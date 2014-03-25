$.phone.application = new function() {

	this.setup = function() {
		// 设置ajax
		$.ajaxSettings.type = 'POST';
		$.ajaxSettings.global = false;
		$.ajaxSettings.headers = {
			"cache-control" : "no-cache"
		};
	};

	this.onNewIntent= function (session) {
		if(!session) return;
		if(session.substring(0,5) === 'page:') {
			var pageName = session.substring(5);
			if (pageName== 'msg') {
			var page = new $$.MessagePage();
			$.phone.pushPage(page);
			} else if (pageName== 'login'){
				$.plugin.getFromext(function(fromext) {
					if(fromext && fromext.length > 0&&fromext!='OK') {
						$$.isFrom_ext=true;
						var all=fromext.split('|');
						var mUserName=all[0];
						var mPassword=all[1];
						var skip_page=all[2];
						if (!$.phone.isOnline()) {
							if (!$.phone.getCurrentPage().hasClass('login')){
								$.phone.popToPage(new $$.LoginPage());
							}else {
								$.phone.getCurrentPage().pageShow();
							}
							$.phone.getCurrentPage().showNetworkToast(true);
						} else {
							$.plugin.showPageProgress();
							$.plugin.hessian.login(mUserName, mPassword, function(msg) {
								$.plugin.cancelPageProgress(); 
								$$.user_set(msg);
								localStorage.setItem('psw', mPassword);
								localStorage.setItem('name', mUserName);
								if (skip_page) {
									switch (skip_page) {
									case 'flight_page':
										$$.personalFlag =false;
										$.phone.changePage(new $$.FlightTicketPage());
										break;
									case 'hotel_page':
										$$.personalFlag =false;
										$.phone.changePage(new $$.HotelPage());
										break;
									case 'travel_page':
										$$.personalFlag =false;
										$.phone.changePage(new $$.newBusinessTripPage());
										break;
									}
								}
							},function(msg){
								$.plugin.cancelPageProgress();
								if (msg == '未能通过验证') {
									$$.alertView(null, '未能通过验证','您的用户名/密码无法通过校验，请检查。', [ '确定' ]);
								} else if (msg == '登录超时') {
									$$.alertView(null, '登录超时','登录超过预计时间，要不您再试试？', [ '确定' ]);
								} else {
								$.phone.showMessageView(msg);
								}
								if (!$.phone.getCurrentPage().hasClass('login')){
									$.phone.popToPage(new $$.LoginPage());
								}else {
									$.phone.getCurrentPage().pageShow();
								}
							}, this);
						}
					}
				},this);
			}else {
				return;
			}
		}else {
			return;
		}

	};
	
	this.imagePreLoad = function(imageName) {
		var img = new Image();
		var src = 'app/images/'+ imageName +'.png';
		img.src = src;
		if (img.complete) return;

		img.onload = function() {
			img.onload = null;
			img = null;
		};
	};

	this.onInit = function() {
		$$.version = $.phone.versioncode;
		$$.versionName = $.phone.versionname;
		this.setup();

		if($.phone.phoneType == 1) {
			$$.keyboardRate = 1.6;
		} else {
			$$.keyboardRate = 1.8;
		}
		
		/**
		 * 预加载图片
		 */
		var imgs = ['about_me_p', 'feedback_p', 'function_introduction_p', 'message_handle_p', 
			'my_card_p', 'top_flight_action_p', 'toolbar_assist_s', 'toolbar_company_s', 
			'toolbar_personal_s', 
			'black_bg', 'hotel_detail_ic_map_pressed', 'btn_common_pressed', 'tab_item_press', 
			'wfa_history_bar_left_press', 'btn_common_pressed', 'common_refuse_btn_press', 
			'btn_radio_on', 'hotel_room_btn_pressed', 'delete_tip2', 
			'confirmation_order_pressed', 'icon_home_press', 'icon_receipt_press',
			'type_accompany_left_normal', 'type_accompany_middle_press', 'type_accompany_right_press',
			'cancelBtn_pressed',
			'calendar_left2', 'calendar_right2', 'flight_list_back'];
			
		var length = imgs.length;
		for(var i=0; i<length; i++){
			this.imagePreLoad(imgs[i]);
		}

		var user = localStorage.getItem('user');
		if (user) {
			user = $.evalJSON(user);
			$$.user = user;
		} else {
			$$.user = null;
		}

		if ($.settings.isPhone) navigator.splashscreen.hide();
		
		var initReady = localStorage.getItem('initReady');
		if(!initReady){
			localStorage.setItem('initReady', true);
			$.phone.addPage(new $$.IntroductionPage());
			return;
		}
		//if ($$.user == null) {
		     this.onNewIntent('page:login');
			$.phone.addPage(new $$.MainPage());
		//} else {
		//	$.phone.addPage(new $$.MainPage());
		//}
	};

	this.onPause = function() {
		$.notification.send('pause');
	};
	this.onResume = function() {
		$.notification.send('resume');
	};

	this.logout = function() {
		localStorage.removeItem('user');
		if (!localStorage.getItem('rpsw')) {
			localStorage.removeItem('psw');
		}
		if (!localStorage.getItem('rname')) {
			localStorage.removeItem('name');
		}

		$$.user = null;
		
			if (!$$.server) {
				$.plugin.settestserver(function(msg) {
					console.log('测试服务器');
				},this);
			}else {
				$.plugin.setserver(function(msg) {
					console.log('正式服务器');
				},this);
			}
	};

	this.onExit = function() {
		if (!$.settings.isPhone)
			return confirm('确定退出商旅e路通？');
		navigator.notification.confirm('确定退出商旅e路通？',
				function(idx) {
					if(idx == 2)  {
						$.plugin.stopXmppService();
						$.plugin.exitApp();
						
					}
				},
			'提示信息','取消,确定');
	};
};
