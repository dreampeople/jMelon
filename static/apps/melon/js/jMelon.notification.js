(function($) {
$.notification = {};

var callbacks = {};

$.notification.regist = function(notiName,callback,delegate) {
	if(!(notiName in callbacks)) {
		callbacks[notiName] = [];
	}
	callbacks[notiName].push([callback,delegate]);

	return callbacks[notiName].length - 1;
};

$.notification.send = function(notiName) {
	if(!(notiName in callbacks)) return;

	var callback = callbacks[notiName];
	for(var i=0;i<callback.length;i++) {
		if(!callback[i]) continue;
		callback[i][0].apply(callback[i][1],arguments.slice(1));
	}
};

$.notification.remove = function(notiName,nid) {
	if(!(notiName in callbacks)) return;

	if(nid === undefined) {
		delete callbacks[notiName];
		return;
	}
	
	var callback = callbacks[notiName];
	if(nid < 0 || nid >= callback.length) return;
	callback[nid] = null;
};

})(jMelon);
