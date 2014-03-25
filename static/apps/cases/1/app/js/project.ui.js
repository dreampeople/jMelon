(function($) {
	/**
	 * Toast
	 * bee2c项目
	 */
	var Toast = $.getWidgetClass(function(type) {
		this.init();
		this.setClass('ui-toast');
		if(type == 1){
		this.append($('img', {src: 'app/images/function_tip_icon.png'}));
			this.append($('div', null, null, 'bigText', '功能正在建设中'));
			this.append($('div', null, null, 'smallText', '即将推出&nbsp;&nbsp;敬请期待'));
		}
		if(type == 2){
			this.append($('img', {src: 'app/images/warn.png'}));
			this.append($('div', null, null, 'bigText', '当前网络不可用'));
			this.append($('div', null, null, 'smallText', '请检查您的网络设置'));
		}
	});
	$.ui.Toast = Toast;
})(jMelon);
