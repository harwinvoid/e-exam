/**
 * extends or cover "mxGraph" plugin code
 */


/*
 * add "marker" tag for create arrow on line
 */
//mxShape.prototype.createSvgGroup = function(shape) {
//	var g = document.createElementNS(mxConstants.NS_SVG, "g");
//
//	// Creates the shape inside an svg group
//	this.innerNode = document.createElementNS(mxConstants.NS_SVG, shape);
//	this.configureSvgShape(this.innerNode);
//
//	// Avoids anti-aliasing for non-rounded rectangles with a
//	// strokewidth of 1 or more pixels
//	if (shape == "rect" && this.strokewidth * this.scale >= 1 && !this.isRounded) {
//		this.innerNode.setAttribute("shape-rendering", "optimizeSpeed");
//	}
//
//	if (shape == "rect" && this.fill == "#8CCDF5") {
//		g.innerHTML = "<defs>" +
//						"<filter id='shadowFilter' x='0' y='0' width='200%' height='200%'>" +
//							"<feOffset result='offOut' in='SourceAlpha' dx='2' dy='2' />" +
//							"<feGaussianBlur result='blurOut' in='offOut' stdDeviation='2' />" +
//							"<feBlend in='SourceGraphic' in2='blurOut' mode='normal' />" +
//						"</filter>" +
//					"</defs>";
//	}
//	//"<i data-id='"+id+"' style=\"cursor: pointer\" class='fx-mx-delete text-muted text-lg md md-clear pull-right'></i>";
//	if (shape == "path" && this.scale >= 1) {
//		g.innerHTML = "<defs>" +
//						"<marker orient='auto' refy='6' refx='6' viewbox='0 0 12 12' markerheight='6' markerwidth='6' markerunits='strokeWidth' id='arrow'>" +
//							"<path fill='#6482B9' d='M2,2 L10,6 L2,10 L6,6 L2,2'></path>" +
//						"</marker>" +
//					"</defs>";
//	}
//
//	// Creates the shadow
//	this.shadowNode = this.createSvgShadow(this.innerNode);
//
//	if (this.shadowNode != null) {
//		g.appendChild(this.shadowNode);
//	}
//
//	// Appends the main shape after the shadow
//	g.appendChild(this.innerNode);
//
//	return g;
//};
//
///*
// * create curved line
// */
//mxShape.prototype.createCurvedPoints = function(isVml) {
//	var crisp = (this.crisp && this.dialect == mxConstants.DIALECT_SVG && mxClient.IS_IE) ? 0.5 : 0;
//	var offsetX = (isVml) ? this.bounds.x : 0;
//	var offsetY = (isVml) ? this.bounds.y : 0;
//
//	var p0 = this.points[0];
//	var p1 = this.points[1];
//	var p2 = this.points[2];
//	var p3 = this.points[3];
//
//	configurationArrowStyle(this);
//
//	var n = this.points.length;
//	var points = ((isVml) ? "m" : "M") + " " + (Math.round(p0.x + 18 - offsetX) + crisp) + " " + (Math.round(p0.y + 7 - offsetY) + crisp) + " ";
//	var lastX = 0;
//	var lastY = 0;
//
//	if (!isVml) {
//		points += "Q " + Math.round(p0.x + 10 - offsetX) + " " + Math.round((p0.y + p3.y + 7) / 2 - offsetY) + " " + (Math.round((p0.x + p3.x + 10) / 2 - offsetX) + crisp) + " " + (Math.round((p0.y + p3.y + 7) / 2 - offsetY) + crisp) + " ";
//	}
//
//	if (isVml) {
//		points += this.createVmlQuad(lastX - offsetX, lastY - offsetY, p0.x - offsetX, p0.y - offsetY, p1.x - offsetX, p1.y - offsetY);
//	} else {
//		points += "Q " + Math.round(p3.x + 10 - offsetX) + " " + Math.round((p0.y + p3.y + 14) / 2 - offsetY) + " " + (Math.round(p3.x + 18 - offsetX) + crisp) + " " + (Math.round(p3.y - 8 - offsetY) + crisp) + " ";
//	}
//
//	return points;
//};

/*
 * change "stroke-width" by color
 */
