function getTouchIntf() {

	var $document = $(window.document);

	var elements = [];
	var isTouch = false; //是否触摸
	var holdFlag = false; //是否产生hold消息
	var owerIntf = null; //当前是否有确认的元素
	var beginPos = 0; //从哪个节点开始
	var isPause = false;
	var dragFlag = 0; //0 - 没有拖拽,1 - 向左拖拽,2 - 向右拖拽

	var isInput = false;

	/*获取事件源的tagName*/
	function getTagName(e) {
		if(!$.settings.tagEventOn) return e.target.tagName.toLowerCase();

		return e.srcElement.nodeName.toLowerCase();
	}

	function reset() {
		for(var i=0;i<elements.length;i++) elements[i].fire('reset');

		o.isEnd = true;
		elements.splice(0);
		isTouch = false;
		holdFlag = false;
		owerIntf = null;
		beginPos = 0;
		isPause = false;
		dragFlag = 0;
		isInput = false;
	}
	function addElement(elem) {
		if(!o.isEnd) reset();

		if('hold' in elem.events) holdFlag = true;
		elements.push(elem);
	}
	function removeElement(elem) {
		for(var i=0;i<elements.length;i++) {
			if(elements[i] === elem) {
				elements.splice(i,1);
				return;
			}
		}
	}
	function pause() {
		isPause = true;
	}
	function resume() {
		isPause = false;
	}
	var o = {
		addElement: addElement,		//添加接口
		removeElement: removeElement, //删除接口
		pause: pause, 			//删除接口
		resume: resume, 		//删除接口
		isEnd: true, 			//是否结束
		isMove: false,			//是否被移动
		beginPoint: {x:0,y:0},	//开始的位置
		nowPoint: {x:0, y:0},	//最后一次的位置
		distance: {x:0,y:0},	//移动的距离
		moveDistance: {x:0,y:0},	//和上次比较移动的距离
		isSwipe: false,			//是否滑动
		v: {x: 0,y: 0},			//最终的移动速度
		beginTime: null,		//开始时间
		lastTime: null			//上次的结束时间
	};

	/*
	 * 事件回调处理
	 */
	function evtCall(evtType) {
		var that = null;
		if(owerIntf) {
			if(owerIntf.fire(evtType) === false) { /*如果消息被忽略,则重新开始*/
				owerIntf = null;
				evtCall('begin');
			}
			return;
		}

		for(var i=0;i<elements.length;i++) {
			if(i < beginPos) continue;
			var elem = elements[i];

			if(elem.fire(evtType) === true) {
				beginPos = i + 1;
				owerIntf = elem;
				break;
			}
		}
	}

	function down() {

		if(elements.length == 0) return end(true);
		if(o.isMove || o.isEnd) return;
		evtCall('down');

		if(!holdFlag) return;
		setTimeout(function() {
			if(o.isMove || o.isEnd) return;
			evtCall('hold');
			end(true);
		},500);
	}

	function begin() {
		o.beginTime = (new Date()).getTime();
		o.lastTime = o.beginTime;

		o.distance.x = 0;
		o.distance.y = 0;
		o.isSwipe = false;
		o.v.x = 0;
		o.v.y = 0;

		o.isMove = false;
		o.isEnd = false;

		down();

		evtCall('begin');
	}
	function end(hold) {
		o.isEnd = true;

		if(isTouch) {
			$document.unbind("touchmove",moving);
			$document.unbind("touchend",end);
		} else {
			$document.unbind("mousemove",moving);
			$document.unbind("mouseup",end);
		}

		if(hold === true) {
			evtCall('end');
			return reset();
		}

		if($.phone.phoneType == $.phone.FIREFOX) event = arguments[0];
		if(!isInput) {
			if(event && event.preventDefault) {
				event.preventDefault(); //如果不加的话，有些手机拖不动
			} else {
				window.event.returnValue = false;
			}
		}

		var now = (new Date()).getTime();
		if(now - o.lastTime > 100) {
			o.v.x = 0;
			o.v.y = 0;
		}
		if(Math.abs(o.v.x) < 0.1) o.v.x = 0;
		if(Math.abs(o.v.y) < 0.1) o.v.y = 0;

		if(Math.abs(o.v.x) > Math.abs(o.v.y)) o.isSwipe = true;

		//断定是不是swip事件
		if(o.isSwipe) {
			evtCall('swipe');
			if(o.v.x > 0) {
				evtCall('swipeRight');
			} else {
				evtCall('swipeLeft');
			}
		}

		if(!o.isMove) evtCall('click');

		evtCall('end');
		reset();
	}
	
	function canMove(x,y) {

		var mType = '';
		var absX = Math.abs(o.beginPoint.x - x);
		var absY = Math.abs(o.beginPoint.y - y);
		if(absX > 50 || absY > 50) {
			o.isMove = true;
			return;
		}

		if(absX > absY) {
			if(o.beginPoint.x - x < -3) {
				mType = 'canMoveRight';
			} else if(o.beginPoint.x - x > 3) {
				mType = 'canMoveLeft';
			}
		} else {
			if(o.beginPoint.y - y < -3) {
				mType = 'canMoveDown';
			} else if(o.beginPoint.y - y > 3) {
				mType = 'canMoveUp';
			}
		}
		if(mType == '') return;

		for(var i=0;i<elements.length;i++) {
			var e = elements[i];
			var cm = false;
			if($.isFunction(e[mType])){
				cm = e[mType]();
			}else{
				cm = e[mType] == true;
			}
			if(!cm) continue;

			o.isMove = true;
			return;
		}
	}
	function getV(v) {
		var absV = Math.abs(v);
		if(v < 1) {
			absV = absV * absV;
		} else {
			absV = Math.sqrt(absV);
		}
		if(v < 0) return -absV;
		return absV;
	}
	function moving() {
		if(elements.length == 0) return end(true);

		var now = (new Date()).getTime();
		var duration = now - o.lastTime;

		if($.phone.phoneType == $.phone.FIREFOX) event = arguments[0];
		if(event && event.preventDefault) {
			event.preventDefault(); //如果不加的话，有些手机拖不动
		} else {
			window.event.returnValue = false;
		}

		var clientX,clientY;
		if(isTouch) {
			var touch = event.touches[0];
			clientX = touch.pageX;
			clientY = touch.pageY;
		} else {
			clientX = event.clientX;
			clientY = event.clientY;
		}
		if(!o.isMove) canMove(clientX,clientY);
		/*
		if(!o.isMove && (Math.abs(o.beginPoint.x - clientX) > 3 || Math.abs(o.beginPoint.y - clientY) > 3)) {
			o.isMove = true;
		}*/

		o.distance.x = clientX - o.beginPoint.x; 
		o.distance.y = clientY - o.beginPoint.y; 
		if(Math.abs(o.distance.x) < Math.abs(o.distance.y * 2)) dragFlag = -2;

		o.moveDistance.x = clientX - o.nowPoint.x; 
		o.moveDistance.y = clientY - o.nowPoint.y; 
		if(o.moveDistance.x < 0) {
			if(dragFlag == 0 || dragFlag == 1) {
				dragFlag = 1;
				if(o.distance.x < -10) {
					evtCall('dragLeft');
					dragFlag = -2;
				}
			} else {
				dargFlag = -1;
			}
		} else if(o.moveDistance.x > 0) {
			if(dragFlag == 0 || dragFlag == 2) {
				dragFlag = 2;
				if(o.distance.x > 10) {
					evtCall('dragRight');
					dragFlag = -2;
				}
			} else {
				dargFlag = -1;
			}
		} else {
			dragFlag = -1;
		}
		if((Math.abs(o.moveDistance.x) > 0 || Math.abs(o.moveDistance.y) > 0) && duration >= 1) {
			/*o.v.x = (o.v.x + o.moveDistance.x / duration)/2;
			o.v.y = (o.v.y + o.moveDistance.y / duration)/2;*/
			o.v.x = o.moveDistance.x / duration;
			o.v.y = o.moveDistance.y / duration;
			o.v.x = getV(o.v.x);
			o.v.y = getV(o.v.y);
			o.nowPoint.x = clientX;
			o.nowPoint.y = clientY;
			o.lastTime = now;
		} else if((clientX == o.nowPoint.x && clientY == o.nowPoint.y) || duration > 5) {
			o.v.x = 0;
			o.v.y = 0;

			o.nowPoint.x = clientX;
			o.nowPoint.y = clientY;
			o.lastTime = now;
		}
		if(o.isMove) evtCall('moving');

		//console.log('time:' + ((new Date()).getTime() - now) + ',delay:' + duration);
	}

	function _bind(e) {
		if(!o.isEnd) reset();

		if($.phone.phoneType == $.phone.FIREFOX) event = e;

		var tagName = getTagName(e);
		if(tagName != 'input' && tagName != 'textarea') { //这样点击旁边不会出现自动让input获得焦点
			isInput = false;

			if(e && e.preventDefault) {
				e.preventDefault(); //如果不加的话，有些手机拖不动
			} else {
				window.event.returnValue = false;
			}
		} else {
			isInput = true;
		}

		//获取触摸点（鼠标点）
		if(isTouch) { //触摸
			var touch = event.touches[0];
			o.beginPoint.x = touch.pageX;
			o.beginPoint.y = touch.pageY;
			o.nowPoint.x = touch.pageX;
			o.nowPoint.y = touch.pageY;
		} else { //鼠标
			o.beginPoint.x = event.clientX;
			o.beginPoint.y = event.clientY;
			o.nowPoint.x = event.clientX;
			o.nowPoint.y = event.clientY;
		}
		
		$.notification.send('touchStart');

		if(elements.length == 0) {
			o.isEnd = true;
			return false;
		}

		if(isPause) {
			reset();
			return true;
		}

		var now = (new Date()).getTime();

		if(!isTouch) {
			$document.bind("mousemove",moving);
			$document.bind("mouseup",end);
		} else {
			$document.bind("touchmove",moving);
			$document.bind("touchend",end);
		}
		begin();
		return true;
	}

	if(!$.phone.isPhoneGap) {
		$document.bind("mousedown",function(e) {
			isTouch = false;
			return !_bind(e);
		});

		$document.bind($.phone.mousewheel,function(e) {

			if(elements.length == 0) return true;

			o.beginPoint.x = 0;
			o.beginPoint.y = 0;
			o.nowPoint.x = 0;
			o.nowPoint.y = 0;
			o.moveDistance.x = 0;
			o.moveDistance.y = 0;

			evtCall('begin');

			var distance = 0;
			if($.phone.phoneType == $.phone.FIREFOX) {
				distance = -e.detail;
			} else {
				var flex = 2
				if($.phone.phoneType == $.phone.IE) flex = 2;
				if(e.wheelDelta >= 0) {
					distance = parseInt(Math.sqrt(e.wheelDelta)/flex);
				} else {
					distance = -parseInt(Math.sqrt(-e.wheelDelta)/flex);
				}
			}
			o.beginPoint.x = 0;
			o.beginPoint.y = distance;
			o.nowPoint.x = 0;
			o.nowPoint.y = distance;
			o.distance.x = 0;
			o.distance.y = distance;
			o.moveDistance.x = 0;
			o.moveDistance.y = distance;

			evtCall('moving');

			o.v.x = 0;
			o.v.y = 0;
			//o.v.y = distance / 50;
			evtCall('end');

			reset();

			e.preventDefault(); //如果不加的话，有些手机拖不动
			return false;
		});
	}
	$document.bind("touchstart",function(e) {
		isTouch = true;
		return !_bind(e);
	});

	return o;
}
