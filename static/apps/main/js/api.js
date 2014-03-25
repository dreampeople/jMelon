(function() {
window.$$ = {};

$$.baseURL = '';
$$.user = null;
$$.version = '1';
$$.versionName = '1.0';
$$.calendarApi = {};

$$.loadPage = function(pageName,success,fail,delegate,data) {
	if($$[pageName]) {
		success.call(delegate,$$[pageName]);
		return;
	}

	var url = $$.baseURL + 'page/' + pageName + '/';
	var params = null;
	if(data) params = {data: $.toJSON(data)};

	var _success = function(data) {
		eval(data);
		if(!$$[pageName]) {
			_fail(pageName + ' 不存在!');
			return;
		}
		if(!success || !$.isFunction(success)) return;
		success.call(delegate);
	};

	var _fail = function(err) {
		if(!fail || !$.isFunction(fail)) return;
		fail.call(delegate);
	};

	$.ajax({
		url: url,
		data: params,
		success: _success,
		error: _fail });
};

$$.callAPI = function(funcName,data,success,fail,delegate) {

	var _fail = function(err,isCancel) {
		$$.hideLoadingView();
		if(cancelFlag) return;

		if($.isFunction(fail)) {
			fail.call(delegate,err,isCancel);
		} else if(!isCancel) {
			$.phone.showMessageView('联网失败,请检查网络!');
		}

	};
	var _success = function(data) {
		$$.hideLoadingView();
		if(cancelFlag) return;

		retVal = $.evalJSON(data);
		if(retVal.retval != 0) {
			$.phone.showMessageView(retVal.errmsg);
			if($.isFunction(success)) success.call(delegate,retVal,false);
		} else {
			if($.isFunction(success)) success.call(delegate,retVal,true);
		}
	};

	var url = $$.baseURL + funcName + '/';
	var params = {data: $.toJSON(data)};
				
	$.ajax({
		url: url,
		data: params,
		success: _success,
		error: _fail });
};

})();
