(function($) {
    $.plugin = {};

	$.plugin.showSoftInput = function(){
		if (!$.settings.isPhoneGap) return;

		cordova.exec(null, null, "Melon", "showSoftInput", []);
	};

	$.plugin.hideSoftInput = function(){
		if (!$.settings.isPhoneGap) return;

		cordova.exec(null, null, "Melon", "hideSoftInput", []);
	};

    /**
	 * 设置软键盘弹出不把界面向上推
	 */
	$.plugin.setWindowSoftAdjustPan = function(){
		if (!$.settings.isPhoneGap) return;

		if(!$.phone.softPan) return;

		$.phone.softPan = false;
		cordova.exec(null, null, "Melon", "setWindowSoftAdjustPan", []);
	};
	
	/**
	 * 设置软键盘弹出把界面向上推
	 */
	$.plugin.setWindowSoftAdjustResize = function(){
		if (!$.settings.isPhoneGap) return;

		if($.phone.softPan) return;
		$.phone.softPan = true;
		cordova.exec(null, null, "Melon", "setWindowSoftAdjustResize", []);
	};

    /**
     * 加载启动数据
     * 
     * @prams 无
     * 
     * @retval width - webview 宽度 height - webview 高度
     */
    $.plugin.getStartData = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, "Melon", "getStartData", []);
    };

    /**
	 * 获取配送地址默认的省市区数据
	 */
	$.plugin.getAddressDefaultProvinceAndCityAndRegion = function(success, fail, delegate){
		if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, "Melon", "getAddressDefaultProvinceAndCityAndRegion", []);
	};

	/**
	 * 获取配送地址的省数据
	 */
	$.plugin.getAddressProvince = function(success, fail, delegate){
		if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, "Melon", "getAddressProvince", []);
	}
	
	/**
	 * 获取配送地址的市数据
	 * 需要传递省名称
	 */
	$.plugin.getCityByProvince = function(provinceIndex, success, fail, delegate){
		if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, "Melon", "getCityByProvince", [provinceIndex]);
	}
	
	/**
	 * 获取配送地址的区数据
	 * 需要传递省市名称
	 */
	$.plugin.getRegionByProvinceAndCity = function(provinceIndex, cityIndex, success, fail, delegate){
		if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, "Melon", "getRegionByProvinceAndCity", [provinceIndex, cityIndex]);
	};

    /**
     * 用浏览器打开一个url
     * 
     * url - 地址
     */
    $.plugin.openUrl = function(url) {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(null, null, "Melon", "openUrl", [ url ]);
    };
    
	/****************服务器设置*******************************/
	$.plugin.whatserver = function(success,fail,delegate) {
		if (!$.settings.isPhoneGap)
			return;
		cordova.exec(function() {
			if ($.isFunction(success))
				success.apply(delegate, arguments);
		}, function() {
			if ($.isFunction(fail))
				fail.apply(delegate, arguments);
		}, "Melon", "whatserver", []);
	};
	$.plugin.settestserver = function(success,delegate) {
		if (!$.settings.isPhoneGap)
			return;
		cordova.exec(function() {
			if ($.isFunction(success))
				success.apply(delegate, arguments);
		}, null, "Melon", "testserver", []);
	};
	$.plugin.setserver = function(success,delegate) {
		if (!$.settings.isPhoneGap)
			return;
		cordova.exec(function() {
			if ($.isFunction(success))
				success.apply(delegate, arguments);
		}, null, "Melon", "server", []);
	};
	/***********************************************/
	
    $.plugin.choice = function(titledata, success, fail, delegate) {
		if (!$.settings.isPhoneGap)
			return;

    	cordova.exec(function() {
			if ($.isFunction(success))
				success.apply(delegate, arguments);
    	},function() {
			if ($.isFunction(fail))
				fail.apply(delegate, arguments);
    	}, 'Melon', 'choice', titledata);
    };

    $.plugin.sub = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, "Melon", "sub", []);
    };

    /**
     * 显示提示信息
     */
    $.plugin.showToast = function(message) {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(null, null, "Melon", "showToast", [ message ]);
    };

    $.plugin.showDialog = function(success, fail, title, message, delegate) {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, "Melon", "showDialog", [ title, message ]);
    };

    $.plugin.download = function(url, success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonDownload', 'download', [ url ]);
    };

    $.plugin.showProgress = function(title) {
        if (!$.settings.isPhoneGap)
            return;

		if($.phone.inProgress) return;

		$.phone.inProgress = true;
        cordova.exec(null, null, 'Melon', 'showProgress', [ title ]);
    };

    $.plugin.cancelProgress = function() {
        if (!$.settings.isPhoneGap)
            return;

		if(!$.phone.inProgress) return;
		$.phone.inProgress = false;
        cordova.exec(null, null, 'Melon', 'cancelProgress', []);
    };

    $.plugin.showPageProgress = function() {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(null, null, 'Melon', 'showPageProgress', []);
    };

    $.plugin.showDownloadProgress = function() {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(null, null, 'Melon', 'showDownloadProgress', []);
    };
    
    $.plugin.cancelPageProgress = function() {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(null, null, 'Melon', 'cancelPageProgress', []);
    };

	$.plugin.getLocation = function(success, fail, delegate) {

		if (!$.settings.isPhoneGap)
			return;

		var canceled = false;
		var nid = $.notification.regist('hessianCancel',function() {
			canceled = true;
		});
		cordova.exec(function() {
			$.notification.remove('hessianCancel',nid);
			if(canceled) return;
			if ($.isFunction(success))
				success.apply(delegate, arguments);
		},  function(error) {
			$.notification.remove('hessianCancel',nid);
			if(canceled) return;
			if (error==1) {
				setTimeout(function() {
					$.plugin.cancelProgress();
					$.phone.getCurrentPage().showNetworkToast();
				}, 300);
				return;
			}
			if ($.isFunction(fail))
				fail.apply(delegate, arguments);
		}, 'Melon', 'getLocation', []);
	};

	$.plugin.getFlightDynamicByCity= function(takeoff_city,arrival_city, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(null, function() {
            if ($.isFunction(fail))
            	fail.apply(delegate, arguments);
        }, 'Melon', 'getFlightDynamic', [1,takeoff_city,arrival_city]);
    };
    $.plugin.getFlightDynamicByNo= function(flight_no,fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(null, function() {
            if ($.isFunction(fail))
            	fail.apply(delegate, arguments);
        }, 'Melon', 'getFlightDynamic', [2,flight_no]);
    };
	
    /**
     * type:0所有酒店地图查看 1酒店地址查看
     * data:地图显示所需数据json array                                                                                                                                                                                                                                    {'type':1}     
     * 		type=0:为地图页面标题栏显示数据（显示标题文本、起始时间、住的时间文本）、中心点数据（中心点类型[0地点,1我的位置:不需要后面的值了],中心点显示文本，中心点经度、中心点纬度）以及要展示的数据json数组 组成的数组，如[{'name':'深圳海岸城','fromdate':'11-28','time':'住1晚'},{'name':'深圳市（市中心）','lng':'','lat':'','type':0},[]] 
     * 		type=1:为要查看酒店的“名称+地址（如："7天连锁(深南街东方路90号)"）”、“经度”、“纬度”数据，如：[{'name':'','lng':'','lat':''}]
     */
    $.plugin.amap = function(type,data,success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
            	fail.apply(delegate, arguments);
        }, 'Melon', 'amap', [type,data]);
    };
    
    //语音识别类型type=0 机票   type=1酒店
    $.plugin.startVoice = function(success,type,delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
        	 cordova.exec(function() {
                 if ($.isFunction(success))
                     success.apply(delegate, arguments);
             }, function(msg) {
     			console.log('error：'+msg);
     		}, 'Melon', 'startVoice', [type]);
        }, function() {
			return navigator.notification.confirm('检测到您尚未安装语音组件，是否现在安装？',
					function(idx) {
						if (idx != 2)
							return;
        		cordova.exec(function() {
        			console.log('install success');
              }, function(msg) { 
            	  $.plugin.showToast(msg); 
      		}, 'Melon', 'installVoice', []);
        	},'确认',['否','是']);
		}, 'Melon', 'beforeStartVoice', []);
    };
    
    $.plugin.install = function(addr) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(null, null, 'Melon', 'install', [ addr ]);
    };

	//启动xmpp服务
	$.plugin.startXmppService = function(username) {
		if (!$.settings.isPhoneGap)
			return;

		cordova.exec(null, null, "Melon", "startXmppService", [ username ]);
	};
	//结束xmpp服务
	$.plugin.stopXmppService = function() {
		if (!$.settings.isPhoneGap)
			return;

		cordova.exec(null, null, "Melon", "stopXmppService", []);
	};
	//获取是否要跳转页面
	$.plugin.getSession = function(success,delegate) {
		if (!$.settings.isPhoneGap)
			return;

		cordova.exec(function() {
			if ($.isFunction(success))
				success.apply(delegate, arguments);
		}, null, "Melon", "getSession", []);
	};
	//获取是否要跳转页面2
	$.plugin.getFromext = function(success,delegate) {
		if (!$.settings.isPhoneGap)
			return;

		cordova.exec(function() {
			if ($.isFunction(success))
				success.apply(delegate, arguments);
		}, null, "Melon", "getFromext", []);
	};
	
    /**
     * 退出应用
     */
    $.plugin.exitApp = function() {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(null, null, "Melon", "exitApp", []);
    };

    /**
     * 显示加载框
     */
    $.plugin.showLoadingView = function(title, message) {
        if (!$.settings.isPhoneGap)
            return;
		if($.phone.inProgress) return;

		$.phone.inProgress = true;
        cordova
                .exec(null, null, "Melon", "showLoadingView",
                        [ title, message ]);
    };
    /**
     * 隐藏加载框
     */
    $.plugin.hideLoadingView = function() {
        if (!$.settings.isPhoneGap)
            return;
    	if(!$.phone.inProgress) return;
		$.phone.inProgress = false;
        cordova.exec(null, null, "Melon", "hideLoadingView", []);
    };

})(jMelon);

