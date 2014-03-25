(function(pageName) {
	var pageObj = $.phone.extendPage();
	pageObj.prototype.initialize = function() {
		this.addClass('main');
	};
	pageObj.prototype.pageInit = function() {
		/*
		 * 滚动图片区域
		 */
		var swipeContainer = $("div", null, null, "swipeContainer");
		var imgs = ["static/apps/main/images/1.jpg",
					 "static/apps/main/images/2.jpg",
					 "static/apps/main/images/3.jpg",
					 "static/apps/main/images/4.jpg",
					 "static/apps/main/images/5.jpg"];
		this.swipeSV = new $.ui.SwipeScrollView("swipeSV", imgs);
		swipeContainer.append(this.swipeSV);

		//this.swipeSV.startAutoScroll();

		/*
		 * app展示区域
		 */
		var apps = $("div", null, null, "apps");
		var app1 = apps.append($("div", null, null, "app"));
		app1.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app1.append($("div", null, null, "text", "成功案例"));
		app1.live('click', function(){
			var page = new $$.SuccessPage();
			$.phone.pushPage(page);
		});
		var app2 = apps.append($("div", null, null, "app"));
		app2.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app2.append($("div", null, null, "text", "Jmelon"));
		app2.live('click', function(){});
		var app3 = apps.append($("div", null, null, "app"));
		app3.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app3.append($("div", null, null, "text", "关于我们"));
		app3.live('click', function(){});
		var app4 = apps.append($("div", null, null, "app"));
		app4.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app4.append($("div", null, null, "text", "员工入口"));
		app4.live('click', function(){});
		
		/*
		 * 新闻区域
		 */
		this.newsSV = new $.ui.ScrollView('newsSV');
		for(var i = 0; i < 10; i++){
			this.newsSV.content.append($("div", null, null, "newsItem", "item" + i));
		}
		
		/*
		 * 版权
		 */
		var footer = $("div", null, null, "footer", "南京华铸通信发展有限公司 版权所有");
		
		this.content.append(swipeContainer);
		this.content.append(apps);
		this.content.append(this.newsSV);
		this.content.append(footer);
	};
	pageObj.prototype.pageShow = function() {
		if(this.isFirst){
		//this.swipeSV.scrollToPage(2500, 0);
		this.swipeSV.scrollToPage(10, -1);
		}
	};
	$$.MainPage = pageObj;
})();

(function($){
	var SwipeScrollView = $.extendClass(function(classname, imgs) {
		$.ui.ScrollView.call(this, classname, this);
		this.enableScroll(true,false,false);
		this.pageEnable = true;
		this.content.css('width', '500000%');
		this.lOrR = null;
		this.turnLeft = null; // true为往左滑, false为往右滑
		this.imgs = [];
		var imgContaineer = $("div", null, null, "imgContainer");
		for(i in imgs){
			var img = imgContaineer.append($('img',{src: imgs[i]}));
			img.live("click", function(img){
				var x = Math.round(img.x);
				var pageNum = Math.round(-this.content.X / this.svWidth);
				if(x === this.rDistance) return;
				if(x === 0){
					this.scrollToPage(pageNum - 1, 0);
					this.content.X += this.svWidth;
				}else if(x === this.mDistance_r){
					this.scrollToPage(pageNum + 1, 0);
					this.content.X -= this.svWidth;
				}
			}, this);
			this.imgs.push(img);
		}
		this.append(imgContaineer);
	}, $.ui.ScrollView);
	SwipeScrollView.prototype.onScroll = function(){
			this.imgW_c = this.svWidth * .5;
			this.imgH_c = this.svHeight;
			this.imgW = this.svWidth * .4;
			this.imgH = this.svHeight * .8;
			this.top = (this.svHeight - this.imgH) / 2;
			this.rDistance = (this.svWidth - this.imgW_c) / 2;
			this.rX = (this.content.X + Math.floor(Math.abs(this.content.X) / this.svWidth) * this.svWidth) * this.rDistance / this.svWidth;
			this.r = Math.abs(this.rX / this.rDistance);
			this.mDistance_r = this.svWidth - this.imgW;
			this.x_r = (this.mDistance_r - this.rDistance) / this.rDistance * this.rX;
			this.imgLen = this.imgs.length;
			
			if(this.lOrR){
				if(this.lOrR >= this.content.X){
					this.turnLeft = true;
				}else{
					this.turnLeft = false;
				}
				this.lOrR = this.content.X;
			}else{
				this.lOrR = this.content.X;
			}
			var counter = Math.abs(this.content.X) / this.svWidth;
			if(parseInt(counter) != counter){
				var pageNum = Math.ceil(counter) + 1;
				if(pageNum > this.imgLen){
					var imgNum = pageNum - Math.ceil(pageNum / this.imgLen - 1) * this.imgLen;
				}else{
					var imgNum = pageNum;
				}
				this.picMove(imgNum, this.content.X);
			}
		};
	SwipeScrollView.prototype.picMove = function(center, flag){
			/*
			 * 往左滑动  center为中间图片
			 * 往右滑动 center为左边图片
			 */
			this.imgs[center - 1].moveTo(this.rDistance + this.rX, null);
			var changeW = this.imgW_c - this.r * (this.imgW_c - this.imgW);
			var changeH = this.imgH_c - this.r * (this.imgH_c - this.imgH);
			var changeTop = this.top * this.r;
			this.imgs[center - 1].css({"width": changeW,
					"height": changeH,
					"top": changeTop});
			var left = (center - 1 > 0) ? center - 1 : this.imgLen;
			var right = (center + 1 > this.imgLen) ? 1 : center + 1;
				this.imgs[left - 1].moveTo(this.imgW / this.rDistance * this.rX, null);
			this.imgs[left - 1].css("z-index", 8);
				this.imgs[right - 1].moveTo(this.x_r + this.mDistance_r, null);
				var changeW_r = this.imgW + this.r * (this.imgW_c - this.imgW);
				var changeH_r = this.imgH + this.r * (this.imgH_c - this.imgH);
				var changeTop_r = this.top * (1 - this.r);
				this.imgs[right - 1].css({"width": changeW_r,
						"height": changeH_r,
						"top": changeTop_r});
				if(this.turnLeft){
					if(Math.abs(this.rX) > this.rDistance / 2){
						this.imgs[center - 1].css("z-index", 9);
						this.imgs[right - 1].css("z-index", 10);
					}else{
						this.imgs[center - 1].css("z-index", 10);
						this.imgs[right - 1].css("z-index", 9);
					}
				}else{
					if(Math.abs(this.rX) < this.rDistance / 2){
						this.imgs[right - 1].css("z-index", 9);
						this.imgs[center - 1].css("z-index", 10);
					}else{
						this.imgs[right - 1].css("z-index", 10);
						this.imgs[center - 1].css("z-index", 9);
					}
				}
				var right_s = (right + 1 > this.imgLen) ? 1 : right + 1;
				this.imgs[right_s - 1].moveTo(this.svWidth + this.imgW / this.rDistance * this.rX, null);
				this.imgs[right_s - 1].css("z-index", 8);
				var right_ss = (right_s + 1 > this.imgLen) ? 1 : right_s + 1;
				this.imgs[right_ss - 1].moveTo(this.svWidth, null);
				this.imgs[right_ss - 1].css("z-index", 7);
	};
	$.ui.SwipeScrollView = SwipeScrollView;
})(jMelon);

