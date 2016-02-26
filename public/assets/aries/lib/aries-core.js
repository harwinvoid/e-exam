define(function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * ui-core.js
 * 核心类
 */
//;(function($, undefined) {
	
	$.aries = $.aries || {};

	if ($.aries.version) {
		return;
	}

	$.extend($.aries, {
		version : "3.1"
	});

	$.extend({
		isString : function(value) {
			return '[object String]' == Object.prototype.toString.call(value);
		},
		isArray:function(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		},
		//判断是否为object类型的对象
		isObject:function(obj){
			return Object.prototype.toString.call(obj) === "[object Object]";
		},
		isBoolean: function(value) {
	            return typeof value === 'boolean';
	    }
	});
	
	//覆盖getScript方法，默认对js缓存
	$.getScript = function(url, callback, cache) {
	    $.ajax(
	    	{type: 'GET', url: url, success: callback, dataType: 'script',
	    		ifModified: true, cache: cache || true
	    });
	};

	String.prototype.startWith = function(s) {
		if (s == null || s == "" || this.length == 0 || s.length > this.length)
			return false;
		if (this.substr(0, s.length) == s)
			return true;
		else
			return false;
		return true;
	};

	String.prototype.endWith = function(s) {
		if (s == null || s == "" || this.length == 0 || s.length > this.length)
			return false;
		if (this.substring(this.length - s.length) == s)
			return true;
		else
			return false;
		return true;
	};
	
	$.format = {
		 /**
		 * 按照format格式来格式化数字
		 * 0 - (123456) 取整数部分<br>
		 * 0.00 - (123456.78) 取2位小数<br>
		 * 0.0000 - (123456.7890) 取4位小数<br>
		 * 0,000 - (123,456) 取金额格式<br>
		 * 0,000.00 - (123,456.78) 取金额格式并2位小数
		 * 0,0.00 - (123,456.78)  取简短金额格式
		 * 如果需要转换小数位数后为金额格式，需要在format后加 "/i"
		 * exp: {value:number('0.00')}
		 * 例如: 0.000,00/i
		 */
		number:function(v, format) {
			if(!format){
				return v;
			}
			 if (isFinite(v)) {
				v = parseFloat(v);
			}
			v=!isNaN(v) ? v : NaN;

			if (isNaN(v)){
				return '';
			}
			var comma = ',',
				dec = '.',
				i18n = false,
				neg = v < 0;

			v = Math.abs(v);
			if(format.substr(format.length - 2) == '/i'){
				format = format.substr(0, format.length - 2);
				i18n = true;
				comma = '.';
				dec = ',';
			}

			var hasComma = format.indexOf(comma) != -1,
				psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);

			if(1 < psplit.length){
				v = v.toFixed(psplit[1].length);
			}else if(2 < psplit.length){
				throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
			}else{
				v = v.toFixed(0);
			}

			var fnum = v.toString();

			psplit = fnum.split('.');

			if (hasComma) {
				var cnum = psplit[0], parr = [], j = cnum.length, m = Math.floor(j / 3), n = cnum.length % 3 || 3;

				for (var i = 0; i < j; i += n) {
					if (i != 0) {
						n = 3;
					}
					parr[parr.length] = cnum.substr(i, n);
					m -= 1;
				}
				fnum = parr.join(comma);
				if (psplit[1]) {
					fnum += dec + psplit[1];
				}
			} else {
				if (psplit[1]) {
					fnum = psplit[0] + dec + psplit[1];
				}
			}

			return (neg ? '-' : '') + format.replace(/[\d,?\.?]+/, fnum);
		}
	};

//})(jQuery);
});