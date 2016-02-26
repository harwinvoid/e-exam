/**
 * util purpose(mix with mxGraph code): for HTML constitution
 *
 * 1. HTML element "class" selector
 * 2. transform HTML string to DOM object
 * 3. get kind of "Container"'s DOM object on HTML page
 * 4. create "sidebarIcon"\"sidebarTypeIcon"\"toolbar"\"graphNode" HTML element
 * 5. create, parse and analyze mxGraph node
 * 6. create "sidebar" switch button
 * 7. add style on "sidebar" icon
 **/

/*
 * HTML element "class" selector
 */
var getHTMLElement = {
	getElementByClassName: function(parentId, className) {
		var parentDOM = null;
		var parentDOMChildNodes = null;

		if (parentId) {
			parentDOM = document.getElementById(parentId);
		} else {
			parentDOM = document.getElementsByTagName(HTML_ELEMENT.BUSINESSFLOW_HTML_BODY)[0].childNodes;
		}

		parentDOMChildNodes = getAllChildNodes(parentDOM);
		var nodeArray = null;
		if (parentDOMChildNodes) {
			for (var i = 0; i < parentDOMChildNodes.length; i ++) {
				if (parentDOMChildNodes[i] && (parentDOMChildNodes[i].className == className)) {
					if (nodeArray) {
						nodeArray.push(parentDOMChildNodes[i]);
					} else {
						nodeArray = new Array();
						nodeArray.push(parentDOMChildNodes[i]);
					}
				}
			}
		}

		return nodeArray;
	},
	parseDom: function(domString) {
		var objectDOM = document.createElement("div");
		objectDOM.innerHTML = domString;
		return objectDOM.childNodes;
	},
	findParentDOMWithKeyWord: function(currentDOM) {
		var isFind = false;

		for (var i = 0; i < HTML_ELEMENT_FILTER_LIST.length; i ++) {
			if (HTML_ELEMENT_FILTER_LIST[i] == currentDOM.className) {
				return true;
			}
		}

		if (currentDOM) {
			var isWhile = null;
			var isWhile = true;

			parentDOM = currentDOM.parentNode;
			while (isWhile) {
				if (parentDOM) {
					for (var j = 0; j < HTML_ELEMENT_FILTER_LIST.length; j ++) {
						if (parentDOM.className && HTML_ELEMENT_FILTER_LIST[j] == parentDOM.className) {
							isWhile = false;
						}
					}
					if (!isWhile) {
						isFind = true;
					} else {
						parentDOM = parentDOM.parentNode;
					}
				} else {
					isWhile = false;
				}
			}
		}

		return isFind;
	}
};

function getAllChildNodes(nodeObject) {
	var childNodesObjectArray = nodeObject.childNodes;
	var childNodesArray = null;

	if (childNodesObjectArray) {
		childNodesArray = new Array();

		for (var j = 0; j < childNodesObjectArray.length; j ++) {
			childNodesArray.push(childNodesObjectArray[j]);
			var childNodesObjectArrayTemp = childNodesObjectArray[j].childNodes;
			if (childNodesObjectArrayTemp) {

				childNodesArray = childNodesArray.concat(getAllChildNodes(childNodesObjectArray[j]));
			}
		}

		return childNodesArray;
	}
}

/*
 * set html "container" element
 */
var getContainer = {
	sidebarContainer: function() {
		return document.getElementById("sidebarContainer");
	},

	toolbarContainer: function() {
		return document.getElementById("toolbarContainer");
	},

	outlineContainer: function() {
		return document.getElementById("outlineContainer");
	},

	graphContainer: function() {
		return document.getElementById("graphContainer");
	},
	graphViewContainer: function() {
		return document.getElementById("graphViewContainer");
	},
	graphSplash: function() {
		return document.getElementById("splash");
	},

	resetSidebarContainers : function() {
		this.sidebarContainer().innerHTML = "";
	},

	resetToolbarContainers : function() {
		this.toolbarContainer().innerHTML = "";
	},

	resetOutlineContainers : function() {
		this.outlineContainer().innerHTML = "";
	},

	resetGraphContainers : function() {
		this.graphContainer().innerHTML = "";
	}
};

