(function($) {
	var TableView = $.extendClass(function(className,delegate) {
		$.ui.ScrollView.call(this,'tableview',delegate);
		this.contentH = this.contentB.before($('div',null,null,'content'));

		this.content.calHeight = 0;
		this.sectionIndex = null;
		this.showIndexBoard = true;

		this.sectionNum = 1;
		this.sections = [];

		this.content.Y = 0;

		this.inRedraw = false;

		this.live('show',function() {
			this.calSize();
			this.onScroll();
		},this);

		this.cells = {};
		this.headers = {};

		this.headerView = null;
		this.footerView = null;

		//this.enablePreLoad(true);
	},$.ui.ScrollView);

	TableView.prototype.enablePreLoad = function(enable) {
		if(enable) {
			this.preLoadData = this.preLoadData__;
		} else {
			this.preLoadData = null;
		}
	};

	TableView.prototype.setHeaderView = function(headerView, height) {
		if(headerView != null && headerView.parent) return;

		if(this.headerView) {
			var view = this.headerView[0];
			this.content.calHeight -= this.headerView[1];
			view.remove();
		}

		if(!headerView) return;

		if(headerView.parent) return;

		this.contentH.append(headerView);

		this.headerView = [headerView,height];

		this.content.calHeight += height;
	};

	TableView.prototype.setFooterView = function(footerView, height) {
		if(!footerView && footerView.parent) return;

		if(this.footerView) {
			var view = this.footerView[0];
			this.content.calHeight -= this.footerView[1];
			view.remove();
		}

		if(!footerView) return;

		if(footerView.parent) return;

		this.content.append(footerView);

		this.footerView = [footerView,height];

		this.content.calHeight += height;
	};

	/*
		inUse - 0 未用
			  - 1 正在隐藏,等待回收
			  - 2 正在使用
	*/
	TableView.prototype.getCell__ = function(flag,loopType) {
		if(loopType == 0) _cells = this.headers;
		else _cells = this.cells;

		var cells = null;
		if(flag in _cells) {
			cells = _cells[flag];
		} else {
			cells = [];
			_cells[flag] = cells;
		}

		for(var i=0;i<cells.length;i++) {
			var cell = cells[i];
			if(cell.inUse != 0) continue;

			/*将最近使用的cell放到队列尾部*/
			cells.splice(i,1);
			cells.push(cell);

			if(loopType == 0) {
				if(cell.section__ >= 0) this.sections[cell.section__][4] = null;
			} else {
				var indexPath = cell.indexPath__;
				if (indexPath) this.sections[indexPath.section][2][indexPath.row][3] = null;
			}
			return cell;
		}

		var cell = null;
		if(loopType == 0) {
			cell = $('div',null,null,'header');
		} else {
			cell = $('div',null,null,'cell');
		}
		cell.inUse = 0;
		cells.push(cell);
		return cell;

	};

	TableView.prototype.getHeader = function(flag) {
		return this.getCell__(flag,0);
	};

	TableView.prototype.getCell = function(flag) {
		return this.getCell__(flag,1);
	};

	TableView.prototype.scrollAtTop = function(animate) {
		this.content.Y = 0;
		this.onScroll();
	};

	TableView.prototype.scrollToBottom = function(animate) {
		if(this.content.calHeight < this.svHeight) {
			this.content.Y = 0;
		} else {
			this.content.Y = this.svHeight - this.content.calHeight;
		}
		this.onScroll();
	};

	TableView.prototype.scrollAtIndexPath = function(section,row,animate) {
		if(this.svHeight > this.content.calHeight) return;

		if(section < 0) {
			this.scrollAtTop(animate);
			return;
		}
		if(section >= this.sections.length) {
			this.scrollAtBottom(animate);
			return;
		}
		var section_ = this.sections[section];
		var rows = section_[2]; //rows数组
		if(row >= rows.length) row = rows.length - 1;

		//计算头的高度
		var topHeight = 0;
		if(this.headerView) topHeight  = this.headerView[1];

		var h = section_[1]; //header 的高度
		var posY = 0;
		if(row <= 0) {
			posY = -section_[0] - topHeight; //header 的位置
		} else {
			var row_ = rows[row];
			posY = row_[0] + topHeight; //row 顶部位置
			posY = -posY + h;
		}
		if(posY + this.content.calHeight < this.svHeight) {
			posY = this.svHeight - this.content.calHeight;
		}
		this.content.Y = posY;
		this.onScroll();
	};

	/**
	 * header 和 footer 没有 inUse
	 */
	TableView.prototype.isHide__ = function(cell) {
		if(cell.y > this.content.calHeight + 1000) return true;
		return false;
	};

	TableView.prototype.show__ = function(cell) {
		if(cell.Y != cell.y) cell.moveTo(null,cell.Y);
		//else cell.update();
		cell.inUse = 1;
	};

	TableView.prototype.hide__ = function(cell) {
		if(this.isHide__(cell)) return;
		cell.moveTo(null,this.content.calHeight + 10000);
		cell.inUse = 0;
	};

	/*
	section - (位置,高度,rows,显示否,cell)
	row - (位置,高度,显示否,cell)
	isReset - 资源重置,将原来的资源释放
	*/
	TableView.prototype.reloadData = function(isReset) {
		//获取section个数
		if($.isFunction(this.numberOfSections)) {
			this.sectionNum = this.numberOfSections();
		} else {
			this.sectionNum = 1;
		}
		this.sections = [];
		this.content.calHeight = 0;

		//清除资源
		for(var loopType = 0;loopType < 2;loopType ++) {
			var cells_ = null;
			if(loopType == 0) cells_ = this.headers;
			else cells_ = this.cells;

			for(var key in cells_) {
				var cells = cells_[key];
				for(var i=0;i<cells.length;i++) {
					var cell = cells[i];
					if(isReset) {
						cell.remove();
						continue;
					}
					if(loopType == 0) {
						cell.section__ = -1;
					} else {
						cell.indexPath__ = null;
					}
				}
			}
		}
		if(isReset) {
			this.headers = {};
			this.cells = {};
		}

		//获取secton的内容
		for(var i=0;i<this.sectionNum;i++) {
			var h = 0;
			//header的高度,如果为0,则没有header
			if($.isFunction(this.heightForHeaderInSection)) {
				h = this.heightForHeaderInSection(i);
			}
			var rows = [];
			this.sections.push([this.content.calHeight,h,rows,false,null]);

			this.content.calHeight += h;
			var n = 0;
			if($.isFunction(this.numberOfRowsInSection)) {
				n = this.numberOfRowsInSection(i);
			}
			for(var j=0;j<n;j++) {
				var rh = 0;
				if($.isFunction(this.heightForRowInSection)) {
					rh = this.heightForRowInSection(i,j);
				}
				rows.push([this.content.calHeight,rh,false,null]);
				this.content.calHeight += rh;
			}
		}

		this.titles = null;
		while($.isFunction(this.sectionIndexTitles)) {
			var titles = this.sectionIndexTitles();
			if(!titles || titles.length == 0) break;

			if(!this.sectionIndex) {
				this.sectionIndex = this.append($('div',null,null,'groupIndex'));
				this.sectionIndex.g = this.sectionIndex.append($('div',null,null,'g'));
				this.sectionIndex.modalStyle = true;
				this.sectionIndex.live('begin',this.indexBegin,this);
				this.sectionIndex.live('end',this.indexEnd,this);
				this.sectionIndex.live('moving',this.indexMoving,this);
				this.sectionIndex.live('click',this.indexMoving,this);
			}
			var h = '';
			for(var i=0;i<titles.length;i++) {
				h += '<div class=index><div>' + titles[i] + '</div></div>';
			}
			this.sectionIndex.g.html(h);

			this.titles = titles;
			break;
		}
		if(!this.titles && this.sectionIndex) {
			this.sectionIndex.remove();
			this.sectionIndex = null;
		}

		this.calSize();

		//如果有头,添加头的高度
		if(this.headerView) this.content.calHeight += this.headerView[1];
		//如果有尾部,添尾部的高度
		if(this.footerView) this.content.calHeight += this.footerView[1];

		if(this.content.Y >= 0) {
			this.content.Y = 0;
		} else if(this.content.Y + this.svcHeight < this.svHeight) {
			this.content.Y = -this.svcHeight + this.svHeight;
		}

		//将所有当前cell隐藏
		for(var loopType = 0;loopType < 2;loopType ++) {
			var cells_ = null;
			if(loopType == 0) cells_ = this.headers;
			else cells_ = this.cells;

			for(var key in cells_) {
				var cells = cells_[key];
				for(var i=0;i<cells.length;i++) {
					var cell = cells[i];
					this.hide__(cell);
				}
			}
		}

		if(this.preLoadData && $.isFunction(this.preLoadData)) this.preLoadData();

		this.onScroll();
		if(!$.settings.isPhone) this.showScrollBar();
	};

	TableView.prototype.indexBegin = function() {
		this.content.stop();
		this.sectionIndex.addClass('down');
		this.titleIndexNum = -1;
		this.calSize();
		this.__y = this.offset()['top'];

		if(!this.showIndexBoard) return;
		if(!this.indexBoard) this.indexBoard = this.append($('div',null,null,'index-board'));
		this.indexMoving();

	};

	TableView.prototype.indexEnd = function() {
		this.sectionIndex.removeClass('down');
		if(this.indexBoard) this.indexBoard.remove();
		this.indexBoard = null;

		if(this.preLoadData && $.isFunction(this.preLoadData)) this.preLoadData();
	};

	TableView.prototype.indexMoving = function() {
		var y = $.phone.touchIntf.nowPoint.y - this.__y - 8;
		var unit = (this.svHeight - 16) / this.titles.length;
		var idx = Math.floor(y / unit);

		if(this.indexBoard) this.indexBoard.html(this.titles[idx]);

		if(idx == this.titleIndexNum) return;

		if(idx < 0) idx = 0;
		if(idx >= this.titles.length) idx = this.titles.length - 1;

		this.titleIndexNum = idx;
		var section = idx;
		if($.isFunction(this.sectionForSectionIndexTitle)) {
			section = this.sectionForSectionIndexTitle(titles[idx],idx)
		}
		if(section < 0) return;
		this.scrollAtIndexPath(section,0,false);
	};

	//预取cell和header
	TableView.prototype.preLoadData__ = function() {

		var top = - $.phone.bodySize.height;
		var bottom = this.svHeight + $.phone.bodySize.height;

		var topHeight = 0;
		if(this.headerView) topHeight  = this.headerView[1];

		for(var sp=0;sp < this.sections.length;sp ++) {
			var rows = this.sections[sp][2]; //rows数组

			//row处理
			for(var rp=0;rp < rows.length;rp++) {
				var posY = rows[rp][0] + topHeight; //row 顶部位置
				var posRY = this.content.Y + posY;	//对于tableview 的绝对未知
				var h = rows[rp][1];	//高度
				var cell = rows[rp][3]; //cell

				if(posRY > bottom || posRY + h < top) continue;
				if(cell) continue;

				var cell = this.cellForRowInSection(sp,rp);
				if(!cell.parent) this.content.append(cell);
				cell.indexPath__ = {section:sp,row:rp};

				cell.css('height',h,false);
				cell.inUse = 2;

				rows[rp][3] = cell;
			}

			var posY = this.sections[sp][0] + topHeight; //header 的位置
			var h = this.sections[sp][1]; //header 的高度
			var header = this.sections[sp][4]; //header

			var posRY = posY + this.content.Y; //header的实际未知

			if(h <= 0) continue;

			//header 处理
			if(posRY > bottom || posRY + h < top) continue;

			if(header) continue;

			header = this.headerForSection(sp);
			if(!header.parent) this.contentH.append(header);
			header.section__ = sp;

			header.css('height',h,false);
			header.inUse = 2;

			this.sections[sp][4] = header;
		}

		/**清理cells 和 headers**/
		for(var loopType = 0;loopType < 2;loopType ++) {
			var _cells = null;
			if(loopType == 0) _cells = this.headers;
			else _cells = this.cells;

			for(var key in _cells) {
				var cells = _cells[key];
				for(var i=0;i<cells.length;i++) {
					var cell = cells[i];
					if(cell.inUse == 2) {
						this.hide__(cell);
					}
				}
			}
		}
	};

	//滚动的时候取值
	TableView.prototype.onScroll = function() {
		if(this.inRedraw) return;
		this.inRedraw = true;

		var topHeight = 0;
		if(this.headerView) topHeight  = this.headerView[1];

		for(var sp=0;sp < this.sections.length;sp ++) {
			var rows = this.sections[sp][2]; //rows数组
			var hh = this.sections[sp][1];	//section header 高度
			var isSectionShow = false; //该section是否有显示
			var sectionTop = {x:0,y:-this.content.Y};

			//row处理
			for(var rp=0;rp < rows.length;rp++) {
				var posY = rows[rp][0] + topHeight; //row 顶部位置
				var posRY = this.content.Y + posY;	//对于tableview 的绝对未知
				var h = rows[rp][1];	//高度
				var show = rows[rp][2]; //是否显示
				var cell = rows[rp][3]; //cell

				if((posRY > this.svHeight || posRY + h < 0)) { //不显示
					if(cell) cell.inUse = 0;
				} else {
					isSectionShow = true;
					if(!cell) { //如果原来没有显示
						var cell = this.cellForRowInSection(sp,rp);
						if(!cell.parent) this.content.append(cell);
						rows[rp][3] = cell;
						cell.indexPath__ = {section:sp,row:rp};
					}
					cell.Y = posY;
					cell.inUse = 1;
					var isFirst = false;
					var isLast = false;
					if(rp == 0) { //如果是section的第一行
						if(cell.Y > sectionTop.y + hh) {
							sectionTop.y = cell.Y - hh;
						}
						isFirst = true;
					}
					if(rp == rows.length -  1) { //如果是section的最后一行
						if(cell.Y + h < sectionTop.y + hh) {
							sectionTop.y = cell.y + h - hh;
						}
						isLast = true;
					}

					if(isFirst) if(!cell.hasClass('first')) cell.addClass('first');
					else if(cell.hasClass('first')) cell.removeClass('first');

					if(isLast) if(!cell.hasClass('last')) cell.addClass('last');
					else if(cell.hasClass('last')) cell.removeClass('last');

					if(cell.height() != h) cell.css('height',h);
				}
			}

			var posY = this.sections[sp][0] + topHeight; //header 的位置
			var h = this.sections[sp][1]; //header 的高度
			var show = this.sections[sp][3]; //header 是否显示
			var header = this.sections[sp][4]; //header

			var posRY = posY + this.content.Y; //header的实际未知

			if(h <= 0) continue;

			//header 处理
			if(!isSectionShow && ((posRY > this.svHeight || posRY + h < 0))) { //不显示
				if(header) header.inUse = 0;
			} else { //显示
				if(!header) {
					var header = this.headerForSection(sp);
					if(!header.parent) this.contentH.append(header);
					this.sections[sp][4] = header;
					header.section__ = sp;
				}
				header.inUse = 1;

				if(isSectionShow) {
					header.Y = sectionTop.y;
				} else {
					header.Y = posY;
				}
				if(header.height() != h) header.css('height',h);
			}
		}

		/**清理cells 和 headers**/
		for(var loopType = 0;loopType < 2;loopType ++) {
			var _cells = null;
			if(loopType == 0) _cells = this.headers;
			else _cells = this.cells;

			for(var key in _cells) {
				var cells = _cells[key];
				for(var i=0;i<cells.length;i++) {
					var cell = cells[i];
					if(cell.inUse == 0) {
						this.hide__(cell);
					} else {
						this.show__(cell);
					}
				}
			}
		}

		if(this.headerView) {
			var headerView = this.headerView[0];
			var h = this.headerView[1];
			var posY = 0;
			var posRY = this.content.Y + posY;

			if((posRY > this.svHeight || posRY + h < 0)) { //不显示
				if(!this.isHide__(headerView)) this.hide__(headerView);
			} else {
				headerView.Y = posY;
				this.show__(headerView);
			}
		}

		if(this.footerView) {
			var footerView = this.footerView[0];
			var h = this.footerView[1];
			var posY = this.content.calHeight - h;
			var posRY = this.content.Y + posY;

			if((posRY > this.svHeight || posRY + h < 0)) { //不显示
				if(!this.isHide__(footerView)) this.hide__(footerView);
			} else {
				footerView.Y = posY;
				this.show__(footerView);
			}
		}

		if(this.content.Y != this.content.y) {
			this.content.moveTo(null,this.content.Y);
			this.contentH.moveTo(null,this.content.Y);
		}
		
		this.inRedraw = false;

		this.fire('onScroll');
	};

	$.ui.TableView = TableView;
})(jMelon);