/*******************************************************************************
 * * 移动内置计费相关
 ******************************************************************************/
(function($) {
    $.plugin.mmbilling = {};
    /**
     * @params code - 计费点代码
     * 
     * @retval 无
     */
    $.plugin.mmbilling.pay = function(code, success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function(msg) {
            cordova.exec(function() {
                if ($.isFunction(success))
                    success.apply(delegate, arguments);
            }, function() {
                if ($.isFunction(fail))
                    fail.apply(delegate, arguments);
            }, 'MelonMMBilling', 'pay', [ code ]);
        }, function() {
        }, 'MelonMMBilling', 'init', []);
    };
})(jMelon);

/*******************************************************************************
 * * 支付宝相关相关
 ******************************************************************************/
(function($) {
    $.plugin.alipay = {};
    /**
     * 支付接口
     * 
     * @params subject - 标题 body - 内容 fee - 金额（如2.50),单位元
     * 
     * @retval 无
     */
    $.plugin.alipay.pay = function(subject, body, fee, success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonAlipay', 'pay', [ subject, body, fee ]);
    };
})(jMelon);

/*******************************************************************************
 * * 新浪微博相关
 ******************************************************************************/
(function($) {
    $.plugin.sinaweibo = {};
    /**
     * 微博登陆
     * 
     * @prams 无
     * 
     * @retval 无(提示信息)
     */
    $.plugin.sinaweibo.login = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function(err) {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonSinaWeibo', 'login', []);
    };
    /**
     * 微博登出
     * 
     * @prams 无
     * 
     * @retval 无(提示信息)
     */
    $.plugin.sinaweibo.logout = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonSinaWeibo', 'logout', []);
    };
    /**
     * 微博函数调用
     * 
     * @prams url - 查看微博文档 method - 'POST'或者'GET' params - 参数
     * 
     * @retval 微博文档
     */
    $.plugin.sinaweibo.callFunc = function(url, method, params, success, fail,
            delegate) {
        if (!$.settings.isPhoneGap)
            return;

        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonSinaWeibo', 'callFunc', [ url, method, params ]);
    };
})(jMelon);