/*
 * build html element
 */
var htmlElementConstruction = {
	/*
	 * create business type icon on sidebar(accordion)
	 */
	createBusinessTypeIconConstruction: function(businessTypeIconObject) {
		var sidebarDiv = document.createElement("div");
		sidebarDiv.setAttribute("id", businessTypeIconObject.getBusinessTypeName() + "Type");
		var sidebarTypeDiv = document.createElement("div");
		sidebarTypeDiv.setAttribute("class", "m-b-sm m-t-lg ");

		var sidebarTypeName = document.createTextNode(businessTypeIconObject.getBusinessTypeName().toUpperCase());
		sidebarTypeDiv.appendChild(sidebarTypeName);

		sidebarDiv.appendChild(sidebarTypeDiv);


		return sidebarDiv;
	},
	/*
	 * create business icon on sidebar
	 */
	createBusinessIconConstruction: function(businessIconObject) {
		if (!businessIconObject.getBusinessSidebarIconName()) {
			return "";
		}
		var businessIconDiv = document.createElement("div");
		businessIconDiv.setAttribute("id", businessIconObject.getBusinessName());
		businessIconDiv.setAttribute("title", businessIconObject.getBusinessTitleName());
		businessIconDiv.setAttribute("class", "padder padder-v-xs bg-white b-a text-left m-b-sm r");
		businessIconDiv.style.cursor = "move";

		var businessIconIDiv = document.createElement("div");
		var businessIconI = document.createElement("i");
		var businessIconTextDiv = document.createElement("div");
		var businessIconText = document.createTextNode(businessIconObject.getBusinessTitleName());


		businessIconI.style.cursor = "move";
		businessIconI.setAttribute("class", "v-middle "+businessIconObject.businessIconName+" m-r-xs");

		businessIconIDiv.setAttribute("class", "cell");
		businessIconIDiv.appendChild(businessIconI);

		businessIconTextDiv.appendChild(businessIconText);
		businessIconTextDiv.style.cursor = "move";
		businessIconTextDiv.setAttribute("class", "cell v-middle");
		businessIconDiv.appendChild(businessIconIDiv);
		businessIconDiv.appendChild(businessIconTextDiv);

		return businessIconDiv;
	},
	/*
	 * create business node icon on graph containe
	 */
	createBusinessNodeIconConstruction: function(businessIconObject,id) {

		var businessTag = "";
		//class要放前面
		businessTag += '<div class="mx-node b-a bg-gd r text-center wrapper-xs ' + businessIconObject.businessName + '" data-mxNode-id="'+id+'"  title="'+ businessIconObject.businessTitleName +'">';
		//md md-account-circle
//		businessTag += '<i data-id="'+id+'" style="cursor: pointer" class="fx-mx-delete text-muted text-lg md md-clear pull-right"></i>';
		businessTag += '<div><i class="icon-lg ' + businessIconObject.businessIconName + '"></i></div>';
		businessTag += '<p class="m-b-none m-t-xs text-ellipsis">' + businessIconObject.businessTitleName + '</p>'
		businessTag += '<p class="mx-node-name text-muted text-ellipsis">' + (businessIconObject.businessContent || businessIconObject.businessTitleName) + '</p>';
		businessTag += '</div>';

		return businessTag;
	},
	/*
	 * create button on toolbar
	 */
	createToolbarButton: function(toolbarObject) {
		var toolbarDiv = document.createElement(HTML_ELEMENT.BUSINESSFLOW_HTML_DIV);
		toolbarDiv.setAttribute(HTML_ELEMENT.BUSINESSFLOW_HTML_CLASS, toolbarObject.getClassName() + "Toolbar");

		if (toolbarObject) {
			if (toolbarObject.getIcon()) {
				var toolbarIconImage = document.createElement(HTML_ELEMENT.BUSINESSFLOW_HTML_IMG);
				toolbarIconImage.setAttribute(HTML_ELEMENT.BUSINESSFLOW_ATTR_SRC, toolbarObject.getIcon());
				toolbarIconImage.setAttribute(HTML_ELEMENT.BUSINESSFLOW_HTML_ID, toolbarObject.getTitle());

				toolbarDiv.appendChild(toolbarIconImage);
			} else if (toolbarObject.getHtmlConstruction()) {
				toolbarDiv.innerHTML = toolbarObject.getHtmlConstruction();
			}
		}

		return toolbarDiv;
	},
	/*
	 * create sidebar
	 */
	createSidebarDragElementConstruction: function() {
		var dragElement = document.createElement(HTML_ELEMENT.BUSINESSFLOW_HTML_DIV);
		dragElement.setAttribute(HTML_ELEMENT.BUSINESSFLOW_HTML_CLASS, STYLESHEET_NAME.BUSINESSFLOW_STYLESHEET_DRAGELEMENT);
		return dragElement;
	},
	/*
	 * create "loading" image div
	 */
	createSplashDiv: function() {
		//var sqlash = document.createElement(HTML_ELEMENT.BUSINESSFLOW_HTML_DIV);
		//sqlash.setAttribute(HTML_ELEMENT.BUSINESSFLOW_HTML_ID, "splash");
		//sqlash.setAttribute(HTML_ELEMENT.BUSINESSFLOW_HTML_CLASS, "splash");
        //
		//var center = document.createElement("center");
		//var img = document.createElement("img");
		//img.setAttribute("src", "../../fe-common/vendor/businessflowPlugin/src/images/loading.gif");
		//center.appendChild(img);
		//sqlash.appendChild(center);
        //
		//document.getElementById(appendedDOM).appendChild(sqlash);
		$("#splash").show();
	},
	/*
	 * release "loading" image div
	 */
	releaseSplashDiv: function() {
		$("#splash").hide();
		//var splash = getContainer.graphSplash();
        //
		//if (splash != null) {
		//	try {
		//		mxEvent.release(splash);
		//		mxEffects.fadeOut(splash, 100, true);
		//	} catch (error) {
		//		splash.parentNode.removeChild(splash);
		//	}
		//}
		//
		//return splash;
	},
	/*
	 * create space on toolbar
	 */
	createSpacer: function() {
		var spacer = document.createElement(HTML_ELEMENT.BUSINESSFLOW_HTML_DIV);
		spacer.setAttribute(HTML_ELEMENT.BUSINESSFLOW_HTML_CLASS, STYLESHEET_NAME.BUSINESSFLOW_STYLESHEET_SPACER);

		return spacer;
	},
	parseXMLNodes: function() {
		var xmlData = processData.businessflowData.getBusinessflowViewXMLData();
		if (xmlData) {
			var xmlDocument = mxUtils.parseXml(xmlData);
			var businessflowNodes = xmlDocument.documentElement;
			if (businessflowNodes) {
				return businessflowNodes;
			}
		}

		return null;
	},
	/*
	 * read xml stream and parse to mxGraph element
	 */
	createNodes: function() {
		var businessflowNodes = htmlElementConstruction.parseXMLNodes();
		graph.getModel().clear();

		if (businessflowNodes) {
			graph.getModel().beginUpdate();

			try {
				var rootNode = businessflowNodes.firstChild;

				if (rootNode.hasChildNodes()) {
					var rootChildNodes = rootNode.childNodes;
					graphNodeArray = new Array();

					for (var i = 0; i < rootChildNodes.length; i ++) {
						var xmlNodeType = htmlElementConstruction.judgeXMLNodeType(rootChildNodes[i]);

						if (xmlNodeType == XML_NODE.BUSINESSFLOW_XML_NODETYPE_NODE) {
							var graphNodeReturn = createNode(rootChildNodes[i])

							var graphNodeTemp = new Object();
							graphNodeTemp.id = rootChildNodes[i].getAttribute(XML_NODE.BUSINESSFLOW_XML_ID);
							graphNodeTemp.node = graphNodeReturn;
							graphNodeArray.push(graphNodeTemp);

						} else if(xmlNodeType == XML_NODE.BUSINESSFLOW_XML_NODETYPE_POINT) {
							var graphNodePointReturn = createPoint(rootChildNodes[i]);

							var graphNodePointTemp = new Object();
							graphNodePointTemp.id = rootChildNodes[i].getAttribute(XML_NODE.BUSINESSFLOW_XML_ID);
							graphNodePointTemp.node = graphNodePointReturn;
							graphNodeArray.push(graphNodePointTemp);

						} else if(xmlNodeType == XML_NODE.BUSINESSFLOW_XML_NODETYPE_LINK) {
							if ("1" != rootChildNodes[i].id && "0" != rootChildNodes[i].id) {
								createLink(rootChildNodes[i]);
							}
						}
					}
				}

			} finally {

				graph.getModel().endUpdate();
				graphNodeArray = null;
			}
		}
	},

	getNodesRelation: function() {
		var businessflowNodes = htmlElementConstruction.parseXMLNodes();

		if (businessflowNodes) {
			var rootNode = businessflowNodes.firstChild;

			if (rootNode.hasChildNodes()) {
				var graphNodeTargetArray = new Array();
				var rootChildNodes = rootNode.childNodes;
				processData.businessflowData.setXmlNodeArray(rootChildNodes);

				for (var i = 0; i < rootChildNodes.length; i ++) {
					var xmlNodeType = htmlElementConstruction.judgeXMLNodeType(rootChildNodes[i]);

					if(xmlNodeType == XML_NODE.BUSINESSFLOW_XML_NODETYPE_LINK) {
						if ("1" != rootChildNodes[i].id && "0" != rootChildNodes[i].id) {

							graphNodeTargetArray.push(getRelationNodeById(rootChildNodes[i].id));
						}
					}
				}

				return graphNodeTargetArray;
			}
		}

		return null;
	},
	/*
	 * judge xml element type (can be improved)
	 */
	judgeXMLNodeType: function(xmlNode) {
		if (xmlNode) {

			if (xmlNode.attributes[XML_NODE.BUSINESSFLOW_XML_VALUE]) {

				if (XML_NODE.BUSINESSFLOW_XML_TRUE_POINT == xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)) {
					return XML_NODE.BUSINESSFLOW_XML_NODETYPE_POINT;

				} else if (XML_NODE.BUSINESSFLOW_XML_FALSE_POINT == xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)) {
					return XML_NODE.BUSINESSFLOW_XML_NODETYPE_POINT;

				} else if (XML_NODE.BUSINESSFLOW_XML_INPUT_POINT == xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)) {
					return XML_NODE.BUSINESSFLOW_XML_NODETYPE_POINT;

				} else if (XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT == xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)) {
					return XML_NODE.BUSINESSFLOW_XML_NODETYPE_POINT;

				} else if ("" == xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)) {
					return XML_NODE.BUSINESSFLOW_XML_NODETYPE_LINK;

				} else {

					return XML_NODE.BUSINESSFLOW_XML_NODETYPE_NODE;
				}
			}
		}

		return;
	}
};

