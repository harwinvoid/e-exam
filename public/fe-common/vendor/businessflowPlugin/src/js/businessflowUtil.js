/**
 * util purpose(mix with mxGraph code): initialize
 * 1. mxGraph
 * 2. businessflow data
 * 3. "sidebar"
 * 4. "toolbar"
 **/

//window.onload = function() {
//	var activityParameter = processRequestParameter(window);
//	if (activityParameter) {
//		var campaignId = activityParameter.campId;
//		var campaignOperate = activityParameter.operate;
//
//		configureBusinessflow(campaignId, campaignOperate);
//	}
//}
/*type view/edit*/
function initMxgraph(type, data, from){
	var activityParameter;

	//兼容ie9-11.如果是老版本IE则强制使用VML渲染
	if(!!window.ActiveXObject){
		mxClient.IS_IE=true;
		mxClient.IS_SVG=false;
		mxClient.IS_VML=true;
	}

	activityParameter = processRequestParameter(window);
	if (activityParameter) {
		var campaignId = activityParameter.campId;
		var campaignOperate = activityParameter.operate;
		configureBusinessflow(campaignId, campaignOperate, type, data, from);
	}
}

function fixGraphData(){
	graph.setSelectionCell();
	if(currentNodeId !== undefined && currentNodeId !== ""
		&& currentNodeName !== undefined && currentNodeName !== ""){
		eval(currentNodeName + "CloseEvent()");
	}
}

var editor = null;
var graph = null;
var model = null;
var wBoxObject = null;
var addToCampaignArray = new Array();

