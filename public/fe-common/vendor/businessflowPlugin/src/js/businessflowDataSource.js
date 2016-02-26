/**
 * util purpose: create data
 * 1. "sidebar" data(from database)
 * 2. "sidebarType" data
 * 3. "toolbar" data
 * 4. "graphNodePoint" data
 * 5. ajax request data
 * 6. data construction for show and save campaign
 * 7. ajax request public function
 */

/*
 * set business type icon
 */
var getBusinessTypeIcon = {
	getBusinessTypeIconList: function() {
		var businessTypeIconArray = new Array();
		
		var businessTypeSegmentIcon = new BusinessTypeIcon();
		businessTypeSegmentIcon.setBusinessTypeName("audience");
		businessTypeSegmentIcon.setBusinessTypeIconName("audience");
		businessTypeSegmentIcon.setBusinessTypeTitleName("audience");
		businessTypeSegmentIcon.setBusinessTypeColor("");
		var businessTypeChannelIcon = new BusinessTypeIcon();
		businessTypeChannelIcon.setBusinessTypeName("channel");
		businessTypeChannelIcon.setBusinessTypeIconName("channel");
		businessTypeChannelIcon.setBusinessTypeTitleName("channel");
		businessTypeChannelIcon.setBusinessTypeColor("");
		var businessTypeDecisionIcon = new BusinessTypeIcon();
		businessTypeDecisionIcon.setBusinessTypeName("decision");
		businessTypeDecisionIcon.setBusinessTypeIconName("decision");
		businessTypeDecisionIcon.setBusinessTypeTitleName("decision");
		businessTypeDecisionIcon.setBusinessTypeColor("");
		var businessTypeActionIcon = new BusinessTypeIcon();
		businessTypeActionIcon.setBusinessTypeName("action");
		businessTypeActionIcon.setBusinessTypeIconName("action");
		businessTypeActionIcon.setBusinessTypeTitleName("action");
		businessTypeActionIcon.setBusinessTypeColor("");
		
		businessTypeIconArray.push(businessTypeSegmentIcon);
		businessTypeIconArray.push(businessTypeChannelIcon);
		businessTypeIconArray.push(businessTypeDecisionIcon);
		businessTypeIconArray.push(businessTypeActionIcon);
		
		for (var i = 0; i < businessTypeIconArray.length; i ++) {
			var businessIconArray = getBusinessIcon.getBusinessIconList();
			
			if (businessIconArray) {
				var businessIconArrayTemp = new Array();
				for (var k = 0; k < businessIconArray.length; k ++) {

					if (businessIconArray[k].getBusinessflowType() == businessTypeIconArray[i].getBusinessTypeName()) {
						businessIconArrayTemp.push(businessIconArray[k]);
					}

					businessTypeIconArray[i].setBusinessIconCollection(businessIconArrayTemp);
				}
			}
		}
		
		return businessTypeIconArray;
	}
}