/*
 * create mxGraph "node" element on graph
 */
function createNode(xmlNode) {
	if (xmlNode) {
		console.log("createNode");
		var mxGeometryNode = xmlNode.firstChild;
		var graphNode = graph.insertVertex(graph.getDefaultParent(),
				xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_ID),
				xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE),
				parseInt(mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_X)),
				parseInt(mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_Y)),
				parseInt(mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_WIDTH)),
				parseInt(mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_HEIGHT)));
		graphNode.setConnectable(false);
		return graphNode;
	}
}

/*
 * create mxGraph "point" element on graph
 */
function createPoint(xmlNode) {
	if (xmlNode) {
		var mxGeometryNode = xmlNode.firstChild;
		var mxPointNode = mxGeometryNode.lastChild;

		var xCoordinate = null == mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_X) ? getBusinessPointIconByName(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)).getPointDefaultX() : mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_X);
		var yCoordinate = null == mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_Y) ? getBusinessPointIconByName(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)).getPointDefaultY() : mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_Y);
		var xOffset = null == mxPointNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_X) ? getBusinessPointIconByName(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)).getPointDefaultOffsetX() : mxPointNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_X);
		var yOffset = null == mxPointNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_Y) ? getBusinessPointIconByName(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)).getPointDefaultOffsetY() : mxPointNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_Y);
		var width = null == mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_WIDTH) ? getBusinessPointIconByName(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)).getPointDefaultWidth() : mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_WIDTH);
		var height = null == mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_HEIGHT) ? getBusinessPointIconByName(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE)).getPointDefaultHeight() : mxGeometryNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_HEIGHT);
		var style = xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_STYLE);

		var point = graph.insertVertex(getGraphNodeById(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_PARENT)),
				xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_ID),
				xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_VALUE),
				new Number(xCoordinate), new Number(yCoordinate), parseInt(width), parseInt(height), style, true);
		point.geometry.offset = new mxPoint(parseInt(xOffset), parseInt(yOffset));

		return point;
	}

	return;
}