//mxShape.prototype.updateSvgScale = function(node) {
//	if ("rect" == node.nodeName && "#038cd6" == node.getAttribute("stroke")) {
//		node.setAttribute("rx", "4");
//		node.setAttribute("ry", "4");
//		node.setAttribute("stroke-width", 2);
//	} else if ("rect" == node.nodeName && "#8CCDF5" == node.getAttribute("fill")) {
//		node.setAttribute("filter", "url(#shadowFilter)");
//		node.setAttribute("rx", "5");
//		node.setAttribute("ry", "5");
//	} else if ("rect" == node.nodeName && "#00C8E0" == node.getAttribute("fill")) {
//		node.setAttribute("stroke-width", 0);
//	} else if ("path" == node.nodeName &&
//		"none" == node.getAttribute("fill") &&
//		"#6482B9" == node.getAttribute("stroke")) {
//		node.setAttribute("stroke-width", 0);
//	} else if ("path" == node.nodeName && "#00FF00" == node.getAttribute("stroke")) {
//		node.setAttribute("stroke-width", 1);
//	} else if ("path" == node.nodeName && node.getAttribute("marker-mid")) {
//		node.setAttribute("stroke-width", 3);
//	} else {
//		node.setAttribute("stroke-width", Math.round(Math.max(1, this.strokewidth * this.scale)));
//	}
//
//	if (this.isDashed) {
//		var phase = Math.max(1, Math.round(3 * this.scale * this.strokewidth));
//		node.setAttribute("stroke-dasharray", phase + " " + phase);
//	}
//
//	if (this.crisp && (this.roundedCrispSvg || this.isRounded != true) && (this.rotation == null || this.rotation == 0)) {
//		node.setAttribute("shape-rendering", "crispEdges");
//	} else {
//		node.removeAttribute("shape-rendering");
//	}
//};

/*
 * add arrow on to line
 */
function configurationArrowStyle(pathNode) {
	var p0 = pathNode.points[0];
	var p1 = pathNode.points[1];
	var p2 = pathNode.points[2];
	var p3 = pathNode.points[3];

	pathNode.innerNode.nextElementSibling.setAttribute("stroke-opacity", "0");
	pathNode.innerNode.nextElementSibling.setAttribute("fill-opacity", "0");

	if (1 == pathNode.scale) {
		var nodesNearBy =  pathNode.node.parentNode.childNodes;
		if (pathNode.node.parentNode.childNodes) {

			for (var i = 0; i < nodesNearBy.length; i ++) {

				var nodesNearByFirstChild = nodesNearBy[i].firstChild;
				if ("image" == nodesNearByFirstChild.nodeName) {

					var xDistance = parseInt(p0.x) - parseInt(nodesNearByFirstChild.getAttribute("x"));
					var rightIndex = nodesNearByFirstChild.href.baseVal.indexOf("point_right");
					var wrongIndex = nodesNearByFirstChild.href.baseVal.indexOf("point_wrong");
					var normalIndex = nodesNearByFirstChild.href.baseVal.indexOf("point_normal");

					if ((parseInt(nodesNearByFirstChild.getAttribute("x")) - parseInt(p0.x) == -30) && rightIndex > -1) {
						pathNode.innerNode.setAttribute("stroke", "#819f00");
						pathNode.innerNode.setAttribute("marker-mid", "url(#arrowRight)");
						pathNode.innerNode.previousSibling.firstChild.setAttribute("id", "arrowRight");
						pathNode.innerNode.previousSibling.firstChild.firstChild.setAttribute("fill", "#819f00");
					}

					if ((parseInt(nodesNearByFirstChild.getAttribute("x")) - parseInt(p0.x) == 6) && wrongIndex > -1) {
						pathNode.innerNode.setAttribute("stroke", "#ff2a6a");
						pathNode.innerNode.setAttribute("marker-mid", "url(#arrowWrong)");
						pathNode.innerNode.previousSibling.firstChild.setAttribute("id", "arrowWrong");
						pathNode.innerNode.previousSibling.firstChild.firstChild.setAttribute("fill", "#ff2a6a");
					}

					if ((parseInt(nodesNearByFirstChild.getAttribute("x")) - parseInt(p0.x) == 6) && normalIndex > -1) {
						pathNode.innerNode.setAttribute("stroke", "#4a5b6d");
						pathNode.innerNode.setAttribute("marker-mid", "url(#arrowNormal)");
						pathNode.innerNode.previousSibling.firstChild.setAttribute("id", "arrowNormal");
						pathNode.innerNode.previousSibling.firstChild.firstChild.setAttribute("fill", "#4a5b6d");
					}

					if (30 == xDistance && rightIndex > -1) {
						p0.x = p0.x - 36;

						if (parseInt(p3.x) - parseInt(p2.x) != 24) {

							if (1 == pathNode.scale) {
								p3.x = parseInt(pathNode.innerNode.nextElementSibling.getAttribute("d").split(/\s+/)[1]) + 6;
								p3.y = parseInt(pathNode.innerNode.nextElementSibling.getAttribute("d").split(/\s+/)[2]) + 6;
							}
						}
					}
				}
			}
		}
	}
}