var configureBusinessflow = function(campaignId, campaignOperate, type, data, from) {
	var style;
	// edit			campaignOperate = 1
	// show			campaignOperate = 2
	// monitor		campaignOperate = 3
	campaignOperate = 1;

	// Checks if the browser is supported
	if (!mxClient.isBrowserSupported()) {
		// Displays an error message if the browser is not supported.
		mxUtils.error(ENGLISHLANGUAGE.NOT_SUPPORTED, 200, false);
	} else {
		editor = new mxEditor();
		graph = editor.graph;

		style=graph.getStylesheet().getDefaultEdgeStyle();
		// style = [];
		style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
		style[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
		// style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SegmentConnector;
		style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
		style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
		style[mxConstants.STYLE_ROUNDED] = true;
		style[mxConstants.STYLE_FONTSIZE] = '20';
		style[mxConstants.STYLE_STROKEWIDTH] = 3;
		style[mxConstants.STYLE_CURVED] = false;
		style[mxConstants.STYLE_EXIT_PERIMETER] = 0; // disabled
		style[mxConstants.STYLE_EXIT_X] = 0.5; //中心
		style[mxConstants.STYLE_EXIT_Y] = 0.7; //底边界
		style[mxConstants.STYLE_ENTRY_PERIMETER] = 0; // disabled
		style[mxConstants.STYLE_ENTRY_X] = 0.5; //中心
		style[mxConstants.STYLE_ENTRY_Y] = 0.3; //上边界
		style[mxConstants.STYLE_BENDABLE]=0; //禁止拖拽句柄

		style=graph.getStylesheet().getDefaultVertexStyle();

		model = graph.getModel();
		resizePage();
		configureGlobal();
		configureStylesheet(graph);
		if(!type || type === "edit"){
			configureEditor(editor, "edit");
			configureGraph(graph, campaignOperate);
			//configureToolbarButton(graph, editor);
			configureMxOutline(graph);

		}else{
			configureEditor(editor, "view");
			campaignOperate = 2;
			configureGraph(graph, campaignOperate);

			graph.centerZoom=true;
			graph.setEnabled(false);

			$("#campaign-view-zoomIn").on('click', function(){
				graph.zoomIn();
			});

			$("#campaign-view-zoomOut").on('click', function(){
				graph.zoomOut();
			});
		}

		if (3 == parseInt(campaignOperate)) {
			loadData(campaignId, type);
			setInterval(loadData, 5000);
			graph.zoomActual();
		} else {
			loadData(campaignId, type, data);
			var dataCache = $.extend(true,{},data);
			var time = setInterval(function(){
				if(time) clearInterval(time);
				graph.refresh();
				processData.setAllData(dataCache);
				// set data of key="marketCampaign"
				processData.businessflowData.setMarketCampaignData();
				// set data of key="processDefinition.activity"
				processData.businessflowData.setActivityData();
				// set data of key="processDefinition.processDefinitionExtension[0].processDefContent"
				processData.businessflowData.setBusinessflowXMLData();
				$("#campaign-container").data("info", dataCache.data);
			}, 10);
			if(from===1){
				graph.zoomActual();
			}else{
				graph.zoomTo(0.5);
			}
		}
	}
};

/*
 * load data
 */
function loadData(campaignId, type, data) {
	var ajaxRequestList = getAjaxRequest.getAjaxRequestList(campaignId);
	if (ajaxRequestList) {
//		htmlElementConstruction.createSplashDiv("graphContainer");
		if(data){
			processBusinessData(data);
		}
		if(type === "view") return false;
		for (var i = 0; i < ajaxRequestList.length; i ++) {
			ajaxRequest(ajaxRequestList[i]);
		}
	}
}

/*
 * configure editor
 */
function configureEditor(editor, type) {
	// Sets the graph container and configures the editor
	if(type === "edit"){
		editor.setGraphContainer(getContainer.graphContainer());
		var config = mxUtils.load('../../fe-common/vendor/businessflowPlugin/src/resources/keyhandler-commons.xml').getDocumentElement();
		editor.configure(config);
		editor.addAction('delete', function(editor, cell) {
			var isDelete = false;
			var selectionCells = null;
			try {
				selectionCells = graph.getSelectionCells();
				if (selectionCells) {
					graph.removeCells(selectionCells, true);
					isDelete = true;
				}
			} catch (error) {
				console.log("Remove cells has been failed! error message: " + error);
			} finally {
				if (isDelete && selectionCells) {
					for (var i = 0; i < selectionCells.length; i ++) {
						// process delete cell to "allData" that kind of "edge" type
						if (selectionCells[i].source && selectionCells[i].target) {
							if(currentNodeId && currentNodeId == selectionCells[i].id){
								currentNodeId = "";
								currentNodeName = "";
							}
							processData.businessflowData.removeActivityRelationDataFromAllData(selectionCells[i].source.parent.id, selectionCells[i].source.value);
						} else {
							if(currentNodeId && currentNodeId == selectionCells[i].id){
								currentNodeId = "";
								currentNodeName = "";
							}
							// process delete cell to "allData"
							processData.businessflowData.removeActivityDataById(selectionCells[i].id);
						}
					}
				}
			}
		});

		/** 删除事件 **/


		var deleteImage = new mxImage('/ARIESRES/crm-bj/fe-common/vendor/businessflowPlugin/src/images/forbidden.png', 16, 16);

		// Overridden to add an additional control to the state at creation time
		mxCellRendererCreateControl = mxCellRenderer.prototype.createControl;
		mxCellRenderer.prototype.createControl = function(state)
		{
			var value = state.cell.value;
			if(value === XML_NODE.BUSINESSFLOW_XML_INPUT_POINT || value === XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT
					|| value === XML_NODE.BUSINESSFLOW_XML_TRUE_POINT || value === XML_NODE.BUSINESSFLOW_XML_FALSE_POINT) return false;

			mxCellRendererCreateControl.apply(this, arguments);

			if (graph.getModel().isVertex(state.cell))
			{
				if (state.deleteControl == null)
				{
					var b = new mxRectangle(0, 0, deleteImage.width, deleteImage.height);
					state.deleteControl = new mxImageShape(b, deleteImage.src);
					state.deleteControl.dialect = graph.dialect;
					state.deleteControl.preserveImageAspect = false;

					this.initControl(state, state.deleteControl, false, function (evt)
					{
						if (graph.isEnabled())
						{
							graph.removeCells([state.cell]);
							mxEvent.consume(evt);
						}
					});
				}
			}
			else if (state.deleteControl != null)
			{
				state.deleteControl.destroy();
				state.deleteControl = null;
			}
		};

		// Helper function to compute the bounds of the control
		var getDeleteControlBounds = function(state)
		{
			if (state.deleteControl != null)
			{
				var oldScale = state.deleteControl.scale;
				var w = state.deleteControl.bounds.width / oldScale;
				var h = state.deleteControl.bounds.height / oldScale;
				var s = state.view.scale;
				return (state.view.graph.getModel().isEdge(state.cell)) ?
					new mxRectangle(state.x + state.width / 2 - w / 2 * s,
						state.y + state.height / 2 - h / 2 * s, w * s, h * s)
					: new mxRectangle(state.x + state.width - 4 - w * s,
						state.y + 3, w * s, h * s);
			}

			return null;
		};

		// Overridden to update the scale and bounds of the control
		mxCellRendererRedrawControl = mxCellRenderer.prototype.redrawControl;
		mxCellRenderer.prototype.redrawControl = function(state)
		{
			mxCellRendererRedrawControl.apply(this, arguments);

			if (state.deleteControl != null)
			{
				var bounds = getDeleteControlBounds(state);
				var s = state.view.scale;

				if (state.deleteControl.scale != s || !state.deleteControl.bounds.equals(bounds))
				{
					state.deleteControl.bounds = bounds;
					state.deleteControl.scale = s;
					state.deleteControl.redraw();
				}
			}
		};

		// Overridden to remove the control if the state is destroyed
		mxCellRendererDestroy = mxCellRenderer.prototype.destroy;
		mxCellRenderer.prototype.destroy = function(state)
		{
			mxCellRendererDestroy.apply(this, arguments);

			if (state.deleteControl != null)
			{
				var id = state.cell.id
				var mxRightId = $("#mx-container-right").data("id");

				if(id == mxRightId){
					$("#mx-container-right").empty();
				}

				if(currentNodeId && currentNodeId == id){
					currentNodeId = "";
					currentNodeName = "";
				}
				var arrayCells = [];
				var deleteModel = state.cell;
				arrayCells.push(deleteModel);
					// process delete cell to "allData" that kind of "edge" type
				if (deleteModel.source && deleteModel.target) {
					processData.businessflowData.removeActivityRelationDataFromAllData(deleteModel.source.parent.id, deleteModel.source.value);
				} else {
					// process delete cell to "allData"
					processData.businessflowData.removeActivityDataById(deleteModel.id);
				}

				state.deleteControl.destroy();
				state.deleteControl = null;
			}
		};

		// Uncomment the following if you want the container
		// to fit the size of the graph
		//graph.setResizeContainer(true);

		// Enables rubberband selection
		new mxRubberband(graph);
	}else{
		editor.setGraphContainer(getContainer.graphViewContainer());
	}
}

function selectionChanged(graph){
	var cells,
		mxRightId,
		geom;

	graph.container.focus();
	cells = graph.getSelectionCells();
	if(cells.length===1 && cells[0].isVertex()){
		$("#propEmptyTip").hide();
		$("#mx-container-right").show();
		mxRightId = $("#mx-container-right").data("id");
		//如果节点的ID和右边区域绑定的ID相同就不返回false
		if (cells[0].id != mxRightId){
			var businessIconList = getBusinessIcon.getBusinessIconList();
			for (var i = 0; i < businessIconList.length; i ++) {
				var className = "";
				var regularExpression = /\"(.*?)\"/g;
				var matchingArray = cells[0].value.match(regularExpression);
				if (matchingArray) {
					className = matchingArray[0].replace(/\"/g, "");
				}
				if (className.indexOf(businessIconList[i].businessClassName) > 0) {
					businessIconList[i].id = cells[0].id;

					//兼容ie9-11.原来此处取的icon位置貌似取错了，为了将影响降到最低此处沿用原有逻辑
					geom=cells[0].getGeometry();
					businessIconList[i].left = geom.x;
					businessIconList[i].top = geom.y;

					businessIconList[i].runPolicy(POLICY_FLOW_NODE_DBCLICK_ACTION, businessIconList[i]);
					break;
				}
			}
			return;
		}
	}
	$("#mx-container-right").data("id","");
	$("#propEmptyTip").show();
	$("#mx-container-right").hide();
}

/*
 * configure graph
 */
function configureGraph(graph, campaignOperate) {
	// Disable highlight of cells when dragging from toolbar
	if (3 == parseInt(campaignOperate) || 2 == parseInt(campaignOperate)) {
		mxGraph.prototype.foldingEnabled = false;
		graph.setCellsResizable(false);
		graph.setTooltips(false);
		graph.setCellsMovable(false);
		graph.setConnectable(true);
	} else {
		mxGraph.prototype.foldingEnabled = false;
		graph.setCellsResizable(false);
		graph.setTooltips(false);
	}

	// Uses the port icon while connections are previewed
	graph.connectionHandler.getConnectImage = function(state) {
		return new mxImage(state.style[mxConstants.STYLE_IMAGE],
				MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_POINT_WIDTH, MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_POINT_HEIGHT);
	};
	// Centers the port icon on the target port
	graph.connectionHandler.targetConnectImage = true;
	// Does not allow dangling edges
	graph.setAllowDanglingEdges(false);

	// Disables drag-and-drop into non-swimlanes.
	graph.isValidDropTarget = function(cell, cells, evt) {
		return this.isSwimlane(cell);
	};

	// Disables drilling into non-swimlanes.
	graph.isValidRoot = function(cell) {
		return this.isValidDropTarget(cell);
	}

	graph.connectionHandler.selectCells = function(edge, target) {
		processData.businessflowData.putActivityRelationData(
				edge.source.parent.id, edge.target.parent.id, edge.source.value);
	}

	graph.isCellSelectable = function(cell) {
		return !this.isCellLocked(cell);
	};

	// verify link is legal
	graph.isValidConnection = function(source, target) {
		return verifyLink(source, target);
	}

	graph.getLabel = function(cell) {

		var tmp = mxGraph.prototype.getLabel.apply(this, arguments);

		if (this.isCellLocked(cell)) {
			return "";
		}

		return tmp;
	}

	graph.isHtmlLabel = function(cell) {
		return !this.isSwimlane(cell);
	}
	if(campaignOperate == "1"){
		graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt){
			console.log("mxEvent.SELECT --- "+currentNodeName);
			selectionChanged(graph);
			if(currentNodeId !== undefined && currentNodeId !== ""
	            && currentNodeName !== undefined && currentNodeName !== ""){
	            eval(currentNodeName + "CloseEvent()");
	        }
			evt.consume();
		});
	}

	graph.dblClick = function(evt, cell) {
//		if (this.isEnabled() && !mxEvent.isConsumed(evt) && cell != null && this.isCellEditable(cell)) {
//			if (this.model.isEdge(cell) || !this.isHtmlLabel(cell)) {
//				this.startEditingAtCell(cell);
//
//			} else {
//				var businessIconList = getBusinessIcon.getBusinessIconList();
//
//				for (var i = 0; i < businessIconList.length; i ++) {
//					var className = "";
//					var regularExpression = /\"(.*?)\"/g;
//					var matchingArray = cell.value.match(regularExpression);
//					if (matchingArray) {
//						className = matchingArray[0].replace(/\"/g, "");
//					}
//					if (className.indexOf(businessIconList[i].businessClassName) > 0) {
//						var selectionNode = getContainer.graphContainer().firstChild.firstChild.lastChild.lastChild.lastChild;
//						businessIconList[i].id = cell.id;
//						businessIconList[i].left = selectionNode.getAttribute("x");
//						businessIconList[i].top = selectionNode.getAttribute("y");
//						businessIconList[i].runPolicy(POLICY_FLOW_NODE_DBCLICK_ACTION, businessIconList[i]);
//					}
//				}
//			}
//		}

		mxEvent.consume(evt);
	};

	// Enables new connections
	graph.setConnectable(true);
}

