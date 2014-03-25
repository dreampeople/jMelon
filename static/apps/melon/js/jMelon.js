/**
 * 此库为jMelon的基础库
 *
 * 作者: 朱杰
 * 开发时间: 2012-10-23
 */
(function() {

//基本设置
var settings = {};
var phone = {};

(function() {
	var agent = window.navigator.userAgent.toLowerCase();;

	settings.useNoTrans = false;

	phone.IOS = 1;
	phone.ANDROID = 2;
	phone.FIREFOX = 3;
	phone.IE = 4;
	phone.ver = 0;

	if(window.staticDir) {
		settings.staticDir = window.staticDir;
	} else {
		settings.staticDir = 'static/apps/main';
	}
	settings.isCore=!!window.isCore;
	settings.isPhoneGap = !!window.isPhoneGap;
	settings.isPhone = false;
	settings.useAnim = true;
	settings.useLocalAnimate = true;
	settings.tagEventOn=false;
	settings.renderDuration=0;

	phone.enable3D = true;
	phone.mousewheel = "mousewheel";

	/**
	phoneType
		1	-	ios
		2	-	android
		3	-	firefox
		4	-	ie
	 */
	if (agent.indexOf('iphone') >= 0 ||
		agent.indexOf('ipad') >= 0) {
		settings.isPhone = true;
		settings.useNoTrans = false;
		phone.phoneClass = 'ios';
		phone.phoneType = phone.IOS;
		settings.renderDuration=1;
	} else if(agent.indexOf('android') >= 0) {
		settings.isPhone = true;
		settings.useNoTrans = false;
		phone.phoneClass = 'android';
		phone.phoneType = phone.ANDROID;
		settings.renderDuration=0;
	} else if(agent.match(/firefox\/([\d.]+)/)) {
		settings.useNoTrans = false;
		phone.phoneClass = 'firefox';
		phone.phoneType = phone.FIREFOX;
		settings.renderDuration=50;
		phone.mousewheel = "DOMMouseScroll";
	} else if(agent.match(/msie ([\d.]+)/)) {
		phone.phoneClass = 'ie';
		phone.phoneType = phone.IE;
		settings.renderDuration=50;
		var arr = /msie \d+/.exec(agent);
		if(arr && arr.length > 0) phone.ver = parseInt(arr[0].substring(5));

		if(phone.ver <= 8) {
			settings.tagEventOn=true;
			settings.useNoTrans = true;
			phone.enable3D = false;
			settings.useLocalAnimate = false;
		} else if(phone.ver <= 9) {
			settings.tagEventOn=false;
			settings.useNoTrans = false;
			phone.enable3D = false;
			settings.useLocalAnimate = false;
		} else {
			settings.tagEventOn=false;
			settings.useNoTrans = false;
			phone.enable3D = true;
			settings.useLocalAnimate = true;
		}
	} else if(agent.match(/rv:([\d.]+)/)) {
		phone.phoneClass = 'ie';
		phone.phoneType = phone.IE;
		settings.renderDuration=50;
		var arr = /rv:\d+/.exec(agent);
		if(arr && arr.length > 0) phone.ver = parseInt(arr[0].substring(5));

		settings.tagEventOn=false;
		settings.useNoTrans = false;
		phone.enable3D = true;
		settings.useLocalAnimate = true;

	} else {
		settings.useNoTrans = false;
		phone.phoneClass = 'ios';
		phone.phoneType = phone.IOS;
	}
})();

/**
 * jMelon基础库生成逻辑
 */
var jMelon = (function() {

	/*解决ie兼容性问题*/
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf=function(el, index){
			var n = this.length>>>0, i = ~~index;
			if(i < 0) i += n;
			for(; i < n; i++) if(i in this && this[i] === el) return i;
			return -1;
		}
	}
	if(phone.phoneType == phone.IE && phone.ver <= 8) {
		Array.prototype.splice= function (start,count) {
			if(count === undefined) count = this.length;
			var r = [];
			var cnt = 0;
			for(var i=0;i<this.length;i++) {
				if(i<start) {
					r.push(this[i]);
					continue;
				}
				if(i>=start && cnt < count) {
					cnt ++;
					continue;
				}
				r.push(this[i]);
			}
			this.length = 0;
			for(var i=0;i<r.length;i++) {
				this.push(r[i]);
			}
			return this;
		}
	}

	var readyList = []; //页面就绪后调用的函数列表

	/**
	 * 元素的包装
	 */
	function WidgetBase(e) {
		this.lastClickStamp = 0;
		//dom 变量
		this.e = e;
		//父节点引用
		this.parent = null;
		//子节点
		this.children = [];

		this.disableFlag = false;
		this.showFlag = true;

		//css 属性
		this.style = {};
		//transform 属性
		this.x = 0; this.y = 0; this.z = 0;
		this.status = 1;
		this.transform = {scale: {x: 1,y: 1, z:1},
						skew: {x: 0,y: 0},
						rotate: {x: 0,y: 0, z:0}
						};
		//事件属性
		this.evtFunc = null;
		this.events = {};

		this.enableDown = false;
		this.buttonStyle = false;
		this.modalStyle = false;

		//类名
		this.classNames = [];
	}

	/**
	 * 获取事件函数
	 */
	function getEventFunc(elem) {
		return function() {
			if(elem.disableFlag) return;
			//if(elem.buttonStyle && !elem.canClick()) return;
			if(!elem.canClick()) return;
			$.phone.touchIntf.addElement(elem);
		};
	}
	/**
	 * 绑定内部事件
	 */
	WidgetBase.prototype.live = function(evtName,callback,delegate) {
		if(!this.evtFunc) {
			this.evtFunc = getEventFunc(this);
			if(!$.settings.isPhoneGap) {
				this.bind("mousedown",this.evtFunc);
				this.bind(phone.mousewheel,this.evtFunc);
			}
			this.bind("touchstart",this.evtFunc);
		}
		this.events[evtName] = [callback,delegate];
	};
	/**
	 * 解绑内部事件
	 */
	WidgetBase.prototype.unlive = function(evtName) {
		if(!this.evtFunc) return;

		if(evtName) {
			if(this.events[evtName]) delete this.events[evtName];
		} else {
			this.events = {};
		}
		if($.keys(this.events).length == 0) {
			if(!$.settings.isPhoneGap) this.unbind("mousedown",this.evtFunc);
			this.unbind("touchstart",this.evtFunc);
			delete this.evtFunc;
		}
	};
	/**
	 * 取消当前事件
	 */
	WidgetBase.prototype.notifyEvent = function(evtName) {
		for(var i=0;i<this.children.length;i++) {
			this.children[i].notifyEvent(evtName);
		}
		this.fire(evtName);
	};
	/**
	 * 取消当前事件
	 */
	WidgetBase.prototype.cancelEvent = function() {
		$.phone.touchIntf.removeElement(this);
	};

	/**
	 * 触发事件
	 */
	WidgetBase.prototype.evtCall = function(evtName) {
		if(!$.isFunction(this[evtName])) return;
		
		var args = [];
		for(var i=1;i<arguments.length;i++) args.push(arguments[i]);

		return this[evtName].apply(this,args);
	};

	/**
	 * 触发事件
	 */
	WidgetBase.prototype.fire = function(evtName) {
		if(!this.e) return;
		if(!this.isEnable()) return;

		if(this.enableDown) {
			if(evtName === 'down') {
				this.addClass('down');
			} else if(evtName === 'moving') {
				this.removeClass('down');
			} else if(evtName === 'end') {
				this.lock();
				$.util.afterRender(function() {
					this.removeClass('down');
					this.unlock();
				},this);
			}
		}

		if(evtName === 'click') {
			//在动画过程中不能点击
			if($.phone.inTransform) return;

			//当前节点已经隐藏,不处理
			if(!this.isShow()) return;

			//同一个节点，两次点击小于1秒钟，不处理
			var timeStamp = (new Date()).getTime();
			if(timeStamp - this.lastClickStamp < 500) return;

			this.lastClickStamp = timeStamp;
		}
		if(this.events[evtName]) {
			var callback = this.events[evtName][0];
			var delegate = this.events[evtName][1];
			try {
				if(delegate) callback.call(delegate,this);
				else callback.call(this,this);
			} catch(error) {
				if(error.message){
					console.log(error.message);
				}else{
					console.log(error);
				}
			}
		}
		if(this.modalStyle) {
			if(evtName === 'begin') return true;
			else if(evtName === 'moving') return true;
		}
		if(this.buttonStyle) {
			if(evtName === 'begin') return true;
			else if(evtName === 'moving') return false;
		}
	};

	/**
	 * find
	 */
	WidgetBase.prototype.find = function(name,elemType) {
		if(!this.e) return;
		if(elemType === 'class') {
			return this.e.getElementsByClassName(name);
		} else if(elemType === 'tag') {
			return this.e.getElementsByTagName(name);
		} else if(elemType === 'id') {
			return this.e.getElementById(name);
		} else {
			var e = this.e.getElementById(name);
			if(!e) return null;
			return jMelon(e);
		}
	};

	/**
	 * 删除一个dom节点
	 */
	WidgetBase.prototype.remove = function() {
		this.stop();
		while(true) {
			if(this.children.length == 0) break;
			this.children[0].remove();
		}
		this.fire('remove');
		this.children = null;
		this.unlive();
		this.parent.e.removeChild(this.e); //删除dom实体
		this.e = null; //断开dom
		for(var i=0;i<this.parent.children.length;i++) {
			if(this.parent.children[i] === this) {
				this.parent.children.splice(i,1);
				break;
			}
		}
		this.parent = null; //断开父节点
		this.status = 9;
	};

	/**
	 * 删除所有的子节点
	 */
	WidgetBase.prototype.removeChildren = function() {
		while(true) {
			if(this.children.length == 0) break;
			this.children[0].remove();
		}
		this.children = [];
	}

	/**
	 * bind
	 */
	WidgetBase.prototype.bind = function(evtName,callback) {
		if(!this.e) return this;
		if(!$.settings.tagEventOn && document.addEventListener) {
			this.e.addEventListener(evtName,callback);
		} else {
			if($.settings.tagEventOn && evtName.search("mouse") == 0) evtName = "on" + evtName;
			this.e.attachEvent(evtName,callback);
		}
		return this;
	};

	/**
	 * unbind
	 */
	WidgetBase.prototype.unbind = function(evtName,callback) {
		if(!this.e) return this;
		if(!$.settings.tagEventOn && document.addEventListener) {
			this.e.removeEventListener(evtName,callback);
		} else {
			if($.settings.tagEventOn && evtName.search("mouse") == 0) evtName = "on" + evtName;
			this.e.detachEvent(evtName,callback)
		}
		return this;
	};

	/**
	 * focus
	 */
	WidgetBase.prototype.focus = function() {
		if(!this.e) return this;
		this.e.focus();
		return this;
	};

	/**
	 * value === undefined 获取dom节点的value值
	 * 否则 设置 value
	 */
	WidgetBase.prototype.val = function(value) {
		if(!this.e) return this;
		if(value === 'undefined') value = '';
		if(value === undefined) return this.e.value;

		this.e.value = value;
		return this;
	};

	/**
	 * 获取节点的高度
	 */
	WidgetBase.prototype.height = function() {
		if(!this.e) return 0;
		return this.e.offsetHeight;
	};

	/**
	 * 获取节点的宽度
	 */
	WidgetBase.prototype.width = function() {
		if(!this.e) return 0;
		return this.e.offsetWidth;
	};

	/**
	 * 获取元素的相对父节点的位置
	 */
	WidgetBase.prototype.position = function() {
		if(!this.e) return {left: 0,top: 0, width: 0, height: 0};
		var rect = this.e.getBoundingClientRect();
		var parentRect = this.parent.e.getBoundingClientRect();
		return {left: rect.left - parentRect.left,
				top: rect.top - parentRect.top,
				width: rect.width,
				height: rect.height };
	};

	/**
	 * 获取元素的相对窗口的位置
	 */
	WidgetBase.prototype.offset = function() {
		if(!this.e) return {left: 0,top: 0, width: 0, height: 0};
		var rect = this.e.getBoundingClientRect()
		return {left: rect.left + window.pageXOffset,
				top: rect.top + window.pageYOffset,
				width: rect.width,
				height: rect.height };
	};

	/**
	 * 获取元素的相对view的位置
	 */
	WidgetBase.prototype.viewset = function() {
		if(!this.e) return {left: 0,top: 0, width: 0, height: 0};
		return this.e.getBoundingClientRect()
	};

	/**
	 * html
	 */
	WidgetBase.prototype.html = function(html) {
		if(!this.e) return '';
		if(html === 'undefined') html = '';
		if(html === undefined) return this.e.innerHTML;

		if($.isString(html)) {
			html = html.replace('undefined,','');
			html = html.replace('undefined','');
		}
		this.removeChildren();
		this.e.innerHTML = html;
	};

	/**
	 * text
	 */
	WidgetBase.prototype.text = function(text) {
		if(!this.e) return '';
		if(text === 'undefined') text = '';
		if(text) this.e.textContent = text;
		else this.e.textContent = '';
	};

	/**
	 * 获取计算后的css
	 */
	WidgetBase.prototype.getComputedStyle = function() {
		if ( window.getComputedStyle ) {
			return document.defaultView.getComputedStyle(this.e);
		} else {
			return this.e.currentStyle;
		}
	};

	/**
	 * 是否显示
	 */
	WidgetBase.prototype.isShow = function() {
		if(!this.showFlag) return false;
		if(this.parent) return this.parent.isShow();

		return true;
	};

	/**
	 * 是否是能
	 */
	WidgetBase.prototype.isEnable = function() {
		if(this.disableFlag) return false;
		if(this.parent) return this.parent.isEnable();

		return true;
	};

	/**
	 * 显示
	 */
	WidgetBase.prototype.show = function() {
		this.showFlag = true;
		if(this.css('display') !== 'none') return;
		if('display' in this.style) this.css('display',null);
		else this.css('display','block');

		this.notifyEvent('show');
	}

	/**
	 * 隐藏
	 */
	WidgetBase.prototype.hide = function() {
		this.showFlag = false;
		if(this.css('display') === 'none') return;
		if('display' in this.style) this.css('display',null);
		else this.css('display','none');

		this.notifyEvent('hide');
	}

	/**
	 * class 判断
	 */
	WidgetBase.prototype.hasClass = function(className) {
		return this.classNames.toString().indexOf(className) >= 0;
	}

	/**
	 * 添加一个 class
	 */
	WidgetBase.prototype.addClass = function(className) {
		if(!this.e) return this;
		if(!className) {
			this.e.className = this.classNames.join(' ');
			return this;
		}
		var update = false;
		if($.isArray(className)) {
			for(var i=0;i<className.length;i++) {
				var cName = className[i];
				if(this.classNames.indexOf(cName) < 0) {
					update = true;
					this.classNames.push(cName);
				}
			}
		} else {
			if(this.classNames.indexOf(className) < 0) {
				update = true;
				this.classNames.push(className);
			}
		}
		if(update) this.e.className = this.classNames.join(' ');
		return this;
	}

	/**
	 * 设置 class
	 */
	WidgetBase.prototype.setClass = function(className) {
		this.classNames.splice(0);
		this.addClass(className);
	}

	/**
	 * 删除一个 class
	 */
	WidgetBase.prototype.removeClass = function(className) {
		if(!this.e) return this;
		var update = false;
		if($.isObject(className)) {
			for(var i=0;i<className.length;i++) {
				var cName = className[i];
				var idx = this.classNames.indexOf(cName);
				if(idx < 0) continue;
				update = true;
				this.classNames.splice(idx,1);
			}
		} else {
			var idx = this.classNames.indexOf(className);
			if(idx >= 0) {
				update = true;
				this.classNames.splice(idx,1);
			}
		}

		if(update) this.e.className = this.classNames.join(' ');
		return this;
	};

	/**
	 * 为dom增加属性
	 */
	WidgetBase.prototype.attr = function(name,val) {
		if(!this.e) return;
		if($.isObject(name)) {
			for(var k in name) {
				if(name[k] === 'undefined' || name[k] === undefined) {
					this.e.setAttribute(k,'');
				} else {
					this.e.setAttribute(k,name[k]);
				}
			}
		} else {
			if(val === undefined) return this.e.getAttribute(name);
			this.e.setAttribute(name,val);
		}
	};

	/**
	 * 移动节点到绝对位置
	 */
	WidgetBase.prototype.moveTo = function(x,y,update) {
		if(x != null) this.x = x
		if(y != null) this.y = y

		if(update || update === undefined) this.update();
	};
	//移动节点到相对位置
	WidgetBase.prototype.move = function(x,y,update) {
		if(x == null) x = 0
		if(y == null) y = 0
		this.moveTo(this.x + x,
					this.y + y,update);
	};
	//压缩到绝对大小
	WidgetBase.prototype.scaleTo = function(x,y,update) {
		if(x != null)
			this.transform.scale.x = x
		if(y != null)
			this.transform.cale.y = y

		if(update || update === undefined) this.update();

	};
	//压缩到相对大小
	WidgetBase.prototype.scale = function(x,y,update) {
		if(x == null) x = 0
		if(y == null) y = 0
		this.scaleTo(this.transform.scale.x + x,
					this.transform.scale.y + y,update);
	};
	//变形到绝对角度
	WidgetBase.prototype.skewTo = function(x,y,update) {
		if(x != null) this.transform.skew.x = x
		if(y != null) this.transform.skew.y = y

		if(update || update === undefined) this.update();
	};
	//变形到相对角度
	WidgetBase.prototype.skew = function(x,y,update) {
		if(x == null) x = 0
		if(y == null) y = 0
		this.skewTo(this.transform.skew.x + x,
					this.transform.skew.y + y,update);
	};
	//旋转到相绝对角度
	WidgetBase.prototype.rotateTo = function(angle,update) {
		if(angle != null) this.transform.rotate.z = angle;
		if(update || update === undefined) this.update();
	};
	//旋转到相对角度
	WidgetBase.prototype.rotate = function(angle,update) {
		if(angle == null) angle = 0
		this.rotateTo(this.transform.rotate.z + angle, update);
	};

	//获取或设置css属性
	WidgetBase.prototype.css = function(name,val,update) {
		if($.isObject(name)) {
			for(var k in name) {
				if(name[k] === null) {
					if(k in this.style) delete this.style[k];
				} else {
					if(name[k] === 'undefined' || name[k] === undefined) name[k] = '';
					if(k === 'x') {
						this.x = name[k];
					} else if(k === 'y') {
						this.y = name[k];
					} else if(k === 'z') {
						this.z = name[k];
					} else if(k === 'skewX') {
						this.transform.skew.x = name[k];
					} else if(k === 'skewY') {
						this.transform.skew.y = name[k];
					} else if(k === 'scaleX') {
						this.transform.scale.x = name[k];
					} else if(k === 'scaleY') {
						this.transform.scale.y = name[k];
					} else if(k === 'scaleZ') {
						this.transform.scale.z = name[k];
					} else if(k === 'rotate') {
						this.transform.rotate.z = name[k];
					} else if(k === 'rotateZ') {
						this.transform.rotate.z = name[k];
					} else if(k === 'rotateX') {
						this.transform.rotate.x = name[k];
					} else if(k === 'rotateY') {
						this.transform.rotate.y = name[k];
					} else {
						var value = ($.isNumber(name[k])?name[k] + 'px':name[k]);
						this.style[k] = name[k];
					}
				}
			}
			if(val || val === undefined) update = true;
		} else {
			if(val === 'undefined') val = '';
			if(val === undefined) {
				if(name in this.style) return this.style[name];
				var computeStyle = this.getComputedStyle();
				if(name in computeStyle) return computeStyle[name];
				return null;
			} else if(val === null) {
				if(name in this.style) delete this.style[name];
			} else {
				if(name === 'x') {
					this.x = val;
				} else if(name === 'y') {
					this.y = val;
				} else if(name === 'z') {
					this.z = val;
				} else if(name === 'skewX') {
					this.transform.skew.x = val;
				} else if(name === 'skewY') {
					this.transform.skew.y = val;
				} else if(name === 'scaleX') {
					this.transform.scale.x = val;
				} else if(name === 'scaleY') {
					this.transform.scale.y = val;
				} else if(name === 'scaleZ') {
					this.transform.scale.z = val;
				} else if(name === 'rotate') {
					this.transform.rotate.z = val;
				} else if(name === 'rotateZ') {
					this.transform.rotate.z = val;
				} else if(name === 'rotateX') {
					this.transform.rotate.x = val;
				} else if(name === 'rotateY') {
					this.transform.rotate.y = val;
				} else {
					var value = ($.isNumber(value)?value + 'px':value);
					this.style[name] = val;
				}
			}
			if(update === undefined) update = true;
		}
		if(update) this.update();
	}
	WidgetBase.prototype.setUseNOTrans = function() {
		if($.phone.phoneType != 2) return;
		this.addClass('no-trans');
		this.useNoTrans = true;
	};
	WidgetBase.prototype.isNoTrans = function() {

		if(settings.useNoTrans) return true;

		if(this.useNoTrans) return true;

		if(!this.parent) return false;

		return this.parent.isNoTrans();
	};

	/*刷新css属性串*/
	WidgetBase.prototype.update = function() {
		if(!this.e) return;

		var cssText = '';
		for(var k in this.style) {
			if(k === 'opacity' || k === 'z-index') {
				cssText += k + ':' + this.style[k] + ';';
			} else {
				cssText += k + ':' + ($.isNumber(this.style[k])?this.style[k] + 'px':this.style[k]) + ';';
			}
		}

		var transformText = '';
		if(this.x != 0 || this.y != 0 || this.z != 0 ) {
			if(this.isNoTrans()) {
				if(this.y != 0) cssText += 'top:' + parseInt(this.y) + 'px;';
				if(this.x != 0) cssText += 'left:' + parseInt(this.x) + 'px;';
			} else if($.phone.enable3D) {
				transformText += 'translate3d(' + parseInt(this.x) + 'px,' + parseInt(this.y) + 'px,' + parseInt(this.z) + 'px) ';
			} else {
				transformText += 'translate(' + parseInt(this.x) + 'px,' + parseInt(this.y) + 'px) ';
			}
		}

		if(this.transform.skew.x != 0 || this.transform.skew.y != 0) {
			transformText += 'skew(' + this.transform.skew.x + 'deg,' + this.transform.skew.y + 'deg) ';
		}

		if(this.transform.scale.x != 1 || this.transform.scale.y != 1 || this.transform.scale.z != 1) {
			if($.phone.enable3D)
				transformText += 'scale3d(' + this.transform.scale.x + ',' + this.transform.scale.y + ',' + this.transform.scale.z + ') ';
			else
				transformText += 'scale(' + this.transform.scale.x + ',' + this.transform.scale.y + ') ';
		}

		if(this.transform.rotate.x != 0 || this.transform.rotate.y != 0 || this.transform.rotate.z != 0) {
			if($.phone.enable3D)
				transformText += 'rotateX(' + this.transform.rotate.x + 'deg) ' + 
										'rotateY(' + this.transform.rotate.y + 'deg) ' +
										'rotateZ(' + this.transform.rotate.z + 'deg)';
			else
				transformText += 'rotate(' + this.transform.rotate.z + 'deg)';
		}

		if(transformText.length > 0) {
			if($.phone.phoneType == $.phone.IOS || $.phone.phoneType == $.phone.ANDROID) {
				cssText += '-webkit-transform:' + transformText + ';'
			} else if($.phone.phoneType == $.phone.FIREFOX) {
				cssText += '-moz-transform:' + transformText + ';'
			} else if($.phone.phoneType == $.phone.IE) {
				cssText += '-ms-transform:' + transformText + ';'
			}
		}

		this.e.style.cssText = cssText;
	}

	//控件是否允许点击(当其父节点处在运动中的时候是不允许点击的)
	WidgetBase.prototype.canClick = function() {
		if(!this.isEnable()) return false;
		if(!this.parent) return true;
		if(this.parent.getAnimQueue() != null) return false;
		if(!this.parent.canClick()) return false;

		return true;
	}
	/*是否允许各个方向的拖拽*/
	var canMoveArray = new Array('canMoveUp','canMoveDown','canMoveLeft','canMoveRight');
	for(var i=0;i<canMoveArray.length;i++) {
		k = canMoveArray[i];
		(function(k) {
			WidgetBase.prototype[k] = function() {
				if(!this.parent) return false;
				return this.parent[k]();
			}
		})(k);
	}

	/**
	 * 锁定元素,不响应事件
	 */
	WidgetBase.prototype.lock = function() {
		this.disableFlag = true;
		return this;
	};
	/**
	 * 解除锁定元素,响应事件
	 */
	WidgetBase.prototype.unlock = function() {
		this.disableFlag = false;
		return this;
	};

	/**
	 * 自动锁定
	 */
	WidgetBase.prototype.autoLock = function() {
		this.lock();
		$.util.afterRender(function() {
			this.unlock();
		},this);
	};

	WidgetBase.prototype.enable = function() {
		if(!this.disableFlag) return;

		this.disableFlag = false;
		this.removeClass('disable');
		return this;
	}
	WidgetBase.prototype.disable = function() {
		if(this.disableFlag) return;

		this.disableFlag = true;
		this.addClass('disable');
		return this;
	}

	var appendArray = new Array('append','prepend','before','after');
	for(var i=0;i<appendArray.length;i++) {
		var k = appendArray[i];
		(function(k,idx) {
			WidgetBase.prototype[k] = function(elem) {
				if(!this.e) return null;
				switch(idx) {
				case 0:
					this.e.appendChild(elem.e);
					elem.parent = this;
					this.children.push(elem);
					break;

				case 1:
					//this.e.insertBefore(elem.e,this.e.childNodes[0]);
					this.e.insertBefore(elem.e,this.e.firstChild);
					elem.parent = this;
					this.children.push(elem);
					break;

				case 2:
					this.parent.e.insertBefore(elem.e,this.e);
					elem.parent = this.parent;
					this.parent.children.push(elem);
					break;
				}

				return elem;
			}
		})(k,i);
	}

	WidgetBase.prototype.replace = function(e) {
		this.parent.e.replaceChild(e,this.e);
		this.e = e;
		this.addClass();
		this.update();
	};

	WidgetBase.prototype.setNum = function(num) {
		if(this.numCtrl) {
			if(num) this.numCtrl.e.textContent = num;
			else this.numCtrl.e.textContent = '';
			return;
		}

		if(num) this.numCtrl = this.append($('div',null,null,'number-control',num));
		else  this.numCtrl = this.append($('div',null,null,'number-control'));

		return this;
	};
	WidgetBase.prototype.clearNum = function() {
		if(!this.numCtrl) return this;

		this.numCtrl.remove();
		this.numCtrl = null;
		return this;
	};

	WidgetBase.prototype.dragEnable = function(xEnable,yEnable) {
		this.canMoveLeft = function() { return xEnable;};
		this.canMoveRight = function() { return xEnable;};
		this.canMoveUp = function() { return yEnable;};
		this.canMoveDown = function() { return yEnable;};
		if(!xEnable && !yEnable) {
			this.unlive('begin');
			this.unlive('moving');
			this.unlive('end');
			return;
		}
		if('begin' in this.events) return;

		var lastPoint = {x:0,y:0};
		this.live('begin',function() {
			lastPoint.x = $.phone.touchIntf.nowPoint.x;
			lastPoint.y = $.phone.touchIntf.nowPoint.y;

			this.fire('dragBegin');
			return true;
		},this);
		this.live('moving',function() {

			var dx = $.phone.touchIntf.nowPoint.x - lastPoint.x;
			var dy = $.phone.touchIntf.nowPoint.y - lastPoint.y;
			lastPoint.x = $.phone.touchIntf.nowPoint.x;
			lastPoint.y = $.phone.touchIntf.nowPoint.y;

			if(!xEnable) dx = null;
			if(!yEnable) dy = null;

			this.move(dx,dy);

			this.fire('drag');
		},this);
		this.live('end',function() {
			var dx = $.phone.touchIntf.nowPoint.x - lastPoint.x;
			var dy = $.phone.touchIntf.nowPoint.y - lastPoint.y;
			lastPoint.x = $.phone.touchIntf.nowPoint.x;
			lastPoint.y = $.phone.touchIntf.nowPoint.y;

			if(!xEnable) dx = null;
			if(!yEnable) dy = null;

			this.move(dx,dy);

			this.fire('dragEnd');
		},this);
	};


	var jMelon = function(e,attrs,styles,classNames,html) {
		if($.isFunction(e)) {
			if ( document.readyState === "complete" ) return setTimeout(e,1);

			readyList.push(e);
		} else if($.isString(e)) { /*对字符串进行dom节点配置*/
			var elem = document.createElement(e);
			val = new WidgetBase(elem);
			if(attrs) val.attr(attrs);
			if(styles) val.css(styles,true);
			if(classNames) val.addClass(classNames);
			if(html) val.html(html);
			return val;
		} else  { //if($.isObject(e)) { /*对dom节点进行$*/
			return new WidgetBase(e);
		}
	}

	jMelon.extend = function() {
		var target = arguments[0] || {};
		for(var k in target) WidgetBase.prototype[k] = target[k];
	}

	jMelon.objExtend = function(target,source){
		for (key in source)
			if (source[key] !== undefined)
				target[key] = source[key]
		return target
	}

	jMelon.isFunction = function(value) { return typeof value === 'function' }
	jMelon.isString = function(value) { return typeof value === 'string' }
	jMelon.isNumber = function(value) { return typeof value === 'number' }
	jMelon.isArray = function(value) { return value instanceof Array }
	jMelon.isObject = function(obj) { 
		if(jMelon.isArray(obj)) return false;
		if(jMelon.isString(obj)) return false;
		if(jMelon.isNumber(obj)) return false;
		if(jMelon.isFunction(obj)) return false;
		return obj instanceof Object;
	}
	jMelon.likeArray = function(obj) { return typeof obj.length == 'number' }

	if(!window.Object.keys) {
		jMelon.keys = function(o) {
			var isArray = jMelon.isArray(this);
			var ks = [];
			for(var k in o) {
				if(isArray && k === 'indexOf') continue;
				ks.push(k);
			}
			return ks;
		};
	} else {
		jMelon.keys = window.Object.keys;
	}

	jMelon.each = function(elements, callback){
		var i, key
		if (jMelon.likeArray(elements)) {
			for (i = 0; i < elements.length; i++)
				if (callback.call(elements[i], i, elements[i]) === false) return elements
		} else {
			for (key in elements)
				if (callback.call(elements[key], key, elements[key]) === false) return elements
		}

		return elements
	}

	function domContentLoaded() {
		if(readyList.length == 0) return;
		for(var i=0;i<readyList.length;i++) readyList[i]();
		readyList.splice(0);
	}
	if(document.addEventListener) {
		document.addEventListener('DOMContentLoaded',domContentLoaded);
	} else {
		document.attachEvent('onreadystatechange',function() {
			if(document.readyState !== "complete") return;
			domContentLoaded();
		});
	}

	jMelon.extendClass = function(newClass,extClass) {
		try {
			for(var k in extClass.prototype) {
				newClass.prototype[k] = extClass.prototype[k];
			}
		} catch(err) {
			console.log(err);
		}
		return newClass;
	}
	/**
	 * 用来封装新的控件
	 */
	jMelon.getWidgetClass = function(funcClass) {
		for(var k in WidgetBase.prototype) funcClass.prototype[k] = WidgetBase.prototype[k];
		funcClass.prototype.init = function(tag) {
			WidgetBase.call(this);
			if($.isObject(tag)) {
				this.e = tag;
				return;
			}
			if(!tag) tag = 'div';
			this.e = document.createElement(tag);
		};
		return funcClass;
	}

	jMelon.getStringDate = function(string) {
		var d = new Date(string);
		return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
	};

	jMelon.blur = function() {
		$.plugin.hideSoftInput();
		document.activeElement.blur();
	};
	
	jMelon.clone = function(obj) {
		var o;
		if (typeof obj != "object") {
			o = obj;
			return o;
		}
		if (obj === null) {
				o = null;
				return null;
		}

		if (obj instanceof Date) {
			return new Date(obj);
		} else if (obj instanceof Array) {
			o = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				o.push(jMelon.clone(obj[i]));
			}
		} else {
			o = {};
			for (var j in obj) {
				o[j] = jMelon.clone(obj[j]);
			}
		}
		return o;
	};

	return jMelon;
})();

window.jMelon = window.$ = jMelon;
window.$.settings = settings;
window.$.phone = phone;

})();
