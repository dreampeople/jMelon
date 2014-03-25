(function($) {

$.ui = {};

/**
 * Page
 */
var Page = $.getWidgetClass(function(pageName) {
	this.pageName = pageName;
	this.init('div');
	this.addClass('page');
	if(pageName) this.attr('id',pageName);
	//this.css({width:$.phone.bodySize.width,height: $.phone.bodySize.height});
	this.content = this.append($('div',null,null,'content'));
	this.isFirst = true;
	this.pageInited = false;

	if($.isFunction(this.initialize)) {
		this.initialize();
	}
});
Page.prototype.showNavbar = function(title) {
	if(this.navbar) return;
	this.navbar = new $.ui.NavBar(title);
	this.prepend(this.navbar);

	this.addClass('has-navbar');
	return this;
};
Page.prototype.showTabbar = function(hasSelected) {
	if(!this.tabbar) {
		this.tabbar = new $.ui.TabBar(hasSelected);
		this.append(this.tabbar);
	} else {
		this.tabbar.show();
	}
	this.addClass('has-tabbar');
	return this;
}
Page.prototype.hideTabbar = function(animate) {
	if(!this.tabbar) return;
	this.tabbar.hide();
	this.removeClass('has-tabbar');
	return this;
}
Page.prototype.showNetworkToast = function(flag) {
	if (!this.toastExist) {
		var toast = new $.ui.Toast(2);
		if(!flag){
			toast.css({'top': '46px'});
		}
		this.append(toast);
		this.toastExist = true;
		var that = this;
		setTimeout(function() {
			toast.remove();
			that.toastExist = false;
		}, 3000);
	}
};

Page.prototype.enableSwipeLeft = function(pageName) {
	var swipeLeft = null;
	if($.isString(pageName)) {
		swipeLeft = function() {
			$.phone.pushPage($.phone.getPage(pageName));
		}
	} else if($.isFunction(pageName)) {
		swipeLeft = pageName;
	} else {
		return;
	}
	if(this.content.dragObj) {
		var intf = this.content.dragObj.getIntf();
		intf.swipeLeft = swipeLeft;
	} else {
		this.content.live('swipeLeft',swipeLeft,this);
	}
}
Page.prototype.enableSwipeBack = function(callback) {
	var swipeRight = null;
	if($.isFunction(callback)) {
		swipeRight = callback;
	} else {
		swipeRight = $.phone.back;
	}
	if(this.content.dragObj) {
		var intf = this.content.dragObj.getIntf();
		intf.swipeRight = swipeRight;
		if(!intf.delegate) intf.delegate = this;
	} else {
		this.content.live('swipeRight',swipeRight,this);
	}
}
Page.prototype.enableDragLeft = function(pageName) {
	var dragLeft = null;
	if($.isString(pageName)) {
		dragLeft = function() {
			$.phone.pushPage($.phone.getPage(pageName));
		}
	} else if($.isFunction(pageName)) {
		dragLeft = pageName;
	} else {
		return;
	}
	if(this.content.dragObj) {
		var intf = this.content.dragObj.getIntf();
		intf.dragLeft = dragLeft;
	} else {
		this.content.live('dragLeft',dragLeft,this);
	}
}
Page.prototype.enableDragBack = function(callback) {
	var dragRight = null;
	if($.isFunction(callback)) {
		dragRight = callback;
	} else {
		dragRight = $.phone.back;
	}
	if(this.content.dragObj) {
		var intf = this.content.dragObj.getIntf();
		intf.dragRight = dragRight;
		if(!intf.delegate) intf.delegate = this;
	} else {
		this.content.live('dragRight',dragRight,this);
	}
}
$.ui.Page = Page;

})(jMelon);
