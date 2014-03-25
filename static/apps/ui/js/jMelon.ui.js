(function($) {

var Panel = $.getWidgetClass(function(label,className) {
	this.init();
	if(className) this.addClass(className);
	if(label) {
		if($.isString(label)) this.html(label);
		else this.append(label);
	}
});
$.ui.Panel = Panel;

var Button = $.getWidgetClass(function(label,className) {
	this.init();
	this.setClass('ui-button');
	if(className) this.addClass(className);
	if(label) {
		if($.isString(label)) this.html(label);
		else this.append(label);
	}

	this.callback = null;
	this.buttonStyle = true;
	this.enableDown = true;
	this.live('click',this.onClick,this);
});
Button.prototype.setOnClick = function(callback,delegate) {
	if(!$.isFunction(callback)) return;
	this.callback = callback;
	this.delegate = delegate;
}
Button.prototype.onClick = function(btn) {
	if(!this.callback) return;
	this.callback.call(this.delegate,btn);
}
Button.prototype.setDisabled = function(flag) {
	if (flag) {
		this.buttonStyle = false;
		this.enableDown = false;
		this.css({'background-image':'url(' + $.settings.staticDir + '/images/btn_d.png)','color': '#000000'});
		this.live('click',function(){console.log('disabled');},this);
	} else {
		this.buttonStyle = true;
		this.enableDown = true;
		this.css({'background-image':'url(' + $.settings.staticDir + '/images/btn.png)','color': '#FFFFFF'});
		this.removeClass('down');
		this.live('click',this.onClick,this);
	}
}
Button.prototype.setEnabled = function(flag) {
	if(flag){
		this.buttonStyle = true;
		this.enableDown = true;
		this.removeClass("disabled");
		this.live('click',this.onClick,this);
	}else{
		this.buttonStyle = false;
		this.enableDown = false;
		this.addClass("disabled");
		this.live('click',function(){console.log('disabled');},this);
	}
}
$.ui.Button = Button;

/**
 * checkbox
 */
var CheckBox = $.getWidgetClass(function(label,className) {
	this.init();
	this.setClass('ui-checkbox');
	this.checked = false;
	if(className) this.addClass(className);
	if(label) {
		if($.isString(label)) this.html(label);
		else this.append(label);
	}

	this.live('click',this.onClick,this);
});
CheckBox.prototype.setOnClick = function(callback, delegate){
	if(!$.isFunction(callback)) return;
	this.callback = callback;
	this.delegate = delegate;
}
CheckBox.prototype.onClick = function(checkBox) {
	this.setCheck(!this.checked);
	if($.isFunction(this.callback))
		this.callback.call(this.delegate,checkBox);
}
CheckBox.prototype.setCheck = function(flag) {
	if(this.checked == flag) return;
	if(flag) {
		this.checked = true;
		this.addClass('checked');
	} else {
		this.checked = false;
		this.removeClass('checked');
	}
}
CheckBox.prototype.getCheck = function() {
	return this.checked;
}
$.ui.CheckBox = CheckBox;

/**
 * Switch
 */
var Switch = $.getWidgetClass(function(className,noTrans) {
	this.init();
	this.setClass('ui-switch');
	if(className) this.addClass(className);
	
	if(noTrans) {
		this.useNoTrans = true;
	}
	
	this.mHandle = this.append($('div',null,null,'ui-switch-handle'));
	this.mLabelOn = this.mHandle.append($('div',null,null,'ui-switch-label ui-switch-label-on','on'));
	this.mLabelOff = this.mHandle.append($('div',null,null,'ui-switch-label ui-switch-label-off','off'));
	this.mHandle.canMoveLeft = true;
	this.mHandle.canMoveRight = true;
	this.on = true;
	this.mLabelOn.x = -30;
	this.mLabelOff.x = 30;
	this.realW = 30;
	this.mLabelOn.update();
	this.mLabelOff.update();

	this.mChanged = null;
	this.mHandle.live('begin',this.begin,this);
	this.mHandle.live('moving',this.moving,this);
	this.mHandle.live('click', this.onClick,this);
	this.mHandle.live('end',this.end,this);
});
Switch.prototype.setChanged = function(callback,delegate) {
	if($.isFunction(callback)){
	this.mChanged = callback;
		this.mDelegate = delegate;
	}
}
Switch.prototype.begin = function() {
	var switchW = this.width();
	var lockW = this.mHandle.width();
	this.realW = switchW - lockW;
}
Switch.prototype.moving = function() {
	var x = $.phone.touchIntf.moveDistance.x;
	this.mHandle.x += x;
	if(this.mHandle.x < 0){
		this.mHandle.x = 0;
	}
	if(this.mHandle.x > this.realW){
		this.mHandle.x = this.realW;
	}
	this.mHandle.update();
}
Switch.prototype.end = function() {
	var trueX = this.realW / 2;
	if(this.mHandle.x < trueX){
		this.mHandle.x = 0
		this.on = false;
	}else{
		this.mHandle.x = this.realW;
		this.on = true;
	}
	this.mHandle.update();
	if(this.mChanged) this.mChanged.call(this.mDelegate,this.on);
}
Switch.prototype.onClick = function() {
	if(!this.on){
		this.mHandle.x = this.realW;
		this.on = true;
	}else{
		this.mHandle.x = 0;
		this.on = false;
	}
	this.mHandle.update();
}
Switch.prototype.setOn = function(on) {
	if(typeof(on) === "undefined"){
		on = true;
	}
	this.on = on;
	if(!this.on){
		this.mHandle.x = 0;
	}else{
		this.mHandle.x = this.realW;
	}
	this.mHandle.update();
}
Switch.prototype.isOn = function() {
	return this.on;
}
$.ui.Switch = Switch;

/**
 *
 */
var Segment = $.getWidgetClass(function(className,num) {
	this.init();
	this.setClass('ui-segment');
	if(className) this.addClass(className);

	this.selectedIdx = -1;
	if(num === undefined) num = 0;
	for(var i=0;i<num;i++) {
		var button = this.append($('div',null,null,'seg-button'));
		button.live('click', this.onClick,this);
	}
	this.children = [];
});
Segment.prototype.setCallback = function(callback,delegate) {
	this.mCallback = callback;
	this.mDelegate = delegate;
}
Segment.prototype.onClick = function(button) {
	if(button.idx === this.selectedIdx) return;

	var oldBtn = null;
	if(this.selectedIdx >= 0) {
		oldBtn = this.children[this.selectedIdx];
		oldBtn.removeClass('selected');
	}
	this.children[button.idx].addClass('selected');

	if(this.mCallback) {
		this.mCallback.call(this.mDelegate,button,oldBtn);
	}

	this.selectedIdx = button.idx;
}
Segment.prototype.addButton = function(button) {
	if(!button) button = $('div',null,null,'seg-button');

	button = this.append(button);
    button.live('click', this.onClick,this);
	button.idx = this.children.length - 1;
	return button;
}
Segment.prototype.setSelected = function(idx) {
	if(idx < 0 || idx >= this.children.length) return;
	if(idx === this.selectedIdx) return;

	this.onClick(this.children[idx]);
}
Segment.prototype.getSelected = function(idx) {
	return this.selectedIdx;
}
$.ui.Segment = Segment;

var NavBar = $.getWidgetClass(function(title) {
	this.init('div');
	this.setClass('navbar');

	this.titleDiv = this.append($('div',null,null,'title'));
	this.leftDiv = this.append($('div',null,null,'left'));
	this.rightDiv = this.append($('div',null,null,'right'));

	if($.isString(title)) this.title = $('h1',null,null,null,title);
	else if(title) this.title = title;

	if(this.title) this.titleDiv.append(this.title);

	return this;
});
NavBar.prototype.addLeftBtn = function(title,callback,delegate) {
	var leftBtn = new $.ui.Button(title,'navbtn');
	if($.isString(title) && title.length > 0) leftBtn.addClass('text');
	else leftBtn.addClass('img');
	if($.isFunction(callback)) leftBtn.setOnClick(callback,delegate);
	return this.leftDiv.append(leftBtn);
};
NavBar.prototype.addRightBtn = function(title,callback,delegate) {
	var rightBtn = new $.ui.Button(title,'navbtn');
	if($.isString(title) && title.length > 0) rightBtn.addClass('text');
	else rightBtn.addClass('img');
	if($.isFunction(callback)) rightBtn.setOnClick(callback,delegate);
	return this.rightDiv.append(rightBtn);
};
NavBar.prototype.setBackBtn = function(title,callback,delegate) {
	//if($.phone.phoneType != 1) return;

	if(this.backBtn) return;

	this.backBtn = new $.ui.Button(title,['navbtn','back']);
	this.backBtn.append($('img',{src: $.settings.staticDir + '/images/title_left_icon.png'}));
	this.leftDiv.prepend(this.backBtn);

	if(!$.isFunction(callback)) {
		if(delegate && delegate.back) {
			callback = delegate.back;
		} else {
			callback = $.phone.back;
		}
	}

	this.backBtn.setOnClick(callback,delegate);

	return this.backBtn;
};
$.ui.NavBar = NavBar;

var TabBar = $.getWidgetClass(function(hasSelected) {
	this.init();
	this.setClass('tabbar');
	if(hasSelected) {
		this.selectedBtn = this.tabbar.append($('div',null,null,'selectedBtn'));
	} else {
		this.selectedBtn = null;
	}
	this.buttons = [];
	this.currentBtn = null;

	return this;
});
TabBar.prototype.makeTabBtn = function(img,text) {
	var btn = $('div');
	var _img_  = null;
	if(img == undefined) {
	} else if($.isString(img)) {
		//_img_ = $('div',null,{ '-webkit-mask': 'url(' + img + ')'},'img');
		_img_ = $('div',null,{ 'background-image': 'url(' + img + ')'},'img');
	} else {
		_img_ = img;
	}
	btn.img = btn.append(_img_);
	btn.text = btn.append($('span',null,null,null,text));
	return btn;
};
TabBar.prototype.addTabBtn = function(btn,callback,delegate) {

	this.append(btn);
	btn.addClass('tabbtn');

	btn.callback = callback;
	btn.delegate = delegate;
	btn.idx = this.buttons.length;

	btn.setTabSelected = this.setTabSelected;

	btn.enableDown = true;
	btn.buttonStyle = true;
	btn.live('click', this.setTabSelected, btn);

	this.buttons.push(btn);
	var w = 20;
	var left = 10;
	var margin = 0;
	if(this.buttons.length <= 4) {
		w = 25;
		left = parseInt(100 / this.buttons.length) / 2;
		margin = left - 12.5;
	}

	if(this.selectedBtn != null) this.selectedBtn.css('width', w + '%');

	for(var idx=0;idx<this.buttons.length;idx ++) {
		var btn = this.buttons[idx];
		btn.css('width', w + '%');
		btn.css('left', (idx * left * 2 + margin) + '%');
		btn.leftStyle = (idx * left * 2 + margin) + '%';
	}

	return btn;
};
TabBar.prototype.setTabSelected = function(animate) {
	var tabbar = this.parent;
	var oldBtn = tabbar.currentBtn;

	if(oldBtn === this) {
		if($.isFunction(this.callback)) this.callback.call(this.delegate,this,this);
		return;
	}

	if(oldBtn != null) oldBtn.removeClass('selected');
	this.addClass('selected');

	tabbar.currentBtn = this;
	var selectedBtn = tabbar.selectedBtn;
	if(selectedBtn != null) {
		if(animate === false) {
			selectedBtn.css({'left':this.leftStyle},true);
		} else {
			selectedBtn.stop().animate({'left':this.css('left')},200);
		}
	}
	if($.isFunction(this.callback)) {
		for(var idx=0;idx < tabbar.buttons.length;idx ++) {
			if(tabbar.buttons[idx] === this) break;
		}
		this.callback.call(this.delegate,this,oldBtn);
	}
};
$.ui.TabBar = TabBar;

var BookBar = $.getWidgetClass(function(className) {
	this.init();
	this.setClass('bookbar');
	if(className) this.addClass(className);

	this.buttons = [];
	this.currentBtn = -1;
});
BookBar.prototype.addBookBtn = function(btn,cbFunction,delegate) {
	if(this.buttons.length >= 5) return null;
	this.append(btn);
	btn.enableDown = true;
	btn.addClass('bookbtn');
	btn.delegate = delegate;
	btn.cbFunction = cbFunction;
	btn.idx = this.buttons.length;
	btn.live('click',this.onSelected,this);

	this.buttons.push(btn);
	return this;
}
BookBar.prototype.onSelected = function(btn) {
	this.setSelected(btn.idx);
}
BookBar.prototype.setSelected = function(pos) {
	if(pos < 0 || pos >= this.buttons.length) return;

	var oldBtn = null;
	if(this.currentBtn >= 0) oldBtn = this.buttons[this.currentBtn];
	var btn = this.buttons[pos];
	var delegate = this;
	if(btn.delegate) delegate = btn.delegate;

	if(this.currentBtn === pos) {
		if($.isFunction(btn.cbFunction)) {
			return btn.cbFunction.call(delegate,btn,btn);
		}
	}
	if(oldBtn != null) oldBtn.removeClass('selected');
	btn.addClass('selected');

	this.currentBtn = pos;
	if($.isFunction(btn.cbFunction)) btn.cbFunction.call(delegate,btn,oldBtn);
}
$.ui.BookBar = BookBar;

/**
 * Slider
 */
var Slider = $.getWidgetClass(function(className,delegate,totalStep) {
	this.init();
	this.setClass('ui-slider');
	if(className && className != '') this.addClass(className);
	this.mCorner = this.append($('div',null,null,'ui-slider-corner'));
	this.mCorner.canMoveLeft = true;
	this.mCorner.canMoveRight = true;
	
	this.mCorner.live('begin',this.begin,this);
	this.mCorner.live('moving',this.moving,this);
	this.mCorner.live('end',this.end,this);
	
	this.delegate = delegate;
	if(totalStep) {
		this.totalStep = totalStep;
	} else {
		this.totalStep = 100;
	}
});
Slider.prototype.initStep = function(step) {
	var ratio = step / this.totalStep;
	var realW = this.width() - this.mCorner.width();
	this.mCorner.x = ratio * realW;
	this.mCorner.update();
}
Slider.prototype.begin = function() {
	var sliderW = this.width();
	var cornerW = this.mCorner.width();
	this.realW = sliderW - cornerW;
	if('stepBegin' in this.delegate && $.isFunction(this.delegate.stepBegin)) {
		this.delegate.stepBegin(this.step(this.mCorner.x));
	}
}
Slider.prototype.moving = function() {
	var x = $.phone.touchIntf.moveDistance.x;
	this.mCorner.x += x;
	if(this.mCorner.x < 0){
		this.mCorner.x = 0;
	}
	if(this.mCorner.x > this.realW){
		this.mCorner.x = this.realW;
	}
	this.mCorner.update();
	if('stepMoving' in this.delegate && $.isFunction(this.delegate.stepMoving)) {
		this.delegate.stepMoving(this.step(this.mCorner.x));
	}
}
Slider.prototype.end = function() {
	if('stepEnd' in this.delegate && $.isFunction(this.delegate.stepEnd)) {
		this.delegate.stepEnd(this.step(this.mCorner.x));
	}
}
Slider.prototype.step = function(cornerX){
	var step = Math.floor((cornerX / this.realW) * this.totalStep);
	return step;
}
Slider.prototype.autoMoving = function(ratio){
	var realW = this.width() - this.mCorner.width();
	this.mCorner.x = ratio * realW;
	this.mCorner.update();
}
$.ui.Slider = Slider;

/**
 * Swipe
 */
var Swipe = $.getWidgetClass(function(className, num, first) {
	this.init();
	this.setClass('ui-swipe');
	if(className && className != "") this.addClass(className);
	this.swipePages = this.append($('ol',null,null,'ui-swipe-pages'));
	for(var i=0; i<num; i++){
		this.swipePages.append($('li'));
	}
	if(!first) first = 0;
	this.setPage(first);
});
Swipe.prototype.setPage = function(num) {
	var dotLen = this.swipePages.children.length;
	for(var i=0; i<dotLen; i++){
		this.swipePages.children[i].setClass();
	}
	this.swipePages.children[num].setClass("ui-swipe-current");
}
$.ui.Swipe = Swipe;

/**
 * SlideBar
 */
var SlideBar = $.getWidgetClass(function(className) {
	this.init();
	this.setClass('slideBar');
	if(className) this.addClass(className);
	this.switcher=this.append($('div', null, null, 'switcher'));
	this.itemContainer=this.append($('div', null, null, 'slidItemContainer'));
	this.itemScrollView = this.itemContainer.append(new $.ui.ScrollView());
});
SlideBar.prototype.toggleItemContainer = function(){
	if(this.itemContainer.isShow){
		this.hideItemContainer();
	}else{
		this.showItemContainer();
	}
}
SlideBar.prototype.hideItemContainer = function(){
	if(!this.itemContainer.isShow) return;
	this.itemContainer.isShow=false;
	this.itemContainer.hide();
}
SlideBar.prototype.showItemContainer = function(){
	if(this.itemContainer.isShow) return;
	this.itemContainer.isShow=true;
	this.itemContainer.show();

}
SlideBar.prototype.isItemContainerShow = function(){
	return this.itemContainer.isShow;
}
SlideBar.prototype.setSlideSwitcher = function(item){
	this.switcher.remove();
	if($.isObject(item)){
		this.switcher=item;
	}else{
		this.switcher=$('div', null, null, 'item');
	}
	this.prepend(this.switcher);
	this.switcher.live('click', function() {
		this.toggleItemContainer();
	}, this);
}
SlideBar.prototype.addSlidItem = function(item, callback, delegate){
	var slideName=null;
	if($.isObject(item)){
		slideItem=item;
	}else if($.isString(item)){
		slideItem=$('div', null, null, 'slidItem', item);
	}
	this.itemScrollView.content.append(slideItem);
	slideItem.live('click', function(){
		this.hideItemContainer(true);
		callback.call(delegate);
	}, this);
}
$.ui.SlideBar = SlideBar;

var LoadingItem = $.getWidgetClass(function() {
	this.init();
	this.setClass('margin');
	this.canvas = this.append($('canvas',{width: 60,height: 40}));
	this.top = this.append($('div',null,null,'top','下拉即可刷新...'));
	
	this.val=1;
	this.flag=1;
});
LoadingItem.prototype.drawLoading = function(angle) {
	
	var w = 60,h = 40;
	var ctx = this.canvas.e.getContext('2d'); 
	ctx.clearRect(0 , 0, w, h);

	ctx.save();
	ctx.translate(30,20)

	ctx.rotate(-Math.PI/2);
	if(this.val==0){
		this.flag=1;
		ctx.rotate(Math.PI/4);
	}else if(this.val==178){
		this.flag=-1;
	}
	ctx.fillStyle='#664922';

	ctx.beginPath();
	ctx.moveTo(0, 0);	
	if(this.flag==1){
		this.val++;
		ctx.arc(0, 0, 9, -Math.PI/180*this.val, Math.PI/180*this.val, false);
	}else{
		this.val--;
		ctx.arc(0, 0, 9, -2*Math.PI/180*this.val, 2*Math.PI/180*this.val, false);
	}
	ctx.closePath();
	ctx.fill();

	ctx.restore();
};
LoadingItem.prototype.loading = function() {
	this.top.html('正在刷新...');
	this.canvas.animate(function(d,finished) {
		this.drawLoading(Math.PI/ 100 * d);
	},100000,null,null,null,this);
};

$.ui.LoadingItem = LoadingItem;

var Marquee = $.getWidgetClass(function(delegate) {
	this.init();
	this.setClass('marquee');
	this.items = [];
	this.itemClass=null;
	this.dx=1;
	this.dt=60;
	this.changeTime=1;
	this.mDatas = [];
	this.loadingItem = this.append(new LoadingItem());
	this.loadingItem.hide();
	this.mScroll=false;
	this.mDelegate = delegate;
	this.itemHeight = 24;
	this.canScroll = true;
	this.minLen = 0;
	this.mHeight=0;
});

Marquee.prototype.setDatas = function(datas){
	if(!datas && datas.length==0){
		return ;
	}
	var len=datas.length;
	for(var i=0;i<len;i++) {
		var data = datas[i];
		this.mDatas.push(data);
	}
	this.scroll();
};

Marquee.prototype.refresh = function(){
	if(this.mRefresh) return;
	this.mRefresh = true;
	if(!this.mScroll){
	this.loadingItem.show();
	this.loadingItem.loading();
	}
	
	this.getDatas({maxId: this.maxId},function(datas, itemClass, isOK) {
		this.loadingItem.hide();
		this.mRefresh = false;
		if(!isOK) return;
		this.itemClass=itemClass;
		this.setDatas(datas);
	},this);
};

Marquee.prototype.scroll = function(){
	if(this.mScroll)return;
	if(this.mDatas == null || this.mDatas.length == 0){
		return ;
	}
	
	this.minLen = this.mHeight/this.itemHeight;
	var len;
	var itemHeight=this.itemHeight;
	
	var dataLen = this.mDatas.length;
	if(dataLen<this.minLen){
		this.canScroll=false;
		len=dataLen;
	}else{
		len=Math.round(this.minLen)+1;
	}
	var dx=this.dx;
	var dt = this.dt;
	var time = 1;
	var index=1;
	var that=this;
	var items = this.items;
	var itemClass=this.itemClass;
	if(this.items.length == 0 || this.items.length < len){
		var itemCount = this.items.length;
		var lastItemCount = len-itemCount;
		for(var i=0; i<lastItemCount ; i++){
			if(itemClass){
				this.items[itemCount+i]=this.append(new itemClass());
			}else{
				this.items[itemCount+i]=this.append($('div',null,null,'item'));
			}
			this.items[itemCount+i].css('height', itemHeight);
			this.items[itemCount+i].css('line-height', itemHeight);
			this.items[itemCount+i].css('top', (itemCount+i)*itemHeight);
			this.items[itemCount+i].data=this.mDatas[itemCount+i];
			if(itemClass){
				this.getItem(this.items[itemCount+i]);
			}else{
				this.items[i].html(this.mDatas[itemCount+i]);
			}
			
		}
	}
	if(this.items.length<this.minLen){
		this.canScroll=false;
		return;
	}else{
		this.canScroll=true;
	}
	this.mScroll=true;
	
	var timeId = setInterval(function(){
		if(dx*index < itemHeight){
			for(var i=0; i<len; i++){
				var item = that.items[i];
				if($.phone.enable3D){
				item.css('-webkit-transform', 'translate3d(0px,-'+dx*index+'px,0px)');
				}else{
					item.css('-webkit-transform', 'translate(0px,-'+dx*index+'px)');
				}
				
			}
			index++;				
		}else{
			var item0 = that.items[0];
			index=1;
			for(var i=0; i<len-1; i++){
				that.items[i] = that.items[i+1];
			}
			that.items[len-1] = item0;
			
			for(var i=0; i<len; i++){
				that.items[i].css('-webkit-transform', null);
				that.items[i].css('top', i*itemHeight);
			}
			
			var datasLen = that.mDatas.length;

			if(time+len <= datasLen){
				that.items[len-1].data=that.mDatas[len+time-1];
				time++;
			}else if(time+len > datasLen){
				if(time+len == 2*datasLen){
					that.items[len-1].data=that.mDatas[datasLen-1];
					time=datasLen-len+1;
			}else{
					that.items[len-1].data=that.mDatas[len+time-1-datasLen];
				time++;
			}		
			}			
						
			if(that.itemClass){
				that.getItem(that.items[len-1]);
			}else{
				that.items[len-1].html(that.items[len-1].data);
			}		
			
		}
	}, dt);
};

$.ui.Marquee = Marquee;

/**
 * Toast
 * bee2c项目
 */
var Toast = $.getWidgetClass(function(type) {
	this.init();
	this.setClass('ui-toast');
	if(type == 1){
	this.append($('img', {src: $.settings.staticDir + '/images/function_tip_icon.png'}));
		this.append($('div', null, null, 'bigText', '功能正在建设中'));
		this.append($('div', null, null, 'smallText', '即将推出&nbsp;&nbsp;敬请期待'));
	}
	if(type == 2){
		this.append($('img', {src: $.settings.staticDir + '/images/warn.png'}));
		this.append($('div', null, null, 'bigText', '当前网络不可用'));
		this.append($('div', null, null, 'smallText', '请检查您的网络设置'));
	}
});
$.ui.Toast = Toast;

/**
 * SlideNav
 * bee2c项目
 */
var SlideNav = $.getWidgetClass(function(btnName, btnImg) {
	this.init();
	this.setClass('ui-slideNav');
	
	if(btnImg){
		this.btnImg = btnImg;
	}
	
	var btnNum = btnName.length,
		btn = null,
		btnW = $.phone.bodySize.width / 3.2,
		btnH = btnW * 48 /152;
		
	this.css('width', btnW * btnNum);
	if(btnNum === 2){
		this.css('background-image', 'url(' + $.settings.staticDir + 'images/tab_bg_2.png)');
	}else{
		this.css('background-image', 'url(' + $.settings.staticDir + '/images/tab_bg_3.png)');
	}
	
	var iconW = btnW /5,
		iconH = iconW * 25 / 32,
		iconSize = iconW + 'px ' + iconH + 'px';
	this.btns = [];
	for(var i in btnName){
		btn = $('div',null,{'width':btnW,'height':btnH},'tabBtn');
		btn.idx = i;
		if(i == 0){
			btn.addClass('selected');
		}
		if(btnImg){
			if(i == 0){
				btn.icon = $('div',null,{'background-image':btnImg[1], 'background-size':iconSize},'title',btnName[i]);
			}else{
				btn.icon = $('div',null,{'background-image':btnImg[i*2], 'background-size':iconSize},'title',btnName[i]);
			}
			btn.icon.css('width', iconW + btnName[i].length * 14);
		}else{
			btn.icon = $('div',null,null,'title',btnName[i]);
			btn.icon.css('width', btnName[i].length * 14);
		}
		btn.append(btn.icon)
		btn.buttonStyle = true;
		btn.enableDown = true;
		btn.live('click', this.onClick, this);
		this.append(btn);
		this.btns.push(btn);
	}
});
SlideNav.prototype.setOnClick = function(callback, delegate){
	if(!$.isFunction(callback)) return;
	this.callback = callback;
	this.delegate = delegate;
};
SlideNav.prototype.onClick = function(btn){
	if(!btn.hasClass("selected")){
		var children = this.children;
		for(var i in children){
			if(children[i].hasClass("selected")){
				children[i].removeClass("selected");
				if(this.btnImg){
					children[i].icon.css("background-image", this.btnImg[(i * 2)]);
				}
			}
		}
		btn.addClass("selected");
		if(this.btnImg){
			btn.icon.css("background-image", this.btnImg[(btn.idx * 2 + 1)]);
		}
		if($.isFunction(this.callback)){
			this.callback.call(this.delegate,btn);
		}
	}
};
SlideNav.prototype.setSelected = function(idx){
	if(idx >= this.btns.length){
		return;
	}
	this.onClick(this.btns[idx]);
};
$.ui.SlideNav = SlideNav;

/**
 * SideMenu
 */
var SideMenu = $.getWidgetClass(function(delegate) {
	this.init('aside');
	this.setClass('ui-sidemenu');
	this.noPrepare=true;
	this.isCreate=false;
	this.returnvalue=[];
	if(!delegate.sideMenus){
	delegate.sideMenus=[];
	}
	
	this.live('swipeRight',this.menuHide,this);
	
//	delegate.enableSwipeBack(function(){
//	for(i=0;i<delegate.sideMenus.length;i++){
//	delegate.sideMenus[i].css('right','-85%');
//	delegate.sideMenus[i].noPrepare?delegate.sideMenus[i].noPrepare=false:delegate.sideMenus[i].noPrepare=true;console.log(delegate.sideMenus[i].noPrepare);
//	}
//	if(delegate.updiv){
//	delegate.updiv.remove();
//	delegate.updiv=undefined;
//	}
//	delegate.navbar.css('right','0');
//	delegate.content.css('right','0');});
//	delegate.live('click',function(){
//		this.css('right','-85%');
//		delegate.navbar.css('right','0');
//		delegate.content.css('right','0');
//		this.noPrepare?this.noPrepare=false:this.noPrepare=true;console.log(this.noPrepare);
//	},this);
	this.delegate=delegate;
	this.sideMenuListview = new $.ui.SideMenuListview(this);
	this.append(this.sideMenuListview);
	delegate.sideMenus.push(this);
});

SideMenu.prototype.prepare = function(callback,type,data,item,multitile){
//	$.blur();
//	if(!this.useNoTrans_) {
//		this.useNoTrans_ = this.delegate.useNoTrans;
//		console.log('useNoTrans = ' + this.useNoTrans_);
//		if(this.useTrans_) this.delegate.removeClass('no-trans');
//		this.delegate.useNoTrans = false;
//	}
	if(!$.isFunction(callback)) return;
	this.callback = callback;
	if (!this.isCreate) {
	 if (multitile&&type==1) {
			 this.append(multitile).addRightBtn('确定', this.callBackClick, this);
			 this.sideMenuListview.css('top','46px');
			 this.sideMenuListview.height = function() {
		            return ($.phone.bodySize.height - 46);
		        };
	}else {
			this.sideMenuListview.css('top','0');
			this.sideMenuListview.height = function() {
	            return ($.phone.bodySize.height);
	        };
	}
	 var standardData=[];
	 for ( var i = data.length-1; i >= 0; i--) {
		 var items=data[i];
		 this.returnvalue.push(items.defaultvalue);
		 for ( var j = items.item.length-1; j >=0 ; j--) {
			    var itemtext=items.item[j];
			 var d = {}; 
			 d['group']=i;
			 d['ccss']=item;
			 d['type']=type;
			 d['title']=undefined;
			 d['defaultvalue']='line';
			 d['line']=itemtext;
			 
			 if (j==0) {
				 d['title']=items.title;
				}
			 if (items.defaultvalue==itemtext) {
				 d['defaultvalue']=item;
		}
			 standardData.push(d); 
	}
	}
	 this.returnvalue.reverse();
	 this.sideMenuListview.reset(standardData,this);
     this.sideMenuListview.refresh();
	 this.isCreate=true;
	}
	
	if(this.noPrepare){
		this.delegate.navbar.css('right','85%');
		this.delegate.content.css('right','85%');
		this.css('right','0');
	}else {
		this.delegate.navbar.css('right','0');
		this.delegate.content.css('right','0');
		this.css('right','-85%');
	}
	this.noPrepare?this.noPrepare=false:this.noPrepare=true;
	if(!this.delegate.updiv){
	this.delegate.updiv=this.delegate.append($('div', null, null, 'updiv'))
	this.delegate.updiv.live('begin',this.menuHide,this);
	}
}

SideMenu.prototype.callBackClick = function(line){
	this.menuHide();
	this.callback.call(this.delegate,this.returnvalue);
	
}

SideMenu.prototype.menuHide = function(){
//	console.log('run run run:' + this.useNoTrans_);
//	this.delegate.useNoTrans = this.useNoTrans_;
//	this.useNoTrans_ = false;
//	if(this.useNoTrans_)
//	$.util.afterRender(function() {
//		 this.delegate.addClass('no-trans');
//		},this,1000);
	if(this.delegate.updiv){
	this.delegate.updiv.remove();
	this.delegate.updiv=undefined;
	}
	this.delegate.navbar.css('right','0');
	this.delegate.content.css('right','0');
	this.css('right','-85%');
	this.noPrepare?this.noPrepare=false:this.noPrepare=true;
//	for(i=0;i<this.delegate.sideMenus.length;i++){
//		this.delegate.sideMenus[i].css('right','-85%');
//		this.delegate.sideMenus[i].noPrepare?this.delegate.sideMenus[i].noPrepare=false:this.delegate.sideMenus[i].noPrepare=true;console.log(this.delegate.sideMenus[i].noPrepare);
//	}
}
	
$.ui.SideMenu = SideMenu;

})(jMelon);