/*******************************************************************************
 * * QQ相关
 ******************************************************************************/
(function($) {
    $.plugin.qq = {};
    /**
     * QQ登陆
     * 
     * @prams 无
     * 
     * @retval 无(提示信息)
     */
    $.plugin.qq.login = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonQQConnect', 'login', []);
    };
    /**
     * QQ登出
     * 
     * @prams 无
     * 
     * @retval 无(提示信息)
     */
    $.plugin.qq.logout = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonQQConnect', 'logout', []);
    };
    /**
     * QQ获取用户信息
     * 
     * @prams 无
     * 
     * @retval 参见QQ文档
     */
    $.plugin.qq.getUserInfo = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonQQConnect', 'getUserInfo', []);
    };
    /**
     * QZone 分享
     * 
     * @prams title - 标题 comment - 备注 summary - 简介 imageUrl - 图片 url - 详细内容的url
     * 
     * @retval 参见QQ文档
     */
    $.plugin.qq.addShare = function(title, comment, summary, imageUrl, url,
            success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonQQConnect', 'addShare', [ title, comment, summary, imageUrl,
                url ]);
    };
    /**
     * QZone 添加发言
     * 
     * @prams title - 标题 content - 发言
     * 
     * @retval 参见QQ文档
     */
    $.plugin.qq.addBlog = function(title, content, success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonQQConnect', 'addBlog', [ title, content ]);
    };
})(jMelon);

