(function($) {

//$('.item').smartShow();
//$('.item').smartShow($('#test'));
//$('.item').smartShow('#test');
//$('.item').smartShow('show'); // method call
//$('.item').smartShow({$showItem: $('#test')});

var namespace = 'smartShow';

function oSmartShow(obj, options) {
	var base = this;

	// default settings for plugin
	base.settings = {
		$showItem: 0,
		animationSpeed: 0,
		openCSSClass: 'open',
		openStatus: false,
		onInit: function() {},
		onClick: function() {}
	};

	// extending with settings parameter
	$.extend(base.settings, options);

	base.obj = obj; // actual DOM element
	base.$obj = $(obj); // jQuery version of DOM element

	// init method
	base.init = function () {
		// Try get $showItem
		if(typeof options == 'string') {
			if(base.$obj.find(options).length) {
				base.settings.$showItem = base.$obj.find(options).first();
			} else {
				base.settings.$showItem = $(options);
			}
		} else if (options instanceof $) {
			base.settings.$showItem = options;
		} else if (typeof options == 'undefined' || base.settings.$showItem == 0) {
			base.settings.$showItem = base.$obj.next();
		}
		
		// Click Event
		base.$obj.click(function(e) {

			base.settings.onClick.call(this, base);

			// hide other open items
			if($.fn.smartShow.lastItem != base.$obj && typeof $.fn.smartShow.lastItem != 'undefined') {
				$.fn.smartShow.lastItem.smartShow('hide');
			}

			if(base.settings.openStatus == false) {
				base.show();

				$.fn.smartShow.lastItem = base.$obj;
				
				if(typeof e == 'object') e.stopPropagation();
			} else {
				base.hide();
			}


			/* if(base.$obj.nodeName == 'A') */ return false;
		});

		$('body').bind('click',function(e) {
			// if clicked outside element hide this
			if(typeof e == 'object') {
				if(!$(e.target).closest(base.settings.$showItem).length){
					base.hide();
				}
			}
		});

		// Call onInit function
		base.settings.onInit.call(this, base);
	};

	// public Something method
	base.show = function() {
		base.$obj.addClass(base.settings.openCSSClass);
		base.settings.$showItem.fadeIn(base.settings.animationSpeed);
		base.settings.openStatus = true;
	};

	// public Something method
	base.hide = function() {
		base.$obj.removeClass(base.settings.openCSSClass);
		base.settings.$showItem.fadeOut(base.settings.animationSpeed);
		base.settings.openStatus = false;
	};

	// calling init
	base.init();
}

$.fn.smartShow = function(method) {
	// Method calling logic
	return this.each(function() {
		if (typeof $(this).data(namespace) == 'undefined') {
			$(this).data(namespace, new oSmartShow(this, method));
		} else if (typeof $(this).data(namespace) == 'object' && typeof $(this).data(namespace)[method] == 'function') {
			$(this).data(namespace)[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
		//	console.info('no method');
		}
	});
}
})(jQuery);