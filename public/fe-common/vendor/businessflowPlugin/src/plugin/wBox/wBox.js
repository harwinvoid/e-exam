/**
 * jQuery wBox plugin
 * wBox是一个轻量级的弹出窗口jQuery插件，基于jQuery1.4.2开发，
 * 主要实现弹出框的效果，并且加入了很多有趣的功能，比如可img灯箱效果，callback函数，显示隐藏层，Ajax页面，iframe嵌入页面等功能
 * @name wBox
 * @author WangYongqing - http://www.js8.in（王永清 http://www.js8.in）
 * @version 0.1
 * @copyright (c) 2010 WangYongqing (js8.in)
 * @example Visit http://www.js8.in/mywork/wBox/ for more informations about this jQuery plugin
 */
(function($){
    //class为.wBox_close为关闭
    $.fn.wBox = function(options){
        var defaults = {
            wBoxURL: "../src/plugin/wBox/",
            opacity: 0,//背景透明度
            callBack: null,
            successCallback: null,
            errorCallback: null,
            noTitle: false,
			show: false,
			timeout: 0,
			target: null,
			requestType: null,//iframe,ajax,img
            title: "",
			drag:true,
			positionMode: "",// parameter(userMode): userMode(define position by user), parameter(""): autoMode(center of browser)
			iframeWH: {//iframe 设置高宽
                width: 1000,
                height: 400
            },
            ajaxPosition: {
            	positionObject: new Object(),
                width: 240,
                height: 300
            },
            closeCallBack : null,
            html: ''//wBox内容
        },_this=this;
		this.YQ = $.extend(defaults, options);
		var wBoxHtml = "";
		if ("userMode" == _this.YQ.positionMode) {
			wBoxHtml = '<div id="wBox" class="wBox_userMode"><div id="wBoxPopup" class="wBox_userMode_popup"></div></div>', B = null, C = null, $win = $(window),$t=$(this);//B背景，C内容jquery div
		} else {
			wBoxHtml = '<div id="wBox" class="wBox_autoMode"><div id="wBoxPopup" class="wBox_autoMode_popup"></div></div>', B = null, C = null, $win = $(window),$t=$(this);//B背景，C内容jquery div
		}
   
        this.showBox=function (){
            $("#wBox_overlay").remove();
			$("#wBox").remove();
            
//            B = $("<div id='wBox_overlay' class='wBox_hide'></div>").hide().addClass('wBox_overlayBG').css('opacity', _this.YQ.opacity).click(function(){
//                _this.close();
//            }).appendTo('body').fadeIn(500);
            C = $(wBoxHtml).appendTo('body').fadeIn(500);
            handleClick();
        }
        /*
         * 处理点击
         * @param {string} what
         */
        function handleClick(){
            var con = $("#wBoxPopup");
			if (_this.YQ.requestType && $.inArray(_this.YQ.requestType, ['iframe', 'ajax','img'])!=-1) {
				con.html("<div class='wBox_load'><div id='wBox_loading' class='wBox_loading'><img src='"+_this.YQ.wBoxURL+"loading.gif' /></div></div>");				
				if (_this.YQ.requestType === "img") {
					var img = $("<img />");
					img.attr("src",_this.YQ.target);
					img.load(function(){
						img.appendTo(con.empty());
						setPosition();
					});
				} else if (_this.YQ.requestType === "ajax") {
						var wBoxPopup = $("#wBoxPopup");
						wBoxPopup.html("<div class='wBox_load'><div id='wBox_loading' class='wBox_loading'><img src='"+_this.YQ.wBoxURL+"loading.gif' /></div></div>");
						
						var lrPosition = positionOfSubpage(
								parseInt(_this.YQ.ajaxPosition.positionObject.left) + parseInt(_this.YQ.ajaxPosition.positionObject.businessflowDefaultWidth) + 320, 
		            			parseInt(_this.YQ.ajaxPosition.positionObject.top) + 35, 
		            			_this.YQ.ajaxPosition.width, 
		            			_this.YQ.ajaxPosition.positionObject.businessflowDefaultWidth, 
		            			_this.YQ.ajaxPosition.height);
		            	
		            	if (!lrPosition) {
		            		lrPosition = {};
		            		lrPosition[0] = parseInt(_this.YQ.ajaxPosition.positionObject.left) + parseInt(_this.YQ.ajaxPosition.positionObject.businessflowDefaultWidth) + 320;
		            		lrPosition[1] = parseInt(_this.YQ.ajaxPosition.positionObject.top) + 35;
		            	}
		            	
		            	_this.YQ.ajaxPosition.left = lrPosition[0];
		            	_this.YQ.ajaxPosition.right = lrPosition[1];
						
						$.ajax({
							type: "get",
							url: _this.YQ.target,
							dataType: "html",
							success: function(data) {
								wBoxPopup.html(data);
								setPosition();
								typeof _this.YQ.successCallback === 'function' ? _this.YQ.successCallback() : null;
							},
							complete: function(XHR, TS) {
								if ("error" == TS) {
									wBoxPopup.html(JSON.stringify(XHR));
									setPosition();
								}
							}
						});
						
					} else {
						var wBoxPopup = $("#wBoxPopup");
						var iframePosition = positionOfIframe();
						var width = (null != iframePosition[0]) ? iframePosition[0] : 1000;
						var height = (null != iframePosition[1]) ? iframePosition[1] : 500;
						ifr = $("<iframe name='wBoxIframe' style='width:" + width + "px;height:" + height + "px;' scrolling='auto' frameborder='0' src='" + _this.YQ.target + "'></iframe>");
						ifr.appendTo(wBoxPopup.empty());
						ifr.load(function(a, b, c){
							try {
								$it = $(this).contents();
								fH = $it.height();	//iframe height
								fW = $it.width();
								w = $win;
								newW = Math.min(w.width() - 40, fW);
								newH = w.height() - 100 - (_this.YQ.noTitle ? 0 : 30);
								newH = Math.min(newH, fH);
								if (!newH) 
									return;
								var lt = calPosition(newW);
								C.css({
									left: lt[0],
									top: lt[1]
								});
								$(this).css({
									height: newH,
									width: newW
								});
							} 
							catch (error) {
								console.log(error);
							}
						});
					}
				
			} else if (_this.YQ.target) {
					$(_this.YQ.target).clone(true).show().appendTo(con.empty());
				} else if (_this.YQ.html) {
						con.html(_this.YQ.html);
					} else {
						$t.clone(true).show().appendTo(con.empty());
					}         
            afterHandleClick();
        }
        /*
         * 处理点击之后的处理
         */
        function afterHandleClick(){     
            setPosition();
            C.show().find('.wBox_close').click(_this.close).hover(function(){
                $(this).addClass("on");
            }, function(){
                $(this).removeClass("on");
            });
            $(document).unbind('keydown.wBox').bind('keydown.wBox', function(e){
                if (e.keyCode === 27) 
                    _this.close();
                return true
            });
            typeof _this.YQ.callBack === 'function' ? _this.YQ.callBack() : null;
            !_this.YQ.noTitle&&_this.YQ.drag?drag():null;
			if(_this.YQ.timeout){
                setTimeout(_this.close,_this.YQ.timeout);
            }
				
        }
        /*
         * 设置wBox的位置
         */
        function setPosition(){
            if (!C) {
                return false;
            }
			
            if ("userMode" == _this.YQ.positionMode) {
            	C.css({
					left: _this.YQ.ajaxPosition.left,
					top: _this.YQ.ajaxPosition.right,
					width: _this.YQ.ajaxPosition.width,
					height: _this.YQ.ajaxPosition.height
				});
				var $h = $("body").height(), $wh = $win.height(), $hh = $("html").height();
				$h = Math.max($h, $wh);
				if (B) {
					B.height($h).width($win.width());
				}
            } else {
            	var lt = calPosition(_this.YQ.iframeWH.width);
            	
            	C.css({
					left : lt[0],
					top : lt[1]
				});
            	
            	var $h = $("body").height(), $wh = $win.height(), $hh = $("html").height();
				$h = Math.max($h, $wh);
				if (B) {
					B.height($h).width($win.width());
				}
            }
        }
        function positionOfIframe() {
        	var minWidth = 1000;
        	var minHeight = 500;
        	var iframeWidth, iframeHeight;
        	if (parseInt(document.body.clientWidth) <= minWidth) {
        		iframeWidth = minWidth;
        	} else {
        		iframeWidth = parseInt(document.body.clientWidth) - 366;
        	}
        	if (parseInt(document.body.clientHeight) <= minHeight) {
        		iframeHeight = minHeight;
        	} else {
        		iframeHeight = parseInt(document.body.clientHeight) - 168;
        	}
        	
        	return [iframeWidth, iframeHeight];
        }
        function positionOfSubpage(positionX, positionY, width, nodeWidth, height) {
        	var lrPosition = {};
        	var arrowOffsetX = 0;
        	var arrowOffsetY = 0;
        	
        	if ((parseInt(document.body.clientWidth) - parseInt(width)) <= parseInt(positionX)) {
        		lrPosition[0] = parseInt(positionX) - parseInt(nodeWidth) - parseInt(width) - 30;
        		arrowOffsetX = parseInt(width);
        	} else {
        		lrPosition[0] = parseInt(positionX);
        	}
        	
        	if ((parseInt(document.body.clientHeight) - parseInt(height)) <= parseInt(positionY)) {
        		lrPosition[1] = parseInt(document.body.clientHeight) - parseInt(height) -10;
        		arrowOffsetY = parseInt(positionY) - lrPosition[1];
        	} else {
        		lrPosition[1] = parseInt(positionY);
        	}
        	
        	var userModeBeforeAndAfter = document.createElement("style");
        	userModeBeforeAndAfter.id = "userModeBeforeAndAfter";
        	userModeBeforeAndAfter.type = "text/css";
        	var styleInnerHTML = "";
        		styleInnerHTML += ".wBox_userMode:before{";
        		styleInnerHTML += "position: absolute;";
        		styleInnerHTML += "display: inline-block;";
        		if (0 != arrowOffsetX) {
        			styleInnerHTML += "border-top: 7px solid transparent;";
        			styleInnerHTML += "border-right: 7px solid transparent;";
        			styleInnerHTML += "border-left: 7px solid #eee;";
        			styleInnerHTML += "border-bottom: 7px solid transparent;";
        			styleInnerHTML += "border-left-color: rgba(0, 0, 0, 0.2);";
        			
        			styleInnerHTML += "left: " + (-2 + arrowOffsetX) + "px;";
        			styleInnerHTML += "top: " + (20 + arrowOffsetY) + "px;";
        		} else if (0 != arrowOffsetY) {
        			styleInnerHTML += "border-top: 7px solid transparent;";
        			styleInnerHTML += "border-right: 7px solid #eee;";
        			styleInnerHTML += "border-bottom: 7px solid transparent;";
        			styleInnerHTML += "border-right-color: rgba(0, 0, 0, 0.2);";
        			
        			styleInnerHTML += "left: " + (-8 + arrowOffsetX) + "px;";
        			styleInnerHTML += "top: " + (20 + arrowOffsetY) + "px;";
        		} else {
        			styleInnerHTML += "border-top: 7px solid transparent;";
        			styleInnerHTML += "border-right: 7px solid #eee;";
        			styleInnerHTML += "border-bottom: 7px solid transparent;";
        			styleInnerHTML += "border-right-color: rgba(0, 0, 0, 0.2);";
        			
        			styleInnerHTML += "left: -8px;";
        			styleInnerHTML += "top: 20px;";
        		}
        		styleInnerHTML += "content: '';}";
        		
        		styleInnerHTML += ".wBox_userMode:after {";
        		styleInnerHTML += "position: absolute;";
        		styleInnerHTML += "display: inline-block;";
        		if (0 != arrowOffsetX) {
        			styleInnerHTML += "border-top: 6px solid transparent;";
        			styleInnerHTML += "border-left: 6px solid white;";
        			styleInnerHTML += "border-right: none;";
        			styleInnerHTML += "border-bottom: 6px solid transparent;";
        			
        			styleInnerHTML += "left: " + (-2 + arrowOffsetX) + "px;";
        			styleInnerHTML += "top: " + (21 + arrowOffsetY) + "px;";
        		} else if (0 != arrowOffsetY) {
        			styleInnerHTML += "border-top: 6px solid transparent;";
        			styleInnerHTML += "border-left: none;";
        			styleInnerHTML += "border-right: 6px solid white;";
        			styleInnerHTML += "border-bottom: 6px solid transparent;";
        			
        			styleInnerHTML += "left: " + (-6 + arrowOffsetX) + "px;";
        			styleInnerHTML += "top: " + (21 + arrowOffsetY) + "px;";
        		} else {
        			styleInnerHTML += "border-top: 6px solid transparent;";
        			styleInnerHTML += "border-left: none;";
        			styleInnerHTML += "border-right: 6px solid white;";
        			styleInnerHTML += "border-bottom: 6px solid transparent;";
        			
        			styleInnerHTML += "left: -6px;";
        			styleInnerHTML += "top: 21px;";
        		}
        		styleInnerHTML += "content: '';}";
        	userModeBeforeAndAfter.innerHTML = styleInnerHTML;
        	
        	document.getElementsByTagName("head").item(0).appendChild(userModeBeforeAndAfter);
        	
        	return lrPosition;
        }
        /*
         * 计算wBox的位置
         * @param {number} w 宽度
         */
        function calPosition(w){
            l = ($win.width() - w) / 2;
            t = $win.scrollTop() + $win.height() / 15;
            return [l, t];
        }
        /*
         * 拖拽函数drag
         */
        function drag(){
            var dx, dy, moveout;
            var T = C.find('.wBox_dragTitle').css('cursor', 'move');
            T.bind("selectstart", function(){
                return false;
            });
            
            T.mousedown(function(e){
                dx = e.clientX - parseInt(C.css("left"));
                dy = e.clientY - parseInt(C.css("top"));
                C.mousemove(move).mouseout(out).css('opacity', 0.8);
                T.mouseup(up);
            });
            /*
             * 移动改变生活
             * @param {Object} e 事件
             */
            function move(e){
                moveout = false;
                if (e.clientX - dx < 0) {
                    l = 0;
                }
                else 
                    if (e.clientX - dx > $win.width() - C.width()) {
                        l = $win.width() - C.width();
                    }
                    else {
                        l = e.clientX - dx
                    }
                C.css({
                    left: l,
                    top: e.clientY - dy
                });
                
            }
            /*
             * 你已经out啦！
             * @param {Object} e 事件
             */
            function out(e){
                moveout = true;
                setTimeout(function(){
                    moveout && up(e);
                }, 10);
            }
            /*
             * 放弃
             * @param {Object} e事件
             */
            function up(e){
                C.unbind("mousemove", move).unbind("mouseout", out).css('opacity', 1);
                T.unbind("mouseup", up);
            }
        }
        
        /*
         * 关闭弹出框就是移除还原
         */
        this.close=function (){
            if (C) {
            	typeof _this.YQ.closeCallBack === 'function' ? _this.YQ.closeCallBack() : null;
            	if (B) {
            		B.remove();	
            	}
//                C.stop().fadeOut(500, function(){
                    C.remove();

                    var userModeBeforeAndAfter = document.getElementById("userModeBeforeAndAfter");
                    if (userModeBeforeAndAfter) {
                    	userModeBeforeAndAfter.parentNode.removeChild(userModeBeforeAndAfter);
                    }
                    
//                })
            }
        }
        /*
         * 触发click事件
         */		
        $win.resize(function(){
//            setPosition();
        });
		_this.YQ.show?_this.showBox():$t.click(function(){
            _this.showBox();
            return false;
        });
		return this;
    };
})(jQuery);
