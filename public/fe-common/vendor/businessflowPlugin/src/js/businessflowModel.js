/**
 * util purpose: businessflow model
 * 
 * 1. ToolBarButtonObject
 * 2. BusinessPointIcon
 * 3. BusinessIcon
 * 4. BusinessTypeIcon
 * 5. AjaxRequestObject
 */


/*
 * tool bar
 */
function ToolBarButtonObject() {
	this.action = "";
	this.title = "";
	this.icon = "";
	this.className = "";
	this.htmlConstruction = "";
	this.policyName = "";
	
	// call back by policy
	this.runPolicy = function(jsonString) {
		try {
			if (window[this.policyName]) {
				if (parameterAnalysis(jsonString)) {
					return window["eval"].call(window, this.policyName + "(" + parameterAnalysis(jsonString) + ")");
				} else {
					return window["eval"].call(window, this.policyName + "()");
				}
			}
		} catch(error) {
			console.log(error);
		}
	}
	
	this.setAction = function(actionParam) {
		this.action = actionParam;
	};
	this.getAction = function() {
		return this.action;
	};
	
	this.setTitle = function(titleParam) {
		this.title = titleParam;
	};
	this.getTitle = function() {
		return this.title;
	};
	
	this.setIcon = function(iconParam) {
		this.icon = iconParam;
	};
	this.getIcon = function() {
		return this.icon;
	};
	
	this.setClassName = function(classNameParam) {
		this.className = classNameParam;
	};
	this.getClassName = function() {
		return this.className;
	};
	
	this.setPolicyName = function(policyNameParam) {
		this.policyName = policyNameParam;
	};
	this.getPolicyName = function() {
		return this.policyName;
	};
	
	this.setHtmlConstruction = function(htmlConstructionParam) {
		this.htmlConstruction = htmlConstructionParam;
	};
	this.getHtmlConstruction = function() {
		return this.htmlConstruction;
	};
};

function AjaxRequestObject() {
	this.url = "";
	this.type = "";
	this.method = "";
	this.async = null;
	this.cache = null;
	this.callbackName = "";
	this.data = null;
	
	this.setUrl = function(urlParam) {
		this.url = urlParam;
	};
	this.getUrl = function() {
		return this.url;
	};
	
	this.setType = function(typeParam) {
		this.type = typeParam;
	};
	this.getType = function() {
		return this.type;
	};
	
	this.setMethod = function(methodParam) {
		this.method = methodParam;
	};
	this.getMethod = function() {
		return this.method;
	};
	
	this.setAsync = function(asyncParam) {
		this.async = asyncParam;
	};
	this.getAsync = function() {
		return this.async;
	};
	
	this.setCache = function(cacheParam) {
		this.cache = cacheParam;
	};
	this.getCache = function() {
		return this.cache;
	};
	
	this.setCallbackName = function(callbackNameParam) {
		this.callbackName = callbackNameParam;
	};
	this.getCallbackName = function() {
		return this.callbackName;
	};
	
	this.setData = function(dataParam) {
		this.data = dataParam;
	};
	this.getData = function() {
		return this.data;
	};
};

/*
 * define "BusinessPoitnIcon" on "BusinessIcon" 
 */
function BusinessPointIcon() {
	this.pointName = "";
	this.pointType = "";
	this.pointIconName = "";
	this.pointDefaultX = "";
	this.pointDefaultY = "";
	this.pointDefaultOffsetX = "";
	this.pointDefaultOffsetY = "";
	this.pointDefaultWidth = "";
	this.pointDefaultHeight = "";
	
	// get and set function
	this.setPointName = function(pointNameParam) {
		this.pointName = pointNameParam;
	};
	this.getPointName = function() {
		return this.pointName;
	};
	
	this.setPointType = function(pointTypeParam) {
		this.pointType = pointTypeParam;
	};
	this.getPointType= function() {
		return this.pointType;
	};
	
	this.setPointIconName = function(pointIconNameParam) {
		this.pointIconName = pointIconNameParam;
	};
	this.getPointIconName = function() {
		return this.pointIconName;
	};
	
	this.setPointDefaultX = function(pointDefaultXParam) {
		this.pointDefaultX = pointDefaultXParam;
	};
	this.getPointDefaultX = function() {
		return this.pointDefaultX;
	};
	
	this.setPointDefaultY = function(pointDefaultYParam) {
		this.pointDefaultY = pointDefaultYParam;
	};
	this.getPointDefaultY = function() {
		return this.pointDefaultY;
	};
	
	this.setPointDefaultOffsetX = function(pointDefaultOffsetXParam) {
		this.pointDefaultOffsetX = pointDefaultOffsetXParam;
	};
	this.getPointDefaultOffsetX = function() {
		return this.pointDefaultOffsetX;
	};

	this.setPointDefaultOffsetY = function(pointDefaultOffsetYParam) {
		this.pointDefaultOffsetY = pointDefaultOffsetYParam;
	};
	this.getPointDefaultOffsetY = function() {
		return this.pointDefaultOffsetY;
	};
	
	this.setPointDefaultWidth = function(pointDefaultWidthParam) {
		this.pointDefaultWidth = pointDefaultWidthParam;
	};
	this.getPointDefaultWidth = function() {
		return this.pointDefaultWidth;
	};
	
	this.setPointDefaultHeight = function(pointDefaultHeightParam) {
		this.pointDefaultHeight = pointDefaultHeightParam;
	};
	this.getPointDefaultHeight = function() {
		return this.pointDefaultHeight;
	};
}

/*
 * define business icon
 */