/*
 * create mxGraph "link" element on graph
 */
function createLink(xmlNode) {
	if (xmlNode) {
		graph.insertEdge(getGraphNodeById(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_PARENT)),
				xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_ID), "",
				getGraphNodeById(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_SOURCE)),
				getGraphNodeById(xmlNode.getAttribute(XML_NODE.BUSINESSFLOW_XML_TARGET)));

	}

	return;
}

/*
 * get business point icon by type for set dufault value
 */
function getBusinessPointIconByType(businessPointIconType) {

	var businessPointIconReturnList = new Array();
	var businessPointIconList = getBusinessPointIcon.getBusinessPointIconList();

	if (businessPointIconList) {
		for (var i = 0; i < businessPointIconList.length; i ++) {
			if (businessPointIconType == businessPointIconList[i].getPointType()) {
				businessPointIconReturnList.push(businessPointIconList[i]);
			}
		}
	}
	return businessPointIconReturnList;
}

/*
 * get business point icon by type for set dufault value
 */
function getBusinessPointIconByName(businessPointIconName) {

	var businessPointIconList = getBusinessPointIcon.getBusinessPointIconList();
	if (businessPointIconList) {
		for (var i = 0; i < businessPointIconList.length; i ++) {
			if (businessPointIconName == businessPointIconList[i].getPointName()) {
				return businessPointIconList[i];
			}
		}
	}

	return;
}