/*
 * configure mxOutline
 */
function configureMxOutline(graph) {
	var outline;
	getContainer.resetOutlineContainers();
	outline=new mxOutline(graph, getContainer.outlineContainer());
	outline.refresh();
}

/*
 * configure toolbar button icon
 */
function configureToolbarButton(graph, editor) {
	getContainer.resetToolbarContainers();
	//var toolBarButtonArray = getToolBarButton.getToolBarButtonList();
	//
	//for (var i = 0; i < toolBarButtonArray.length; i ++) {
	//	addToolbarButton(editor, getContainer.toolbarContainer(), toolBarButtonArray[i]);
	//}

	// defines a new export action
	editor.addAction(MX_GRAPH_ACTION.BUSINESSFLOW_ACTION_EXPORT, function(editor, cell) {
		saveXML(editor);
	});

	/*var activeSwitchCheckbox = document.querySelector("#activeSwitchCheckbox");
	var switchery = new Switchery(activeSwitchCheckbox);
	switchery.handleOnchange = function(state) {
		if (state) {
			document.getElementById("activeSwitchText").innerHTML = "active";
		} else {
			document.getElementById("activeSwitchText").innerHTML = "deactive";
		}
	}*/
}

/*
 * add single button to toolbar
 */
function addToolbarButton(editor, toolbarContainer, toolbarIconObject) {
	var toolbarIconDiv = htmlElementConstruction.createToolbarButton(toolbarIconObject);

	if (toolbarIconObject.getAction()) {

		mxEvent.addListener(toolbarIconDiv, MX_GRAPH_ACTION.BUSINESSFLOW_ACTION_CLICK, function(evt) {
			editor.execute(toolbarIconObject.getAction());
		});

		mxUtils.write(toolbarIconDiv, "");
		toolbarContainer.appendChild(toolbarIconDiv);

	} else {
		mxUtils.write(toolbarIconDiv, "");
		toolbarContainer.appendChild(toolbarIconDiv);

		if (toolbarIconObject.getTitle()) {
			document.getElementById(toolbarIconObject.getTitle()).addEventListener("click", function(event) {
				toolbarIconObject.runPolicy();

				var e = event || window.e;
				e.stopPropagation();
			}, false);
		}
	}
}

