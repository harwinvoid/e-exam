/**
 * util purpose(mix with mxGraph code): list "toolbar" button click "callback" functions
 */

/*
 * "delete" button action 
 * 1. delete node on graph
 * 2. delete "acitvityData" in "campaignData"
 */



function businessflowDelete() {
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
					processData.businessflowData.removeActivityRelationDataFromAllData(selectionCells[i].source.parent.id, selectionCells[i].source.value);
				} else {
					// process delete cell to "allData"
					processData.businessflowData.removeActivityDataById(selectionCells[i].id);
				}
			}
		}
	}
}

/*
 * "back" button
 */
function businessflowBack() {
	console.log("businessflowBack");
}

/*
 * "done" button
 */
function businessflowSave() {
	console.log("businessflowDone");
}

/*
 * "unable" button
 */
function businessflowUnable() {
	console.log("businessflowUnable");
}

/*
 * "submit" button
 */
function businessflowSumit() {
	console.log("businessflowSumit");
}

/*
 * "setting" button
 */
function businessflowSetting(mouseEvent) {
	console.log(mouseEvent);
	console.log("businessflowSetting");
}

/*
 * "check" button (tooltip error message)
 */
function businessflowCheck() {
	createLabelOnVertexLeft();
	return checkNode();
	//保存校验信息入库
//	var activitys = processData.businessflowData.getActivityData();
//	var param = "activitys="+JSON.stringify(activitys);
//	alert(param);
//	$.aries.ajax.post($.aries.service.marketcampaign.saveActivityValidationMsg,JSON.stringify(activitys),function(data){
//		console.log("++++++++");
//		console.log(data);
//	},function(errorCode,errorInfo){
//		$.aries.messagebox.error("Post service error!","saveActivityValidationMsg","load data fail,errorCode:"+errorCode+",errorInfo:"+JSON.stringify(errorInfo));
//	});
}

function businessflowTemp() {
	wBoxObject = $("#popUp").wBox({
		requestType: "iframe",
		target: BUSINESSFLOW_TYPE_URL.BUSINESSFLOWADDTOCAMPAIGN
		+ "?campaignId=" + 110 + "&activityId=" + 22,
		closeCallBack : function() {

		}
	});

	wBoxObject.showBox();
}

function businessflowTempTemp() {
	createLabelOnVertexRight("10");
}

/*
 * checkNode
 */
function checkNode() {
	var flag = true; //判断是否有节点
	if (model.cells) {
		var selectionCellsArray = new Array();
		for (var cellIndex in model.cells) {
			if (model.cells[cellIndex].children && model.cells[cellIndex].children.length > 0
				&& "0" != model.cells[cellIndex].id && "1" != model.cells[cellIndex].id) {
				var cellChilds = model.cells[cellIndex].children;

				if (cellChilds) {
					var selectionCount = 0;

					for (var j = 0; j < cellChilds.length; j ++) {
						if (cellChilds[j]) {
							if (!cellChilds[j].edges && !cellChilds[j].edges) {
								selectionCount ++;
							}
						}
					}
					/*先验证节点的连线是否有问题，如若没有问题，则验证必填项*/
					if (selectionCount == cellChilds.length) {
						selectionCellsArray.push(model.cells[cellIndex]);
					}else{
						var activityData = processData.businessflowData.getActivityDataById(model.cells[cellIndex].id);

						if (activityData) {
							// invoke validation function by "subpage validation function"
							if (activityData.activitySpecification) {
								if (activityData.activitySpecification.activitySpecId) {
									try {
										if (window[BUSINESSFLOW_ID_TYPE_TRANS[activityData.activitySpecification.activitySpecId] + "Validation"]) {
											activityData = window["eval"].call(window, BUSINESSFLOW_ID_TYPE_TRANS[activityData.activitySpecification.activitySpecId] + "Validation" + "(" + JSON.stringify(activityData) + ")");
										}
									} catch(error) {
										console.log(error);
									}
								}
							}

							processData.businessflowData.putActivityDataByIndex(activityData.extlCode, activityData);
							if (activityData.activityValidationMsg && activityData.activityValidationMsg.length > 0) {
								selectionCellsArray.push(model.cells[cellIndex]);
							}
						}
					}
				}
				flag = false;
			}
		}
		

			
		
		
		if (selectionCellsArray && selectionCellsArray.length >0) {
			graph.clearSelection();
			mxVertexHandler.prototype.createSelectionShape = function(bounds) {
				bounds.rx = "4";
				bounds.ry = "4";
				var shape = new mxRectangleShape(bounds, null, "#CC1C05");
				shape.strokewidth = 2;
				shape.isDashed = false;
				shape.crisp = true;

				return shape;
			}
			
			graph.setSelectionCells(selectionCellsArray);
			return false;
//			var businessTagI = $(document).find("i[data-id='"+id+"']")[0];
//			mxEvent.addListener(businessTagI, 'click',
//				mxUtils.bind(this, function(evt)
//				{
//					var mxRightId = $("#mx-container-right").data("id");
//					
//					if(id == mxRightId){
//						$("#mx-container-right").empty();
//					}
//					
//					if(currentNodeId && currentNodeId == id){
//						currentNodeId = "";
//						currentNodeName = "";
//					}
//					var arrayCells = [];
//					var deleteModel = model.cells[id];
//					arrayCells.push(deleteModel);
//					graph.removeCells(arrayCells, true);
//						// process delete cell to "allData" that kind of "edge" type
//					if (deleteModel.source && deleteModel.target) {
//						processData.businessflowData.removeActivityRelationDataFromAllData(deleteModel.source.parent.id, deleteModel.source.value);
//					} else {
//						// process delete cell to "allData"
//						processData.businessflowData.removeActivityDataById(deleteModel.id);
//					}
//					mxEvent.consume(evt);
//				})
//			);
		}
		if(!flag){
			return true;
		}
	}
	return false;
}

