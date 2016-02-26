define(function(require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	require('aries-core-ajax');
	require('aries-core-public');
	require('aries-core-data');
	require('aries-core-page');
});
define('aries-core-public',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
//;(function($, undefined) {

	$.aries.common = {
		includeHtml : function(id, url, callback, error, noTenant) {
			if(!id)
				return;
			var $obj;
			if(typeof id == "string"){
				$obj = $("#" + id);
			}else if(typeof id == "object"){
				$obj = id;
			}else{
				return;
			}
			if(!$obj.length)
				 return;
			function _callback(data, textStatus, jqXHR) {
				if (id && id != null && $obj.length > 0) {
					$obj.html(data);
					$.aries.common.globalInit(id);
					var code = data.code;
					if (code && code === "-1") {
						if (s.errorback && $.isFunction(s.errorback)) {
							s.errorback(code, data.info, data.error);
						} else {
							$.message.alert("",data.error);
						}

					} else {
						if (s.callback && $.isFunction(s.callback)) {
							s.callback(data, textStatus, jqXHR);
						}
					}
				}
			}

			function _error(xhr, status, ex) {
				var code = xhr ? xhr.status : status;
				var info = ex ? ex.message : "HttpStatus:" + code
						+ "\nXMLHttp Request Error";
				if (s.errorback && $.isFunction(s.errorback)) {
					s.errorback(code, info, info);
				} else {
					$.message.alert("",info);
				}
			}

			if (url) {
				if(url.indexOf('http')!==0 && $.aries.config && $.aries.config.common.PAGE_REDIRECT_PREFIX){
					var tenant = $.getTenant();
					if($.aries.config.common.IS_USE_TENANT_PREFIX && tenant && !noTenant){
						if (url.indexOf("/") == -1) {
							url = '/' + tenant + '/' + url;
						}else{
							url = '/' + tenant + url;
						}
					}
					var pagePrefix = $.aries.config.common.PAGE_REDIRECT_PREFIX;
					if (pagePrefix.substring(pagePrefix.length-1,pagePrefix.length) == '/') {
						if(url.indexOf("/") == 0){
							url = url.substring(1,url.length);
						}
					}else{
						if (url.indexOf("/") == -1) {
							url = '/' + url;
						}
					}
					url=pagePrefix+url;
				}
				var s = {
					cache : true,
					success : _callback,
					error : _error,
					callback : callback,
					errorback : error
				};
				$.ajax(url, s);
			}
		},
		/**
		 * globalInit 执行页面全局初始化
		 * The last modification time : 2015-2-10 18:18
		 * log : 全局初始化方法不做ui-tpl组件内部初始化 2015-2-3 12:35
		 * 		 修复代码bug，判断each对象的长度 2015-2-9 15:26
		 *		 修复bug  2015-2-10 18:18
		 *		 对组件做初始化后，将 aeInit 属性值置为 false； 2015-3-24 18:55
		 *		 支持入参为 id 或对象； 2015-4-4 11:40
		 *		 修复代码扫描问题，避免重新声明已有变量； 2015-4-22 16:10
		 *		 当传flag=true时，无论父级是否存在aeTpl，都会做所传对象的内部初始化; 2015-11-23 20:53
		 */
		globalInit : function(id,flag) {
			var initFuncArray = [];
			var obj = $(document.body);
			if(id && typeof id == "string"){
			   obj = $("#"+id);
			}else if(id && typeof id == "object"){
				obj = id;
			}
			$.aries.common.transferI18nRes(obj);
			var aeInit = obj.find('[aeInit="true"]');
			if(aeInit && aeInit.length){
				$.each(aeInit,function(index,item){
					if((flag != true && flag != "true") && $(item).parents().hasClass("ae_tpl")){
						return;
					}
					var initFunction = $(item).attr("initFunction");
					var aeType = $(item).attr("aeType");
					if(initFunction && initFunction.length){
						var i = initFunction.indexOf("(");
						funcName = i>0 ? initFunction.substring(0, i) : initFunction;
						if(funcName == "$" || funcName.indexOf(".")>0){
							$(item).attr('aeInit','false');
							initFuncArray.push(initFunction);
						}else{
							var func = "return window."+funcName+"?"+funcName+".call(window):false";
							func = new Function(func)();
							if(func==false){
								$(item).attr('aeInit','false');
								initFuncArray.push(initFunction);
							}
						}
					}else if(aeType && aeType.length){
						$(item).attr('aeInit','false');
						$(item)[aeType]();
					}
				});
				if(initFuncArray.length){
					eval(initFuncArray.join(';'));
				}
			}
			if($.aries.config.common.IS_DEVELOPE_MODE){
				//$.aries.common._globalErrorDetection();
			}
		},
		/**
		 * loadTemp是对handlebars 的封装,请求模版加载数据
		 *
		 * @method loadTemp
		 * @param {Object}
		 *            obj Dom对象
		 * @param {Object}
		 *            temp 模版
		 * @param {Object}
		 *            data 数据
		 */
		loadTpl : function(obj, temp, data) {
			if(obj && temp && data){
				var template = Handlebars.compile(temp.html());
				$(obj).html(template(data));
			}
		},
		//根据datafield获取data中的子集合
		getDataByDatafield : function(data,datafield){
			var obj = data;
			if(obj && datafield && $.isString(datafield)){
				var idAry = datafield.split('.');
				if(idAry&&idAry.length){
					var len = idAry.length;
					var reg = /\[.*\]/;
					var lastIdx = 0;
					var attr;
					var prexAry;
					for(var i=0;i<len;i++){
						attr = idAry[i]+'';
						lastIdx=attr.search(reg);
						if(lastIdx>-1){
							prexAry = attr.substring(0,lastIdx);
							obj = obj[prexAry];
							if(typeof(obj)=="undefined" || obj == null ){
								obj = null;
								break;
							}
							if((attr.length-1) > lastIdx+1){
								prexAry = attr.substring(lastIdx+1,(attr.length-1));
								obj = obj[prexAry];
							}else{
								obj = null;
							}

						}else{
							obj = obj[attr];
						}
						if(typeof(obj)=="undefined" || obj == null ){
							obj = null;
							break;
						}
					}
				}
			}
			return obj;
		},
		buildUiidData : function(obj,datafield,value){
			if(obj && datafield && $.isString(datafield)){
				var idAry = datafield.split('.');
				if(idAry&&idAry.length){
					var attrstr = '';
					var attrAry = [];
					var reg = /\[.*\]/;
					var lastIdx = 0;
					var prexAry;
					var attr;
					var len = idAry.length;
					var tempAttrStr;
					for(var i=0;i<len;i++){
						attr = idAry[i]+'';
						lastIdx=attr.search(reg);
						if(lastIdx>-1){
							prexAry = attr.substring(0,lastIdx);
							tempAttrStr=attrstr+'["'+prexAry+'"]';
							attrAry.push('o'+tempAttrStr+' || (o'+tempAttrStr+'=[]);');
							prexAry = attr.substring(lastIdx);
							tempAttrStr+=prexAry;
							attrstr=tempAttrStr;
							if(i != (len-1)){
								attrAry.push('o'+tempAttrStr+' || (o'+tempAttrStr+'={});');
							}
						}else{
							attrstr+='["'+attr+'"]';
							if(i != (len-1)){
								attrAry.push('o'+attrstr+' || (o'+attrstr+'={});');
							}
						}
					}
					attrAry.push('o'+attrstr+'=v;');
					attrAry.push('return o;');
					obj = new Function("o","v",attrAry.join(''))(obj,value);
				}
			}
			return obj;
		},
		getAjaxUrl : function(svcode){
			if(svcode){
				return $.aries.config.core.AJAX_URL_SERVICE_CODE_PREFIX + svcode;
			}
			return svcode;
		},
		disabledButton:function(btnId, disabled){
			var btnObj = $("#"+btnId), btnClass;
			if(disabled==true){
				btnObj.attr("disabled","disabled");
				btnClass = btnObj.attr("class");
				if(!btnClass || (btnClass&&btnClass.indexOf("e_dis")==-1)){
					btnObj.attr("discss",btnObj.attr("class"));
					btnObj.addClass("e_dis");
				}
			}else{
				btnClass = btnObj.attr("class");
				btnObj.removeAttr("disabled");
				if(btnClass&&btnClass.indexOf("e_dis")!=-1){
					btnObj.attr("class",btnObj.attr("discss"));
					btnObj.removeAttr("discss");
				}
			}
		},
		reloadUiidData:function(data,id){
			if(data){
				var obj;
				id ? obj = $("#"+id).find("[uiid]") : obj = $(document).find("[uiid]");
				obj.each(function(index,item){
					var type = $(item).attr("aeType");
					switch(type) {
					   case "aeForm":
						   $(item).aeForm('reload',data);
						   break;
					   case "aeGrid":
						   $(item).aeGrid('reload',data);
						   break;
					   case "aeTpl":
						   $(item).aeTpl('reload',data);
						   break;
					   default :
					       break;
				    }
				});
			}
	    },
	    getUiidData:function(id){
	    	 if(id){
	 			 var $obj;
	 			 if(typeof id == "string"){
	 				 $obj = $("#" + id);
	 			 }else if(typeof id == "object"){
	 				 $obj = id;
	 			 }else{
	 				 return;
	 			 }
	 			 if(!$obj.length)
	 				 return;
	    		 var partData = {},returnData = {},dataArray=[],tempObj={};
	    		 var obj = $obj.find("[uiid]");
				 var bodyDataField = $obj.attr("dataField");
				 obj.each(function(index,item){
					 var type = $(item).attr("aeType");
					switch(type) {
					   case "aeForm":
						   partData = $(item).aeForm('getData');
						   dataArray.push(partData);
						   break;
					   case "aeGrid":
						   partData = $(item).aeGrid('getData');
						   dataArray.push(partData);
						   break;
					   case "aeTpl":
						   partData = $(item).aeTpl('getData');
						   dataArray.push(partData);
						   break;
					   default :
					       break;
				    }
				 });
				 if(dataArray && dataArray.length){
					 for(var i=0;i<dataArray.length;i++){
						 for(key in dataArray[i]){
							 if(key){
								 tempObj[key]  = dataArray[i][key];
								 break;
							 }
						 }
					 }
				 }
				 if(bodyDataField){
					 returnData = $.aries.common.buildUiidData(returnData,bodyDataField,tempObj);
				 }
				 return returnData;
	    	}
	    },
        i18n : function(code){
        	var value = "";
        	if(window.ariesI18nRes && code){
        		value = window.ariesI18nRes[code];
        	}
        	return value;
        },
        evalI18nString : function(input){
        	var rtn = input;
        	if(input && $.isString(input) && input.indexOf("$.i18n") == 0){
        		rtn = eval(input);
        	}
        	return rtn;
        },
	    transferI18nRes : function (selector){
	    	var i18nSpan;
	    	if (selector && selector.length){
	    		i18nSpan = $('span.i18n',selector);
	    	}else{
	    		i18nSpan = $('span.i18n');
	    	}
	    	var text;
	    	i18nSpan.each(function(idx,item){
	    		item = $(item);
	    		text = item.text();
	    		if(text){
	    			item.text($.aries.common.i18n(text+''));
	    		}
	    	});
	    },
	    setTenant : function (tenant,isTenantPrefix){
	    	if(typeof(tenant) == "undefined" || tenant == null){
	    		var pathName=window.document.location.pathname;
		    	tenant=pathName.substring(1,pathName.substr(1).indexOf('/')+1);
	    	}
	    	$.cookie($.aries.config.sec.SEC_AUTH_TENANT_KEY,tenant);
	    	if(isTenantPrefix){
	    		$.aries.config.common.IS_USE_TENANT_PREFIX = true;
	    	}
	    },
	    getTenant : function (){
	    	return $.cookie($.aries.config.sec.SEC_AUTH_TENANT_KEY);
	    },
	    divide:function(value,divisor,digits){
	    	var tranValue='';
	    	if(value){
	    		divisor ? divisor : '100';
	    		digits ? digits : '2';
	    		tranValue = (value/divisor).toFixed(digits);
	    	}
	    	return tranValue;
	    },
	    /**
		 * 将各种类型转换成string
		 * @param obj {Mixed}
		 */
	    toString : function (obj){
	    	var rtn = obj;
	    	if($.isObject(obj) || $.isArray(obj) || ($.isNumeric(obj)&&!$.isString(obj))){
	    		rtn = $.toJSON(obj);
	    	}
	    	return rtn;
	    },
	    /**
		 * 以安全的方式将string转成object
		 * @param str {String}
		 */
	    toObject : function (str){
	    	return $.secureEvalJSON(str);
	    },
	    /**
		 * html中特殊字符转换
		 * @param str {Object}
		 */
	    escapeHTML : function (str) {
	    	var rtn = str;
	    	if(str){
	    		rtn = $.isString(str) ? str : $.aries.common.toString(str);
	    		rtn = rtn.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
	    	}
	    	return rtn;
	    },
	    /**
		 * 针对需保存的数据设置状态，isNew为true时表示新增状态，否则是修改状态
		 * @param input {Mixed}
		 * @param isNew {boolean}
		 */
	    setSaveDataState:function(input,isNew){
	    	var rtn;
	    	if(input){
	    		if($.isString(input)){
	    			try{
	    				input = $.parseJSON(input);
	    				if(isNew){
	    					input.actionType="1";
	    				}else{
	    					input.actionType="2";
	    				}
	    			}catch(e){}
	    			if($.isObject(input)){
	    				rtn = JSON.stringify(input);
	    			}else{
	    				rtn = input;
	    			}
	    		}else if($.isObject(input)){
	    			if(isNew){
    					input.actionType="1";
    				}else{
    					input.actionType="2";
    				}
	    			rtn = JSON.stringify(input);
	    		}else if($.isArray(input)){
	    			for(var i=0;i<input.length;i++){
	    				if(isNew){
	    					input[i].actionType="1";
	    				}else{
	    					input[i].actionType="2";
	    				}
		    		}
	    			rtn = input;
	    		}
	    	}else{
	    		rtn = input;
	    	}
	    	return rtn;
	    },
	    /**
		 * 任意数组数据根据条件转化成简单树数据模型
		 * @param data {Array || String} 数组或数组型的String
		 * @param col {Object}
		 */
        buildTreeData : function(data,col){
        	if (!data || data.length == 0 || !col || !$.isObject(col))
        		return [];
        	if($.isString(data)){
        		data = $.aries.common.toObject(data);
        		if(!$.isArray(data)){
        			return [];
        		}
        	}
        	var object = $.extend(true, [], data);
        	var r = [],
        	    idField = col.idField,
        	    pIdField = col.pIdField,
        	    labelField = col.labelField,
        	    valueField = col.valueField,
        	    rootId = col.rootId,
        	    sortField = col.sortField,
        	    tmpMap = [],
        	    transMap = [],
        	    i,j,item;
    	    if(!sortField){
    	    	sortField = idField;
    	    }
    		for (i=0; i<object.length; i++) {
    			tmpMap[i] = object[i];
    			item = tmpMap[i];
        		/*if(data[i][idField]==rootId){
        			item["aeNodeLevel"] = 1;
        		}*/
        		item["aeNodeId"] = object[i][idField];
        		item["aeNodePId"] = object[i][pIdField];
        		item["aeNodeLabel"] = object[i][labelField];
        		item["aeNodeValue"] = object[i][valueField];
        		item["aeNodeLevel"] = 1;
        		transMap[item["aeNodeId"]] = item;
    		}
    		for (i=0; i<tmpMap.length; i++) {
    			item = tmpMap[i];
    			if (transMap[item["aeNodePId"]]) {

    				item["aeNodeLevel"]=transMap[item["aeNodePId"]]["aeNodeLevel"]+1;
    				if(item["aeChildren"] && item["aeChildren"].length){
    					item = $.aries.common._iterateTreeNodeLevel(item);
    				}
    				var pid = item["aeNodePId"];
    				if (!transMap[pid]["aeChildren"])
    					transMap[pid]["aeChildren"] = [];
    				transMap[pid]["aeChildren"].push(item);
    				transMap[pid]["aeChildren"].sort(function(a,b){return a[sortField]>b[sortField]?1:-1});
    			} else {
    				r.push(item);
    				r.sort(function(a,b){return a[sortField]>b[sortField]?1:-1});
    			}
    		}
    		return r;
        },
        /**
		 * 阻止事件冒泡
		 * @param arguments 方法默认参数
		 */
        stopPropagation : function(arguments){
        	var event = window.event || arguments.callee.caller.arguments[0];
    		event.stopPropagation();
        },
        /**
		 * 根据字符串条件过滤数组型对象中String数据
		 * @param searchText 过滤字符串,{String},不区分大小写,不可为空
		 * @param data 源数据,{Array},不可为空
		 * @param filterColumns 指定属性,{Array},如果为空则全属性过滤
		 * @param isMatched 是否全匹配
		 * @return {Array}
		 */
        filterStringInArray : function(searchText, data, filterColumns, isMatched) {
            if (!data || !$.isArray(data) || !searchText || !$.isString(searchText)){
            	return data;
            }

            var s = searchText && searchText.toLowerCase();

            data = s ? $.grep(data, function (item, i) {
            	if(filterColumns && $.isArray(filterColumns) && filterColumns.length){
            		for (var i = 0;i < filterColumns.length;  i++) {
            			var key = filterColumns[i];
            			if(item.hasOwnProperty(key)){
            				var value = item[key];
            				if (typeof value === 'string' || typeof value === 'number') {
            					if(isMatched){
            						if((value + '') == searchText){
            							return true;
            						}
            					}else{
            						if((value + '').toLowerCase().indexOf(s) !== -1){
            							return true;
            						}
            					}
                            }
                        }
            		}
            	}else {
            		for (var key in item) {
                        var value = item[key];
                        if (typeof value === 'string' || typeof value === 'number'){
                            if(isMatched){
        						if((value + '') == searchText){
        							return true;
        						}
        					}else{
        						if((value + '').toLowerCase().indexOf(s) !== -1){
        							return true;
        						}
        					}
                        }
                    }
            	}
                return false;
            }) : data;
            return data;
        },
        /**
		 * @name getIrguide 获取当前正在执行的不可逆向导对象
		 * @返回
		 * The last modification time : 2015-6-21 18:38
		 * log :
		 *
		 */
        getIrguide : function(){
        	var id = $.getPublicData("irGuide");
        	return id ? $("#"+id) : undefined;
        },
        /**
		 * @name getGuide 获取当前正在执行的可逆向导对象
		 * @返回
		 * The last modification time : 2015-6-21 18:38
		 * log :
		 *
		 */
        getGuide : function(){
        	var id = $.getPublicData("aeGuide");
        	return id ? $("#"+id) : undefined;
        },
        //根据dom或domid获取内部含datafield的表单元素的数据集合
        getDataFromUnits : function(id){
			var $ele;
 			if(typeof id == "string"){
 				$ele = $("#" + id);
 			}else if(typeof id == "object"){
 				$ele = id;
 			}else{
 				return;
 			}
 			if(!$ele.length)
 				return;
 			var result = {};
    		var keyValueObj = $ele.find('[datafield]');
    		if(keyValueObj && keyValueObj.length){
    			$.each(keyValueObj,function(index,item){
    				var dataField = $(item).attr("datafield"),
    					value = "";
    				if(typeof($(item).attr("value")) != "undefined"){
    					value = $(item).attr("value");

    				}else if($(item).text()){
    					value = $(item).text();
    				}
    				result = $.aries.common.buildUiidData(result,dataField,value);
    			});
    		}
			return result;
    	},
        /*
         * 下载文件
         */
        downloadFile:function(s){
        	if(!s)return;
        	var form = this._createDownloadForm(s);
        	$(form).submit();
        	setTimeout(function() {
              try {
                  $(form).remove();
              } catch (e) {

              }
            }, 100);
        },
        /*
         * 以下是内部公共方法，方法名以_开头
         */
        _createDownloadForm : function(s) {
        	if(!s.server)
        		return;
            var formId = 'aeDownloadFileForm' + new Date().getTime();
            var form = $('<form  action="'+s.server+'" method="POST" name="' + formId + '" id="' + formId+ '"></form>');
            var buf =[],obj = [],params='';
            if (s.formData) {
            	 $.each(s.formData, function( k, v ) {
                 	if($.isObject(v)){
                 		obj.push("\"" + k + "\":" + $.toString(v) + "");
                 	}else{
                     	obj.push("\"" + k + "\":\"" + v + "\"");
                 	}
                 });
            }
			buf.push("{\"data\":{");
			buf.push(obj.join(","));
			buf.push("},");
			var token = $.cookie($.aries.config.sec.SEC_AUTH_TOKEN_KEY);
			token = (token === undefined ? '' : token);
			var tenant = $.cookie($.aries.config.sec.SEC_AUTH_TENANT_KEY);
			tenant = (tenant === undefined ? '' : tenant);
			buf.push("\"header\":{\"file\":\"download\",\"token\":\"");
			buf.push(token);
			buf.push("\",\"tenant\":\"");
			buf.push(tenant);
			buf.push("\"");
			buf.push("}}");
			$.aries.config.common.IS_AJAX_URL_ENCODE == false ? params = buf.join("") : params = encodeURIComponent(buf.join(""));
			$('<input type="hidden" name="WEB_HUB_PARAMS" value="' + params + '" />').appendTo(form);
            $(form).appendTo('body');
            return form;
        },
        _iterateTreeNodeLevel : function(node){
        	if(!node || !node.aeChildren || node.aeChildren.length == 0)
        		return node;
        	var item;
        	for (var i = 0; i < node.aeChildren.length; i++){
        		item = node.aeChildren[i];
        		item.aeNodeLevel = node.aeNodeLevel + 1;
        		if(item.aeChildren && item.aeChildren.length){
        			item = $.aries.common._iterateTreeNodeLevel(item);
        		}
			}
        	return node;
        },
        _replaceEscape : function(string){
			var escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;
			var meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\"'};
		    if(string.match(escapeable)){
		        return string.replace(escapeable,function(a){
		            var c=meta[a];
		            if(typeof c==='string') {
		                return c;
		            }
		            c=a.charCodeAt();
		            return '\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);
		        });
		    }
		    return string;
		},
		_encode : function(str){
			var rtn = '';
			if(str && $.isString(str)){
				if(str.startWith('[') && str.endWith(']')){
					rtn = '[';
					if(str.length > 2){
						rtn += encodeURIComponent(str.substring(1,str.length-1));
					}
					rtn += ']';
				}else{
					rtn = encodeURIComponent(str);
				}
			}else{
				rtn = str;
			}
			return rtn;
		},
		_globalErrorDetection : function(){
			//全局判断ID是否重复
			var idDoms = $('[id]');
			if(idDoms.length){
				var ids = [];
				for(var i = 0;i < idDoms.length;i++){
					ids.push(idDoms[i].id);
				}
				var idsort = ids.sort();
				for(var j = 0;j < ids.length;j++){
					if (idsort[j]==idsort[j+1]){
						$.message.error("代码级异常","存在id重复的Dom对象，请检查！id为： "+idsort[j]);
						return;
					}
				}
			}
		},
		//是否输出日志，输出日志的内容和方式
		aelog : function (content,level,useConsole){
			var type = $.aries.config ? $.aries.config.common.GLOBAL_LOG_SHOW_TYPE : undefined;
			if(!type){
				type = 'console';
			}
			if(type === 'console'){
				if(level == 'error'){
					console.error(content);
				}else{
					console.log(content);
				}
			}else if(type === 'msg'){
				if(level == 'error'){
					if(useConsole){
						console.error(content);
					}else{
						$.message.error("",content);
					}
				}else{
					if(useConsole){
						console.log(content);
					}else{
						$.message.alert("",content);
					}
				}
			}
		}
	};

	$.extend($.aries.common);

	String.prototype.append = function (str1) {
		if(arguments.length == 0)
			return this;
		return this + $.toString(str1);
	};

	String.prototype.appendParam = function (str1,str2) {
		if(arguments.length == 2){
			var rtn = this;
			if(this != ""){
				rtn += "&";
			}
			if($.aries.config.common.IS_AJAX_URL_ENCODE){
				rtn += $._encode($._replaceEscape($.toString(str1))) + "=" + $._encode($._replaceEscape($.toString(str2)));
			}else{
				rtn += $._replaceEscape($.toString(str1)) + "=" + $._replaceEscape($.toString(str2));
			}
			return rtn;
		}
		return this;
	};
	//修复IE8下Array无indexOf问题
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function(elt /*, from*/){
	    var len = this.length >>> 0;
	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	        from += len;
	    for (; from < len; from++){
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	    };
	}

//})(jQuery);

});