/*******************************************************************************
 * * 微信相关
 ******************************************************************************/
(function($) {
    $.plugin.weixin = {};
    $.plugin.weixin.SESSION = 0;
    $.plugin.weixin.TIMELINE = 1;

    /**
     * 微信注册
     * 
     * @prams 无
     * 
     * @retval 无(提示信息)
     */
    $.plugin.weixin.regist = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonWeiXin', 'regist', []);
    };
    /**
     * 微信取消注册
     * 
     * @prams 无
     * 
     * @retval 无(提示信息)
     */
    $.plugin.weixin.unregist = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonWeiXin', 'unregist', []);
    };
    /**
     * 微信认证
     * 
     * @prams 无
     * 
     * @retval {userName ：“”，token ：“”} "出错了:……"
     */
    $.plugin.weixin.login = function(success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonWeiXin', 'login', []);
    };
    /**
     * 发送文本
     * 
     * @prams text - 文本内容 scene - 场景
     * 
     * @retval 无(提示信息)
     */
    $.plugin.weixin.sendText = function(text, scene, success, fail, delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonWeiXin', 'sendText', [ text, scene ]);
    };
    /**
     * 发送图片
     * 
     * @prams image - 图片路径 title - 标题 scene - 场景
     * 
     * @retval 无(提示信息)
     */
    $.plugin.weixin.sendImage = function(image, title, scene, success, fail,
            delegate) {
        if (!$.settings.isPhoneGap)
            return;
        cordova.exec(function() {
            if ($.isFunction(success))
                success.apply(delegate, arguments);
        }, function() {
            if ($.isFunction(fail))
                fail.apply(delegate, arguments);
        }, 'MelonWeiXin', 'sendImage', [ image, title, scene ]);
    };
})(jMelon);
