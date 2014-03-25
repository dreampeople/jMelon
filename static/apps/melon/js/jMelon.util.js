
(function($) {
$.util = {};

$.util.renderLog = function(message) {
	var d1 = new Date();
	setTimeout(function() {
		console.log(message + ':' + (d1.getTime() - (new Date()).getTime()));
	},0);
};

$.util.afterRender = function(callback,delegate,delay) {
	if(!delay) delay = $.settings.renderDuration;
	if(!$.isFunction(callback)) return;
	setTimeout(function() {
		callback.call(delegate);
	},delay);
};

})(jMelon);