/*
 * For when drop event happend to invoke function
 */
mxDragSource.prototype.mouseUp = function(evt) {
	if (this.currentGraph != null) {
		if (this.currentPoint != null
				&& (this.previewElement == null || this.previewElement.style.visibility != 'hidden')) {
			var scale = this.currentGraph.view.scale;
			var tr = this.currentGraph.view.translate;
			var x = this.currentPoint.x / scale - tr.x;
			var y = this.currentPoint.y / scale - tr.y;

			this.drop(this.currentGraph, evt, this.currentDropTarget, x, y);
		}
		this.dragExit(this.currentGraph);

		var selectionCells = graph.getSelectionCell();

		if (selectionCells) {
			var businessIconList = getBusinessIcon.getBusinessIconList();

			for (var i = 0; i < businessIconList.length; i ++) {
				var className = "";
				var regex = /\"(.*?)\"/g;
				var matchArr = selectionCells.value.match(regex);
				if (matchArr) {
					className = matchArr[0].replace(/\"/g, "");
				}
				if (className.indexOf(businessIconList[i].businessClassName) > 0) {
					businessIconList[i].id = selectionCells.id;
					businessIconList[i].runPolicy(POLICY_FLOW_NODE_DROP_ACTION, businessIconList[i]);
				}
			}
		}
	}

	this.stopDrag(evt);

	this.currentGraph = null;

	if (this.mouseMoveHandler != null) {
		var mm = (mxClient.IS_TOUCH) ? 'touchmove' : 'mousemove';
		mxEvent.removeListener(document, mm, this.mouseMoveHandler);
		this.mouseMoveHandler = null;
	}

	if (this.mouseUpHandler != null) {
		var mu = (mxClient.IS_TOUCH) ? 'touchend' : 'mouseup';
		mxEvent.removeListener(document, mu, this.mouseUpHandler);
		this.mouseUpHandler = null;
	}

	mxEvent.consume(evt);

};

/*
 * change the color of selected shape
 */
mxVertexHandler.prototype.createSelectionShape = function(bounds) {
	bounds.rx = "4";
	bounds.ry = "4";
	var shape = new mxRectangleShape(bounds, null, "#038cd6");
	shape.strokewidth = 2;
	shape.isDashed = false;
	shape.crisp = true;

	return shape;
}

/**
 * Function: clearSelection
 *
 * Clears the selection using <mxGraphSelectionModel.clear>.
 */
mxGraph.prototype.clearSelection = function() {

	mxVertexHandler.prototype.createSelectionShape = function(bounds) {
		bounds.rx = "4";
		bounds.ry = "4";
		var shape = new mxRectangleShape(bounds, null, "#038cd6");
		shape.strokewidth = 2;
		shape.isDashed = false;
		shape.crisp = true;

		return shape;
	};
	return this.getSelectionModel().clear();
};

/*
 * define vertex style
 */
function createDefaultVertexStyle() {
	var defaultVertexStyle = new Object();
	defaultVertexStyle[mxConstants.STYLE_FILLCOLOR] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_FILLCOLOR;
	defaultVertexStyle[mxConstants.STYLE_ROUNDED] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_ROUNDED;

	return defaultVertexStyle;
}

/*
 * define cell style
 */
function createCellStyle() {
	var cellStyle = new Object();
	cellStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
	cellStyle[mxConstants.STYLE_FONTCOLOR] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_FONTCOLOR;
	cellStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
	cellStyle[mxConstants.STYLE_PERIMETER_SPACING] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_PERIMETER_SPACING;
	cellStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
	cellStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	cellStyle[mxConstants.STYLE_FONTSIZE] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_FONTSIZE;
	cellStyle[mxConstants.STYLE_FONTSTYLE] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_FONTSTYLE;

	return cellStyle;
}

/*
 * define edge style
 */
function createDefaultEdgeStyle(defaultEdgeStyle) {
	defaultEdgeStyle[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_LABEL_BACKGROUNDCOLOR;
	// defaultEdgeStyle[mxConstants.STYLE_STROKEWIDTH] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_STROKEWIDTH;
	defaultEdgeStyle[mxConstants.STYLE_ROUNDED] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_ROUNDED;
	// defaultEdgeStyle[mxConstants.STYLE_CURVED] = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_CURVED;
	defaultEdgeStyle[mxConstants.STYLE_CURVED] = false;
//	defaultEdgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
}