function BusinessIcon() {
	// parameters 
	this.businessId = "";
	this.businessName = "";
	this.businessIconName = "";
	this.businessSidebarIconName = "";
	this.businessClassName = "";
	this.businessTitleName = "";
	this.businessContent = "";
	this.businessflowType = "";
	this.businessflowDefaultWidth = "";
	this.businessflowDefaultHeight = "";
	this.htmlConstruction = "";
	this.policyName = "";
	
	// call back by policy
	this.runPolicy = function(policy, jsonString) {
		try {
			if (window[this.businessName + policy]) {
				if (parameterAnalysis(jsonString)) {
					return window["eval"].call(window, this.businessName + policy + "(" + parameterAnalysis(jsonString) + ")");
				} else {
					return window["eval"].call(window, this.businessName + policy + "()");
				}
			}
		} catch(error) {
			console.log(error);
		}
	}
	
	// get and set function
	this.setBusinessId = function(businessIdParam) {
		this.businessId = businessIdParam;
	};
	this.getBusinessId = function() {
		return this.businessId;
	};
	
	this.setBusinessName = function(businessNameParam) {
		this.businessName = businessNameParam;
	};
	this.getBusinessName = function() {
		return this.businessName;
	};
	
	this.setBusinessIconName = function(businessIconNameParam) {
		this.businessIconName = businessIconNameParam;
	};
	this.getBusinessIconName = function() {
		return this.businessIconName;
	};
	
	this.setBusinessSidebarIconName = function(businessSidebarIconNameParam) {
		this.businessSidebarIconName = businessSidebarIconNameParam;
	};
	this.getBusinessSidebarIconName = function() {
		return this.businessSidebarIconName;
	};
	
	this.setBusinessClassName = function(businessClassNameParam) {
		this.businessClassName = businessClassNameParam;
	};
	this.getBusinessClassName = function() {
		return this.businessClassName;
	};
	
	this.setBusinessTitleName = function(businessTitleNameParam) {
		this.businessTitleName = businessTitleNameParam;
	};
	this.getBusinessTitleName = function() {
		return this.businessTitleName;
	};
	
	this.setBusinessContent = function(businessContentParam) {
		this.businessContent = businessContentParam;
	};
	this.getBusinessContent = function() {
		return this.businessContent;
	};
	
	this.setBusinessflowType = function(businessflowTypeParam) {
		this.businessflowType = businessflowTypeParam;
	};
	this.getBusinessflowType = function() {
		return this.businessflowType;
	};

	this.setBusinessflowDefaultWidth = function(businessflowDefaultWidthParam) {
		this.businessflowDefaultWidth = businessflowDefaultWidthParam;
	};
	this.getBusinessflowDefaultWidth = function() {
		return this.businessflowDefaultWidth;
	};

	this.setBusinessflowDefaultHeight = function(businessflowDefaultHeightParam) {
		this.businessflowDefaultHeight = businessflowDefaultHeightParam;
	};
	this.getBusinessflowDefaultHeight = function() {
		return this.businessflowDefaultHeight;
	};
	
	this.setHtmlConstruction = function(htmlConstructionParam) {
		this.htmlConstruction = htmlConstructionParam;
	}
	this.getHtmlConstruction = function() {
		return this.htmlConstruction;
	}
	
	this.setPolicyName = function(policyNameParam) {
		this.policyName = policyNameParam;
	}
	this.getPolicyName = function() {
		return this.policyName;
	}
}

/*
 * define business type icon
 */
function BusinessTypeIcon() {
	this.businessTypeName = "";
	this.businessTypeIconName = "";
	this.businessTypeTitleName = "";
	this.businessTypeColor = "";
	this.businessIconCollection = null;
	
	this.setBusinessTypeName = function(businessTypeNameParam) {
		this.businessTypeName = businessTypeNameParam;
	};
	this.getBusinessTypeName = function() {
		return this.businessTypeName;
	};
	
	this.setBusinessTypeIconName = function(businessTypeIconNameParam) {
		this.businessTypeIconName = businessTypeIconNameParam;
	};
	this.getBusinessTypeIconName = function() {
		return this.businessTypeIconName;
	};
	
	this.setBusinessTypeTitleName = function(businessTypeTitleNameParam) {
		this.businessTypeTitleName = businessTypeTitleNameParam;
	};
	this.getBusinessTypeTitleName = function() {
		return this.businessTypeTitleName;
	};
	
	this.setBusinessTypeColor = function(businessTypeColorParam) {
		this.businessTypeColor = businessTypeColorParam;
	};
	this.getBusinessTypeColor = function() {
		return this.businessTypeColor;
	};
	
	this.setBusinessIconCollection = function(businessIconCollectionParam) {
		this.businessIconCollection = businessIconCollectionParam;
	};
	this.getBusinessIconCollection = function() {
		return this.businessIconCollection;
	};
}

/*
 * transform string parameter to json Object or json array 
 */
function parameterAnalysis(parameterString) {
	var returnString = null;
	
	if (parameterString) {
		if ("object" == typeof(parameterString)) {
			returnString = JSON.stringify(parameterString);
			
		} else {
			var jsonObject = JSON.parse(parameterString);
			
			if (parameterString) {
				if (jsonObject.length > 1) {
					for (var i = 0; i < jsonObject.length; i ++) {
						returnString += "'" + JSON.stringify(jsonObject[i]) + "'" + ",";
					}
				} else {
					returnString = parameterString;
				}
			}
			
			if (!returnString) {
				if ("," == returnString.charAt(returnString.length - 1)) {
					returnString = returnString.substring(0, returnString.length - 1);
				}
			}
		}
	}
	
	return returnString;
}
