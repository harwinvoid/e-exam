define(function(require, exports, modules) {
	"require:nomunge,exports:nomunge,modules:nomunge";
	//第三方插件
	require('./handlebars');
	require('./handlebars-helpers');
	require('./jquery-scroll');
	require('./jquery-metadata');
	//aries 组件-生产
	require('./aries-core');
	require('../config/aries-config');
	require('./aries-load.min');
	require('./webuploader');
});
