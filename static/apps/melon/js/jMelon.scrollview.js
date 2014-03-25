(function($) {
	var minBarLength = 6;
	var ScrollView = $.getWidgetClass(function(className,scrollDelegate) {
		//构建dom节点
		this.init();
		this.setClass(['control','scroll-view','eh']);
		if(className) this.addClass(className);
		this.content = this.append($('div',null,null,'content'));
		this.contentB = this.append($('div',null,null,'contentB'));

		//设置参数
		this.scrollBar = {x: null,y: null};
		this.scrollEnable = {x: false,y: true};
		this.pageEnable = false;
		this.pageSize = 0; //每页的宽度(高度)
		this.pageNum = 0; //当前的页码
		this.marginEnable = {top: true, bottom: true, left: true, right: true};
		this.marginLength = {top: 0, bottom: 0, left: 0, right: 0};
		this.distanceRate = 1; //速度阻尼参数
		this.marginRate = 3; //拉拽阻尼参数
		this.minStopDuration = 500; //自动移动到停止的最小时间
		//内部参数
		this.lastPoint = {x:0,y:0};
		this.isMargin = {top: false,bottom: false,left: false,right: false};
		this.isMarginBegin = {top: false,bottom: false,left: false,right: false};

		this.content.X = 0;
		this.content.Y = 0;
		this.scrollDelegate = scrollDelegate;

		//监听事件
		this.enableScroll(this.scrollEnable.x,this.scrollEnable.y,true);
		this.live('begin',this.begin,this);
		this.live('end',this.end,this);
		this.live('moving',this.moving,this);

		if($.isFunction(this.onScroll)) {
			this.isDynamic = true;
		} else {
			this.isDynamic = false;
		}

		this.inTouch = false;
		this.loopIntval = 0;
		
		this.live('remove',function() {
			this.content.stop();
			if(this.loopIntval != 0) {
				clearInterval(this.loopIntval);
				this.loopIntval = 0;
			}
		},this);
		this.hideScrollBar();
	});
	ScrollView.prototype.enableDynamic = function(flag) {
		this.isDynamic = flag;
	};
	ScrollView.prototype.enableScroll = function(x,y,scrollbarEnable) {
		this.scrollEnable.x = (x === true);
		this.scrollEnable.y = (y === true);
		if(this.scrollEnable.x) {
			this.removeClass('eh');
			this.addClass('ew');
		}
		if(this.scrollEnable.y) {
			this.removeClass('ew');
			this.addClass('eh');
		}
		if(scrollbarEnable) {
			if(this.scrollEnable.x) {
				if(this.scrollBar.x == null) {
					this.scrollBar.x = $('div',{type:'h'},null,'scroll-bar');
					this.contentB.append(this.scrollBar.x).isShow = true;
				}
			} else {
				if(this.scrollBar.x != null) {
					this.scrollBar.x.remove();
					this.scrollBar.x = null;
				}
			}
			if(this.scrollEnable.y) {
				if(this.scrollBar.y == null) {
					this.scrollBar.y = $('div',{type:'v'},null,'scroll-bar');
					this.contentB.append(this.scrollBar.y).isShow = true;
				}
			} else {
				if(this.scrollBar.y != null) {
					this.scrollBar.y.remove();
					this.scrollBar.y = null;
				}
			}
		} else {
			if(this.scrollBar.x != null) {
				this.scrollBar.x.remove();
				this.scrollBar.x = null;
			}
			if(this.scrollBar.y != null) {
				this.scrollBar.y.remove();
				this.scrollBar.y = null;
			}
		}
		this.hideScrollBar();
	}
	ScrollView.prototype.enableMarginTop = function(flag,length) {
		this.marginEnable.top = (flag === true);
		if(!length) length = 0;
		this.marginLength.top = length;
	}
	ScrollView.prototype.enableMarginBottom = function(flag,length) {
		this.marginEnable.bottom = (flag === true);
		if(!length) length = 0;
		this.marginLength.bottom = length;
	}
	ScrollView.prototype.enableMarginLeft = function(flag,length) {
		this.marginEnable.left = (flag === true);
		if(!length) length = 0;
		this.marginLength.left = length;
	}
	ScrollView.prototype.enableMarginRight = function(flag,length) {
		this.marginEnable.right = (flag === true);
		if(!length) length = 0;
		this.marginLength.right = length;
	}
	ScrollView.prototype.canMoveUp = function() {
		return this.scrollEnable.y;
	};
	ScrollView.prototype.canMoveDown = function() {
		return this.scrollEnable.y;
	};
	ScrollView.prototype.canMoveLeft = function() {
		return this.scrollEnable.x;
	};
	ScrollView.prototype.canMoveRight = function() {
		return this.scrollEnable.x;
	};
	ScrollView.prototype.calSize = function() {
		//获取高度
		this.svHeight = this.height();
		this.svWidth = this.width();
		if(this.isDynamic && 'calHeight' in this.content) {
			this.svcHeight = this.content.calHeight;
		} else {
			this.svcHeight = this.content.height();
		}
		this.svcWidth = this.content.width();
		if(this.svcHeight < this.svHeight) this.svcHeight = this.svHeight;
		if(this.svcWidth < this.svWidth) this.svcWidth = this.svWidth;
	};
	ScrollView.prototype.begin = function() {

		this.inTouch = true;

		//停止动画
		this.content.stop();
		this.stopScrollBar();

		this.isFirst = true;

		this.calSize();

		//内部变量
		this.lastPoint.x = $.phone.touchIntf.nowPoint.x;
		this.lastPoint.y = $.phone.touchIntf.nowPoint.y;

		this.isMargin.top = false;
		this.isMargin.bottom = false;
		this.isMargin.left = false;
		this.isMargin.right = false;

		this.isMarginBegin.top = false;
		this.isMarginBegin.bottom = false;
		this.isMarginBegin.left = false;
		this.isMarginBegin.bottom = false;

		//计算页宽
		if(!this.pageEnable || this.pageSize > 0) return;

		if(this.scrollEnable.x) this.pageSize = this.svWidth;
		if(this.scrollEnable.y) this.pageSize = this.svHeight;
	}
	ScrollView.prototype.movingDistance = function(distance,flag) {
		var x,y,top,bottom,marginTop,marginBottom,svcHeight,svHeight;
		if(flag == 'x') {
			if(this.isDynamic) {
				y = 'X';
				x = 'Y';
			} else {
				y = 'x';
				x = 'y';
			}
			sx = 'y';
			sy = 'x';
			top = 'left';
			marginTop = 'marginLeft';
			marginTopBegin = 'marginLeftBegin';
			bottom = 'right';
			marginBottom = 'marginRight';
			marginBottomBegin = 'marginRightBegin';
			svcHeight = this.svcWidth;
			svHeight = this.svWidth;
		} else {
			if(this.isDynamic) {
				y = 'Y';
				x = 'X';
			} else {
				y = 'y';
				x = 'x';
			}
			sx = 'x';
			sy = 'y';
			top = 'top';
			marginTop = 'marginTop';
			marginTopBegin = 'marginTopBegin';
			bottom = 'bottom';
			marginBottom = 'marginBottom';
			marginBottomBegin = 'marginBottomBegin';
			svcHeight = this.svcHeight;
			svHeight = this.svHeight;
		}

		//如果是第一次moving且y移动的距离小于x移动的距离,则不移动
		if(this.isFirst && 
			Math.abs($.phone.touchIntf.distance[sy]) < Math.abs($.phone.touchIntf.distance[sx])) {
			this.cancelEvent();
			return;
		}
		this.isFirst = false;

		this.showScrollBar();

		if(this.content[y] + distance > 0) { //margin top
			if(!this.marginEnable[top]) {
				/*不允许下滑*/
				if(this.content[y] < 0) distance = -this.content[y];
				else distance = 0;
			} else {
				/*允许下滑*/
				if(this.content[y] < 0) {
					distance = -this.content[y] + (distance + this.content[y]) / this.marginRate;
				} else {
					distance = distance / this.marginRate;
					if(!this.isMarginBegin[top] && this.scrollDelegate && $.isFunction(this.scrollDelegate[marginTopBegin])) {
						this.scrollDelegate[marginTopBegin]();
						this.isMarginBegin[top] = true;
					}
				}

				if(this.content[y] + distance > this.marginLength[top]) {
					/*调用marginTop事件*/
					if(!this.isMargin[top] && this.scrollDelegate && $.isFunction(this.scrollDelegate[marginTop]))
						this.scrollDelegate[marginTop](true);
					this.isMargin[top] = true;
				} else {
					/*取消marginTop事件*/
					if(this.isMargin[top] && this.scrollDelegate && $.isFunction(this.scrollDelegate[marginTop]))
						this.scrollDelegate[marginTop](false);
					this.isMargin[top] = false;
				}
			}
		} else if(this.content[y] + svcHeight + distance < svHeight) { //margin bottom
			if(!this.marginEnable[bottom]) {
				/*不允许上滑*/
				if(this.content[y] + svcHeight - svHeight < 0) {
					distance = this.content[y] + svcHeight - svHeight;
				} else {
					distance = 0;

					if(!this.isMarginBegin[bottom] && this.scrollDelegate && $.isFunction(this.scrollDelegate[marginBottomBegin])) {
						this.scrollDelegate[marginBottomBegin]();
						this.isMarginBegin[bottom] = true;
					}
				}
			} else {
				/*允许上滑*/
				if(this.content[y] + svcHeight - svHeight < 0) distance = distance / this.marginRate;
				else distance = (this.content[y] + svcHeight - svHeight + distance ) / this.marginRate;

				if(svHeight - this.content[y] - svcHeight - distance > this.marginLength[bottom]) {
					/*调用marginBottom事件*/
					if(!this.isMargin[bottom] && this.scrollDelegate && $.isFunction(this.scrollDelegate[marginBottom]))
						this.scrollDelegate[marginBottom](true);
					this.isMargin[bottom] = true;
				} else {
					/*取消marginBottom事件*/
					if(this.isMargin[bottom] && this.scrollDelegate && $.isFunction(this.scrollDelegate[marginBottom])) 
						this.scrollDelegate[marginBottom](false);
					this.isMargin[bottom] = false;
				}
			}
		}
		if(distance != 0) {
			this.content[y] += distance;

			if(this.isDynamic) this.onScroll();
			else this.content.update();
		}
	}

	ScrollView.prototype.moving = function() {
		var distanceX = $.phone.touchIntf.nowPoint.x - this.lastPoint.x;
		var distanceY = $.phone.touchIntf.nowPoint.y - this.lastPoint.y;

		if(this.scrollEnable.x) this.movingDistance(distanceX,'x');
		if(this.scrollEnable.y) this.movingDistance(distanceY,'y');

		this.lastPoint.x = $.phone.touchIntf.nowPoint.x;
		this.lastPoint.y = $.phone.touchIntf.nowPoint.y;
	};

	//此处用来结束动画后预加载数据
	ScrollView.prototype.end__ = function() { 

		if(!$.phone.touchIntf.isEnd) return;
		if(!this.preLoadData || !$.isFunction(this.preLoadData)) return;
		if(this.content.getAnimQueue() != null) return;

		$.util.afterRender(function() {
			if(!$.phone.touchIntf.isEnd) return;
			if(this.content.getAnimQueue() != null) return;
			this.preLoadData();
		},this);

	};

	ScrollView.prototype.endDistance = function(flag) {
		var x,y,sx,sy,top,bottom,marginTopEnd,marginBottomEnd,svcHeight,svHeight;
		if(flag == 'x') {
			if(this.isDynamic) {
				y = 'X';
				x = 'Y';
			} else {
				y = 'x';
				x = 'y';
			}
			sy = 'x';
			sx = 'y';
			top = 'left';
			marginTopEnd = 'marginLeftEnd';
			bottom = 'right';
			marginBottomEnd = 'marginRightEnd';
			svcHeight = this.svcWidth;
			svHeight = this.svWidth;
			height = 'width';
		} else {
			if(this.isDynamic) {
				y = 'Y';
				x = 'X';
			} else {
				y = 'y';
				x = 'x';
			}
			sy = 'y';
			sx = 'x';
			top = 'top';
			marginTopEnd = 'marginTopEnd';
			bottom = 'bottom';
			marginBottomEnd = 'marginBottomEnd';
			svcHeight = this.svcHeight;
			svHeight = this.svHeight;
			height = 'height';
		}

		var data = {};
		var scrollData = {}
		var duration = 0;
		var ap; //scrollBar动画属性

		var v = $.phone.touchIntf.v[sy];
		if(v > 3) v = 3;
		else if(v < -3) v = -3;

		//margin top
		if(this.content[y] > 0 || (svHeight > svcHeight && this.content[y] < 0)) { 
			/*计算回到哪里*/
			var L = 0;
			if(this.isMargin[top]) L = this.marginLength[top];

			var oldY = this.content[y];
			this.content.animate(function(duration,isEnd) {
				this.content[y] = oldY + duration / 200 * (L - oldY);
				if(this.isDynamic) this.onScroll();
				else this.content.update();

				if(isEnd) {
					this.hideScrollBar();
					if(this.isMargin[top] && this.scrollDelegate && $.isFunction(this.scrollDelegate[marginTopEnd]))
						this.scrollDelegate[marginTopEnd]();
					this.end__();
				}
			},200,'easeOutQuad',null,null,this);

			if(this.scrollBar[sy]) {
				var r = this.getScrollBarLength(y);
				ap = {};
				ap[height] = r[height];
				this.scrollBar[sy].animate( ap, 200,'easeOutQuad');
			}
			return;
		}

		//margin bottom
		if(this.content[y] + svcHeight < svHeight) { 

			var L = svHeight - svcHeight;
			if(this.isMargin[bottom]) {
				L -= this.marginLength[bottom];
			}

			var oldY = this.content[y];
			this.content.animate(function(duration,isEnd) {
				this.content[y] = oldY + duration / 200 * (L - oldY);
				if(this.isDynamic) this.onScroll();
				else this.content.update();
				if(isEnd) {
					this.hideScrollBar();
					if(this.isMargin[bottom] && this.scrollDelegate && $.isFunction(this.scrollDelegate[marginBottomEnd]))
						this.scrollDelegate[marginBottomEnd]();
					this.end__();
				}
			},200,'easeOutQuad',null,null,this);

			if(this.scrollBar[sy]) {
				var r = this.getScrollBarLength(y);
				ap = {};
				ap[height] = r[height];
				ap[sy] = (svHeight - r[height]);
				this.scrollBar[sy].animate(ap, 200,'easeOutQuad');
			}
			return;
		}
		
		//最后停住了
		var distance = 0;
		duration = 2000;
		var currentPage = this.pageNum;
		if(v == 0 || Math.abs(2000 * v / this.distanceRate) <= 10) {
			if(!this.pageEnable) {
				this.hideScrollBar();
				this.end__();
				return;
			}

			//如果需要定位到页
			currentPage = -parseInt(this.content[y] / this.pageSize);
			if((currentPage + 1) * this.pageSize + this.content[y] > this.pageSize / 2) {
				distance = - currentPage * this.pageSize - this.content[y];
				duration = this.minStopDuration;
			} else {
				distance = - (currentPage + 1) * this.pageSize - this.content[y];
				duration = this.minStopDuration;
				currentPage += 1;
			}
		} else {
			//如果需要定位到页,重新计算distance
			if(this.pageEnable) {
				currentPage = -parseInt(this.content[y] / this.pageSize);
				if(v < 0) {
					distance = - (currentPage + 1) * this.pageSize - this.content[y];
					currentPage += 1;
				} else {
					distance = - currentPage * this.pageSize - this.content[y];
				}
				duration = this.minStopDuration;
			} else {
				distance = duration * v / this.distanceRate;
			}
		}

		if(!this.marginEnable[top]) {
			if(distance > 0 && this.content[y] + distance > 0) {
				distance = -this.content[y];
				duration = distance * this.distanceRate / v;
			}
		}
		if(!this.marginEnable[bottom]) {
			if(distance < 0 && this.content[y] + distance + svcHeight - svHeight < 0) {
				distance = svHeight - this.content[y] - svcHeight;
				duration = distance * this.distanceRate / v;
			}
		}
		if(duration == 0) {
			this.hideScrollBar();
			this.end__();
			return ;
		}

		//碰到上边沿
		if(distance < 0 &&  svcHeight + this.content[y] + distance  < svHeight) {
			var d = svHeight - svcHeight - this.content[y];
			margin = (distance - d) / 10;
			if(-margin > svHeight / this.marginRate / 2) {
				margin = -svHeight / this.marginRate / 2;
			}
			duration = Math.abs((d + margin) * this.distanceRate / v);
			var L = this.content[y] + d + margin;
			var oldY = this.content[y];
			this.content.animate(function(d,isEnd) {
				this.content[y] = oldY + d / duration * (L - oldY);
				if(this.isDynamic) this.onScroll();
				else this.content.update();
				if(isEnd) oldY = this.content[y];
			},duration,'easeOutQuad',null,null,this);

			var K = svHeight - svcHeight;
			this.content.animate(function(d,isEnd) {
				this.content[y] = oldY + d / 200 * (K - oldY);
				if(this.isDynamic) this.onScroll();
				else this.content.update();
				if(isEnd) {
					this.hideScrollBar();
					this.end__();
				}
			},200,'easeOutQuad',null,null,this);
			if(this.scrollBar[sy]) {
				var barL = this.scrollBar[sy][height]();
				ap = {};
				ap[sy] = svHeight - barL;
				this.scrollBar[sy].animate(ap, duration - 200,'easeOutQuad');
				var minL = barL + margin < minBarLength?minBarLength:barL + margin;
				ap = {};
				ap[height] = minL;
				ap[sy] = svHeight - minL;
				this.scrollBar[sy].animate(ap, 200,'easeOutQuad');
				ap = {};
				ap[height] = barL;
				ap[sy] = svHeight - barL;
				this.scrollBar[sy].animate(ap, 200,'easeOutQuad');
			}
			return;
		}

		//碰到下边沿
		if(distance > 0 && this.content[y] + distance > 0) {
			var d = - this.content[y];
			var margin = (distance - d) / 10;
			if(margin > svHeight / this.marginRate / 2) {
				margin = svHeight / this.marginRate / 2;
			}
			duration = Math.abs((d + margin) * this.distanceRate / v);
			var L = margin;
			var oldY = this.content[y];
			this.content.animate(function(d,isEnd) {
				this.content[y] = oldY + d / duration * (L - oldY);
				if(this.isDynamic) this.onScroll();
				else this.content.update();
				if(isEnd) oldY = this.content[y];
			},duration,'easeOutQuad',null,null,this);

			var K = 0;
			this.content.animate(function(d,isEnd) {
				this.content[y] = oldY + d / 200 * (K - oldY);
				if(this.isDynamic) this.onScroll();
				else this.content.update();
				if(isEnd) {
					this.hideScrollBar();
					this.end__();
				}
			},200,'easeOutQuad',null,null,this);
			if(this.scrollBar[sy]) {
				var barL = this.scrollBar[sy][height]();
				ap = {};
				ap[sy] = 0;
				this.scrollBar[sy].animate(ap, duration - 200,'easeOutQuad');
				var minL = barL - margin < minBarLength?minBarLength:barL - margin;
				ap = {};
				ap[height] = minL;
				this.scrollBar[sy].animate(ap, 200,'easeOutQuad');
				ap = {};
				ap[height] = barL;
				this.scrollBar[sy].animate(ap, 200,'easeOutQuad');
			}
			return;
		}

		//不碰到上边沿
		var oldY = this.content[y];
		var L = this.content[y] + distance;
		this.content.animate(function(d,isEnd) {
			this.content[y] = oldY + d / duration * (L - oldY);
			if(this.isDynamic) this.onScroll();
			else this.content.update();
			if(isEnd) {
				if(this.pageEnable && currentPage != this.pageNum) { //翻页回调
					if($.isFunction(this.onPageChanged)) {
						this.onPageChanged(currentPage,this.pageNum);
					}
					this.pageNum = currentPage;
				}
				this.hideScrollBar();
				this.end__();
			}
		},duration,'easeOutQuad',null,null,this);
		if(this.scrollBar[sy]) {
			ap = {};
			ap[sy] = this.scrollBar[sy][sy] - distance/svcHeight * svHeight;
			this.scrollBar[sy].animate(ap, duration,'easeOutQuad');
		}
	}
	ScrollView.prototype.end = function() {

		this.inTouch = false;

		//让自动滚动停止2秒
		this.lastScrollTime = (new Date()).getTime() + this.scrollDelayDuration *2 + this.minStopDuration;

		if(this.scrollEnable.y) this.endDistance('y');
		if(this.scrollEnable.x) this.endDistance('x');
	}

	/*
	 * 获取滚动条的长度
	 *	type
	 *		y|Y - 垂直滚动条的长度 
	 *		x|X - 水平滚动条的长度 
	 */
	ScrollView.prototype.getScrollBarLength = function(type) {
		if(type === 'y' || type === 'Y') { //Y
			var h,mh,top;
			if(this.svHeight > this.svcHeight) {
				h = this.svHeight;
			} else {
				h = this.svHeight /this.svcHeight * this.svHeight;
			}
			if(this.content[type] > 0) {
				mh = h - this.content[type];
				mh = mh < minBarLength? minBarLength:mh;
				top = 0;
			} else if(this.content[type] + this.svcHeight < this.svHeight) {
				if(this.svHeight > this.svcHeight) {
					mh = h + this.content[type];
				} else {
					mh = h - (this.svHeight - (this.svcHeight + this.content[type]));
				}
				mh = mh < minBarLength? minBarLength:mh;
				top = this.svHeight - mh;
			} else {
				mh = h < minBarLength? minBarLength:h;
				top = - this.content[type] / this.svcHeight * this.svHeight;
			}

			return {height:h,mheight:mh,top:top};
		} else { //X
			var w,mw,left;
			if(this.svWidth > this.svcWidth) {
				w = this.svWidth;
			} else {
				w = this.svWidth /this.svcWidth * this.svWidth;
			}
			if(this.content[type] > 0) { /*margin left*/
				mw = w - this.content[type];
				mw = mw < minBarLength? minBarLength:mw;
				left = 0;
			} else if(this.content[type] + this.svcWidth < this.svWidth) { /*margin right*/
				if(this.svWidth > this.svcWidth) {
					mw = w + this.content[type];
				} else {
					mw = w - (this.svWidth - (this.svcWidth + this.content[type]));
				}
				mw = mw < minBarLength? minBarLength:mw;
				left = this.svWidth - mw;
			} else { /* 当中 */
				mw = w < minBarLength? minBarLength:w;
				left = - this.content[type] / this.svcWidth * this.svWidth;
			}

			return {width:w,mwidth:mw,left:left};
		}
	}
	/*
	 * 停止滚动条的运动
	 */
	ScrollView.prototype.stopScrollBar = function() {
		if(this.scrollBar.x) this.scrollBar.x.stop();
		if(this.scrollBar.y) this.scrollBar.y.stop();
	}
	/*
	 * 显示滚动条
	 */
	ScrollView.prototype.showScrollBar = function() {
		var x,X,left,width,mwidth;
		if(this.scrollBar.x) {
			x = 'x';
			X = 'X';
			left = 'left';
			width = 'width';
			mwidth = 'mwidth';
		} else if(this.scrollBar.y) {
			x = 'y';
			X = 'Y';
			left = 'top';
			width = 'height';
			mwidth = 'mheight';
		} else {
			return;
		}
		var r,isUpdate = false;
		this.scrollBar[x].stop();
		if(this.isDynamic) r = this.getScrollBarLength(X);
		else r = this.getScrollBarLength(x);
		if(this.scrollBar[x][x] != parseInt(r[left])) {
			this.scrollBar[x][x] = parseInt(r[left]);
			isUpdate = true;
		}
		if(this.scrollBar[x].style[width] != parseInt(r[mwidth])) {
			this.scrollBar[x].css(width, parseInt(r[mwidth]),false);
			isUpdate = true;
		}
		if(!this.scrollBar[x].isShow) {
			this.scrollBar[x].show();
			this.scrollBar[x].isShow = true;
		} else if(isUpdate) {
			this.scrollBar[x].update();
		}
	};
	ScrollView.prototype.hideScrollBar = function() {
		if(!$.settings.isPhone) return;
		var x;
		if(this.scrollBar.x) {
			x = 'x';
		} else if(this.scrollBar.y) {
			x = 'y';
		} else {
			return;
		}
		if(this.scrollBar[x] && this.scrollBar[x].isShow) {
			this.scrollBar[x].hide();
			this.scrollBar[x].isShow = false;
		}
	};
	ScrollView.prototype.scrollTo = function(x,y,animate,duration) {
		if(!animate) {
			if(this.isDynamic) {
				if(x !== null) this.content.X = x;
				if(y !== null) this.content.Y = y;
				this.onScroll();
			} else {
				this.content.moveTo(x,y);
			}
			return;
		}

		if(!duration || duration < 0) duration = 200;
		var x = 'x', y = 'y';
		if(this.isDynamic) {
			x = 'X';
			y = 'Y';
		}
		var oldX = this.content[x];
		var oldY = this.content[y];
		var lX = x - oldX;
		var lY = y - oldY;
		this.content.animate(function(d,isEnd) {
			this.content[y] = oldY + d / duration * (lY - oldY);
			this.content[x] = oldX + d / duration * (lX - oldX);
			if(this.isDynamic) this.onScroll();
			else this.content.update();

			if(isEnd) {
				this.hideScrollBar();
			}
		},duration,'easeOutQuad',null,null,this);
	};
	ScrollView.prototype.scrollToPage = function(page,duration) {

		if(!this.pageEnable) return;

		this.calSize();
		var flag = 'x';
		if(this.scrollEnable.x) {
			this.pageSize = this.svWidth;
			flag = 'x';
		}
		if(this.scrollEnable.y) {
			this.pageSize = this.svHeight;
			flag = 'y';
		}

		var x,y,sx,sy,top,bottom,marginTopEnd,marginBottomEnd,svcHeight,svHeight;
		if(flag == 'x') {
			if(this.isDynamic) {
				y = 'X';
				x = 'Y';
			} else {
				y = 'x';
				x = 'y';
			}
			sy = 'x';
			sx = 'y';
			svcHeight = this.svcWidth;
			svHeight = this.svWidth;
		} else {
			if(this.isDynamic) {
				y = 'Y';
				x = 'X';
			} else {
				y = 'y';
				x = 'x';
			}
			sy = 'y';
			sx = 'x';
			svcHeight = this.svcHeight;
			svHeight = this.svHeight;
		}

		var data = {};
		var scrollData = {}
		var ap; //scrollBar动画属性

		var v = 3;

		var distance = 0;
		var totalPage = parseInt(svcHeight / this.pageSize);
		if(page >= totalPage) page = totalPage - 1;
		else if(page < 0) page = 0;

		var currentPage = -parseInt(this.content[y] / this.pageSize);
		if(page == currentPage) return;

		//如果需要定位到页
		distance = - page * this.pageSize - this.content[y];
		if(duration == 0 || duration == undefined) {
			if(page > currentPage) duration = this.minStopDuration * (page - currentPage);
			else  duration = this.minStopDuration * (currentPage - page);
		} else if(duration < 0) {
			currentPage = page;
			this.content[y] = this.content[y] + distance;
			if($.isFunction(this.onScroll)) this.onScroll();
			else this.content.update();

			if(this.pageEnable && currentPage != this.pageNum) { //翻页回调
				if($.isFunction(this.onPageChanged)) this.onPageChanged(currentPage,this.pageNum);
				this.onPageChanged_(currentPage,this.pageNum);
				this.pageNum = currentPage;
			}
			return;
		}
		currentPage = page;

		var oldY = this.content[y];
		var L = this.content[y] + distance;
		this.content.animate(function(d,isEnd) {
            if (!this.content || !this.content.e) return;
			this.content[y] = oldY + d / duration * (L - oldY);
			if(this.isDynamic) this.onScroll();
			else this.content.update();
			if(isEnd) {
				if(this.pageEnable && currentPage != this.pageNum) { //翻页回调
					if($.isFunction(this.onPageChanged)) this.onPageChanged(currentPage,this.pageNum);
					this.onPageChanged_(currentPage,this.pageNum);
					this.pageNum = currentPage;
				}
				this.hideScrollBar();
			}
		},duration,'easeOutQuad',null,null,this);
	};

	ScrollView.prototype.startAutoScroll = function(delayDuration,scrollDuration) {

		if(this.autoScroll) return;
		this.autoScroll = true;

		this.lastScrollTime = (new Date()).getTime();
		if(delayDuration && delayDuration > 0) {
			this.scrollDelayDuration = delayDuration;
		} else {
			this.scrollDelayDuration = 2000;
		}
		if(scrollDuration && scrollDuration > 0) {
			this.scrollDuration = scrollDuration;
		} else {
			this.scrollDuration = 1000;
		}

		var that = this;
		this.loopIntval = setInterval(function() {

			//如果已经停止了,直接返回
			if(!that.autoScroll) {
				clearInterval(this.loopIntval);
				this.loopIntval = 0;
				return;
			}

			//如果没有显示,则返回
			if(!that.isShow()) return;
			if(that.inTouch) return;

			if(that.lastScrollTime == 0) return;

			var timeStamp = (new Date()).getTime();
			if(timeStamp - that.lastScrollTime < that.scrollDelayDuration) return;

			that.lastScrollTime = 0;
			that.scrollNextPage_();
		},1000);
	};


	//停止自动滚动
	ScrollView.prototype.stopAutoScroll = function(delayDuration,scrollDuration) {
		this.autoScroll = false;
	};

	//滚动到下一页
	ScrollView.prototype.scrollNextPage_ = function() {
		
		var svcHeight = 0;
		if(this.scrollEnable.x) {
			this.pageSize = this.svWidth;
			flag = 'x';
			svcHeight = this.svcWidth;
		}
		if(this.scrollEnable.y) {
			this.pageSize = this.svHeight;
			flag = 'y';
			svcHeight = this.svcHeight;
		}

		var totalPage = parseInt(svcHeight / this.pageSize);

		if(this.pageNum >= totalPage - 1) {
			this.scrollToPage(0, 1);
		} else {
			this.scrollToPage(this.pageNum + 1,this.scrollDuration);
		}
	};

	ScrollView.prototype.onPageChanged_ = function(currentPage,oldPage) {
		
		this.lastScrollTime = (new Date()).getTime();
		if(!this.isShow()) return;
		if(this.inTouch) return;
	};

	$.ui.ScrollView = ScrollView;
})(jMelon);
