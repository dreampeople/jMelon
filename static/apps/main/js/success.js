(function(pageName) {
	var pageObj = $.phone.extendPage();
	pageObj.prototype.initialize = function(){
		this.addClass("success");
	};
	pageObj.prototype.pageInit = function(){
		this.showNavbar("成功案例");
		this.navbar.setBackBtn();
		
		var swipeContainer = $("div", null, null, "swipeContainer");
		var imgs = ["static/apps/main/images/1.jpg",
					 "static/apps/main/images/2.jpg",
					 "static/apps/main/images/3.jpg",
					 "static/apps/main/images/4.jpg",
					 "static/apps/main/images/5.jpg"];
		this.swipeSV = new $.ui.SwipeScrollView("swipeSV", imgs);
		swipeContainer.append(this.swipeSV);
		
		var apps1 = $("div", null, null, "apps");
		var app1 = apps1.append($("div", null, null, "app"));
		app1.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app1.append($("div", null, null, "text", "商旅e路通"));
		app1.live("click", this.pushPage);
		var app2 = apps1.append($("div", null, null, "app"));
		app2.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app2.append($("div", null, null, "text", "礼佛堂"));
		app2.live("click", this.pushPage);
		var app3 = apps1.append($("div", null, null, "app"));
		app3.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app3.append($("div", null, null, "text", "审批系统"));
		app3.live("click", this.pushPage);
		var app4 = apps1.append($("div", null, null, "app"));
		app4.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app4.append($("div", null, null, "text", "掌上课堂"));
		app4.live("click", this.pushPage);
		
		var apps2 = $("div", null, null, "apps");
		var app5 = apps2.append($("div", null, null, "app"));
		app5.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app5.append($("div", null, null, "text", "月递情谊"));
		app5.live("click", this.pushPage);
		var app6 = apps2.append($("div", null, null, "app"));
		app6.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app6.append($("div", null, null, "text", "i信"));
		app6.live("click", this.pushPage);
		var app7 = apps2.append($("div", null, null, "app"));
		app7.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app7.append($("div", null, null, "text", "融信通"));
		app7.live("click", this.pushPage);
		var app8 = apps2.append($("div", null, null, "app"));
		app8.append($("img", {src: "static/apps/main/images/app.jpg"}));
		app8.append($("div", null, null, "text", "MOA"));
		app8.live("click", this.pushPage);
		
		this.content.append(swipeContainer);
		this.content.append(apps1);
		this.content.append(apps2);
	};
	pageObj.prototype.pageShow = function(){
		if(this.isFirst){
			//this.swipeSV.scrollToPage(2500, 0);
			this.swipeSV.scrollToPage(10, 0);
		}
	};
	pageObj.prototype.pushPage = function(){
		var page = new $$.SuccessDetailPage();
		$.phone.pushPage(page);
	};
	$$.SuccessPage = pageObj;
})();

(function(pageName) {
	var pageObj = $.phone.extendPage();
	pageObj.prototype.initialize = function(){
		this.addClass("successDetail");
	};
	pageObj.prototype.pageInit = function(){
		this.showNavbar("案例介绍");
		this.navbar.setBackBtn();
		
		var swipeContainer = $("div", null, null, "swipeContainer");
		var imgs = ["static/apps/main/images/1.jpg",
					 "static/apps/main/images/2.jpg",
					 "static/apps/main/images/3.jpg",
					 "static/apps/main/images/4.jpg",
					 "static/apps/main/images/5.jpg"];
		this.swipeSV = new $.ui.SwipeScrollView("swipeSV", imgs);
		swipeContainer.append(this.swipeSV);
		
		var intro = $("div", null, null, "intro", "这是商旅说明这是商旅说明这是商旅说明这是商旅说明这是商旅说明这是商旅说明");
		
		var showBtn = new $.ui.Button("查看演示", "showBtn");
        showBtn.setOnClick(function(){
        	// var page = new $$.SuccessShowPage();
			// $.phone.pushPage(page);
			window.location = "static/apps/cases/1/index.html";
        }, this);
		
		this.content.append(swipeContainer);
		this.content.append(intro);
		this.content.append(showBtn);
	};
	pageObj.prototype.pageShow = function(){
		if(this.isFirst){
			//this.swipeSV.scrollToPage(2500, 0);
			this.swipeSV.scrollToPage(10, 0);
		}
	};
	$$.SuccessDetailPage = pageObj;
})();

(function(pageName) {
	var pageObj = $.phone.extendPage();
	pageObj.prototype.initialize = function(){
		this.addClass("successShow");
	};
	pageObj.prototype.pageInit = function(){
		this.showNavbar("案例演示");
		this.navbar.setBackBtn();
		
		var showContainer = $("div", null, null, "showContainer");
		
		this.content.append(showContainer);
	};
	pageObj.prototype.pageShow = function(){
	};
	$$.SuccessShowPage = pageObj;
})();