/*
 * get graph element from array
 */
function getGraphNodeById(graphNodeId) {
	if (graphNodeArray) {
		for (var i = 0; i < graphNodeArray.length; i ++) {

			if (graphNodeId == graphNodeArray[i].id) {

				return graphNodeArray[i].node;
			}
		}
	}

	return;
}

/*
 * get relation node by id
 */
function getRelationNodeById(nodeId) {
	var xmlNodeArray = processData.businessflowData.getXmlNodeArray();

	var nodeObject = null;
	if (xmlNodeArray) {
		for (var i = 0; i < xmlNodeArray.length; i ++) {
			if (parseInt(nodeId) == parseInt(xmlNodeArray[i].id)) {

				nodeObject = new Object();
				nodeObject.id = xmlNodeArray[i].getAttribute(XML_NODE.BUSINESSFLOW_XML_ID);
				nodeObject.sourceId = getxmlNodeById(xmlNodeArray[i].getAttribute(XML_NODE.BUSINESSFLOW_XML_SOURCE));
				nodeObject.targetId = getxmlNodeById(xmlNodeArray[i].getAttribute(XML_NODE.BUSINESSFLOW_XML_TARGET));

				return nodeObject;
			}
		}
	}

	return null;
}

/*
 * get xml element from array
 */
function getxmlNodeById(xmlNodeId) {
	var xmlNodeArray = processData.businessflowData.getXmlNodeArray();

	if (xmlNodeArray) {
		for (var i = 0; i < xmlNodeArray.length; i ++) {
			if (parseInt(xmlNodeId) == parseInt(xmlNodeArray[i].getAttribute(XML_NODE.BUSINESSFLOW_XML_ID))) {

				return xmlNodeArray[i].getAttribute(XML_NODE.BUSINESSFLOW_XML_PARENT);
			}
		}
	}

	return null;
}