var getBusinessPointIcon = {
	getBusinessPointIconList: function() {
		var pointArray = new Array();
		
		var businessPointInput = new BusinessPointIcon();
		businessPointInput.setPointName("INPUT");
		businessPointInput.setPointType("INPUT");
		businessPointInput.setPointIconName("port;image=" + mxBasePath + "/images/overlays/flow chart_point_normal.png;spacingLeft=18");
		businessPointInput.setPointDefaultX("0.5");
		businessPointInput.setPointDefaultY("-0.05");
		businessPointInput.setPointDefaultOffsetX("-10");
		businessPointInput.setPointDefaultOffsetY("-8");
		businessPointInput.setPointDefaultWidth("24");
		businessPointInput.setPointDefaultHeight("24");
		
		var businessPointOutput = new BusinessPointIcon();
		businessPointOutput.setPointName("OUTPUT");
		businessPointOutput.setPointType("OUTPUT");
		businessPointOutput.setPointIconName("port;image=" + mxBasePath + "/images/overlays/flow chart_point_normal.png;align=right;imageAlign=right;spacingRight=18");
		businessPointOutput.setPointDefaultX("0.5");
		businessPointOutput.setPointDefaultY("0.95");
		businessPointOutput.setPointDefaultOffsetX("-10");
		businessPointOutput.setPointDefaultOffsetY("-8");
		businessPointOutput.setPointDefaultWidth("24");
		businessPointOutput.setPointDefaultHeight("24");
		
		var businessPointTrue = new BusinessPointIcon();
		businessPointTrue.setPointName("TRUE");
		businessPointTrue.setPointType("OUTPUT");
		businessPointTrue.setPointIconName("port;image=" + mxBasePath + "/images/overlays/flow chart_point_right.png;align=right;imageAlign=right;spacingRight=18");
		businessPointTrue.setPointDefaultX("0.8")
		businessPointTrue.setPointDefaultY("0.95");
		businessPointTrue.setPointDefaultOffsetX("0");
		businessPointTrue.setPointDefaultOffsetY("0");
		businessPointTrue.setPointDefaultWidth("24");
		businessPointTrue.setPointDefaultHeight("24");

		var businessPointFalse = new BusinessPointIcon();
		businessPointFalse.setPointName("FALSE");
		businessPointFalse.setPointType("OUTPUT");
		businessPointFalse.setPointIconName("port;image=" + mxBasePath + "/images/overlays/flow chart_point_wrong.png;align=right;imageAlign=right;spacingRight=18");
		businessPointFalse.setPointDefaultX("0.2");
		businessPointFalse.setPointDefaultY("0.95");
		businessPointFalse.setPointDefaultOffsetX("-6");
		businessPointFalse.setPointDefaultOffsetY("-8");
		businessPointFalse.setPointDefaultWidth("24");
		businessPointFalse.setPointDefaultHeight("24");
		
		pointArray.push(businessPointInput);
		pointArray.push(businessPointOutput);
		pointArray.push(businessPointTrue);
		pointArray.push(businessPointFalse);
		
		return pointArray;
	}
};

/*
 * set businesss icon
 */
var getBusinessIcon = {
	getBusinessIconList: function() {
		var businessIconArrayReturn = null;
		
		if (processData.getSidebarData() && processData.getSidebarData().data) {
			var businessIconArray = processData.getSidebarData().data;
			businessIconArrayReturn = new Array();
			
			// add attribute for web
			for (var i = 0; i < businessIconArray.length; i ++) {
				businessIconArray[i].businessId = businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_ID];
				businessIconArray[i].businessName = BUSINESSFLOW_ID_TYPE_TRANS[businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_ID]];
				businessIconArray[i].businessflowType = (null == businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_SUBTYPE]) ? "" : businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_SUBTYPE].toLocaleLowerCase();
				businessIconArray[i].businessClassName = BUSINESSFLOW_ID_TYPE_TRANS[businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_ID]];
				businessIconArray[i].businessflowDefaultWidth = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_DEFAULTWIDTH;
				businessIconArray[i].businessflowDefaultHeight = MX_GRAPH_STYLE.BUSINESSFLOW_STYLE_DEFAULTHEIGHT;
				businessIconArray[i].businessIconName = (null == businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_NAME]) ? null : businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_NAME].replace("_normal", "_hover");
				businessIconArray[i].businessSidebarIconName = businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_NAME];
				businessIconArray[i].businessTitleName = businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_TITLE];
				businessIconArray[i].policyName = BUSINESSFLOW_ID_TYPE_TRANS[businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_ID]];
			}
			
			// transform JSON object to local object
			for (var i = 0; i < businessIconArray.length; i ++) {
				var businessIcon = new BusinessIcon();
				
				for (var item in businessIcon) {
					
					if (DATA_ATTRIBUTE[item]) {
						if (checkEvalFunctionParam(businessIconArray[i][DATA_ATTRIBUTE[item]])) {
							eval('businessIcon.' + "set" + item.substring(0, 1).toUpperCase() + item.substring(1, item.length) + "(\"" + businessIconArray[i][DATA_ATTRIBUTE[item]] + "\")");
						}
					} else if (businessIconArray[i][item]) {
						if (checkEvalFunctionParam(businessIconArray[i][DATA_ATTRIBUTE[item]])) {
							eval('businessIcon.' + "set" + item.substring(0, 1).toUpperCase() + item.substring(1, item.length) + "(\"" + businessIconArray[i][item] + "\")");
						}
					}
				}
				
				businessIcon.outBranchQty = businessIconArray[i][DATA_ATTRIBUTE.BUSINESS_ICON_OUTBRANCHQTY];
				businessIconArrayReturn.push(businessIcon);
			}
		}
		
		return businessIconArrayReturn;
	}
};

