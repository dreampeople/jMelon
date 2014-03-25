(function(pageName) {
	var pageObj = $.phone.extendPage();
	pageObj.prototype.initialize = function() {
		this.addClass('main');
	};
	pageObj.prototype.pageInit = function() {
		$$.user = {"message":"$d=b86f723cd8fe356c353cb90ebc008c91&$s=208",
					"userInfo":{"tenantId":3,
						"deptName":"平台-终端开发部",
						"needSubmitApply":true,
						"userCode":"0096000449",
						"serviceTel":"400-181-5002",
						"cardType":"身份证",
						"createApplyFlag":true,
						"tenantName":"中兴网信",
						"lowPriceControl":true,
						"cardNo":"320911198810072276",
						"mobilePhone":"18625174556",
						"userId":10000103140,
						"userName":"杨迎朝",
						"remoteServiceUrl":"http://www.bee2c.com/remote_mobile",
						"deptId":1000100939},
					"result":"001"};
		
		// 定义3个页面，用于左右滑动
		var personal = $('div', null, null, 'home home1');
		var company = $('div', null, null, 'home home2');
		var setting = $('div', null, null, 'home home3');
		personal.css("width", 320);
		company.css("width", 320);
		setting.css("width", 320);

		var menuW = 320 * 0.96 - 4;
		var cellW = menuW / 5 * 2;
		var cellH = menuW / 5 * 1.732;
		// 菜单1
		var cells1 = [];
		var verline1 = $('div', null, {
			'width' : cellW,
			'margin-top' : cellH / 2
		}, 'verline');
		cells1[0] = verline1.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell hotelDomestic', "国内酒店"));
		cells1[0].live('click', this.showToast, this);
		cells1[1] = verline1.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell hotelInternational', "国际酒店"));
		cells1[1].live('click', this.showToast, this);
		var verline2 = $('div', null, {
			'width': cellW,
			'left': -cellW / 4 + 2
		}, 'verline');
		cells1[2] = verline2.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell insurance', "保险"));
		cells1[2].live('click', this.showToast, this);
		cells1[3] = verline2.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.8
		}, 'cell voice', "语音订票"));
		cells1[3].live('click', this.showToast, this);
		cells1[4] = verline2.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell bill', "单据"));
		cells1[4].live('click', this.showToast, this);

		var verline3 = $('div', null, {
			'width' : cellW,
			'margin-top' : cellH / 2,
			'left': -cellW / 2 + 4
		}, 'verline');
		cells1[5] = verline3.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell flightDomestic', "国内机票"));
		cells1[5].live('click', this.showToast, this);
		cells1[6] = verline3.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell flightInternational', "国际机票"));
		cells1[6].live('click', this.showToast, this);

		var menus1 = $('div', null, {
			'width' : menuW,
			'height' : menuW
		}, 'menus');
		menus1.append(verline1);
		menus1.append(verline2);
		menus1.append(verline3);

		personal.append(menus1);
		//中国银联定制logo
		if($$.user.userInfo.tenantId == 3421){
		this.logo1 = personal.append($('img', {'src':'app/images/chinaUnionpay.png'}, null, 'logo'));
		}

		// 菜单2
		var cells2 = [];
		var verline1 = $('div', null, {
			'width' : cellW,
			'margin-top' : cellH / 2
		}, 'verline');
		cells2[0] = verline1.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell hotelDomestic', "国内酒店"));
		cells2[0].live('click', this.showToast, this);
		cells2[1] = verline1.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell hotelInternational', "国际酒店"));
		cells2[1].live('click', this.showToast, this);

		var verline2 = $('div', null, {
			'width' : cellW,
			'left': -cellW / 4 + 2
		}, 'verline');
		cells2[2] = verline2.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell approval', "审批"));
		cells2[2].live('click', this.showToast, this);
		cells2[3] = verline2.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.8
		}, 'cell voice', "语音订票"));
		cells2[3].live('click', this.showToast, this);
		cells2[4] = verline2.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell bill', "单据"));
		cells2[4].live('click', this.showToast, this);

		var verline3 = $('div', null, {
			'width' : cellW,
			'margin-top' : cellH / 2,
			'left': -cellW / 2 + 4
		}, 'verline');
		cells2[5] = verline3.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell flightDomestic', "国内机票"));
		cells2[5].live('click', this.showToast, this);
		cells2[6] = verline3.append($('div', null, {
			'width': cellW,
			'height': cellH,
			'padding-top': cellH * 0.685
		}, 'cell flightInternational', "国际机票"));
		cells2[6].live('click', this.showToast, this);

		var menus2 = $('div', null, {
			'width' : menuW,
			'height' : menuW
		}, 'menus');
		menus2.append(verline1);
		menus2.append(verline2);
		menus2.append(verline3);

		company.append(menus2);
		
		for ( var i = 0; i < 7; i++) {
			cells1[i].buttonStyle = true;
			cells1[i].enableDown = true;
			cells2[i].buttonStyle = true;
			cells2[i].enableDown = true;
		}
		//中国银联定制logo
		if($$.user.userInfo.tenantId == 3421){
		this.logo2 = company.append($('img', {'src':'app/images/chinaUnionpay.png'}, null, 'logo'));
		}

		// 页面3
		var tel = $('div', null, null, 'tel');
		var telNum = tel.append($('div', null, null, 'number'));
		telNum.buttonStyle = true;
		telNum.enableDown = true;
		telNum.live('click', this.showToast, this);

		var msgHandle = $('div', null, null, 'icon msgHandle', '消息处理');
		msgHandle.buttonStyle = true;
		msgHandle.enableDown = true;
		msgHandle.live('click', this.showToast, this);
		var flightAction = $('div', null, null, 'icon flightAction', '航班动态');
		flightAction.buttonStyle = true;
		flightAction.enableDown = true;
		flightAction.live('click',this.showToast , this);
		var feedback = $('div', null, null, 'icon feedback', '留言反馈');
		feedback.buttonStyle = true;
		feedback.enableDown = true;
		feedback.live('click', this.showToast, this);

		var bar1 = $('div',null,null,'bar');
		bar1.append(msgHandle);
		bar1.append(flightAction);
		bar1.append(feedback);

		var myCard = $('div',null,null,'icon myCard','我的名片');
		myCard.buttonStyle = true;
		myCard.enableDown = true;
		myCard.live('click', this.showToast, this);
		var funcIntroduction = $('div', null, null, 'icon funcIntroduction',
				'功能介绍');
		funcIntroduction.buttonStyle = true;
		funcIntroduction.enableDown = true;
		funcIntroduction.live('click', this.showToast, this);
		var about = $('div',null,null,'icon about','关于我们');
		about.buttonStyle = true;
		about.enableDown = true;
		about.live('click', this.showToast, this);

		var bar2 = $('div',null,null,'bar');
		bar2.append(myCard);
		bar2.append(funcIntroduction);
		bar2.append(about);
		
		var softwareUp = $('div',null,null,'lineUp');
		softwareUp.buttonStyle = true;
		softwareUp.enableDown = true;
		softwareUp.live('click', this.showToast, this);
		softwareUp.append($("img", {src : 'app/images/more_update.png'}));
		softwareUp.append($('span',null,null,'text','软件升级'));
		softwareUp.append($('span', null, null, 'version hasNext', 'V'+$$.versionName));
		
		var infoSet = $('div',null,null,'lineDown');
		infoSet.buttonStyle = true;
		infoSet.enableDown = true;
		infoSet.live('click', this.showToast, this);
		infoSet.append($("img", {src : 'app/images/more_settings.png'}));
		infoSet.append($('span', null, null, 'text', '信息设置'));
		infoSet.append($('span', null, null, 'version hasNext'));

		var logout = $('div', null, null, 'logout', '注销登录');
		logout.buttonStyle = true;
		logout.enableDown = true;
		logout.live('click', this.showToast, this);

		setting.append(tel);
		setting.append(bar1);
		setting.append(bar2);
		setting.append(softwareUp);
		setting.append(infoSet);
		setting.append(logout);

		// 底部工具栏
		var personalBtn = $('div', null, null, 'button');
		personalBtn.buttonStyle = true;
		personalBtn.enableDown = true;
		personalBtn.live('click', function(btn) {
			this.scrollview.scrollToPage(0, 200);
			var buttons = this.toolbar.children;
			for (i in buttons) {
				var button = buttons[i];
				if (button.hasClass("selected")) {
					button.removeClass("selected");
				}
			}
			btn.addClass("selected");
		}, this);
		personalBtn.append($('div', null, null, 'icon', '个人出行'));
		var companyBtn = $('div', null, null, 'button');
		companyBtn.addClass("selected");
		companyBtn.buttonStyle = true;
		companyBtn.enableDown = true;
		companyBtn.live('click', function(btn) {
			this.scrollview.scrollToPage(1, 200);
			var buttons = this.toolbar.children;
			for (i in buttons) {
				var button = buttons[i];
				if (button.hasClass("selected")) {
					button.removeClass("selected");
				}
			}
			btn.addClass("selected");
		}, this);
		companyBtn.append($('div', null, null, 'icon', '差旅业务'));
		var settingBtn = $('div', null, null, 'button');
		settingBtn.buttonStyle = true;
		settingBtn.enableDown = true;
		settingBtn.live('click', function(btn) {
			this.scrollview.scrollToPage(2, 200);
			var buttons = this.toolbar.children;
			for (i in buttons) {
				var button = buttons[i];
				if (button.hasClass("selected")) {
					button.removeClass("selected");
				}
			}
			btn.addClass("selected");
		}, this);
		settingBtn.append($('div', null, null, 'icon', '商旅助手'));

		this.toolbar = $('div', null, null, 'toolbar');
		this.toolbar.append(personalBtn);
		this.toolbar.append(companyBtn);
		this.toolbar.append(settingBtn);

		this.scrollview = new $.ui.ScrollView('homeSV');
		if ($.settings.useAnim) {
			this.scrollview.enableScroll(true, false, false);
		} else {
			this.scrollview.enableScroll(false, false, false);
		}
		this.scrollview.enableMarginLeft(false);
		this.scrollview.enableMarginRight(false);
		this.scrollview.pageEnable = true;
		this.scrollview.minStopDuration = 200;
		this.scrollview.content.append(personal);
		this.scrollview.content.append(company);
		this.scrollview.content.append(setting);

		this.content.append(this.scrollview);
		this.content.append(this.toolbar);
		this.scrollview.scrollTo(-320);

		this.scrollview.onPageChanged = function(newPageNum, oldPageNum) {
			var page = $.phone.getCurrentPage();
			var buttons = page.toolbar.children;
			for (i in buttons) {
				var button = buttons[i];
				if (button.hasClass("selected")) {
					button.removeClass("selected");
				}
			}
			if (!isNaN(newPageNum)) {
				buttons[newPageNum].addClass("selected");
			}
		};
	};
	pageObj.prototype.pageShow = function() {
	};
	pageObj.prototype.showToast = function() {
		if (!this.toastExist) {
			var toast = new $.ui.Toast(1);
			this.content.append(toast);
			this.toastExist = true;
			var that = this;
			setTimeout(function() {
				toast.remove();
				that.toastExist = false;
			}, 3000);
		}
	};
	$$.MainPage = pageObj;
})();
