/**
 * util purpose(mix with mxGraph code): list graph node style "callback" functions
 * naming rule: "businessflowType" mix with word "FlowNodeStyle"
 * 				"businessflowType" value from constant file(businessflowConstant.js)
 * 				mapping from "businessflow" id
 * create graph node own style
 **/

/*		segment		*/
/*
 * marketingSegment
 */
var marketingSegmentFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;
	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = startNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * customerEvent
 */
var customerEventFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = startNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

var customerOldEventFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = startNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

var addFromCampaignFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = startNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*		channel		*/
/*
 * email
 */
var emailFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = normalNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * sms
 */
var smsFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = normalNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * twitter
 */
var twitterFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = normalNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*		decision		*/
/*
 * clickedEmail
 */
var clickedEmailFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * opendEmail
 */
var opendEmailFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * sendEmail
 */
var sendEmailFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * sendSms
 */
var sendSmsFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * repliedSms
 */
var repliedSmsFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * frequency
 */
var frequencyFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * communicationLimit
 */
var communicationLimitFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * isOwing
 */
var isOwingFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * isInBlackList
 */
var isInBlackListFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*		action		*/
/*
 * subscribeAnOffer
 */
var subscribeAnOfferFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = finishNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * giveAnPresent
 */
var giveAnPresentFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = finishNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};


/*
 * Mannual
 */
var MannualFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = finishNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * MannualWorkRunning
 */
var mannualWorkRunningFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * MannualWorkCompleted
 */
var mannualWorkCompletedFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = judgeNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};


/*
 * addToCampaign
 */
var addToCampaignFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = finishNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * wait
 */
var waitFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = finishNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

var createALeadFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = finishNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
}

/*
 * addToSharedList
 */
var addToSharedListFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = finishNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * addToDisturbList
 */
var addToDisturbListFlowNodeStyle = function(jsonNodeObject) {
	var functNode = null;

	if (jsonNodeObject) {
		// define drag node style with business node
		functNode = finishNodeStyle(jsonNodeObject);
	} else {
		// there is no business node define, pop up alerm
	}

	return functNode;
};

/*
 * start node style
 */
function startNodeStyle(jsonNodeObject) {
	var functNode = function(graph, evt, cell, x, y) {
		$("#workflowModal").trigger("mouseup");
		var parent = graph.getDefaultParent();
		var model = graph.getModel();
		var graphInsertVertex = null;
		model.beginUpdate();
		var id = model.nextId;
		try {
			graphInsertVertex = graph.insertVertex(parent, null,
					htmlElementConstruction.createBusinessNodeIconConstruction(jsonNodeObject, id), x, y,
					parseInt(jsonNodeObject.businessflowDefaultWidth), parseInt(jsonNodeObject.businessflowDefaultHeight));
			graphInsertVertex.setConnectable(false);
			graphInsertVertex.geometry.alternateBounds = new mxRectangle(0, 0, 120, 40);

			var graphPoint = graph.insertVertex(graphInsertVertex, null, XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT,
					new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointDefaultX()), new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointDefaultY()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointDefaultWidth()), parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointDefaultHeight()),
					getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointIconName(), true);
			graphPoint.geometry.offset = new mxPoint(parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetX()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetY()));



		} finally {
			model.endUpdate();
		}
		graph.setSelectionCell(graphInsertVertex);
		//TODO 触发打开事件
		//jsonNodeObject.id = id;
		//eval(jsonNodeObject.businessName+"FlowNodeDBClickAction(jsonNodeObject)");
	};

	return functNode;
}

/*
 * finish node style
 */
function finishNodeStyle(jsonNodeObject) {
	if (0 != parseInt(jsonNodeObject.outBranchQty)) {
		return normalNodeStyle(jsonNodeObject);
	}

	var functNode = function(graph, evt, cell, x, y) {
		$("#workflowModal").trigger("mouseup");
		var parent = graph.getDefaultParent();
		var model = graph.getModel();
		var graphInsertVertex = null;

		model.beginUpdate();
		var id = model.nextId;
		try {

			graphInsertVertex = graph.insertVertex(parent, null,
					htmlElementConstruction.createBusinessNodeIconConstruction(jsonNodeObject, id), x, y,
					parseInt(jsonNodeObject.businessflowDefaultWidth), parseInt(jsonNodeObject.businessflowDefaultHeight));
			graphInsertVertex.setConnectable(false);

			graphInsertVertex.geometry.alternateBounds = new mxRectangle(0, 0, 120, 40);

			var graphPoint = graph.insertVertex(graphInsertVertex, null, XML_NODE.BUSINESSFLOW_XML_INPUT_POINT,
					new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultX()), new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultY()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultWidth()), parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultHeight()),
					getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointIconName(), true);
			graphPoint.geometry.offset = new mxPoint(parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetX()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetY()));

		} finally {
			model.endUpdate();
		}

		graph.setSelectionCell(graphInsertVertex);
		//TODO 触发打开事件
		//jsonNodeObject.id = id;
		//eval(jsonNodeObject.businessName+"FlowNodeDBClickAction(jsonNodeObject)");
	};

	return functNode;
}

/*
 * judge node style
 */
