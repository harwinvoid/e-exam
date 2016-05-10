define(function (require, exports, moudles) {
	/* Handlebars Helpers - Dan Harper (http://github.com/danharper) */
	/**
	 * 带序号的循环
	 * {{index}}为序号。
	 * eg ：
	 * {{#each_with_index array}}
	 *        {{index}}
	 * {{/each_with_index}}
	 */
	Handlebars.registerHelper("each_with_index", function (array, fn) {
		var buffer = "";
		array = array ? array : [''];
		for (var i = 0, j = array.length; i < j; i++) {
			var item = array[i];
			// stick an index property onto the item, starting with 1, may make configurable later
			item.index = i;
			// show the inside of the block
			buffer += fn(item);
		}
		// return the finished buffer
		return buffer;
	});
	/**
	 * If Equals
	 * if_eq this compare=that
	 */
	Handlebars.registerHelper('if_eq', function (context, options) {
		if (context == options.hash.compare)
			return options.fn(this);
		return options.inverse(this);
	});
	/**
	 * Unless Equals
	 * unless_eq this compare=that
	 */
	Handlebars.registerHelper('unless_eq', function (context, options) {
		if (context == options.hash.compare)
			return options.inverse(this);
		return options.fn(this);
	});
	/**
	 * If Greater Than
	 * if_gt this compare=that
	 */
	Handlebars.registerHelper('if_gt', function (context, options) {
		if (context > options.hash.compare)
			return options.fn(this);
		return options.inverse(this);
	});
	/**
	 * Unless Greater Than
	 * unless_gt this compare=that
	 */
	Handlebars.registerHelper('unless_gt', function (context, options) {
		if (context > options.hash.compare)
			return options.inverse(this);
		return options.fn(this);
	});
	/**
	 * If Less Than
	 * if_lt this compare=that
	 */
	Handlebars.registerHelper('if_lt', function (context, options) {
		if (context < options.hash.compare)
			return options.fn(this);
		return options.inverse(this);
	});
	/**
	 * Unless Less Than
	 * unless_lt this compare=that
	 */
	Handlebars.registerHelper('unless_lt', function (context, options) {
		if (context < options.hash.compare)
			return options.inverse(this);
		return options.fn(this);
	});
	/**
	 * If Greater Than or Equal To
	 * if_gteq this compare=that
	 */
	Handlebars.registerHelper('if_gteq', function (context, options) {
		if (context >= options.hash.compare)
			return options.fn(this);
		return options.inverse(this);
	});
	/**
	 * Unless Greater Than or Equal To
	 * unless_gteq this compare=that
	 */
	Handlebars.registerHelper('unless_gteq', function (context, options) {
		if (context >= options.hash.compare)
			return options.inverse(this);
		return options.fn(this);
	});
	/**
	 * If Less Than or Equal To
	 * if_lteq this compare=that
	 */
	Handlebars.registerHelper('if_lteq', function (context, options) {
		if (context <= options.hash.compare)
			return options.fn(this);
		return options.inverse(this);
	});
	/**
	 * Unless Less Than or Equal To
	 * unless_lteq this compare=that
	 */
	Handlebars.registerHelper('unless_lteq', function (context, options) {
		if (context <= options.hash.compare)
			return options.inverse(this);
		return options.fn(this);
	});
	Handlebars.registerHelper("store", function (data) {
		var buffer = "";
		if ($.isArray(data) || $.isObject(data)) {
			buffer = JSON.stringify(data);
		}
		return buffer;
	});
	Handlebars.registerHelper("createImgFront", function (data) {
		return new Handlebars.SafeString('<img src="/ARIESRES/' + data + '"');
	});
	Handlebars.registerHelper("createImgEnd", function (data) {
		return new Handlebars.SafeString('/>');
	});
	/**
	 * {{createLt}} 构建页面标签左尖括号 <
	 * {{createGt}} 构建页面标签右尖括号 >
	 */
	Handlebars.registerHelper("createLt", function (data) {
		return new Handlebars.SafeString('<');
	});
	Handlebars.registerHelper("createGt", function (data) {
		return new Handlebars.SafeString('>');
	});
	Handlebars.registerHelper('divide', function (value) {
		return (value / 100).toFixed(2);
	});
	/**
	 * 判断是否是偶数
	 */
	Handlebars.registerHelper('if_even', function (value, options) {
		if ((value % 2) == 0) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	/**
	 * 判断是否是奇数
	 */
	Handlebars.registerHelper('if_odd', function (value, options) {
		if ((value % 2) == 1) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	/*判断是否相等*/
	Handlebars.registerHelper('ifCond', function (v1, v2, options) {
		if (v1 == v2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
	/*判断是否不相等*/
	Handlebars.registerHelper('unlessCond', function (v1, v2, options) {
		if (v1 == v2) {
			return options.inverse(this);
		}
		return options.fn(this);
	});
	/* 截取字段*/
	Handlebars.registerHelper('substr', function (passedString, num) {
		var num = $.isObject(num) ? 10 : num;
		var theString = passedString.substr(0, parseInt(num));
		if (passedString.length > num) {
			return theString + "...";
		} else {
			return theString;
		}
	});
	/* 截取字段*/
	Handlebars.registerHelper('substr', function (passedString, num) {
		var num = $.isObject(num) ? 10 : num;
		var theString = passedString.substr(0, parseInt(num));
		if (passedString.length > num) {
			return theString + "...";
		} else {
			return theString;
		}
	});
	/**
	 * 序号+1
	 */
	 Handlebars.registerHelper("addOne", function (index) {
		//返回+1之后的结果
		return index + 1;
	});
	/**
	 * 判断是否大于0
	 */
	Handlebars.registerHelper('greaterThanZero',function(value, options){
		if(value > 0){
			return options.fn(this);
		}
		return options.inverse(this);
	});
	Handlebars.registerHelper('getDate',function(value,options) {
	 var completeDate =value.startTime.split('T')[0],
       date = completeDate.substr(0, 10);
    return date; 
});
Handlebars.registerHelper('getPeriod',function(value,options) {
	  value.startTime = moment.parseZone(value.startTime).local().format();
		value.endTime =moment.parseZone(value.endTime).local().format();
	  var begin = value.startTime.split('T')[1].substr(0,5),
    		end = value.endTime.split('T')[1].substr(0,5);
    return begin + '-' + end;
});

});
