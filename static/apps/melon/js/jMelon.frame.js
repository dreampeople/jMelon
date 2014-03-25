(function($) {
/**
 * Page
 */
var Frame = $.getWidgetClass(function(name,e) {
	if(name) this.frameName = name;

	if(e) {
		this.init(e);
		this.e = e;
		this.isRootFrame = true; //是否是body节点
	} else {
		this.init('div');
		this.isRootFrame = false; //是否是body节点
	}

	this.pageStack = []; //内存中的page栈
	this.backStack = []; //内存中的page栈

	if($.isFunction(this.initialize)) this.initialize();
});
/**
 * 对于页面的转场
 */
Frame.prototype.transformPage = function(oldPage,page,transformName,reverse) {
	function pageInited() {
		$.phone.inTransform = true; //标记当前在转场动画中

		if(reverse) $.notification.send('pageHide',oldPage); //发送page返回的notification

		$.phone.transform(oldPage,page,transformName,reverse,function() {
			if(page.resizeSoftPan && !$.phone.softPan) $.plugin.setWindowSoftAdjustResize();

			oldPage.evtCall('pageHide');

			//如果自动删除
			if(oldPage && oldPage.isBack && oldPage.autoRemove) $.phone.removePage(oldPage);

			if(!page.resizeSoftPan && $.phone.softPan){
				$.plugin.setWindowSoftAdjustPan();
			}
			page.evtCall('pageShow');
			page.isFirst = false;
			$.phone.inTransform = false;
		});
	}
	$.blur();
	oldPage.evtCall('pageHideBefore');
	if(page.isFirst && !page.pageInited) {
		page.evtCall('pageInit');
		page.pageInited = true;
		$.util.afterRender(pageInited);
	} else {
		page.evtCall('pageShowBefore');
		pageInited();
	}
};
/**
 * 获取一个page
 */
Frame.prototype.getPage = function(page) {
	if(!page.parent) this.append(page);

	if(page.autoRemove !== false) page.autoRemove = true;
	else page.autoRemove = false;

	return page;
};
/**
 * 增加一个page
 */
Frame.prototype.setRootPage = function(page) {
	var page = this.getPage(page);
	if(this.pageStack.length >= 1) {
		page.hide();
		return;
	}

	this.pageStack.push(page);
	page.evtCall('pageInit');
	
	$.util.afterRender(function() {
		page.evtCall('pageShow');
		page.isFirst = false;
	});

	return page;
};
/**
 * 删除一个页面
 */
Frame.prototype.removePage = function(page) {
	page.evtCall('pageRemove');
	page.remove();
};
Frame.prototype.changePage = function(page,transformName,reverse) {
	var page = this.getPage(page);
	if(!page) return;

	var lastPage = this.pageStack.pop();
	if(lastPage) lastPage.isBack = true;

	this.pageStack.push(page);

	this.transformPage(lastPage,page,transformName,reverse);
};

/**
 * 推入一个页
 */
Frame.prototype.pushPage = function(page,transformName) {
	var page = this.getPage(page);
	if(!page) return;

	//如果已经有页面在堆栈中,则改页面隐藏
	if(this.pageStack.length > 0) page.hide();

	var lastPage = null;
	if(this.pageStack.length > 0) {
		lastPage = this.pageStack[this.pageStack.length - 1];
		lastPage.isBack = false;
	}

	this.pageStack.push(page);
	page.isBack = false;

	this.transformPage(lastPage,page,transformName,false);
	if(transformName) {
		this.setBack(function() { this.popPage(transformName); });
	} else {
		this.setBack(this.popPage);
	}
};
/**
 * 弹出一个页
 * noAnim - 是否不要动画
 */
Frame.prototype.popPage = function(transformName,noAnim) {
	if(this.pageStack.length <= 1) return false;
	var lastPage = this.pageStack[this.pageStack.length - 1];

	//如果当前页不允许隐藏,则返回
	if(lastPage.evtCall('canPageHide') === false) return false;

	this.pageStack.pop();
	var page = this.pageStack[this.pageStack.length - 1];
	page.isBack = true;
	lastPage.isBack = true;

	if(!noAnim) {
		this.transformPage(lastPage,page,transformName,true);
		return true;
	}

	if(lastPage.autoRemove) {
		this.removePage(lastPage);
		return true;
	}

	lastPage.hide();

	return true;
};

Frame.prototype.popToRoot = function() {

	//弹出所页面
	while(this.popPage(null,true)) {}

	var mainPage = this.pageStack[0];
	mainPage.moveTo(0,0);
	mainPage.show();
	this.clearBack();
};

Frame.prototype.popToPage = function(page){
	var len = this.pageStack.length-1;
	for(var index=0; index<len; index++){
		this.popPage(null, true);
	}
	var mainPage = this.pageStack[0];
	mainPage.moveTo(0,0);
	mainPage.show();
	this.pushPage(page);
	this.clearBack(1);
};

/**
 * 设置返回
 */
Frame.prototype.setBack = function(back) {

	if(!$.isFunction(back)) return;

	this.backStack.push(back);
};
Frame.prototype.canBack = function() {
	if(this.pageStack.length <= 1) return false;
	return true;
};
/**
 * 清除返回
 */
Frame.prototype.clearBack = function(size) {
	if(!$.isNumber(size)) {
		size = 0;
	} else if(this.backStack.length < size || size < 0) {
		size = 0;
	}
	this.backStack.splice(size);
};
Frame.prototype.popBack = function() {

	if(this.backStack.length <= 0) return;
	return this.backStack.pop();
};
/**
 * 返回键
 */
Frame.prototype.back = function(size) {
	
	if($.phone.inTransform) return;
	
	if(!$.isNumber(size)) size = 0;
	if(this.backStack.length < size || size < 0) return;
	
	if(size == 0) { //返回一层，缺省执行
		if(this.backStack.length <= 0) {
			if(!this.isRootFrame) return;
			if(!$.phone.application) return;
			if(!$.isFunction($.phone.application.onExit)) return; 

			$.phone.application.onExit();
			return;
		}

		var lastBack = this.backStack.pop();
		if(lastBack == undefined) return this.back();

		//如果不是返回函数返回false，则不执行
		if(lastBack.call(this) === false) this.backStack.push(lastBack);
		return;
	}

	var topPage = this.pageStack.pop();
	var topBack = this.backStack.pop();
	for(var i=0;i<size;i++) {
		var page = this.pageStack.pop();
		if(page.autoRemove) this.removePage(page);		
		this.backStack.pop();
	}
		
	this.backStack.push(topBack);
	this.pageStack.push(topPage);
	return this.back();
};
Frame.prototype.getCurrentPage = function() {
	if(this.pageStack.length <= 0) return null;
	return this.pageStack[this.pageStack.length - 1];
};
Frame.prototype.getPopPage = function() {
	if(this.pageStack.length <= 1) return null;
	return this.pageStack[this.pageStack.length - 2];
};
$.ui.Frame = Frame;

$.extend({
	getFrame : function(name,frameClass) {
		var frame = null;
		if(name === undefined) {
			if(this.currentFrame === null|| this.currentFrame === undefined) return null;
			return this.frames[this.currentFrame];
		}
		if(!this.frames || !(name in this.frames)) {
			frame = this.addFrame(name,frameClass);
		} else {
			frame = this.frames[name];
		}
		return frame;
	},
	addFrame : function(name,frameClass) {
		if(!this.frames) {
			this.frames = {};
			this.currentFrame = null;
		}
		if(name in this.frames) return this.frames[name];

		if(frameClass === undefined) frameClass = Frame;

		var frame = new frameClass(name);
		if(frame.classNames.length == 0) frame.addClass('frame');
		this.append(frame);
		this.frames[name] = frame;

		if($.isFunction(frame.frameInit)) frame.frameInit();
		return frame;
	},
	showFrame : function(name,transformName,reverse,cbFunction) {
		if(!this.frames || !(name in this.frames)) return;
		if(!transformName) transformName = 'show';

		var oldFrame = null;
		if(this.currentFrame !== null)
			oldFrame = this.frames[this.currentFrame];

		var frame = this.frames[name];
		if(oldFrame == frame) {
			if($.isFunction(frame.frameShow)) frame.frameShow();
			return;
		}
		var that = this;
		$.phone.transform(oldFrame,frame,transformName,reverse,function() {
			that.currentFrame = name;

			if($.isFunction(frame.frameShow)) frame.frameShow();
			if(oldFrame && $.isFunction(oldFrame.frameHide)) oldFrame.frameHide();

			if($.isFunction(cbFunction)) cbFunction(frame,oldFrame);
		});
		return this;
	}
});

})(jMelon);
