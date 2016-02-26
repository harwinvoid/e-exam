define(function(require, exports, modules) {
	"require:nomunge,exports:nomunge,modules:nomunge";
	require('./aries-base.min');
	require('./aries-ui.min');
	require("../../../fe-common/js/extend");

	//浏览器版本是否低于IE8
    function isIE8() {
        var UA = navigator.userAgent,
            isIE = UA.indexOf('MSIE') > -1,
            v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie';
        return v <= 8;
    }
    var lessThenIE8=isIE8();
	if(lessThenIE8){
		require.async("../../../fe-common/vendor/respond.min");
	}
	
	$.aries.common.globalInit();
});