function judgeNodeStyle(jsonNodeObject) {
	var functNode = function(graph, evt, cell, x, y) {
		$("#workflowModal").trigger("mouseup");
		var parent = graph.getDefaultParent();
		var model = graph.getModel();
		var graphInsertVertex = null;
		var id = model.nextId;
		model.beginUpdate();
		try {

			graphInsertVertex = graph.insertVertex(parent, null,
					htmlElementConstruction.createBusinessNodeIconConstruction(jsonNodeObject, id), x, y,
					parseInt(jsonNodeObject.businessflowDefaultWidth), parseInt(jsonNodeObject.businessflowDefaultHeight));
			graphInsertVertex.setConnectable(false);

			graphInsertVertex.geometry.alternateBounds = new mxRectangle(0, 0, 120, 40);

			var graphPoint = graph.insertVertex(graphInsertVertex, null, XML_NODE.BUSINESSFLOW_XML_INPUT_POINT,
					new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultX()), new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultY()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultWidth()), parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultHeight()),
					getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointIconName(), true);
			graphPoint.geometry.offset = new mxPoint(parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetX()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetY()));

			var graphPoint = graph.insertVertex(graphInsertVertex, null, XML_NODE.BUSINESSFLOW_XML_TRUE_POINT,
					new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_TRUE_POINT).getPointDefaultX()), new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_TRUE_POINT).getPointDefaultY()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_TRUE_POINT).getPointDefaultWidth()), parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_TRUE_POINT).getPointDefaultHeight()),
					getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_TRUE_POINT).getPointIconName(), true);
			graphPoint.geometry.offset = new mxPoint(parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetX()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetY()));

			var graphPoint = graph.insertVertex(graphInsertVertex, null, XML_NODE.BUSINESSFLOW_XML_FALSE_POINT,
					new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_FALSE_POINT).getPointDefaultX()), new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_FALSE_POINT).getPointDefaultY()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_FALSE_POINT).getPointDefaultWidth()), parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_FALSE_POINT).getPointDefaultHeight()),
					getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_FALSE_POINT).getPointIconName(), true);
			graphPoint.geometry.offset = new mxPoint(parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetX()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetY()));

		} finally {
			model.endUpdate();
		}

		graph.setSelectionCell(graphInsertVertex);
		//TODO 触发打开事件
		//jsonNodeObject.id = id;
		//eval(jsonNodeObject.businessName+"FlowNodeDBClickAction(jsonNodeObject)");
	};

	return functNode;
}

/*
 * normal node style
 */
function normalNodeStyle(jsonNodeObject) {
	var functNode = function(graph, evt, cell, x, y) {
		$("#workflowModal").trigger("mouseup");
		var parent = graph.getDefaultParent();
		var model = graph.getModel();
		var graphInsertVertex = null;
		var id = model.nextId;
		model.beginUpdate();
		try {
			graphInsertVertex = graph.insertVertex(parent, null, htmlElementConstruction.createBusinessNodeIconConstruction(jsonNodeObject, id), x, y,
					parseInt(jsonNodeObject.businessflowDefaultWidth), parseInt(jsonNodeObject.businessflowDefaultHeight));
			graphInsertVertex.setConnectable(false);

			graphInsertVertex.geometry.alternateBounds = new mxRectangle(0, 0, 120, 40);

			var graphPoint = graph.insertVertex(graphInsertVertex, null, XML_NODE.BUSINESSFLOW_XML_INPUT_POINT,
					new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultX()), new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultY()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultWidth()), parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultHeight()),
					getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointIconName(), true);
			graphPoint.geometry.offset = new mxPoint(parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetX()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetY()));

			var graphPoint = graph.insertVertex(graphInsertVertex, null, XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT,
					new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointDefaultX()), new Number(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointDefaultY()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointDefaultWidth()), parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointDefaultHeight()),
					getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointIconName(), true);
			graphPoint.geometry.offset = new mxPoint(parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetX()),
					parseInt(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_INPUT_POINT).getPointDefaultOffsetY()));
			//console.log(getBusinessPointIconByName(XML_NODE.BUSINESSFLOW_XML_OUTPUT_POINT).getPointIconName());
		} finally {
			model.endUpdate();
		}

		graph.setSelectionCell(graphInsertVertex);
		//TODO 触发打开事件
		//jsonNodeObject.id = id;
		//eval(jsonNodeObject.businessName+"FlowNodeDBClickAction(jsonNodeObject)");
//		var businessTagI = $(document).find("i[data-id='"+id+"']")[0];
//		mxEvent.addListener(businessTagI, 'click',
//			mxUtils.bind(this, function(evt)
//			{
//				var mxRightId = $("#mx-container-right").data("id");
//
//				if(id == mxRightId){
//					$("#mx-container-right").empty();
//				}
//
//				if(currentNodeId && currentNodeId == id){
//					currentNodeId = "";
//					currentNodeName = "";
//				}
//				var arrayCells = [];
//				var deleteModel = model.cells[id];
//				arrayCells.push(deleteModel);
//				graph.removeCells(arrayCells, true);
//					// process delete cell to "allData" that kind of "edge" type
//				if (deleteModel.source && deleteModel.target) {
//					processData.businessflowData.removeActivityRelationDataFromAllData(deleteModel.source.parent.id, deleteModel.source.value);
//				} else {
//					// process delete cell to "allData"
//					processData.businessflowData.removeActivityDataById(deleteModel.id);
//				}
//				mxEvent.consume(evt);
//			})
//		);
	};

	return functNode;
}