/*
 * configure business bar
 */
function configureSideBarIcon() {
	var sidebarData = processData.getSidebarData();
	getContainer.resetSidebarContainers();
	// create sidebar icon(accordion icon and drag node icon)
	var businessTypeIconList = getBusinessTypeIcon.getBusinessTypeIconList();

	if (businessTypeIconList) {
		for (var i = 0; i < businessTypeIconList.length; i ++) {
			// create accordion icon
			addSidebarTypeIcon(getContainer.sidebarContainer(), htmlElementConstruction.createBusinessTypeIconConstruction(businessTypeIconList[i]));

			if (businessTypeIconList[i].getBusinessIconCollection()) {
				var businessIconList = businessTypeIconList[i].getBusinessIconCollection();

				for (var k = 0; k < businessIconList.length; k ++) {
					// create drag node icon
					addSidebarNodeIcon(graph, businessTypeIconList[i].getBusinessTypeTitleName(), businessIconList[k], parseInt(k / BUSINESSFLOW_TYPE_CALCULATE_STYLE[businessIconList[k].getBusinessflowType().toLocaleUpperCase()]));
				}
			}
		}
	}
}

/*
 * add accordion icon to sidebar
 */
function addSidebarTypeIcon(sidebarContainer, sidebarAccordionDiv) {
	sidebarContainer.appendChild(sidebarAccordionDiv);
}