/*
 * class of "panel-body-inner-left" element "click" function
 */
function panelBodyInnerClick(event) {
	var childNodes = this.parentNode.childNodes;

	if (childNodes) {
		var maxNodeIdNumber = 0;
		var currentCenterNodeIdNumber = 0;

		// loop nodes under "className" is "panel-body" and put it into
		// array for change them status
		for (var i = 0; i < childNodes.length; i ++) {
			if ("panel-body-inner-center" == childNodes[i].className) {

				// set style of node is "display" to "none"
				if ("none" != childNodes[i].style.display) {
					childNodes[i].style.display = "none";
					currentCenterNodeIdNumber = parseInt(childNodes[i].id.split("PanelBodyInnerCenter")[1]);
				}

				var centerNode = childNodes[i].id.split("PanelBodyInnerCenter");
				if (maxNodeIdNumber < parseInt(centerNode[1])) {
					maxNodeIdNumber = parseInt(centerNode[1]);
				}
			}
		}

		// set next "PanelBodyInnerCenter" to display
		if (0 != maxNodeIdNumber) {
			var calculateNumber = 0;

			if ("Left" == this.id.split("PanelBodyInner")[1]) {
				calculateNumber = (currentCenterNodeIdNumber - 1);
			} else {
				calculateNumber = (currentCenterNodeIdNumber + 1);
			}

			document.getElementById(this.parentNode.firstChild.id.split("PanelBodyInnerLeft")[0]
				+ "PanelBodyInnerCenter"
				+ calculateNumber).style.display = "block";
		}

		// when id index is min value then set "rightButton" none display
		if (0 == calculateNumber) {
			this.parentNode.lastChild.style.display = "none";
			this.parentNode.firstChild.style.display = "none";
		}
		if (0 < calculateNumber) {
			this.parentNode.firstChild.style.display = "block";
		} else {
			this.parentNode.firstChild.style.display = "none";
		}
		// when id index is max value then set "rightButton" none display
		if (maxNodeIdNumber <= calculateNumber) {
			this.parentNode.lastChild.style.display = "none";
		} else {
			this.parentNode.lastChild.style.display = "block";
		}
	}

	var e = event || window.e;
	e.stopPropagation();
}

/*
 * trans normal image name for add normal picture
 */
function transformNormalImageName(imageName) {
	if (0 > imageName.lastIndexOf("_hover")) {
		return imageName.substring(0, imageName.lastIndexOf("_normal")) + "_normal.png";
	} else {
		return imageName.substring(0, imageName.lastIndexOf("_hover")) + "_normal.png";
	}
}

/*
 * trans toggle image name for add toggle picture
 */
function transformToggleImageName(imageName) {
	return imageName.substring(0, imageName.lastIndexOf("_normal")) + "_hover.png";
}

/*
 * function for "mouseenter" on sidebar business type icon div
 */
function businessTypeIconMouseoverEvent(objectNameParam) {
	document.getElementById(objectNameParam + "Type").setAttribute("class", "bs-callout " + objectNameParam + "_over");
}

/*
 * function for "mouseleave" on sidebar business type icon div
 */
function businessTypeIconMouseoutEvent(objectNameParam) {
	document.getElementById(objectNameParam + "Type").setAttribute("class", "bs-callout " + objectNameParam);
}

/*
 * setTimeout for "businessflowDIV" on sidebar to toggle
 */
function divSetTimeoutEvent(objectNameParam) {
	divSetTimeoutEventTemp = setTimeout(function() {
		document.getElementById(objectNameParam).setAttribute("class", objectNameParam + "Sidebar_over");
	}, 500);
}

/*
 * function for "mouseleave" event sidebar to toggle div style
 */
function divBusinessIconMouseoutEvent(objectNameParam) {
	if (divSetTimeoutEventTemp) {
		clearTimeout(divSetTimeoutEventTemp);
	}

	document.getElementById(objectNameParam).setAttribute("class", objectNameParam + "Sidebar");
}

/*
 * setTimeout for "businessflowDIV" on sidebar to rotate
 */
