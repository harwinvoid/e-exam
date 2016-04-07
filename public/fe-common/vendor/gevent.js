/**
 * Created by zengjie on 15/12/22.
 * * 事件定义器
 * 所有需要发布事件的模块需要在这个定义器中定义自己需要发布的事件
 * 需要注册指定事件的模块只需要从这个定义器中获取即可，无需require具体的模块
 */
define(function(require, exports, module) {
	//---------------- BEGIN MODULE SCOPE VARIABLES --------------
	var register, _gevent = {};
	//----------------- END MODULE SCOPE VARIABLES ---------------


	//------------------- BEGIN PUBLIC METHODS -------------------
	register = function(event_map) {
		for ( var event_key in event_map) {
			if (_gevent[event_key]) {
				console.warn('event | ' + event_key + ' | is already registered');
				return;
				//throw 'event | ' + event_key + ' | is already registered';
			}
			_gevent[event_key] = event_map[event_key];
		}
	};

	/**
	 * 无模块依赖的全局事件
	 */
	register({
	});

	module.exports = {
		register : register,
		geventEvent : _gevent
	};
});