/*
 * create label on vertex by mxGraph
 */
function createLabelOnVertexLeft() {
	secondLabelVisible = true;
	var createShape = graph.cellRenderer.createShape;
	graph.getSecondLabel = function(cell) {
		debugger;
		if (!this.model.isEdge(cell)) {
			// return "verify" messages
			var activityData = processData.businessflowData.getActivityDataById(cell.id);

			if (activityData) {
				// invoke validation function by "subpage validation function"
				if (activityData.activitySpecification) {
					if (activityData.activitySpecification.activitySpecId) {
						debugger;
						console.log(BUSINESSFLOW_ID_TYPE_TRANS[activityData.activitySpecification.activitySpecId]);
						try {
							if (window[BUSINESSFLOW_ID_TYPE_TRANS[activityData.activitySpecification.activitySpecId] + "Validation"]) {
								activityData = window["eval"].call(window, BUSINESSFLOW_ID_TYPE_TRANS[activityData.activitySpecification.activitySpecId] + "Validation" + "(" + JSON.stringify(activityData) + ")");
							}
						} catch(error) {
							console.log(error);
						}
					}
				}

				processData.businessflowData.putActivityDataByIndex(activityData.extlCode, activityData);

				if (activityData.activityValidationMsg) {

					if (0 == activityData.activityValidationMsg.length) {
						return null;
					} else {
						return activityData.activityValidationMsg.length + "";
					}

				} else {
					return null;
				}
			} else {
				return null;
			}
		}

		return null;
	};
//
//	graph.cellRenderer.createShape = function(state) {
//		createShape.apply(this, arguments);
//
//		if (secondLabelVisible && !state.cell.geometry.relative) {
//			var secondLabel = graph.getSecondLabel(state.cell);
//
//			if (secondLabel != null && state.shape != null && state.secondLabel == null) {
//				state.secondLabel = new mxText(secondLabel, new mxRectangle(),
//					mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM);
//
//				// Styles the label
//				state.secondLabel.color = "white";
//				state.secondLabel.family = "Verdana";
//				state.secondLabel.size = 12;
//				state.secondLabel.fontStyle = mxConstants.FONT_BOLD;
//				state.secondLabel.background = "#FF0057";
//				state.secondLabel.border = "1px solid #FB2357";
//
//				state.secondLabel.dialect = state.shape.dialect;
//				state.secondLabel.init(state.view.getDrawPane());
//
//				state.secondLabel.backgroundNode.setAttribute("rx", "2");
//				state.secondLabel.backgroundNode.setAttribute("ry", "2");
//			}
//		}
//	};
//
//	var redraw = graph.cellRenderer.redraw;
//	graph.cellRenderer.redraw = function(state) {
//		redraw.apply(this, arguments);
//
//		if (state.shape != null && state.secondLabel != null) {
//			var scale = graph.getView().getScale();
//			var bounds = new mxRectangle(state.x + state.width - 255 * scale, state.y + 8 * scale, 0, 0);
//			state.secondLabel.value = graph.getSecondLabel(state.cell);
//			state.secondLabel.scale = scale;
//			state.secondLabel.bounds = bounds;
//			state.secondLabel.redraw();
//		}
//	};
//
//	var destroy = graph.cellRenderer.destroy;
//	graph.cellRenderer.destroy = function(state) {
//		destroy.apply(this, arguments);
//
//		if (state.secondLabel != null) {
//			state.secondLabel.destroy();
//			state.secondLabel = null;
//		}
//	};
//
//	graph.refresh();
}

/*
 * create label on vertex by mxGraph
 */
function createLabelOnVertexRight(labelText) {
	secondLabelVisible = true;
	var createShape = graph.cellRenderer.createShape;
	graph.getSecondLabel = function(cell) {
		if (!this.model.isEdge(cell)) {
			// Possible to return any string here
			return labelText;
		}

		return null;
	};
	graph.cellRenderer.createShape = function(state) {
		createShape.apply(this, arguments);

		if (secondLabelVisible && !state.cell.geometry.relative) {
			var secondLabel = graph.getSecondLabel(state.cell);

			if (secondLabel != null && state.shape != null && state.secondLabel == null) {
				state.secondLabel = new mxText(secondLabel, new mxRectangle(),
					mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM);

				// Styles the label
				state.secondLabel.color = "white";
				state.secondLabel.family = "Verdana";
				state.secondLabel.size = 12;
				state.secondLabel.fontStyle = mxConstants.FONT_BOLD;
				state.secondLabel.background = "#4bd662";
				state.secondLabel.border = "1px solid #a0c12c";
				state.secondLabel.borderRadius = "5px";

				state.secondLabel.dialect = state.shape.dialect;
				state.secondLabel.init(state.view.getDrawPane());
			}
		}
	};

	var redraw = graph.cellRenderer.redraw;
	graph.cellRenderer.redraw = function(state) {
		redraw.apply(this, arguments);

		if (state.shape != null && state.secondLabel != null) {
			var scale = graph.getView().getScale();
			var bounds = new mxRectangle(state.x + state.width - 10 * scale, state.y + 8 * scale, 0, 0);
			state.secondLabel.value = graph.getSecondLabel(state.cell);
			state.secondLabel.scale = scale;
			state.secondLabel.bounds = bounds;
			state.secondLabel.redraw();
		}
	};

	var destroy = graph.cellRenderer.destroy;
	graph.cellRenderer.destroy = function(state) {
		destroy.apply(this, arguments);

		if (state.secondLabel != null) {
			state.secondLabel.destroy();
			state.secondLabel = null;
		}
	};

	graph.refresh();
}
