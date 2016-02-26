/**
 * define global variable
 **/

/*
 * XMLDocument variable
 */
XML_NODE = {
	BUSINESSFLOW_XML_MXCELL: "mxCell",
	BUSINESSFLOW_XML_MXGEOMETRY: "mxGeometry",
	BUSINESSFLOW_XML_ID: "id",
	BUSINESSFLOW_XML_VALUE: "value",
	BUSINESSFLOW_XML_SOURCE: "source",
	BUSINESSFLOW_XML_TARGET: "target",
	BUSINESSFLOW_XML_PARENT: "parent",
	BUSINESSFLOW_XML_STYLE: "style",
	BUSINESSFLOW_XML_X: "x",
	BUSINESSFLOW_XML_Y: "y",
	BUSINESSFLOW_XML_WIDTH: "width",
	BUSINESSFLOW_XML_HEIGHT: "height",
	BUSINESSFLOW_XML_INPUT_POINT: "INPUT",
	BUSINESSFLOW_XML_OUTPUT_POINT: "OUTPUT",
	BUSINESSFLOW_XML_TRUE_POINT: "TRUE",
	BUSINESSFLOW_XML_FALSE_POINT: "FALSE",
	BUSINESSFLOW_XML_NODETYPE_NODE: "createNode",
	BUSINESSFLOW_XML_NODETYPE_POINT: "createPoint",
	BUSINESSFLOW_XML_NODETYPE_LINK: "createLink"
};

/*
 * data node
 */
DATA_ATTRIBUTE = {
	BUSINESS_ICON_ID: "activitySpecId",
	BUSINESS_ICON_NAME: "iconUrl",
	BUSINESS_ICON_TITLE: "activitySpecName",
	BUSINESS_ICON_SUBTYPE: "activitySpecCatalog",
	BUSINESS_ICON_OUTBRANCHQTY : "outBranchQty"
};

/*
 * html element name
 */
HTML_ELEMENT = {
	BUSINESSFLOW_HTML_BODY: "body",
	BUSINESSFLOW_HTML_DIV: "div",
	BUSINESSFLOW_HTML_ID: "id",
	BUSINESSFLOW_HTML_CLASS: "class",
	BUSINESSFLOW_HTML_IMG: "img",
	BUSINESSFLOW_ATTR_SRC: "src",
	BUSINESSFLOW_HTML_SIDEBARCONTAINER: "Container"
};

HTML_ELEMENT_FILTER_LIST = [
	"wBox_userMode",
	"om-dialog om-widget om-widget-content om-corner-all om-draggable om-resizable",
	"om-dialog om-widget om-widget-content om-corner-all",
	"om-widget-overlay"
];

/*
 * define number of "sidebar" icon
 */
BUSINESSFLOW_TYPE_CALCULATE_STYLE = {
	AUDIENCE: 3,
	CHANNEL: 3,
	DECISION: 9,
	ACTION: 9
};

/*
 * transform "activitySpecId" to local object attribute
 */
BUSINESSFLOW_ID_TYPE_TRANS = {
	//	segment
	1001: "marketingSegment",
	1002: "customerEvent",
	1003: "addFromCampaign",
	1004: "customerOldEvent",
	//	channel
	2001: "email",
	2002: "sms",
	2003: "twitter",
	2004: "Mannual",
	//	decision
	3001: "clickedEmail",
	3002: "opendEmail",
	3003: "sendEmail",
	3004: "sendSms",
	3005: "repliedSms",
	3006: "frequency",
	3007: "communicationLimit",
	3008: "isOwing",
	3009: "isInBlackList",
//	3010: "orderOffer",
	3011: "checkFavoriteMedia",
	4008: "mannualWorkRunning",
	4009: "mannualWorkCompleted",
	//	action
	4001: "giveAnPresent",
	4002: "addToCampaign",
	4003: "wait",
	4004: "addToSharedList",
	4005: "addToDisturbList",
	4006: "createALead",
	4007: "subscribeAnOffer"
};



/*
 * transform businessflow type to local page name
 */