/*
 * add node icon to "sidebar"
 */
function addSidebarNodeIcon(graph, typeIconId, nodeIconObject, divisionNumber) {
	var businessIconHtmlElement = htmlElementConstruction.createBusinessIconConstruction(nodeIconObject),
		dragEl;

	if (businessIconHtmlElement) {
		var businessTypeContainer = document.getElementById(typeIconId + "Type");
		businessTypeContainer.appendChild(businessIconHtmlElement);
		//businessTypeContainer.style.position = "relative";
		//businessTypeContainer.style.zIndex = 1050;

		// debugger;
		dragEl=htmlElementConstruction.createSidebarDragElementConstruction();
		// dragEl.width=graph.view.scale * dragEl.offsetWidth+"px";
		// dragEl.height=graph.view.scale * dragEl.offsetHeight+"px";

		var ds = mxUtils.makeDraggable(businessIconHtmlElement, graph, nodeIconObject.runPolicy(POLICY_FLOW_NODE_STYLE, JSON.stringify(nodeIconObject)), dragEl, 0, 0, false, false, true);
		ds.setGuidesEnabled(true);
	}
}

/*
 * configure export data
 */
function saveXML(editor) {
	// set mxGraph "xmlData" for save
	var enc = new mxCodec(mxUtils.createXmlDocument());
	var node = enc.encode(editor.graph.getModel());

	var xmlData = mxUtils.getXml(node);
	xmlData = xmlData.replace(/"/g, "'").replace(/&/g, "***");
	xmlData = xmlData.replace(/"/g, "'").replace(/=/g, "$$$");
	processData.businessflowData.setBusinessflowViewXMLData(xmlData);
	processData.businessflowData.putBusinessflowXMLDataToProcessData(xmlData);

	// set activity target node data for save
	var activityDataArray = processData.businessflowData.getActivityData();
	if (activityDataArray) {
		for (var i = 0; i < activityDataArray.length; i ++) {
			if (activityDataArray[i] && null != activityDataArray[i]) {
				if (BUSINESSFLOW_OPERATION.DELETE == activityDataArray[i].state) {
					processData.businessflowData.removeActivityRelationDataFromAllData(activityDataArray[i].extlCode, null);
				} else {
					if (activityDataArray[i].activityRelation && 0 < activityDataArray[i].activityRelation.length) {
						for (var j = 0; j < activityDataArray[i].activityRelation.length; j ++) {

							if (activityDataArray[i].activityRelation[j]) {
								if (activityDataArray[i].activityRelation[j].endStepId) {
									var activityDataArrayTemp = processData.businessflowData.getActivityData();
									var isPutNull = true;

									for (var k = 0; k < activityDataArrayTemp.length; k ++) {
										if (activityDataArrayTemp[k] && null != activityDataArrayTemp[k]) {
											if (parseInt(activityDataArray[i].activityRelation[j].endStepId.extlCode) ==
												parseInt(activityDataArrayTemp[k].extlCode)) {

												isPutNull = false;
											}
										}
									}

									if (isPutNull) {
										if (0 != parseInt(activityDataArray[i].activityRelation[j].stepRelId)) {
											activityDataArray[i].activityRelation[j].state = BUSINESSFLOW_OPERATION.DELETE;
										} else {
											activityDataArray[i].activityRelation[j] = null;
										}

										processData.businessflowData.putActivityDataByIndex(
												activityDataArray[i].extlCode, activityDataArray[i]);
									}
								}
							}
						}
					}
				}
			}
		}

		// process "activityData" array "null" value
		var activityWithoutNullArray = new Array();
		for (var j = 0; j < activityDataArray.length; j ++) {
			if (activityDataArray[j] && null != activityDataArray[j]) {
				activityWithoutNullArray.push(activityDataArray[j]);
			}
		}
		processData.getAllData().data[0].processDefinition.activity = activityWithoutNullArray;
	}

	return processData.getAllData();
	//saveCampaign();
}

/*
 * save campaign into database
 */
function saveCampaign() {
	var publishRequest = new AjaxRequestObject();
	publishRequest.setUrl(BUSINESSFLOW_REQUEST.HTTP_URL);
	publishRequest.setType(BUSINESSFLOW_REQUEST.CONTENT_TYPE_JSON);

	publishRequest.setMethod(BUSINESSFLOW_REQUEST.REQUEST_TYPE_POST);
	publishRequest.setAsync(true);
	publishRequest.setCache(false);
	publishRequest.setCallbackName("saveCallback");

	var requestData = new Object();
	requestData.servicecode = BUSINESSFLOW_REQUEST.SERVICE_SAVE;
	requestData.WEB_HUB_PARAMS = "{\"data\":{\"campAndProcessDefInfoList\":" + JSON.stringify(processData.getAllData().data) + "}}";
	publishRequest.setData(requestData);

	htmlElementConstruction.createSplashDiv("graphContainer");
	ajaxRequest(publishRequest);
}

function saveCallback(data) {
	var businessflowRequest = new AjaxRequestObject();
	businessflowRequest.setUrl(BUSINESSFLOW_REQUEST.HTTP_URL);
	businessflowRequest.setType(BUSINESSFLOW_REQUEST.CONTENT_TYPE_JSON);
	businessflowRequest.setMethod(BUSINESSFLOW_REQUEST.REQUEST_TYPE_POST);
	businessflowRequest.setAsync(true);
	businessflowRequest.setCache(false);
	businessflowRequest.setCallbackName("processBusinessData");
	var businessflowParameterObject = new Object();
	businessflowParameterObject.servicecode = BUSINESSFLOW_REQUEST.SERVICE_QUERY_CAMPAIGN;
	businessflowParameterObject.WEB_HUB_PARAMS = "{\"data\":{\"campId\":" + data.data[0].marketCampaign.campId + "}}";
	businessflowRequest.setData(businessflowParameterObject);

	ajaxRequest(businessflowRequest);
}

/*
 * configure global parameter
 */
function configureGlobal() {
	mxGraphHandler.prototype.guidesEnabled = true;
	mxGuide.prototype.isEnabledForEvent = function(evt) {
		return !mxEvent.isAltDown(evt);
	};
	mxEdgeHandler.prototype.snapToTerminals = false;
}

/*
 * configure global style
 */
function configureStylesheet(graph) {
	graph.getStylesheet().putDefaultVertexStyle(createDefaultVertexStyle());
	graph.getStylesheet().putCellStyle(MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_NAME, createCellStyle());
	createDefaultEdgeStyle(graph.getStylesheet().getDefaultEdgeStyle());
}

/*
 * release loading
 */
function releaseLoading() {
	htmlElementConstruction.releaseSplashDiv();
}

/*
 * verify link ("INPUT" can not link "OUTPUT" and link number can not larger than one)
 *
 * PS:	"INPUT" : INPUT\TRUE
 * 		"OUTPUT" : OUTPUT\FALSE
 */
function verifyLink(sourcePointType, targetPointType) {
	if (targetPointType.isConnectable()) {

		if (XML_NODE.BUSINESSFLOW_XML_INPUT_POINT != sourcePointType.value &&
			XML_NODE.BUSINESSFLOW_XML_INPUT_POINT == targetPointType.value) {

			if (0 < sourcePointType.getEdgeCount()) {
				return false;
			} else {
				if (targetPointType.edges && 0 < targetPointType.edges.length) {
					for (var i = 0; i < targetPointType.edges.length; i ++) {
						if (targetPointType.edges[i].source
							&& targetPointType.edges[i].source.parent
							&& sourcePointType.parent
							&& targetPointType.edges[i].source.parent.id == sourcePointType.parent.id) {
							return false;
						}
					}
				}

				return true;
			}
		} else {
			return false;
		}
	}
}

/*
 * body click function to close "popup" page
 */
function bodyOnclick(event) {

}

function resizePage() {
	// fix browser "height"
	document.getElementsByTagName(HTML_ELEMENT.BUSINESSFLOW_HTML_BODY)[0].style.height = document.documentElement.clientHeight + "px";
}
