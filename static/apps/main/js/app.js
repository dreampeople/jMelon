$.phone.application = new function() {

	this.onPause = function() { $.notification.send('pause'); };
	this.onResume = function() { $.notification.send('resume'); };

	this.setup = function() {
		// 设置ajax
		$.ajaxSettings.type = 'POST';
		$.ajaxSettings.global = false;
		$.ajaxSettings.headers = { "cache-control" : "no-cache" };
	};

	/*启动时调用*/
	this.onInit = function() {
		this.setup();
		$.phone.addPage(new $$.MainPage());
	};

	/*当窗体大小改变是调用*/
	this.onResize= function() { };
};