BUSINESSFLOW_TYPE_URL = {
	//	segment
	MARKETINGSEGMENT: "/ARIESRES/marketing/marketingcampaign/Segment.html",
	CUSTOMEREVENT: "/ARIESRES/marketing/marketingcampaign/Event.html",
	CUSTOMEROLDEVENT: "/ARIESRES/crm-bj/campaign/main/workflow-node/html/OldEvent.html",
	//	channel
	TWITTER:"/ARIESRES/marketing/marketingcampaign/Twitter.html",
	EMAIL: "/ARIESRES/marketing/marketingcampaign/Email.html",
	SMS: "sms",
	//	decision
	CLICKEDEMAIL: "clickedEmail",
	OPENDEMAIL: "opendEmail",
	SENDEMAIL: "sendEmail",
	SENDSMS: "/ARIESRES/marketing/marketingcampaign/SendSMS.html",
	REPLIEDSMS: "repliedSms",
	FREQUENCY: "frequency",
	COMMUNICATIONLIMIT: "communicationLimit",
	ISOWING: "isOwing",
	ISINBLACKLIST: "isInBlackList",
//	ORDEROFFER: "/ARIESRES/crm-bj/campaign/main/workflow-node/html/OrderOffer.html",
	CHECKFAVORITEMEDIA: "/ARIESRES/crm-bj/campaign/main/workflow-node/html/CheckFavoriteMedia.html",
	//	action
	SUBSCRIBEANOFFER: "/ARIESRES/marketing/marketingcampaign/SubscribeAnOffer.html",
	GIVEANPRESENT: "giveAnPresent",
	ADDTOCAMPAIGN: "addToCampaign",
	WAIT: "/ARIESRES/marketing/marketingcampaign/Wait.html",
	ADDTOSHAREDLIST: "addToSharedList",
	ADDTODISTURBLIST: "addToDisturbList",
	CREATEALEAD: "createALead",

	// others
	BUSINESSFLOWADDTOCAMPAIGN: "businessflowAddToCampaign.html",
	MANNUAL:"/ARIESRES/marketing/marketingcampaign/TouchPoint.html",
	MANNUALWORKRUNNING:"/ARIESRES/marketing/marketingcampaign/MannualWorkRunning.html",
	MANNUALWORKCOMPLETED:"/ARIESRES/marketing/marketingcampaign/MannualWorkCompleted.html"

};

/*
 * businessflow service "URL"
 */
BUSINESSFLOW_REQUEST = {
	//HTTP_URL: "http://localhost:32000/HubCrmServlet",
	HTTP_URL: "http://hub.crm.veris7.ai:32500/HubCrmServlet",
	SERVICE_QUERY_ACTIVITY: "queryActivitySpecification",
	SERVICE_QUERY_CAMPAIGN: "parseCampaignGraph",
	SERVICE_SAVE: "designCampaign",
	CONTENT_TYPE_URLENCODED: "application/x-www-form-urlencoded",
	CONTENT_TYPE_JSON: "json",
	REQUEST_TYPE_POST: "POST"
};

/*
 * opreation map on number
 */
BUSINESSFLOW_OPERATION = {
	DELETE: 0,
	UNCHANGED: 1,
	CREATE: 2,
	UPDATE: 3,
	CHECK: 4,
	TRUE: 1,
	FALSE: 2,
	OUTPUT: 1
};

/*
 * class name on tag
 */
STYLESHEET_NAME = {
	BUSINESSFLOW_STYLESHEET_DRAGELEMENT: "dragElement",
	BUSINESSFLOW_STYLESHEET_TOOLBARDIV: "toolbarDiv",
	BUSINESSFLOW_STYLESHEET_HINTSCONTAINER: "hintsContainer",
	BUSINESSFLOW_STYLESHEET_SPACER: "spacer"
}

/*
 * mxGraph action variable
 */
MX_GRAPH_ACTION = {
	BUSINESSFLOW_ACTION_EXPORT: "export",
	BUSINESSFLOW_ACTION_CLICK: "click",
	BUSINESSFLOW_ACTION_SIDEBAR: "show",
	BUSINESSFLOW_ACTION_DELETE: "delete"
};

/*
 * define "callback" function name
 */
POLICY_FLOW_NODE_STYLE = "FlowNodeStyle";
POLICY_FLOW_NODE_CLICK_ACTION = "FlowNodeClickAction";
POLICY_FLOW_NODE_DBCLICK_ACTION = "FlowNodeDBClickAction";
POLICY_FLOW_NODE_DROP_ACTION = "FlowNodeDropAction";

/*
 * style variable
 */
MX_GRAPH_STYLE = {
	BUSINESSFLOW_STYLE_NAME: "port",
	BUSINESSFLOW_STYLE_INPUT_X: "0.5",
	BUSINESSFLOW_STYLE_INPUT_Y: "0",
	BUSINESSFLOW_STYLE_OUTPUT_X: "0.5",
	BUSINESSFLOW_STYLE_OUTPUT_Y: "1",
	BUSINESSFLOW_STYLE_TRUE_X: "0.5",
	BUSINESSFLOW_STYLE_TRUE_Y: "1",
	BUSINESSFLOW_STYLE_FALSE_X: "0.2",
	BUSINESSFLOW_STYLE_FALSE_Y: "1",
	BUSINESSFLOW_STYLE_DEFAULTWIDTH: "150",
	BUSINESSFLOW_STYLE_DEFAULTHEIGHT: "80",
	BUSINESSFLOW_STYLE_POPUPWIDTH: "380",
	BUSINESSFLOW_STYLE_POPUPHEIGHT: "300",
	BUSINESSFLOW_STYLE_POINT_WIDTH: "16",
	BUSINESSFLOW_STYLE_POINT_HEIGHT: "16",
	BUSINESSFLOW_STYLE_GRADIENTCOLOR: "#41B9F5",
	BUSINESSFLOW_STYLE_FILLCOLOR: "#eeeeee",
	BUSINESSFLOW_STYLE_ROUNDED: true,
	BUSINESSFLOW_STYLE_OPACITY: "80",
	BUSINESSFLOW_STYLE_PERIMETER_SPACING: "6",
	BUSINESSFLOW_STYLE_LABEL_BACKGROUNDCOLOR: "#FFFFFF",
	BUSINESSFLOW_STYLE_CURVED: 1
};