function imgSetTimeoutEvent(objectNameParam) {
	imgSetTimeoutEventTemp = setTimeout(function() {
		rotateTagY(objectNameParam);
		switchImg(objectNameParam, "enter");
	}, 500);
}

/*
 * function for "mouseleave" on sidebar business icon div
 */
function imgBusinessIconMouseoutEvent(objectNameParam) {
	if (imgSetTimeoutEventTemp) {
		clearTimeout(imgSetTimeoutEventTemp);
	}

	rotateTagYback(objectNameParam);
	switchImg(objectNameParam, "leave");
}

function switchImg(objectNameParam, mouseAction) {
	var imgToggleSrcName = null;
	var imgSrcNormal = document.getElementById(objectNameParam).style.backgroundImage;
	if (imgSrcNormal) {
		var imgSrcNormalArray = imgSrcNormal.replace(/[\")]/g, "").split("/");
		if (imgSrcNormalArray) {
			if ("enter" == mouseAction) {
				imgToggleSrcName = transformToggleImageName(imgSrcNormalArray[imgSrcNormalArray.length - 1]);
			} else if ("leave" == mouseAction) {
				imgToggleSrcName = transformNormalImageName(imgSrcNormalArray[imgSrcNormalArray.length - 1]);
			}
		}
	}

	document.getElementById(objectNameParam).style.backgroundImage = "url('" + mxBasePath + "/images/" + imgToggleSrcName + "')";
}

function rotateTagY(tagId) {
	RotateObject.setRotateObject(document.getElementById(tagId));
	RotateObject.rotateItOn();
}
function rotateTagYback(tagId) {
	RotateObject.setRotateObject(document.getElementById(tagId));
	RotateObject.rotateItBack();
}

var RotateObject = {
	x: 0,
	ny: 0,
	rotateYINT: null,
	rotateYBACK: null,
	rotateObject: null,
	previousRotateObject: null,
	imageStatus: true,
	setRotateObject: function(rotateObjectParam) {
		this.rotateObject = rotateObjectParam;
	},

	rotateItOn: function() {
		if (this.rotateYINT) {
			clearInterval(this.rotateYINT);
		}

		this.rotateYINT = setInterval("RotateObject.startYRotate()", 1);
	},

	rotateItBack: function() {
		if (this.rotateYINT) {
			clearInterval(this.rotateYINT);
		}

		this.rotateYBACK = setInterval("RotateObject.startYRotateBACK()", 1);
	},

	startYRotate: function() {
		if (this.previousRotateObject) {
			if (this.previousRotateObject != this.rotateObject) {
				if (180 > this.ny || (180 < this.ny && 360 > this.ny)) {
//					this.previousRotateObject.style = null;
				}
			}
		}

		this.ny = this.ny + 5;
		this.rotateObject.style.transform = "rotateY(" + this.ny + "deg)";
		this.rotateObject.style.webkitTransform = "rotateY(" + this.ny + "deg)";
		this.rotateObject.style.OTransform = "rotateY(" + this.ny + "deg)";
		this.rotateObject.style.MozTransform = "rotateY(" + this.ny + "deg)";

		if (this.ny == 180 || this.ny >= 360) {
			this.imageStatus = false;
			if (this.rotateYINT) {
				clearInterval(this.rotateYINT);
				this.ny = 0;
			}
			if (this.ny >= 360) {
				this.ny = 0;
				return;
			}
		}

		this.previousRotateObject = this.rotateObject;
	},

	startYRotateBACK: function() {
		this.ny = this.ny - 5;
		this.rotateObject.style.transform = "rotateY(" + this.ny + "deg)";
		this.rotateObject.style.webkitTransform = "rotateY(" + this.ny + "deg)";
		this.rotateObject.style.OTransform = "rotateY(" + this.ny + "deg)";
		this.rotateObject.style.MozTransform = "rotateY(" + this.ny + "deg)";

		if (this.ny == 180 || this.ny <= 0) {
			if (this.rotateYBACK) {
				clearInterval(this.rotateYBACK);
			}
			if (this.ny <= 0) {
				this.ny = 0;
				return;
			}
		}
	}
};