define('aries-core-ajax',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
//;(function($, undefined){
	$.aries.ajax = {
		 doAjax:function(s){
			 var ss=$.extend(true,{},s);
			 $.ajax(ss);
		 },
		 ajaxSettings:{
			type: "GET",
			async: true,
			cache: false,
			dataType: "json", 
			loading: true,
			timeout: 3*60*1000,
			encoding: "UTF-8"
		 },
	
		 request:function(url,params,callback,error,settings,header){
				if(params && $.isFunction(params)){
					error=callback;
					callback=params;
					params=null;
				}
				if(url && url.indexOf('http')!==0){
					if($.aries.config && url.indexOf('file://')!=0){
						if(url.endWith('.json')){
							var ajaxJsonPrefix = $.aries.config.common.AJAX_URL_JSON_PREFIX;
							if(ajaxJsonPrefix){
								if (ajaxJsonPrefix.substring(ajaxJsonPrefix.length-1,ajaxJsonPrefix.length) == '/') {
									if(url.indexOf("/") == 0){
										url = url.substring(1,url.length);
									}
								}else{
									if (url.indexOf("/") == -1) {
										url = '/' + url;
									}
								}
								url=ajaxJsonPrefix+url;
							}
						} else {
							var ajaxSvPrefix = $.aries.config.common.AJAX_URL_SV_PREFIX;
							if(ajaxSvPrefix){
								if (ajaxSvPrefix.substring(ajaxSvPrefix.length-1,ajaxSvPrefix.length) == '/') {
									if(url.indexOf("/") == 0){
										url = url.substring(1,url.length);
									}
								}else{
									if (url.indexOf("/") == -1) {
										url = '/' + url;
									}
								}
								url=ajaxSvPrefix+url;
							}
						}
					}				
				}
				
				var buf =[],obj = [];
				if(params){
					var ov=params.split("&");
					if($.isArray(ov)){
						if(ov.length){
							for(var i = 0, len = ov.length; i < len; i++) {
								if(ov[i]){
									var k = ov[i].split("=");
									if(k[1] != undefined){
										if(k[1].indexOf("{")!=-1 || k[1].indexOf("[")!=-1){
											obj.push("\"" + $.trim(k[0]) + "\":" + k[1] + "");
										}else{
											obj.push("\"" + $.trim(k[0]) + "\":\"" + k[1] + "\"");
										}
									}
								}
							}
						}
					}
				}
				buf.push("{\"data\":{");
				buf.push(obj.join(","));
				buf.push("},");
				var token = $.cookie($.aries.config.sec.SEC_AUTH_TOKEN_KEY);
				token = (token === undefined ? '' : token);
				var tenant = $.cookie($.aries.config.sec.SEC_AUTH_TENANT_KEY);
				tenant = (tenant === undefined ? '' : tenant);
				buf.push("\"header\":{\"token\":\"");
				buf.push(token);
				buf.push("\",\"tenant\":\"");
				buf.push(tenant);
				buf.push("\"");
				obj = [];
				if(header){
					ov=header.split("&");
					if($.isArray(ov)){
						if(ov.length){
							for(var i = 0, len = ov.length; i < len; i++) {
								if(ov[i]){
									var k = ov[i].split("=");
									if(k[1] != undefined){
										if(k[1].indexOf("{")!=-1){
											obj.push("\"" + $.trim(k[0]) + "\":" + k[1] + "");
										}else{
											obj.push("\"" + $.trim(k[0]) + "\":\"" + k[1] + "\"");
										}
									}
								}
							}
						}
					}
				}
				if(obj.length){
					buf.push(",");
					buf.push(obj.join(","));
				}
				buf.push("}}");
				params = buf.join("");
				
				/*buf.push("\"data\":" + "{" + obj.join(",") + "}" + "");
				buf.push("\"code\":\"" + (code === undefined ? '' : code) + "\"");
				buf.push("\"value\":\""+ (value === undefined ? '' : value) + "\"");
				var token= $.cookie($.aries.config.sec.SEC_AUTH_TOKEN_KEY);
				buf.push("\"token\":\""+ (token === undefined ? '' : token) + "\"");
				params = "{" + buf.join(",") + "}";*/
				if($.aries.config.common.IS_AJAX_URL_ENCODE == false){
					params = "WEB_HUB_PARAMS="+params;
				}else{
					params = "WEB_HUB_PARAMS="+encodeURIComponent(params);
				}
				jQuery.support.cors = true;
				var s=$.extend({
					url:url,
					data:params,
					type:"GET",
					success: _callback,
					error: _error,
					callback: callback,
					errorback: error
				},$.aries.ajax.ajaxSettings,settings);
				
				$.aries.ajax.doAjax(s);
				
				function _callback(data, status, xhr){
					$.aries.ajax.callback_handler(data, status, xhr, s);
				}
				
				function _error(xhr, status, ex){
					$.aries.ajax.error_handler(xhr, status, ex, s);
				}
		},
		//ajax请求统一处理回调	
		callback_handler:function(data, status, xhr, s){
			if(s.callback && $.isFunction(s.callback)){
				if(data){
					if(typeof data.hub_code != 'undefined'){
						if(data.hub_code === '0' || data.hub_code == 0){
                            var retCode = data.code;
                            //session expire logical
							if($.aries.config.sec.IS_AJAX_SESSION_EXPIRE_MODE && retCode === $.aries.config.sec.SEC_AUTH_TYPE_SESSION_EXPIRE){
                                window.location.href = $.aries.config.sec.SESSION_EXPIRE_REDIRECT_URL;
                            }else{
                                if(s.errorback && $.isFunction(s.errorback)){
                                    s.errorback(data.hub_code+"",data);
                                }
                            }
						}
						if(data.hub_code === '1' || data.hub_code == 1){
							s.callback(data.data,status,xhr);
						}

					}else{
						s.callback(data,status,xhr);
					}
				}else{
					s.callback(data,status,xhr);
				}
			}
		},
		error_handler:function(xhr, status, ex, s){
        	var errorCode = xhr?xhr.status:status;
			var errorInfo = ex?(ex.message?ex.message:ex):"HttpStatus:" + errorCode + "\nXMLHttp Request Error";
			if(s.errorback && $.isFunction(s.errorback)){
				s.errorback(errorCode,errorInfo);
			}
		},
		get:function(url,params,callback,error,settings,code,value){
			$.aries.ajax.request(url,params,callback,error,settings,code,value);
		},
		post:function(url,params,callback,error,settings,code,value){
			$.aries.ajax.request(url,params,callback,error,$.extend({type:"POST",encoding:"UTF-8"},settings),code,value);
		}
	};
	$.ajaxGet=$.aries.ajax.get;
	$.ajaxPost=$.aries.ajax.post;
//})(jQuery);
});
define('aries-core-data',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
//;(function($, undefined){
	/**
	* 数据总线相关
	**/	 
	var escapeRe=function (d){
		return d.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1");
	};

	$.Collection = function(allowFunctions, keyFn){
	    this.items = [];
	    this.map = {};
	    this.keys = [];
	    this.length = 0; 
	    this.allowFunctions = allowFunctions === true;
	    if(keyFn){
	        this.getKey = keyFn;
	    }
	};
	
	$.Collection.prototype={
	    allowFunctions : false,
	    add : function(key, o){
	        if(arguments.length == 1){
	            o = arguments[0];
	            key = this.getKey(o);
	        }
	        if(typeof key != 'undefined' && key !== null){
	            var old = this.map[key];
	            if(typeof old != 'undefined'){
	                return this.replace(key, o);
	            }
	            this.map[key] = o;
	        }
	        this.length++;
	        this.items.push(o);
	        this.keys.push(key);
	        return o;
	    },
	    getKey : function(o){
	         return o.id;
	    },
	    replace : function(key, o){
	        if(arguments.length == 1){
	            o = arguments[0];
	            key = this.getKey(o);
	        }
	        var old = this.map[key];
	        if(typeof key == 'undefined' || key === null || typeof old == 'undefined'){
	             return this.add(key, o);
	        }
	        var index = this.indexOfKey(key);
	        this.items[index] = o;
	        this.map[key] = o;
	        return o;
	    },
	    addAll : function(objs){
	        if(arguments.length > 1 || $.isArray(objs)){
	            var args = arguments.length > 1 ? arguments : objs;
	            for(var i = 0, len = args.length; i < len; i++){
	                this.add(args[i]);
	            }
	        }else{
	            for(var key in objs){
	                if(this.allowFunctions || typeof objs[key] != 'function'){
	                    this.add(key, objs[key]);
	                }
	            }
	        }
	    },
	    each : function(fn, scope){
	        var items = [].concat(this.items); // each safe for removal
	        for(var i = 0, len = items.length; i < len; i++){
	            if(fn.call(scope || items[i], items[i], i, len) === false){
	                break;
	            }
	        }
	    },
	    eachKey : function(fn, scope){
	        for(var i = 0, len = this.keys.length; i < len; i++){
	            fn.call(scope || window, this.keys[i], this.items[i], i, len);
	        }
	    },
	    find : function(fn, scope){
	        for(var i = 0, len = this.items.length; i < len; i++){
	            if(fn.call(scope || window, this.items[i], this.keys[i])){
	                return this.items[i];
	            }
	        }
	        return null;
	    },
	    insert : function(index, key, o){
	        if(arguments.length == 2){
	            o = arguments[1];
	            key = this.getKey(o);
	        }
	        if(this.containsKey(key)){
	            this.suspendEvents();
	            this.removeKey(key);
	            this.resumeEvents();
	        }
	        if(index >= this.length){
	            return this.add(key, o);
	        }
	        this.length++;
	        this.items.splice(index, 0, o);
	        if(typeof key != 'undefined' && key !== null){
	            this.map[key] = o;
	        }
	        this.keys.splice(index, 0, key);
	        return o;
	    },
	    remove : function(o){
	        return this.removeAt(this.indexOf(o));
	    },
	    removeAt : function(index){
	        if(index < this.length && index >= 0){
	            this.length--;
	            var o = this.items[index];
	            this.items.splice(index, 1);
	            var key = this.keys[index];
	            if(typeof key != 'undefined'){
	                delete this.map[key];
	            }
	            this.keys.splice(index, 1);
	            return o;
	        }
	        return false;
	    },
	    removeKey : function(key){
	        return this.removeAt(this.indexOfKey(key));
	    },
	    getCount : function(){
	        return this.length;
	    },
	    indexOf : function(o){
	        return $.inArray(o,this.items);
	    },
	    indexOfKey : function(key){
	        return $.inArray(key,this.keys);
	    },
	    item : function(key){
	        var mk = this.map[key],
	            item = mk !== undefined ? mk : (typeof key == 'number') ? this.items[key] : undefined;
	        return typeof item != 'function' || this.allowFunctions ? item : null; // for prototype!
	    },
	    itemAt : function(index){
	        return this.items[index];
	    },
	    key : function(key){
	        return this.map[key];
	    },
	    contains : function(o){
	        return this.indexOf(o) != -1;
	    },
	    containsKey : function(key){
	        return typeof this.map[key] != 'undefined';
	    },
	    clear : function(){
	        this.length = 0;
	        this.items = [];
	        this.keys = [];
	        this.map = {};
	    },
	    first : function(){
	        return this.items[0];
	    },
	    last : function(){
	        return this.items[this.length-1];
	    },
	    _sort : function(property, dir, fn){
	        var i, len,
	            dsc   = String(dir).toUpperCase() == 'DESC' ? -1 : 1,
	
	            //this is a temporary array used to apply the sorting function
	            c     = [],
	            keys  = this.keys,
	            items = this.items;
	
	        //default to a simple sorter function if one is not provided
	        fn = fn || function(a, b) {
	            return a - b;
	        };
	
	        //copy all the items into a temporary array, which we will sort
	        for(i = 0, len = items.length; i < len; i++){
	            c[c.length] = {
	                key  : keys[i],
	                value: items[i],
	                index: i
	            };
	        }
	
	        //sort the temporary array
	        c.sort(function(a, b){
	            var v = fn(a[property], b[property]) * dsc;
	            if(v === 0){
	                v = (a.index < b.index ? -1 : 1);
	            }
	            return v;
	        });
	
	        //copy the temporary array back into the main this.items and this.keys objects
	        for(i = 0, len = c.length; i < len; i++){
	            items[i] = c[i].value;
	            keys[i]  = c[i].key;
	        }
	    },
	    sort : function(dir, fn){
	        this._sort('value', dir, fn);
	    },
	    reorder: function(mapping) {
	        this.suspendEvents();
	
	        var items     = this.items,
	            index     = 0,
	            length    = items.length,
	            order     = [],
	            remaining = [];
	
	        //object of {oldPosition: newPosition} reversed to {newPosition: oldPosition}
	        for (oldIndex in mapping) {
	            order[mapping[oldIndex]] = items[oldIndex];
	        }
	
	        for (index = 0; index < length; index++) {
	            if (mapping[index] == undefined) {
	                remaining.push(items[index]);
	            }
	        }
	
	        for (index = 0; index < length; index++) {
	            if (order[index] == undefined) {
	                order[index] = remaining.shift();
	            }
	        }
	
	        this.clear();
	        this.addAll(order);
	
	        this.resumeEvents();
	    },
	    keySort : function(dir, fn){
	        this._sort('key', dir, fn || function(a, b){
	            var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
	            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
	        });
	    },
	    getRange : function(start, end){
	        var items = this.items;
	        if(items.length < 1){
	            return [];
	        }
	        start = start || 0;
	        end = Math.min(typeof end == 'undefined' ? this.length-1 : end, this.length-1);
	        var i, r = [];
	        if(start <= end){
	            for(i = start; i <= end; i++) {
	                r[r.length] = items[i];
	            }
	        }else{
	            for(i = start; i >= end; i--) {
	                r[r.length] = items[i];
	            }
	        }
	        return r;
	    },
	    filter : function(property, value, anyMatch, caseSensitive){
	        if(!value){
	            return this.clone();
	        }
	        value = this.createValueMatcher(value, anyMatch, caseSensitive);
	        return this.filterBy(function(o){
	            return o && value.test(o[property]);
	        });
	    },
	    filterBy : function(fn, scope){
	        var r = new $.Collection();
	        r.getKey = this.getKey;
	        var k = this.keys, it = this.items;
	        for(var i = 0, len = it.length; i < len; i++){
	            if(fn.call(scope||this, it[i], k[i])){
	                r.add(k[i], it[i]);
	            }
	        }
	        return r;
	    },
	    findIndex : function(property, value, start, anyMatch, caseSensitive){
	        if(!value){
	            return -1;
	        }
	        value = this.createValueMatcher(value, anyMatch, caseSensitive);
	        return this.findIndexBy(function(o){
	            return o && value.test(o[property]);
	        }, null, start);
	    },
	    findIndexBy : function(fn, scope, start){
	        var k = this.keys, it = this.items;
	        for(var i = (start||0), len = it.length; i < len; i++){
	            if(fn.call(scope||this, it[i], k[i])){
	                return i;
	            }
	        }
	        return -1;
	    },
	    createValueMatcher : function(value, anyMatch, caseSensitive, exactMatch) {
	        if (!value.exec) { // not a regex
	            value = String(value);
	
	            if (anyMatch === true) {
	                value = escapeRe(value);
	            } else {
	                value = '^' + escapeRe(value);
	                if (exactMatch === true) {
	                    value += '$';
	                }
	            }
	            value = new RegExp(value, caseSensitive ? '' : 'i');
	         }
	         return value;
	    },
	    clone : function(){
	        var r = new $.Collection();
	        var k = this.keys, it = this.items;
	        for(var i = 0, len = it.length; i < len; i++){
	            r.add(k[i], it[i]);
	        }
	        r.getKey = this.getKey;
	        return r;
	    }
	};
	
	$.DataMap=function(data){
		//支持不使用new来构造
		if(!this.parseString) {
			return new $.DataMap(data);
		}
		$.Collection.call(this);	
		if(data){
			if($.isString(data)){
				this.parseString(data);
			}else if(typeof(data)=="object"){
				this.parseObject(data);
			}
		}
	};
	$.DataMap.prototype=new $.Collection();
	$.extend($.DataMap.prototype,{
		get:function(key,defaultValue){
			var r=this.item(key);
			if(arguments.length>1 && (typeof(r)=="undefined" || r==null))
				return arguments[1];
			return r;
		},
		parseString:function(str){
			str=$.parseJSON(str);
			//TODO 此处报错
			//(new Function("this.parseObject(" +str+")")).apply(this);
			//if(typeof(o)=="object")this.parseObject(o);
		},
		parseObject:function(obj){
			for(var p in obj){
				if(obj[p] && $.isArray(obj[p])){
					this.add(p,new $.DatasetList(obj[p]));
				}else if(obj[p] && $.isObject(obj[p])){
					this.add(p,new $.DataMap(obj[p]));
				}else{
					this.add(p,(obj[p]==undefined || obj[p]==null)?"":obj[p]);
				} 
			}
		}
	});

	$.DataMap.prototype.toString=function(){
			var cl=[],is="";
			for(var key in this.map){
				is="\"" + key + "\":";
				if(typeof(this.map[key])=="undefined" || this.map[key]==null){
					is+="\"\"";
				}else if(typeof(this.map[key])=="string" || !isNaN(this.map[key])){
					is+="\"" + this.map[key] + "\"";
				}else{
					is+=this.map[key].toString();
				}
				cl.push(is);
			}
			return "{" + cl.join(",") + "}";
	};
	$.DataMap.prototype.put=$.DataMap.prototype.add;

	$.DatasetList=function(o){
		//支持不使用new来构造
		if(!this.parseString) {
			return new $.DatasetList(o);
		}
		this.items = [];
		this.length=0;
		if(typeof(o)=="string" && o!="")this.parseString(o);
		if(typeof(o)=="object" && (o instanceof Array) && o.length)this.parseArray(o);
	};
	$.extend($.DatasetList.prototype,{
		add:function(o){
			this.length=(this.length+1);
			this.items.push(o);
		},
		item:function(index,key,defaultValue){
			if(index < this.length && index >= 0){
				var r= this.items[index];
				if((typeof(r)!="undefined") && (r instanceof $.DataMap) 
				&& arguments.length>1 && typeof(arguments[1])=="string" 
				&& arguments[1]!="" ){return r.get(key,defaultValue);}
				return r;
			}
		},	
		each:function(fn, scope){
			var items = [].concat(this.items); 
			for(var i = 0, len = items.length; i < len; i=i+1){
				if(fn.call(scope || items[i], items[i], i, len) === false){
					break;
				}
			}
		},   
		remove:function(o){
			return this.removeAt(this.indexOf(o));
		},	
		removeAt:function(index){
			if(index < this.length && index >= 0){
				this.length=(this.length-1);
				this.items.splice(index, 1);
			}		
		},
		indexOf:function(o){
			if(!this.items.indexOf){
				for(var i = 0, len = this.items.length; i < len; i=i+1){
					if(this.items[i] == o){ return i;}
				}
				return -1;
			}else{
				return this.items.indexOf(o);
			}
		},	
		getCount:function(){
			return this.length; 
		},	
		parseString:function(str){
			str=parseJson(str);
			(new Function("this.parseArray(" +str+")")).apply(this);	
		},
		parseArray:function(o){
			for(var i=0;i<o.length;i++){
				if(o[i] && $.isArray(o[i])){
					this.add(new $.DatasetList(o[i]));
				}else if(o[i] && $.isObject(o[i])){
					this.add(new $.DataMap(o[i]));
				}else{
					if(o[i]!=undefined && o[i]!=null)this.add(o[i]);
				} 
			}
		},
		clear:function(){
			this.items =[];
			this.length=0;
			//System.CG();
		}
	});
	$.DatasetList.prototype.toString=function(){
		var cl=[],is="";
		for(var i=0;i<this.items.length;i++){
			is="";
			if(typeof(this.items[i])=="undefined" || this.items[i]==null){
				is+="\"\"";
			}else if(typeof(this.items[i])=="string"){
				is="\"" + this.items[i] + "\"";
			}else{
				is=this.items[i].toString();
			}
			cl.push(is);
		}
		return "[" + cl.join(",") + "]";
	};
	$.DatasetList.prototype.get=$.DatasetList.prototype.item;
	$.DatasetList.prototype.put=$.DatasetList.prototype.add;
	
//})(jQuery);
});
define('aries-core-page',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	
	if(typeof($.aries.page) == 'undefined'){
		$.aries.page = {};
	}
	
	$.aries.page.data = {
		publicDataMap : new $.DataMap(),
		privateDataMap : new $.DataMap(),
		_hidedDataMap : new $.DataMap(),
		_privateArray : [],
		_paramArray : [],
        setData:function(key,data,type,io){
        	var dm = $.aries.page.data.publicDataMap,
        	    obj = {};
        	if(key){
        		obj.data = data;
            	obj.type = type || "json";
            	obj.io = io || "out";
            	dm.put(key,obj);
        	}
        },
        getData:function(key){
        	if(typeof(key)=='undefined' || key == null || key == ''){
        		return '';
        	}
        	var dm = $.aries.page.data.publicDataMap,returnData='';
        	if(dm){
        		if(dm.containsKey(key)){
        			var obj = dm.get(key);
        			if(obj.type === 'dom'){
        				var domId = obj.data;
        				if(domId){
    						var aeType = $("#"+domId).attr("aeType");
    						switch(aeType){
    						    case "aeForm":
    						    	returnData = $("#"+domId).aeForm("getData");
    						        break;
    						    case "aeGrid":
    						    	returnData = $("#"+domId).aeGrid("getData");
        						    break;
    						    case "aeTpl":
    						    	returnData = $("#"+domId).aeTpl("getData");
        						    break;
        						default:
        							break;
    						}
    					}
        			}else{
        				returnData = obj.data;
        			}
        		}
        	}
        	return returnData;
        },
        _setHidedData:function(key,value){
        	if(typeof(key)=='undefined' || key == null || key == ''){
        		return;
        	}
        	$.aries.page.data._hidedDataMap.put(key,value);
        },
        _getHidedData:function(key){
        	if(typeof(key)=='undefined' || key == null || key == ''){
        		return undefined;
        	}
        	return $.aries.page.data._hidedDataMap.get(key);
        },
        _removeHidedData:function(key){
        	if(typeof(key)=='undefined' || key == null || key == ''){
        		return;
        	}
        	$.aries.page.data._hidedDataMap.removeKey(key);
        },
        _clearHidedData:function(){
        	$.aries.page.data._hidedDataMap.clear();
        }
	};
	$.setPublicData = $.aries.page.data.setData;
	$.getPublicData = $.aries.page.data.getData;

	$.extend({
		removePublicData : function(key){
        	if(typeof(key)=='undefined' || key == null || key == ''){
        		return;
        	}
        	$.aries.page.data.publicDataMap.removeKey(key);
        },
		clearPublicData : function(){
			$.aries.page.data.publicDataMap.clear();
		},
		setPrivateData : function (key,value){
			if(typeof(key)=='undefined' || key == null || key == ''){
        		return;
        	}
        	$.aries.page.data.privateDataMap.put(key,value);
		},
		getPrivateData:function(key){
        	if(typeof(key)=='undefined' || key == null || key == ''){
        		return undefined;
        	}
        	return $.aries.page.data.privateDataMap.get(key);
        },
        removePrivateData:function(key){
        	if(typeof(key)=='undefined' || key == null || key == ''){
        		return;
        	}
        	$.aries.page.data.privateDataMap.removeKey(key);
        },
        clearPrivateData:function(){
        	$.aries.page.data.privateDataMap.clear();
        }
	});
});