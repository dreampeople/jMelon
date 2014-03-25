(function() {
window.$$ = {};

$$.baseURL = '';
$$.user = null;
$$.calendarApi = {};
$$.personalFlag = true;
$$.isSingle = true;

$$.isFrom_ext=false;
//酒店所在城市名称，订单确认页面需要
$$.hotelCityName = '';
$$.city = '';
//当前是不是正式服务器
$$.server=true;
$$.isCheckingUpgrade = false;
$$.isDownloadingUpgrade = false;

$$.user_set = function(user) {
	 var s = $.toJSON(user);
	 $$.user = user;
	 localStorage.setItem('user',s);
	return user;
};

$$.alertView = function(callback,title,body,buttons) {
	var bs = buttons.join(',');
	return navigator.notification.confirm(body,callback,title,bs);
};

/*下载新版本*/
$$.updateVersion = function(version,delegate) {
		if (!$.settings.isPhone)
			return;
		var versionContent='';
		for (var i in version.upgrade_content) {
			versionContent=versionContent+version.upgrade_content[i]+'\n';
					}
		
		if (version.force_upgrade) {
			for ( var i in version.force_upgrade_target) {
				if (version.force_upgrade_target[i] == $$.version) {
					$$.isDownloadingUpgrade = true;
					$.phone.showMessageView('正在下载更新，请稍候...');
					$.plugin.showDownloadProgress();
					$.plugin.hessian.Upgrade(version.apk_url, version.apk_size,
							function(path) {
								$$.isDownloadingUpgrade = false;
								$.plugin.install(path);
							}, function(error) {
								$$.isDownloadingUpgrade = false;
								$.phone.showMessageView(error);
							}, delegate);
				return;
			}
		}
		$$.alertView(function(idx) {
				if (idx != 2)
					return;
				$$.isDownloadingUpgrade = true;
				$.phone.showMessageView('正在下载更新，请稍候...');
				$.plugin.showDownloadProgress();
				$.plugin.hessian.Upgrade(version.apk_url, version.apk_size,
						function(path) {
							$$.isDownloadingUpgrade = false;
							$.plugin.install(path);
						}, function(error) {
							$$.isDownloadingUpgrade = false;
							$.phone.showMessageView(error);
						}, delegate);
			}, '软件升级', versionContent, [ '下次再说', '立即升级' ]);
	} else {
			$$.alertView(function(idx) {
				if (idx != 2)
					return;
				$$.isDownloadingUpgrade = true;
				$.phone.showMessageView('正在下载更新，请稍候...');
				$.plugin.showDownloadProgress();
				$.plugin.hessian.Upgrade(version.apk_url, version.apk_size,
						function(path) {
							$$.isDownloadingUpgrade = false;
							$.plugin.install(path);
						}, function(error) {
							$$.isDownloadingUpgrade = false;
							$.phone.showMessageView(error);
						}, delegate);
			}, '软件升级', versionContent, [ '下次再说', '立即升级' ]);
	}
};

$$.showMessageView = function(message){
	$.phone.showMessageView(message);
};

$$.showLoadingView = function(title,msg) {

	if($.settings.isPhone && $.phone.phoneType == 1) {
		$.plugin.showNetworkActivity(true);
	}
	
	if(!$.settings.isPhone) {
		$.phone.showLoadingView();
	} else if($.phone.phoneType == 1) {
		$.plugin.showNetworkActivity(true);
		$.plugin.showLoadingView(title,msg);
	} else {
		$.plugin.showLoadingView(title,msg);
	}
};

$$.hideLoadingView = function() {

	if(!$.settings.isPhone) {
		$.phone.closeModalView();
	} else if($.phone.phoneType == 1) {
		$.plugin.showNetworkActivity(false);
		$.plugin.hideLoadingView();
	} else {
		setTimeout($.plugin.hideLoadingView,100);
	}
};

$$.callAPI = function(funcName,data,fileUrl,success,fail,delegate,isG) {

	if(!$.phone.isOnline()) {
		$$.hideLoadingView();
            if ($.isFunction(fail))
                fail.call(delegate, '网络不给力!', false);
		return;
	}

    var isUpload = true;
    if($.isFunction(fileUrl)) {
        isG = delegate;
        delegate = fail;
        fail = success;
        success = fileUrl;
        isUpload = false;
    } else if(!fileUrl) {
        isUpload = false;
    }	
	
        var page = null, cancelPos = -1, cancelFlag = false;

	if($.isObject(isG)) {
		page = isG;
	} else if(!isG) {
		page = $.phone.getCurrentPage();
	}

	if(page != null) {
			cancelPos = page.cancelCB.push(function() {
						// rfail(null,true);
						cancelFlag = true;
                        if (cancelPos >= 0 && page.cancelCB
                                && page.cancelCB[cancelPos]) {
							page.cancelCB[cancelPos] = null;
						}
						page = null;
					}) - 1;
	}

	var _fail = function(err,isCancel) {
		$$.hideLoadingView();
            if (cancelFlag)
                return;

		if($.isFunction(fail)) {
			fail.call(delegate,err,isCancel);
		} else if(!isCancel) {
			$.phone.showMessageView('联网失败,请检查网络!');
		}

	};
	var _success = function(data) {
		$$.hideLoadingView();
            if (cancelFlag)
                return;

		retVal = $.evalJSON(data);
		if(retVal.retval != 0) {
			$.phone.showMessageView(retVal.errmsg);
                if ($.isFunction(success))
                    success.call(delegate, retVal, false);
		} else {
                if ($.isFunction(success))
                    success.call(delegate, retVal, true);
		}
	};

	var url = $$.baseURL + funcName + '/';
        params = {
            data : $.toJSON(data)
        };
				
	if(!isUpload) {
        $.ajax({
            url: url,
            data: params,
            success: _success,
                error : _fail
            });
        return;
    }
	window.resolveLocalFileSystemURI(fileUrl,function(fileEntry) {
        var options = new FileUploadOptions();
        options.fileKey='file';
            options.fileName = fileEntry.fullPath.substr(fileEntry.fullPath
                    .lastIndexOf('/') + 1);
        options.chunkedMode = false;
        fileEntry.file(function(file) {
            options.mimeType = file.type;
            options.params = params;
            var ft = new FileTransfer();
                ft.upload(fileEntry.fullPath, encodeURI(url), function(retVal) {
                    _success(retVal.response);
                }, _fail, options);
        });
    });

};

$$.getMonthAndDay= function(time) {
	if(time){
		var date = new Date(time);
	}else{
		var date = new Date();
	}
	var m = date.getMonth() + 1;
	var d = date.getDate();
	if (m < 10){m = "0" + m;} 
	if (d < 10){d = "0" + d;} 
	return m + '-' + d;
};

$$.getHoursAndMinutes = function(time) {
	if(time){
		var date = new Date(time);
	}else{
		var date = new Date();
	}
	var h = date.getHours();
	var m = date.getMinutes();
	if (h < 10){h = "0" + h;} 
	if (m < 10){m = "0" + m;} 
	return h + ':' + m;
};

$$.getMonthAndDayCN= function(time) {
	if(time){
	var date = new Date(time);
	}else{
		var date = new Date();
	}
	var m = date.getMonth() + 1;
	var d = date.getDate();
	return m + '月' + d + '日';
};
	
$$.getFullDate= function(time) {
	if(time){
	var date = new Date(time);
	}else{
		var date = new Date();
	}
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	if (m < 10){m = "0" + m;} 
	if (d < 10){d = "0" + d;} 
	return y + '-' + m + '-' + d;
};
	
$$.getSimpleFullDate = function(date){
	return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
}
	
	$$.getOffDays=function(startDate, endDate) {   
		var mmSec = (endDate.getTime() - startDate.getTime()); 
		return Math.round(Math.abs(mmSec / 3600000 / 24));  
	};   

$$.getRating = function(goodComment, badComment){
	//5 * 好评数 / (好评数+差评数)
	var rating = 5 * goodComment / (goodComment+badComment);
	rating = rating.toFixed(1);
	if(rating == 'NaN'){
		return '无评';
	}
	return rating;
}

$$.getDateString = function(time) {
	function formatDN(d) {
			if (d < 10)
				return '0' + d;
		return d;
	}
	var nowTime = parseInt((new Date()).getTime()/ 1000);
	var subTime = nowTime - time;
	if(subTime < 60) {
		return '刚刚';
	} else if(subTime < 60 * 60) {
		return parseInt(subTime / 60) + '分钟前';
	} else if(subTime < 24 * 60 * 60) {
		return parseInt(subTime / 3600) + '小时前';
	} else {
		var t = new Date(time * 1000);
		var m = t.getMonth() + 1;
		var d = t.getDate();
		var h = t.getHours();
		var i = t.getMinutes();
			return formatDN(m) + '-' + formatDN(d) + ' ' + formatDN(h) + ':'
					+ formatDN(i);
	}
};
$$.getHoursAndMinutesFromString = function(date) {
	var hour = date.substring(0, 2);
	var minute = date.substring(2, 4);
	return hour + ":" + minute;
};
$$.getDiscount = function(discount) {
	if(discount == 100){
		return "10.0折";
	}
	var discount = String(discount);
	var d1 = discount.substring(0, 1);
	var d2 = discount.substring(1);
	return d1 + '.' + d2 + "折";
};
$$.checkMobilePhone = function(telNum){ 
	var phoneReg = /(^1[3|4|5|8][0-9]\d{8}$)/;  
	if(phoneReg.test(telNum) === false){  
		return false; 
	}
	return true; 
} 

$$.wantMove = function(e) {
	var rect = e.getBoundingClientRect();
	var top = rect.top + window.pageYOffset;
	if (top > ($.phone.bodySize.height / 2.5)) return true;
	
	return false;  	
}

/**
 * 获取证件类型及编号
 */
$$.getCardType = function(val) {
	var ret = null;
	if(typeof(val) == "number"){
		if(val == 0) return "身份证";
		if(val == 1) return "因公护照";
		if(val == 2) return "因私护照";
		if(val == 3) return "港澳通行证";
		if(val == 4) return "台胞证";
		if(val == 5) return "回乡证";
		if(val == 6) return "外国人永久居留证";
		if(val == 7) return "户口簿";
		if(val == 8) return "出生证明";
		if(val == 9) return "其他";
		return null;
	}

	if(val === "身份证") return 0;
	if(val === "因公护照") return 1;
	if(val === "因私护照") return 2;
	if(val === "港澳通行证") return 3;
	if(val === "台胞证") return 4;
	if(val === "回乡证") return 5;
	if(val === "外国人永久居留证") return 6;
	if(val === "户口簿") return 7;
	if(val === "出生证明") return 8;
	if(val === "其他") return 9;
	return -1;
};

/**
 * 获取酒店星级
 */
$$.getHotelStar = function(val) {
	if(val == '1') return '一星酒店';
	if(val == '2') return '二星酒店';
	if(val == '3') return '三星酒店';
	if(val == '4') return '四星酒店';
	if(val == '5') return '五星酒店';
	return '星级未知';
};

})();