/*
 * set toolbar data
 */
var getToolBarButton = {
	getToolBarButtonList: function() {
		var toolBarButtonArray = new Array();
		
		var toolBarBackButton = new ToolBarButtonObject();
		toolBarBackButton.setAction("");
		toolBarBackButton.setTitle("back");
		toolBarBackButton.setClassName("back");
		toolBarBackButton.setPolicyName("businessflowBack");
		toolBarBackButton.setIcon(mxBasePath + "/images/flow chart_icon_back.png");
		
		var toolBarSpacerButton = new ToolBarButtonObject();
		toolBarSpacerButton.setAction("");
		toolBarSpacerButton.setTitle("");
		toolBarSpacerButton.setClassName("img_none");
		toolBarSpacerButton.setIcon("");

		//var toolBarShowButton = new ToolBarButtonObject();
		//toolBarShowButton.setAction("show");
		//toolBarShowButton.setTitle("show");
		//toolBarShowButton.setClassName("show");
		//toolBarShowButton.setPolicyName("");
		//toolBarShowButton.setIcon(mxBasePath + "/images/xxxx.png");

		var toolBarUnableButton = new ToolBarButtonObject();
		toolBarUnableButton.setAction("");
		toolBarUnableButton.setTitle("unable");
		toolBarUnableButton.setClassName("unable");
		toolBarUnableButton.setPolicyName("businessflowUnable");
		toolBarUnableButton.setIcon(mxBasePath + "/images/flow chart_icon_approve_able.png");
		
		var toolBarSumitButton = new ToolBarButtonObject();
		toolBarSumitButton.setAction("");
		toolBarSumitButton.setTitle("sumit");
		toolBarSumitButton.setClassName("sumit");
		toolBarSumitButton.setPolicyName("businessflowSumit");
		toolBarSumitButton.setIcon(mxBasePath + "/images/flow chart_icon_sumit.png");
		
		var toolBarSaveButton = new ToolBarButtonObject();
		toolBarSaveButton.setAction("export");
		toolBarSaveButton.setTitle("export");
		toolBarSaveButton.setClassName("export");
		toolBarBackButton.setPolicyName("");
		toolBarSaveButton.setIcon(mxBasePath + "/images/flow chart_icon_save.png");
		
		var toolBarSettingButton = new ToolBarButtonObject();
		toolBarSettingButton.setAction("");
		toolBarSettingButton.setTitle("setting");
		toolBarSettingButton.setClassName("setting");
		toolBarSettingButton.setPolicyName("businessflowSetting");
		toolBarSettingButton.setIcon(mxBasePath + "/images/flow chart_icon_setting.png");
		
		var toolBarCheckButton = new ToolBarButtonObject();
		toolBarCheckButton.setAction("");
		toolBarCheckButton.setTitle("check");
		toolBarCheckButton.setClassName("check");
		toolBarCheckButton.setPolicyName("businessflowCheck");
		toolBarCheckButton.setIcon(mxBasePath + "/images/flow chart_icon_check.png");
		
		var toolBarDeleteButton = new ToolBarButtonObject();
		toolBarDeleteButton.setAction("");
		toolBarDeleteButton.setTitle("delete");
		toolBarDeleteButton.setClassName("delete");
		toolBarDeleteButton.setPolicyName("businessflowDelete");
		toolBarDeleteButton.setIcon(mxBasePath + "/images/delete2.png");
		
		var toolBarTempButton = new ToolBarButtonObject();
		toolBarTempButton.setAction("");
		toolBarTempButton.setTitle("temp");
		toolBarTempButton.setClassName("temp");
		toolBarTempButton.setPolicyName("businessflowTemp");
		toolBarTempButton.setIcon(mxBasePath + "/images/delete2.png");
		
		var toolBarTempTempButton = new ToolBarButtonObject();
		toolBarTempTempButton.setAction("");
		toolBarTempTempButton.setTitle("temptemp");
		toolBarTempTempButton.setClassName("temp");
		toolBarTempTempButton.setPolicyName("businessflowTempTemp");
		toolBarTempTempButton.setIcon(mxBasePath + "/images/delete2.png");
		
		var activeSwitchButton = new ToolBarButtonObject();
		activeSwitchButton.setAction("");
		activeSwitchButton.setClassName("activeSwitch");
		activeSwitchButton.setHtmlConstruction("<input type=\"checkbox\" checked=\"\" id=\"activeSwitchCheckbox\" style=\"display: none;\" data-switchery=\"true\">");
		
		var activeSwitchText = new ToolBarButtonObject();
		activeSwitchText.setClassName("activeSwitchText");
		activeSwitchText.setHtmlConstruction("<div id=\"activeSwitchText\">active</div>");
		activeSwitchText.setPolicyName("activeSwitch");
		
		toolBarButtonArray.push(toolBarBackButton);
		toolBarButtonArray.push(toolBarSpacerButton);
		toolBarButtonArray.push(toolBarUnableButton);
		toolBarButtonArray.push(toolBarSumitButton);
		toolBarButtonArray.push(toolBarSaveButton);
		toolBarButtonArray.push(toolBarSettingButton);
		toolBarButtonArray.push(toolBarCheckButton);
		toolBarButtonArray.push(toolBarDeleteButton);
		toolBarButtonArray.push(toolBarTempButton);
		toolBarButtonArray.push(toolBarTempTempButton);
		toolBarButtonArray.push(activeSwitchButton);
		toolBarButtonArray.push(activeSwitchText);
		
		return toolBarButtonArray;
	}
};

