define(function (require, exports, moudles) {
	$.extend($.aries, {
		config : {
			common : {
				//加载页面url前缀，与nginx配置一致
				PAGE_REDIRECT_PREFIX : '',
				//ajax请求sv的url地址
				AJAX_URL_SV_PREFIX : '',
				//ajax请求json的url地址，与nginx配置一致
				AJAX_URL_JSON_PREFIX : '',
				//url串是否要encode编码，默认true
				IS_AJAX_URL_ENCODE : false,
				//写入cookie中国际化语言的key值
				I18N_LOCALE_KEY : 'AE_I18N',
				//默认显示语言
				I18N_LOCALE_DEFAULT : 'en_US',
				//是否开启调试模式，会提示错误信息，上线时设置为false
				IS_DEBUG_MODE : false,
				//业务流可访问SV路径前缀 
				BIZFLOW_SUBMIT_SV_PREFIX : 'HubCrmServlet'
			},
			sec : {
				//临时授权Token的类型，有操作员授权与客户授权两种
				SEC_OPERATOR_TEMP_TOKEN : 'SEC_OPERATOR_TEMP_TOKEN',
				SEC_CUSTOMER_TEMP_TOKEN : 'SEC_CUSTOMER_TEMP_TOKEN',
				//临时授权Token传输给hub的code与value标识
				SEC_TEMP_AUTH_TOKEN_TO_HUB_CODE : 'tempAuthCode',
				SEC_TEMP_AUTH_TOKEN_TO_HUB_VALUE : 'tempAuthValue',
				//临时授权服务的入参授权人类型 ，操作员或客户 
				SEC_TEMP_PERMISSION_TOKEN_TYPE_OPERATOR : 'Operator',
				SEC_TEMP_PERMISSION_TOKEN_TYPE_CUSTOMER : 'Customer',
				//临时授权服务的入参授权对象类型 ，功能集、服务 、数据权限 、属主授权
				SEC_TEMP_PERMISSION_ENTITY_TYPE_FUNCTIONSET : 'FunctionSet',
				SEC_TEMP_PERMISSION_ENTITY_TYPE_SERVICE : 'Service',
				SEC_TEMP_PERMISSION_ENTITY_TYPE_DATA : 'Data',
				SEC_TEMP_PERMISSION_ENTITY_TYPE_OWNER : 'Owner',
				//临时授权服务的入参授权类型，密码 
				SEC_TEMP_PERMISSION_AUTHOR_TYPE_PWD : '1',
				//临时授权服务的入参需验证的输入信息，用户名、密码 
				SEC_TEMP_PERMISSION_CHECK_INPUT_USERNAME : 'username',
				SEC_TEMP_PERMISSION_CHECK_INPUT_PWD : 'password',
				//权限服务返回编码类型，有权限 、未登录无权限、已登录无权限
				SEC_RETURN_TYPE_SUCCESS : 'AISEC0001',
				SEC_RETURN_TYPE_UNLOGIN_FAIL : 'AISEC0002',
				SEC_RETURN_TYPE_LOGINED_FAIL : 'AISEC0003',
				
				//Auth服务返回编码类型，不支持此种临时授权认证方式
				SEC_AUTH_TYPE_AUTHOR_TYPE_WRONG : 'AIATH0001',
				//Auth服务返回编码类型，操作员登陆验证信息失败，主要是登陆后返回的user为空
				SEC_AUTH_TYPE_LOGIN_FAILURE : 'AIATH0005',
				//Auth服务返回编码类型，session失效
				SEC_AUTH_TYPE_SESSION_EXPIRE : 'AIAUTH0008',
				//写入cookie中Token的key值
				SEC_AUTH_TOKEN_KEY : 'AppEngine_TokenId',
				//写入cookie中租户的key值
				SEC_AUTH_TENANT_KEY : 'AE_TENANT'
			}
		}
	});
});