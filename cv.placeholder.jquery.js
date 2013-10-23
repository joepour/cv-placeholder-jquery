;(function( $ ){

	"use strict";

	var Placeholder = function(element, options){

		var self = (this instanceof Placeholder) ? this : Object.create(Placeholder.prototype);
		self.$el = $(element);

		//
		// options
		options = (options || {});
		self.options = $.extend({}, self.defaults, options);

		//
		// assign placeholder mask url to a sane default
		self.options.maskImageUrl = (options.maskImageUrl)
			? options.maskImageUrl
			: (options.placeholderImageUrl || self.defaults.placeholderImageUrl);

		// 
		// constructor
		self.init.apply(self, arguments);
	};

	Placeholder.prototype = {

		defaults: {
			showMask:            false,
			maskImageUrl:        'http://thumbs.clickview.com.au/placeholder',
			placeholderImageUrl: 'http://thumbs.clickview.com.au/placeholder'
		},

		style: function(){
			this.$el.css({
				'width':            this.$el.width(),
				'height':           this.$el.height(),
				'display':          'block',
				'background-size':  this.$el.width() + 'px ' + this.$el.height() + 'px',
				'background-image': 'url(' + this.options.placeholderImageUrl + ')'
			});
		},

		onError: function(){
			this.$el.on('error', this, function(e){
				e.data.$el.attr('src', e.data.options.placeholderImageUrl);

				if(e.data.options.showMask){
					e.data.$el.next('.cv-placeholder-mask').remove();
				}
			});
		},

		onSuccess: function(){
			this.$el.on('load', this, function(e){
				if(e.data.options.showMask){
					e.data.$el.next('.cv-placeholder-mask').remove();
				}
			});
		},

		init: function(){

			//
			// register event handlers
			this.onError();
			this.onSuccess();

			//
			// apply placeholder styles
			this.style();

			//
			// add placeholder mask if enabled
			if(this.options.showMask){
				var mask = new PlaceholderMask(this.$el, this.options);
			}
		}
	};

	var PlaceholderMask = function(element, options){
	
		var self = (this instanceof PlaceholderMask) ? this : Object.create(PlaceholderMask.prototype);
		self.$el = $(element);

		self.options = $.extend({}, self.defaults, options);

		self.init.apply(self, arguments);
	};

	PlaceholderMask.prototype = {
	
		defaults: {},

		style: function(){
			this.$el
				.next('.cv-placeholder-mask')
				.css({
					'top':              0,
					'left':             0,
					'width':            this.$el.width(),
					'height':           this.$el.height(),
					'z-index':          9998,
					'display':          'block',
					'position':         'absolute',
					'background-size':  this.$el.width() + 'px ' + this.$el.height() + 'px',
					'background-image': 'url(' + this.options.maskImageUrl + ')'
				});
		},

		init: function() {
			//
			// We need to create a container to hold
			this.$el.wrap('<div class="cv-placeholder-container"></div>');
			$('.cv-placeholder-container').css('position', 'relative');
			
			//
			// Add mask to DOM
			this.$el.after(jQuery('<span/>').addClass('cv-placeholder-mask'));
			
			//
			// Apply styles to mask
			this.style();
		}
	};

	$.fn.cvPlaceholder = function( option ){
		return this.each(function () {
			var placeholder = new Placeholder(this, option);
		});
	};

}( jQuery ));