var getAjaxRequest = {
	getAjaxRequestList: function(campaignId) {
		var sidebarRequest = new AjaxRequestObject();
//		sidebarRequest.setUrl("sidebar.json");
		sidebarRequest.setUrl(BUSINESSFLOW_REQUEST.HTTP_URL);
		sidebarRequest.setType(BUSINESSFLOW_REQUEST.CONTENT_TYPE_JSON);
		sidebarRequest.setMethod(BUSINESSFLOW_REQUEST.REQUEST_TYPE_POST);
		sidebarRequest.setAsync(true);
		sidebarRequest.setCache(false);
		sidebarRequest.setCallbackName("processSideBarData");
		var sidebarParameterObject = new Object();
		sidebarParameterObject.servicecode = BUSINESSFLOW_REQUEST.SERVICE_QUERY_ACTIVITY;
		sidebarParameterObject.WEB_HUB_PARAMS = "{\"data\":null,\"header\":{\"token\":\"\",\"tenant\":\"\"}}";
		sidebarRequest.setData(sidebarParameterObject);

//		var businessflowRequest = new AjaxRequestObject();
//		businessflowRequest.setUrl("request110.json");
//
////		businessflowRequest.setUrl(BUSINESSFLOW_REQUEST.HTTP_URL);
//		businessflowRequest.setType(BUSINESSFLOW_REQUEST.CONTENT_TYPE_JSON);
//		businessflowRequest.setMethod(BUSINESSFLOW_REQUEST.REQUEST_TYPE_POST);
//		businessflowRequest.setAsync(true);
//		businessflowRequest.setCache(false);
//		businessflowRequest.setCallbackName("processBusinessData");
//		var businessflowParameterObject = new Object();
//		businessflowParameterObject.servicecode = BUSINESSFLOW_REQUEST.SERVICE_QUERY_CAMPAIGN;
//		businessflowParameterObject.WEB_HUB_PARAMS = "{\"data\":{\"campId\":666}}";
////		businessflowParameterObject.WEB_HUB_PARAMS = "{\"data\":{\"campId\":\"109\"}}";
//		businessflowRequest.setData(businessflowParameterObject);
		
		var ajaxRequestArray = new Array();
		ajaxRequestArray.push(sidebarRequest);
//		ajaxRequestArray.push(businessflowRequest);
		
		return ajaxRequestArray;
	}
};

/*
 * check function "eval" way param
 */
function checkEvalFunctionParam(param) {
	
	return true;
	
}

/*
 * The constitution of dock "businessflowPlugin" and service data
 */
