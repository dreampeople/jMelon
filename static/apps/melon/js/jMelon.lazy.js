(function($) {
	var intval = 1000;
	var timerId = null;
	var lazyElements = [];

	function loopLazy() {
		for(var i = 0; i< lazyElements.length;i++) {
			var e = lazyElements[i];
			if(!e || !e.e) {
				lazyElements.splice(i,1);
				i--;
				continue;
			}
			var e = lazyElements[i];
			var pos = e.offset();
			if(pos.left < 0 || pos.top < 0) continue;
			if(pos.left > $.phone.bodySize.width || pos.top > $.phone.bodySize.height) continue;

			lazyElements.splice(i,1);
			if(lazyElements.length === 0) {
				clearInterval(timerId);
				timerId = null;
			}
			e.lazyIntf.show(e);
			i --;
			if(lazyElements.length === 0) return;
		}
	}

	var imageLoaded = {};

	function lazyImageShow(e) {
		e.waitImage = new Image();
		e.waitImage.src = e.src;
		e.waitImage.onload = function() {
			e.attr('src',e.src);
			imageLoaded[e.src] = true;
			delete e.waitImage;
			e.waitImage = null;
		}
	}

	$.extend({
		addLazy: function(intf) {
			if(!intf) intf = {};
			for(var i in lazyElements)
				if(lazyElements[i] === this) return;
			if(timerId == null) timerId = setInterval(loopLazy,intval);

			this.lazyIntf = intf;
			lazyElements.push(this);
		},
		removeLazy: function() {
			for(var i in lazyElements) {
				if(lazyElements[i] !== this) continue;

				lazyElements.splice(i,1);
				if(lazyElements.length === 0) {
					clearInterval(timerId);
					timerId = null;
				}
			}
		},
		addLazyImage: function() {
			if(!this.src) return;
			if(imageLoaded[this.src]) {
				this.attr('src',this.src);
				return;
				//lazyImageShow(this);
			} else {
				this.addLazy({show: lazyImageShow});
			}
		}
	});

})(jMelon);

