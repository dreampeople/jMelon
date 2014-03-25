(function($) {

$.phone.softPan = false;
$.phone.level=10;
$.phone.showChooseServer=false;
$.phone.versioncode='1';
$.phone.versionname='1.0';
$.phone.uuid = '123460'; 
$.phone.deviceName = '';
$.phone.devicePlatform = '';
$.phone.deviceVersion = '';

$.phone.application = null;

var $document = $(window.document);
var $window = $(window);
var $container = null;

var cssStyle = null; //全局css

//调用事件回调
//pageinit pagepreshow pageshow pagehide
//pageinit 和 pagepreshow 的关系,init函数第一次会触发,后面在现实前会触发preshow

//就绪后初始化
$(function() {

	var e = $document.find('jMelonPhone','id');
	if(e) {
		$container = new $.ui.Frame(e.tagName,e);
	} else {
		$container = new $.ui.Frame('body',document.body);
	}
	$.phone.body = $container;

	function doOK() {
		//创建全局css
		if(document.createStyleSheet) {
			cssStyle = document.createStyleSheet();
		} else {
			cssStyle = document.createElement('style');
			cssStyle.type = 'text/css';
			document.getElementsByTagName('head').item(0).appendChild(cssStyle);
		}

		if($.settings.isPhoneGap) {
			$.phone.uuid = device.uuid;
			$.phone.enable3D = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
			$.phone.deviceName = device.name;
			$.phone.devicePlatform = device.platform;
			$.phone.deviceVersion = device.version;
			if(device.platform.substr(0,7) === 'Android') {
				$.phone.phoneType = $.phone.ANDROID;
				if(device.version < '3.0') {
					$.phone.enable3D = true;
					$.phone.body.addClass('android');
				} else {
					$.phone.body.addClass('android');
				}
			} else if(device.platform.substr(0,6) === 'iPhone') {
				$.phone.phoneType = $.phone.IOS;
				$.phone.body.addClass('ios');
			} else if(device.platform.substr(0,4) === 'iPad') {
				$.phone.phoneType = $.phone.IOS;
				$.phone.body.addClass('ios');
			} else if(device.platform.substr(0,4) === 'iOS') {
				$.phone.phoneType = $.phone.IOS;
				$.phone.body.addClass('ios');
			} else {
				$.phone.body.addClass($.phone.phoneClass);
			}

			if($.phone.application && $.isFunction($.phone.application.onPause)) {
				$document.bind("pause", function() {
					$.phone.application.onPause();
				},false);
			}
			if($.phone.application && $.isFunction($.phone.application.onResume)) {
				$document.bind("resume", function() {
					$.phone.application.onResume();
				},false);
			}
			if($.phone.application && $.isFunction($.phone.application.onOnline)) {
				$document.bind("online", function() {
					$.phone.application.onOnline();
				},false);
			}
			if($.phone.application && $.isFunction($.phone.application.onOffline)) {
				$document.bind("offline", function() {
					$.phone.application.onOffline();
				},false);
			}
//			$document.bind("backbutton",$.phone.back,false);
			$document.bind("backbutton",function() {},false);
		} else {
			$.phone.body.addClass($.phone.phoneClass);
		}
		if(!$.settings.isPhoneGap && window.innerHeight == 0) return setTimeout(doOK,100);
		/*启动时调用*/
		$.phone.resize(function() {
			if($.phone.enable3D) $.phone.body.addClass('e3d');
			if($.phone.application && $.isFunction($.phone.application.onInit)) {
				$.phone.application.onInit();
			}
		});
		/*以后当尺寸发生变化时调用*/
		document.body.onresize = function() {
			$.phone.resize();
			if($.phone.application && $.isFunction($.phone.application.onResize)) {
				$.phone.application.onResize();
			}
		};
	}

	if($.settings.isPhoneGap) {
		if($.settings.isCore) doOK();
		else $document.bind("deviceready", doOK);
	} else {
		doOK();
	}
});

/*touch 事件处理对象*/
$.phone.touchIntf = getTouchIntf();

/**
 * 继承page对象
 */
$.phone.extendPage = function() {
	var page = function(pageName) {
		$.ui.Page.call(this,pageName);
	}
	for(var k in $.ui.Page.prototype) {
		page.prototype[k] = $.ui.Page.prototype[k];
	}
	return page;
};

/**
 * 判断是否在线
 */
$.phone.isOnline = function() {
	if(!$.settings.isPhoneGap) return 1;

	var networkState = navigator.connection.type;

	switch(networkState) {
	case Connection.ETHERNET:
	case Connection.WIFI:
		return 1;

	case Connection.CELL_2G:
	case Connection.CELL_3G:
	case Connection.CELL_4G:
	case Connection.CELL:
		return 2;

	case Connection.NONE:
	case Connection.UNKNOWN:
	default:
		return 0;
	}
};
/**
 * 大小变化时调用
 */
$.phone.resize = function(callback) {
	if($.settings.isPhoneGap) {
		$.plugin.getStartData(function(retVal) {
			$.phone.bodySize = {width: retVal.width,height: retVal.height};
			if(retVal.level != undefined) {
				$.phone.level = retVal.level;
			}
			if(retVal.showChooseServer != undefined) {
				$.phone.showChooseServer = retVal.showChooseServer;
			}
			if(retVal.versioncode != undefined) {
				$.phone.versioncode = retVal.versioncode;
			}
			if(retVal.versionname != undefined) {
				$.phone.versionname = retVal.versionname;
			}
			cssStyle.innerHTML = 'body > div.page { width: ' + $.phone.bodySize.width + 'px;' + 
											'height: ' + $.phone.bodySize.height + 'px;}';
			if(callback) callback();
		});
	} else {
		$.phone.bodySize = {width: window.innerWidth,height: window.innerHeight};
		var container = $document.find('jMelonPhoneContainer','id');
		if(container) {
			container.style.width = $.phone.bodySize.width + 'px';
			container.style.height = $.phone.bodySize.height + 'px';
		}
		if(callback) callback();
	}
};
/**
 * 转场动画
 */
$.phone.transform = function(oldPage,page,transformName,reverse,callback) {
	if(oldPage == page || page == null) return;

	if(reverse == undefined) reverse = false;
	if(transformName == undefined) transformName = 'slide';

	var transform = $.transformFuncs[transformName];
	if(!$.settings.useAnim || transformName === 'show' || oldPage == null || !$.isFunction(transform)) {
		page.show();
		if(oldPage != null) {
			$.util.afterRender(function() {
				oldPage.hide();
				if($.isFunction(callback)) $.util.afterRender(callback);
			});
		} else {
			if($.isFunction(callback)) $.util.afterRender(callback);
		}
		return;
	}

	transform(oldPage,page,reverse,0,callback);
};

var pageFuncArray = new Array('getPage','setRootPage','removePage','pushPage','popPage','popToRoot','popToPage','setBack','clearBack','popBack','back','getCurrentPage','getPopPage','changePage');
for(var i=0;i<pageFuncArray.length;i++) {
	var k = pageFuncArray[i];
	(function(k,idx) {
		$.phone[k] = function () {
			return $container[k].apply($container,arguments);
		};
	})(k,i);
}

/*和原来保持兼容*/
$.phone.addPage = function() {
	return $container.setRootPage.apply($container,arguments);
};

$.phone.setLoadingView = function() {
	if(window.loadingView) return;
	window.loadingView = $.phone.makeLoadingView();
	$container.append(window.loadingView);
};
$.phone.showModalView = function() {
	if($.phone.modalView) return;
	$.phone.modalView = $('div',{id: 'modal-view'});
	$container.append($.phone.modalView);
	$.phone.modalView.backIdx = backStack.length;
};
$.phone.showLoadingView = function(title,msg) {
	if(!$.settings.isPhoneGap) {
		this.showModalView();
		this.modalView.append($('div',null,null,'modal-view-back'));
		this.modalView.loading = this.modalView.append($.phone.makeLoadingView());
	} else {
		$.plugin.showLoadingView(title,msg);
	}
};
$.phone.hideLoadingView = function() {
	if(!$.settings.isPhoneGap) {
		$.phone.closeModalView();
	} else {
		$.plugin.hideLoadingView();
	}
};
$.phone.closeModalView = function() {
	if(!$.phone.modalView) return;
	if($.isFunction($.phone.modalView.cbFunction)) {
		$.phone.modalView.cbFunction();
		$.phone.modalView.cbFunction = null
	}
	$.phone.modalView.remove();
	$.phone.modalView = null;
};
$.phone.showMessageView = function(message,timeout,cbFunction) {
	if(!$.settings.isPhoneGap) {
		this.showModalView();
		this.modalView.append($('div',null,null,'modal-view-back',message));
	} else {
		$.plugin.showToast(message);
	}
	if(!timeout) timeout = 1000;
	setTimeout(function() {
		if(!$.settings.isPhoneGap) $.phone.closeModalView();
		if($.isFunction(cbFunction)) cbFunction();
		cbFunction = null;
	},timeout);
};
$.phone.makeLoadingView = function() {
	return $('div',null,null,'loading-spinner','<span class="loading-top"></span>'
				+ '<span class="loading-right"></span>'
				+ '<span class="loading-bottom"></span>'
				+ '<span class="loading-left"></span>');
};

})(jMelon);
