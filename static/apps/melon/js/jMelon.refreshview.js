(function($) {

/**
 * 缺省的item
 */
var DefaultItem = $.getWidgetClass(function() {
	this.init();
	this.addClass('item');
});

/**
 * 刷新item
 */
var RefreshItem = $.getWidgetClass(function() {
	this.init();
	this.setClass('margin');
	this.canvas = this.append($('canvas',{width: 60,height: 40}));
	var div = this.append($('div'));
	this.top = div.append($('div',null,null,'top','下拉即可刷新...'));
	this.bottom = div.append($('div',null,null,'bottom'));
	this.drawArrow(0,0);
	
	this.val=1;
	this.flag=1;
	this.refreshTime = null;
});
RefreshItem.prototype.drawArrow = function(angle) {
	
	var w = 60,h = 40;
	var ctx = this.canvas.e.getContext('2d'); 
	ctx.clearRect(0 , 0, w, h);

	ctx.save();
	ctx.translate(30,20)

	ctx.clearRect(-30, -30, 60, 40);
	ctx.rotate(angle);
	ctx.beginPath();
	
	ctx.fillStyle='rgba(0, 0, 0, .2)';

	//绘制三角形
	ctx.moveTo(-9, 8);
	ctx.lineTo(9, 8);
	ctx.lineTo(0, 17);
	ctx.lineTo(-9, 8);
	ctx.fill();
	ctx.strokeStyle='rgba(0, 0, 0, .3)';
	ctx.stroke();
	
	var styles=new Array('rgba(0, 0, 0, .4)', 'rgba(0, 0, 0, .3)', 'rgba(0, 0, 0, .2)', 'rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, .1)');
	
	for(var i=0; i<5; i++){
		ctx.fillStyle=styles[i];
		ctx.moveTo(-5, 8-i*6);
		ctx.lineTo(5, 8-i*6);
		ctx.lineTo(5, 3-i*6);
		ctx.lineTo(-5, 3-i*6);
		ctx.fill();
	}
	ctx.restore();
};
RefreshItem.prototype.drawLoading = function(angle) {
	
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
RefreshItem.prototype.updateTime = function() {
	if(this.refreshTime != null) {
		this.bottom.html('刷新时间: ' + $$.getDateString(this.refreshTime));
	}
};
RefreshItem.prototype.begin = function() {
	this.top.html('释放开始刷新...');
	this.canvas.stop();
	this.canvas.animate(function(d,finished) {
		if(!finished) this.drawArrow(-Math.PI/ 200 * d);
		else  this.drawArrow(-Math.PI);
	},200,null,null,null,this);
};
RefreshItem.prototype.undo = function() {
	this.top.html('下拉即可刷新...');
	this.canvas.stop();
	this.canvas.animate(function(d,finished) {
		if(!finished) this.drawArrow(Math.PI/ 200 * d - Math.PI);
		else this.drawArrow(0);
	},200,null,null,null,this);
};
RefreshItem.prototype.reset = function(flag) {
	this.top.html('下拉即可刷新...');
	if(flag != false) this.refreshTime = parseInt((new Date()).getTime() / 1000);
	this.canvas.stop();
	this.drawArrow(0);
};
RefreshItem.prototype.loading = function() {
	this.top.html('正在刷新...');
	this.canvas.animate(function(d,finished) {
		this.drawLoading(Math.PI/ 100 * d);
	},100000,null,null,null,this);
};
$.ui.RefreshItem = RefreshItem;

/**
 *  RefreshView 控件
 */
var RefreshView = $.extendClass(function(disableTopMargin) {
	$.ui.ListView.call(this,null,this);
	this.distanceRate = 1; //速度阻尼参数
	this.addClass('refresh');

	if(!disableTopMargin) {
		this.mRefreshItem = new RefreshItem();
		this.addTopItem(40,this.mRefreshItem);
		this.enableMarginTop(true,40);
		this.enableMarginBottom(true,0);
	} else {
		this.disableTopMargin = disableTopMargin;
	}

	this.addBottomItem(50);
	this.bottomItem.html('加载更多');

	this.bottomItem.buttonStyle = true;
	this.bottomItem.enableDown = true;
	this.bottomItem.live('click',this.loadMore,this);

	this.minId = 0;
	this.maxId = 0;
	this.mDatas = [];
},$.ui.ListView);
RefreshView.prototype.resetData = function() {
	this.minId = 0;
	this.maxId = 0;
	this.mDatas = [];
	this.clearItems();
};
RefreshView.prototype.setDatas = function(datas,height,itemClass) {
	for(var i=0;i<datas.length;i++) {
		var data = datas[i];
		if($.isObject(data)) {
		if(this.minId == 0 || this.minId > data.id) this.minId = data.id;
		if(this.maxId == 0 || this.maxId < data.id) this.maxId = data.id;
		} else {
			if(this.minId == 0 || this.minId > data) this.minId = data;
			if(this.maxId == 0 || this.maxId < data) this.maxId = data;
		}
		this.mDatas.unshift(data);
		var item = this.prependItem(height,itemClass);
		if(item == null) continue;
	}
	this.reloadData();
};
RefreshView.prototype.refresh = function() {
	if(this.mRefresh) return;
	this.mRefresh = true;

	if(!this.disableTopMargin) this.mRefreshItem.loading();
	this.scrollTo(0,40);
	this.getData({maxId: this.maxId},function(datas,isOK,height,itemClass) {
		if(!this.disableTopMargin) this.mRefreshItem.reset(isOK);
		this.mRefresh = false;
		this.scrollTo(0,0);
		if(!isOK) return;
		if(!itemClass) itemClass = DefaultItem;
		this.setDatas(datas,height,itemClass);
	},this);
};
RefreshView.prototype.loadMore = function() {
	if(this.mRefresh) return;
	this.mRefresh = true;

	this.bottomItem.html('正在加载...');
	this.getData({minId: this.minId},function(datas,isOK,height,itemClass) {
		this.mRefresh = false;
		if(!isOK) {
			//$.phone.showMessageView('加载数据失败!');
			return this.bottomItem.html('加载更多!');
		}

		if(!itemClass) itemClass = DefaultItem;
		for(var i=0;i<datas.length;i++) {
			var data = datas[i];
			if($.isObject(data)) {
			if(this.minId == 0 || this.minId > data.id) this.minId = data.id;
			if(this.maxId == 0 || this.maxId < data.id) this.maxId = data.id;
			} else {
				if(this.minId == 0 || this.minId > data) this.minId = data;
				if(this.maxId == 0 || this.maxId < data) this.maxId = data;
			}
			this.mDatas.push(data);
			this.addItem(height,itemClass);
		}
		this.bottomItem.html('加载更多');
	},this);
};
RefreshView.prototype.marginTopBegin = function() {
	if(!this.disableTopMargin) this.mRefreshItem.updateTime();
};
RefreshView.prototype.marginTop = function(flag) {
	if(this.disableTopMargin) return;
	if(this.mRefresh) return;

	if(flag) this.mRefreshItem.begin();
	else this.mRefreshItem.undo();
};
RefreshView.prototype.marginTopEnd = function() {
	if(this.disableTopMargin) return;
	this.mRefreshItem.loading();
	this.refresh();
};
RefreshView.prototype.marginBottomEnd = function() {
	this.loadMore();
};
$.ui.RefreshView = RefreshView;

})(jMelon);