var processData = {
	allData : null,
	
	setAllData: function(allDataParam) {
		this.allData = allDataParam;
	},
	getAllData: function() {
		return this.allData;
	},
	putAllDataIntoProcessData: function(allDataParam) {
		if (this.getAllData() && this.getAllData().data) {
			var isPushNewOne = true;
			for (var i = 0; i < this.getAllData().data.length; i ++) {
				if (processData.getAllData().data[i].marketCampaign.campId == allDataParam.marketCampaign.campId) {
					processData.getAllData().data[i] = allDataParam;
					isPushNewOne = false;
				}
			}
			
			if (isPushNewOne) {
				processData.getAllData().data.push(allDataParam);
			}
		}
	},
	
	/*
	 * sidebar data
	 */
	sidebarData: null,
	setSidebarData: function(sidebarDataParam) {
		this.sidebarData = sidebarDataParam;
	},
	getSidebarData: function() {
		return this.sidebarData;
	},
	getSidebarDataById: function(businessId) {
		if (this.getSidebarData() && this.getSidebarData().data) {
			var sidebarData = this.getSidebarData().data;
			
			for (var i = 0; i < sidebarData.length; i ++) {
				if (sidebarData[i][DATA_ATTRIBUTE.BUSINESS_ICON_ID] == businessId) {
					return sidebarData[i];
				}
			}
		}
	},
	
	/*
	 * businessflow data
	 */
	businessflowData: {
		
		marketCampaignData: null,
		activityData: null,
		businessflowViewXMLData: null,
		xmlNodeArray: null,
		
		//*****      marketCampaignData		*****//
		setMarketCampaignData: function() {
			var allData = processData.getAllData();
			if (allData && allData.data && allData.data[0]) {
				this.marketCampaignData = allData.data[0].marketCampaign;
			}
		},
		getMarketCampaignData: function() {
			return this.marketCampaignData;
		},
		getMarketCampaignId: function() {
			if (this.getMarketCampaignData()) {
				return this.getMarketCampaignData().campId;
			} else {
				return null;
			}
		},
		
		//*****      activityData		*****//
		// create a new "activityObject"
		getNewActivityObject: function() {
			return JSON.parse('{"activityCharValue":[],"activityId":"0","activityName":"","activityRelation":[],"activitySpecification":null,"activityType":"0","activityValidationMsg":null,"convertLevel":"0","createDate":"","createOpId":"0","createOrgId":"0","doneCode":"0","doneDate":"","effectiveDate":"","expireDate":"","extlCode":"0","nodeHeight":"0","nodeWidth":"0","nodeXAxis":"0","nodeYAxis":"0","opId":"0","orgId":"0","processDefinition":null,"regionId":"0","state":"2"}');
		},
		getNewActivityRelationObject: function() {
			return JSON.parse('{"convertLevel":0,"createDate":"","createOpId":0,"createOrgId":0,"doneCode":0,"doneDate":"","effectiveDate":"","endStepId":{"activityCharValue":null,"activityId":0,"activityName":"","activityRelation":[],"activitySpecification":null,"activityType":"","activityValidationMsg":[],"convertLevel":0,"createDate":"","createOpId":0,"createOrgId":0,"doneCode":0,"doneDate":"","effectiveDate":"","expireDate":"","extlCode":"","nodeHeight":0,"nodeWidth":0,"nodeXAxis":0,"nodeYAxis":0,"opId":0,"orgId":0,"processDefinition":null,"regionId":"","state":"2"},"expireDate":"","opId":0,"orgId":0,"regionId":"","startNodeBranch":"2","startStepId":null,"state":"2","stepRelId":0}');
		},
		// get "activityData"
		getActivityDataById: function(activityId) {
			var activityAllData = this.getActivityData();
			
			var returnObject = new Object();
			if (activityAllData) {
				for (var i = 0; i < activityAllData.length; i ++) {
					if (activityAllData[i]) {
						if (parseInt(activityAllData[i].extlCode) == parseInt(activityId)) {
							
							return activityAllData[i];
						}
					}
				}
			}
		},
		// save "activityData" by "extlCode"
		putActivityDataByIndex: function(index, activityData) {
			var allData = processData.getAllData();
			
			if (allData && allData.data) {
				if (allData.data[0].processDefinition.activity) {
					for (var i = 0; i < allData.data[0].processDefinition.activity.length; i ++) {
						if (allData.data[0].processDefinition.activity[i] && null != allData.data[0].processDefinition.activity[i]) {
							if (allData.data[0].processDefinition.activity[i].extlCode == index) {
								processData.getAllData().data[0].processDefinition.activity[i] = activityData;
							}
						}
					}
				}
			}
		},
		// save a new "activityData"
		putActivityDataAsNewOne: function(activityDataParam) {
			if (processData.getAllData()) {
				processData.getAllData().data[0].processDefinition.activity.push(activityDataParam);
			}
		},
		// put "activityRelationData" into "activityData"
		putActivityRelationData: function(activityId, targetActivityId, startNodeBranch) {
			var activityData = this.getActivityDataById(activityId);
			var targetActivityData = this.getActivityDataById(targetActivityId);
			
			if (activityData && targetActivityData) {
				// relationship record of "activityObject" has been exist already: 
				// get relation and compare them,save the new one change the old one
				var isRelationExist = true;
				
				if (0 > activityData.activityRelation.length) {
					var activityRelationArray = activityData.activityRelation;
					
					for (var i = 0; i < activityRelationArray.length; i ++) {
						if (activityRelationArray[i].startNodeBranch == BUSINESSFLOW_OPERATION[startNodeBranch]) {
							var activityRelationObject = activityRelationArray[i];
							activityRelationObject.endStepId = targetActivityData;
							activityRelationObject.state = BUSINESSFLOW_OPERATION.UPDATE;
							
							activityData.activityRelation[i] = activityRelationObject;
							isRelationExist = false;
						}
					}
					
				}
				
				// there is no relationship record: 
				// create a new "relationObject" and save it to "activityObject"
				if (isRelationExist) {
					var newActivityRelationObject = this.getNewActivityRelationObject();
					newActivityRelationObject.endStepId = targetActivityData;
					newActivityRelationObject.startNodeBranch = BUSINESSFLOW_OPERATION[startNodeBranch];
					activityData.activityRelation.push(newActivityRelationObject);
				}
				
				this.putActivityDataByIndex(activityId, activityData);
			}
		},
		removeActivityRelationDataFromAllData: function(activityId, startNodeBranch) {
			var activityData = this.getActivityDataById(activityId);
			var isPutNull = null;
			
			if (activityData && activityData.activityRelation) {
				if (0 < activityData.activityRelation.length) {
					
					if (!startNodeBranch) {
						for (var i = 0; i < activityData.activityRelation.length; i ++) {
							if (0 != parseInt(activityData.activityRelation[i].stepRelId)) {
								activityData.activityRelation[i].state = BUSINESSFLOW_OPERATION.DELETE;
							} else {
								isPutNull = i;
							}
						}
						
						if (null != isPutNull) {
							activityData.activityRelation[isPutNull] = null;
						}
						
						this.putActivityDataByIndex(activityId, activityData);
					} else {
						for (var i = 0; i < activityData.activityRelation.length; i ++) {
							if (parseInt(BUSINESSFLOW_OPERATION[startNodeBranch]) == parseInt(activityData.activityRelation[i].startNodeBranch)) {
								if (0 != parseInt(activityData.activityRelation[i].stepRelId)) {
									activityData.activityRelation[i].state = BUSINESSFLOW_OPERATION.DELETE;
								} else {
									isPutNull = i;
								}
							}
						}
						
						if (null != isPutNull) {
							activityData.activityRelation[isPutNull] = null;
						}
						
						this.putActivityDataByIndex(activityId, activityData);
					}
				}
			}
			
			this.setActivityDataToDeleteByEndStepId(activityData.activityId);
		},
		// delete "activityData" from "allData"
		removeActivityDataById: function(activityId) {
			var activityData = this.getActivityDataById(activityId);
			if (activityData) {
				if (0 != parseInt(activityData.activityId)) {
					activityData.state = BUSINESSFLOW_OPERATION.DELETE;
				} else {
					this.putActivityDataByIndex(activityId, null);
				}
			}
		},
		setActivityData: function() {
			if (processData.getAllData() && processData.getAllData().data) {
				this.activityData = processData.getAllData().data[0].processDefinition.activity;
			}
		},
		getActivityData: function() {
			return this.activityData;
		},
		setActivityDataToDeleteByEndStepId: function(id){
			var activityData = this.activityData;
			var activityObj;
			if(activityData && activityData.length > 0){
				for(var i in activityData){
					activityObj = activityData[i];
					if(activityObj && activityObj.activityId !=0 && activityObj.activityRelation && activityObj.activityRelation.length>0){
						for(var j in activityObj.activityRelation){
							var endStepObj = activityObj.activityRelation[j].endStepId;
							if(endStepObj && endStepObj.activityId == id){
								activityObj.activityRelation[j].state = BUSINESSFLOW_OPERATION.DELETE;
							}
						}
					}
				}
			}
		},
		
		//*****      businessflowViewXMLData		*****//
		getNewXMLObject: function() {
			return JSON.parse('{"convertLevel":0,"createDate":"","createOpId":0,"createOrgId":0,"doneCode":0,"doneDate":"","expireDate":"","opId":0,"orgId":0,"processDefContent":"","processDefExtId":0,"processDefinition":null,"regionId":"","sort":0,"state":"2","validDate":""}');
		},
		setBusinessflowXMLData: function() {
			if (processData.getAllData() && processData.getAllData().data) {
				if (processData.getAllData().data[0].processDefinition.processDefinitionExtension[0]) {
					var businessflowViewXMLData = processData.getAllData().data[0].processDefinition.processDefinitionExtension[0].processDefContent;
					businessflowViewXMLData = businessflowViewXMLData.toString().replace(/'/g, "\"").replace(/\*\*\*/g, "&");
					businessflowViewXMLData = businessflowViewXMLData.toString().replace(/'/g, "\"").replace(/\$\$/g, "=");
					this.businessflowViewXMLData = businessflowViewXMLData;
				}
			}
			
		},
		putBusinessflowXMLDataToProcessData: function(xmlData) {
			if (processData.getAllData() && processData.getAllData().data) {
				var newXMLData = new Object(); 
				newXMLData = this.getNewXMLObject();
				newXMLData.processDefContent = xmlData;
				
				processData.getAllData().data[0].processDefinition.processDefinitionExtension[0] = newXMLData;
			}
		},
		setBusinessflowViewXMLData: function(businessflowViewXMLDataParam) {
			this.businessflowViewXMLData = businessflowViewXMLDataParam;
		},
		getBusinessflowViewXMLData: function() {
			return this.businessflowViewXMLData;
		},
		
		setXmlNodeArray: function(xmlNodeArrayParam) {
			this.xmlNodeArray = xmlNodeArrayParam;
		},
		getXmlNodeArray: function() {
			return this.xmlNodeArray;
		}
	},
	
	/*
	 * util function
	 */
	getAttributeValue: function(businessId, attributeName) {
		var busunessIcons = this.getSidebarData();
		var businessIconArray = busunessIcons.data;
		for (var i = 0; i < businessIconArray.length; i ++) {
			if (businessId == businessIconArray[i].activitySpecId) {
				return businessIconArray[i][attributeName];
			}
		}
		
		return null;
	}

};

function processSideBarData(data) {
	if (!processData.getSidebarData()) {
		processData.setSidebarData(data);
	}
	configureSideBarIcon();
}

function processBusinessData(data) {
	// set all data
	processData.setAllData(data);
	// set data of key="marketCampaign"
	processData.businessflowData.setMarketCampaignData();
	// set data of key="processDefinition.activity"
	processData.businessflowData.setActivityData();
	// set data of key="processDefinition.processDefinitionExtension[0].processDefContent"
	processData.businessflowData.setBusinessflowXMLData();
	//console.log(processData.businessflowData.getBusinessflowViewXMLData())
	// create nodes on graph
	htmlElementConstruction.createNodes();
}

function ajaxRequest(paramObject) {
	if (paramObject && paramObject.url) {
		$.ajax({
			type: "" != paramObject.getMethod() ? paramObject.getMethod() : "GET",
			dataType: "" != paramObject.getType() ? paramObject.getType() : "json",
			url: "" != paramObject.getUrl() ? paramObject.getUrl() : "",
			async: null != paramObject.getAsync() ? paramObject.getAsync() : true,
			cache: null != paramObject.getCache() ? paramObject.getCache() : false,
			data: paramObject.getData()
			
		}).done(function(data) {
			if (data) {
//				htmlElementConstruction.releaseSplashDiv();
				if (window[paramObject.getCallbackName()]) {
					window["eval"].call(window, paramObject.getCallbackName() + "(" + parameterAnalysis(data) + ")");
				}
			} else {
				// process none return back
				
			}
			
		}).fail(function(data) {
			console.log(data);
		});
	}
}

/*
 * analyze parameter from URL into object
 */
function processRequestParameter(subPageWindow) {
	var url = subPageWindow.location.search;
	var theRequest = new Object();
	
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	
	return theRequest;
}