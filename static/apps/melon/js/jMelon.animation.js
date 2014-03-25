(function($) {

/**
 * easing 函数集
 */
easingFuncs = {
	linear: function(x, t, b, c, d) {
		return firstNum + diff * x;
	},
	swing: function (x, t, b, c, d) {
		return ((-Math.cos(x*Math.PI)/2) + 0.5) * c + b;
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - easingFuncs.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return easingFuncs.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return easingFuncs.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
};

//settings
//$.settings.animationDuration = 600;
$.settings.animationDuration = 300;

/**
 * 转场动画集
 */
$.transformFuncs = {

	'slide': function(oldPage,newPage,reverse,duration,callback) {
		var pageWidth = oldPage.width();

		if(!duration) duration = $.settings.animationDuration;
		var oldAnim = {}, anim = {};
		newPage.y = 0;
		oldPage.x = 0;
		oldPage.y = 0;
		anim.x = 0; 
		anim.y = 0; 
		oldAnim.y = 0;
		if(reverse) {
			//newPage.x = - pageWidth/4;
			newPage.x = - pageWidth;
			newPage.css('z-index','0',false);
			newPage.show();
			oldPage.css('z-index','1');
			oldAnim.x = pageWidth;
		} else {
			newPage.x = pageWidth;
			newPage.css('z-index','1',false);
			newPage.show();
			oldPage.css('z-index','0');
			//oldAnim.x = - pageWidth/4;
			oldAnim.x = - pageWidth;
		}
		var easing = null;
		//easing = 'easeInQuad';
		$.util.afterRender(function() {
			if(reverse) {
				if($.settings.useLocalAnimate) {
						oldPage.localAnimate(oldAnim,$.settings.animationDuration,easing,function() {
							oldPage.hide();
							newPage.css('z-index',null,false);
							newPage.update();
							if($.isFunction(callback)) callback();
						});
						newPage.localAnimate(anim,$.settings.animationDuration,easing);
				} else {
					oldPage.animate(oldAnim,$.settings.animationDuration,easing,function() {
						newPage.css('z-index',null);
						oldPage.hide();
						if($.isFunction(callback)) callback();
					});
					newPage.animate(anim,$.settings.animationDuration,easing);
				}
			} else {
				if($.settings.useLocalAnimate) {
					newPage.localAnimate(anim,$.settings.animationDuration,easing);
					oldPage.localAnimate(oldAnim,$.settings.animationDuration,easing,function() {
						oldPage.hide();
						newPage.css('z-index',null,false);
						newPage.update();
						if($.isFunction(callback)) callback();
					});
				} else {
					newPage.animate(anim,$.settings.animationDuration,easing);
					oldPage.animate(oldAnim,$.settings.animationDuration,easing,function() {
						newPage.css('z-index',null);
						oldPage.hide();
						if($.isFunction(callback)) callback();
					});
				}
			}
		});
	},
	'slideup': function(oldPage,newPage,reverse,duration,callback) {
		var pageHeight = oldPage.height();
		if(!duration) duration = $.settings.animationDuration;
		var oldAnim = {}, anim = {};
		newPage.x = 0;
		newPage.y = 0;
		oldPage.x = 0;
		oldPage.y = 0;
		anim.x = 0; 
		anim.y = 0; 
		oldAnim.x = 0;
		oldAnim.y = 0;
		if(reverse) {
			newPage.css('z-index','0',false);
			newPage.show();
			oldPage.css('z-index','1');
			oldAnim.y = pageHeight;
		} else {
			newPage.y = pageHeight;
			newPage.css('z-index','1',false);
			newPage.show();
			oldPage.css('z-index','0');
		}
		var easing = null;
		//easing = 'easeInQuad';
		$.util.afterRender(function() {
			if(reverse) {
				if($.settings.useLocalAnimate) {
					newPage.localAnimate(anim,$.settings.animationDuration,easing);
					oldPage.localAnimate(oldAnim,$.settings.animationDuration,easing,function() {
						oldPage.hide();
						newPage.css('z-index',null,false);
						newPage.update();
						if($.isFunction(callback)) callback();
					});
				} else {
					oldPage.animate(oldAnim,$.settings.animationDuration,easing,function() {
						newPage.css('z-index',null);
						oldPage.hide();
						if($.isFunction(callback)) callback();
					});
					newPage.animate(anim,$.settings.animationDuration,easing);
				}
			} else {
				if($.settings.useLocalAnimate) {
					newPage.localAnimate(anim,$.settings.animationDuration,easing,function() {
						oldPage.hide();
						newPage.css('z-index',null,false);
						newPage.update();
						if($.isFunction(callback)) callback();
					});
					oldPage.localAnimate(oldAnim,$.settings.animationDuration,easing);
				} else {
					newPage.animate(anim,$.settings.animationDuration,easing,function() {
						newPage.css('z-index',null);
						oldPage.hide();
						if($.isFunction(callback)) callback();
					});
					oldPage.animate(oldAnim,$.settings.animationDuration,easing);
				}
			}
		});
	}
};

var intval = 13;
var timerId = null;
var queue = [];
function doAnimate() {
	if(timerId == null) return;
	var now = (new Date()).getTime();
	for(var i = 0; i < queue.length;i++) {
		var e = queue[i].e;
        if(!e) {
            queue.splice(i,1);
            i--;
            continue;
        }
 
		var eq = queue[i].queue[0];
		var ps = eq.properties;
		if($.isFunction(ps)) { //如果ps是函数
			if(eq.begin == 0) {
				eq.begin = now - intval;
			}
			var d = now - eq.begin;
			if(d >= eq.duration) {
				ps.call(eq.delegate,eq.duration,true);
				if(eq.callback) eq.callback.call(eq.delegate);
				queue[i].queue.splice(0,1);
				if(queue[i].queue.length == 0) {
					queue.splice(i,1);
					i--;
				}
			} else {
				if(eq.easing)
					d = eq.duration * eq.easing(d / eq.duration, d, 0, 1, eq.duration );
				ps.call(eq.delegate,d,false);
			}
		} else {
			if(eq.begin == 0) {
				eq.old = {};
				for(var k in ps) {
					if(k === 'x') eq.old.x = e.x;
					else if(k === 'y') eq.old.y = e.y;
					else if(k === 'z') eq.old.z = e.z;
					else if(k === 'height') eq.old.height = e.height();
					else if(k === 'width') eq.old.width = e.width();
					else if(k === 'scaleX') eq.old.scaleX = e.transform.scale.x;
					else if(k === 'scaleY') eq.old.scaleY = e.transform.scale.y;
					else if(k === 'scaleZ') eq.old.scaleZ = e.transform.scale.z;
					else if(k === 'skewX') eq.old.skewX = e.transform.skew.x;
					else if(k === 'skewY') eq.old.skewY = e.transform.skew.y;
					else if(k === 'rotate') eq.old.rotate = e.transform.rotate.z;
					else if(k === 'rotateX') eq.old.rotateX = e.transform.rotate.x;
					else if(k === 'rotateY') eq.old.rotateY = e.transform.rotate.y;
					else {
						var val = e.css(k);
						if(typeof val !== 'number') {
							delete ps[k];
							continue;
						}
						eq.old[k] = val;
					}
				}
				eq.begin = now - intval;
			}

			var d = now - eq.begin;
			if(d >= eq.duration) {
				e.css(ps);
				$.util.afterRender(function() {
					if(this.loopCallback) this.loopCallback.call(this.delegate);
					if(this.callback) this.callback.call(this.delegate);
				},eq);
				queue[i].queue.splice(0,1);
				if(queue[i].queue.length == 0) {
					queue.splice(i,1);
					i--;
				}
			} else {
				var state = d / eq.duration;
				if(eq.easing) {
					var pos = eq.easing(state, d, 0, 1, eq.duration );
					d = eq.duration * pos;
				}
				for(var k in ps) {
					var val = eq.old[k] + (ps[k] - eq.old[k]) * d / eq.duration ;
					if(k === 'x') e.x = val;
					else if(k === 'y') e.y = val;
					else if(k === 'z') e.z = val;
					else if(k === 'scaleX') e.transform.scale.x = val;
					else if(k === 'scaleY') e.transform.scale.y = val;
					else if(k === 'scaleZ') e.transform.scale.z = val;
					else if(k === 'skewX') e.transform.skew.x = val;
					else if(k === 'skewY') e.transform.skew.y = val;
					else if(k === 'rotate') e.transform.rotate = val;
					else if(k === 'rotateX') e.transform.rotate.x = val;
					else if(k === 'rotateY') e.transform.rotate.y = val;
					else e.css(k,val,false);
				}
				e.update();
				if(eq.loopCallback) eq.loopCallback.call(eq.delegate);
			}
		}
	}
	if(queue.length == 0) {
		clearInterval(timerId);
		timerId = null;
		return;
	}
}

$.extend({
	animate: function(properties, duration, easing, callback, loopCallback,delegate) {
		var eq = null;
		for(var i in queue) {
			var q = queue[i];
			if(q.e == this) {
				eq = q;
				break;
			}
		}
		if(eq == null) {
			eq = {e: this,queue: []};
			queue.push(eq);
		}
		var easingFunc = null;
		if(easing in easingFuncs) 
			easingFunc = easingFuncs[easing];
		else
			easingFunc = null;
		eq.queue.push({begin: 0,
					properties: properties,
					duration: duration,
					easing: easingFunc,
					callback: callback,
					loopCallback: loopCallback,
					delegate: delegate});
		if(timerId == null) timerId = setInterval(doAnimate,intval);
		return this;
	},
	stop: function() {
		for(var i in queue) {
			var q = queue[i];
			if(q.e == this) {
				queue.splice(i,1);
				break;
			}
		}
		if(queue.length == 0) {
			clearInterval(timerId);
			timerId = null;
		}
		return this;
	},
	getAnimQueue: function() {
		for(var i in queue) {
			var q = queue[i];
			if(q.e == this) return q;
		}

		return null;
	},
	localAnimate: function(properties, duration, easing, callback,delegate) {
		if(!easing) easing = 'ease-in-out';
		var ps = properties;
		var hasTransform = false;
		var pp = {};
		var e = this;
		for(var k in ps) {
			if(k === 'x') {
				e.x = ps[k];
				hasTransform = true;
			} else if(k === 'y') {
				e.y = ps[k];
				hasTransform = true;
			} else if(k === 'z') {
				e.z = ps[k];
				hasTransform = true;
			} else if(k === 'scaleX') {
				e.transform.scale.x = ps[k];
				hasTransform = true;
			} else if(k === 'scaleY') {
				e.transform.scale.y = ps[k];
				hasTransform = true;
			} else if(k === 'scaleZ') {
				e.transform.scale.z = ps[k];
				hasTransform = true;
			} else if(k === 'skewX') {
				e.transform.skew.x = ps[k];
				hasTransform = true;
			} else if(k === 'skewY') {
				e.transform.skew.y = ps[k];
				hasTransform = true;
			} else if(k === 'rotate') {
				e.transform.rotate = ps[k];
				hasTransform = true;
			} else if(k === 'rotateX') {
				e.transform.rotate.x = ps[k];
				hasTransform = true;
			} else if(k === 'rotateY') {
				e.transform.rotate.y = ps[k];
				hasTransform = true;
			} else {
				e.css(k,ps[k],false);
				pp[k] = duration / 1000;
			}
		}

		var transition = '';
		for(var k in pp) {
			if(transition.length !== 0) transition += ','
			transition += k + ' ' + pp[k] + 's ' + easing;
		}
		if(hasTransform) {
			if(transition.length !== 0) transition += ','
			if($.phone.phoneType == $.phone.IOS || $.phone.phoneType == $.phone.ANDROID) {
				transition = '-webkit-transform ' + duration/1000 + 's ' + easing;
			} else if($.phone.phoneType == $.phone.FIREFOX) {
				transition = '-moz-transform ' + duration/1000 + 's ' + easing;
			} else if($.phone.phoneType == $.phone.IE) {
				transition = 'transform ' + duration/1000 + 's ' + easing;
			}
		}
		if($.phone.phoneType == $.phone.IOS || $.phone.phoneType == $.phone.ANDROID) {
			e.css('-webkit-transition',transition);
			e.css('-webkit-transition',null,false);
		} else if($.phone.phoneType == $.phone.FIREFOX) {
			e.css('-moz-transition',transition);
			e.css('-moz-transition',null,false);
		} else if($.phone.phoneType == $.phone.IE) {
			e.css('transition',transition);
			e.css('transition',null,false);
		}

		if($.isFunction(callback)) {
			var evtFunc = function() {
				if($.phone.phoneType == $.phone.IOS || $.phone.phoneType == $.phone.ANDROID) {
					e.unbind('webkitTransitionEnd',evtFunc);
				} else if($.phone.phoneType == $.phone.FIREFOX) {
					e.unbind('transitionend',evtFunc);
				} else if($.phone.phoneType == $.phone.IE) {
					e.unbind('transitionend',evtFunc);
				} 
				$.util.afterRender(callback,delegate);
			}
			if($.phone.phoneType == $.phone.IOS || $.phone.phoneType == $.phone.ANDROID) {
				e.bind('webkitTransitionEnd',evtFunc);
			} else if($.phone.phoneType == $.phone.FIREFOX) {
				e.bind('transitionend',evtFunc);
			} else if($.phone.phoneType == $.phone.IE) {
				e.bind('transitionend',evtFunc);
			} 
		}
	}
});


$.animate = function(duration,animations,complete,delegate) {
};
})(jMelon);
