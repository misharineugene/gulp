(function($) {

	$.fn.codeumCollapse = function( options ) {

		var settings = $.extend({
			'itemActive': false,
		}, options);

		$.collapseOpen = function(element) {

			var elementHeight;

			element.addClass('show');
			elementHeight = element.height();
			element.addClass('collapsing');

			setTimeout( function() {

				element.css( 'height', elementHeight );

				setTimeout( function() {

					element.removeClass('collapsing').attr( 'style', '' );

				}, 350);

			}, 100);

		}

		$.collapseClose = function(element) {

			var  elementHeight = element.height();
			
			element.css( 'height', elementHeight );
			element.addClass('collapsing');

			setTimeout( function() {

				element.css( 'height', 0 );

				setTimeout( function() {

					element.removeClass('show').removeClass('collapsing').attr( 'style', '' );

				}, 350);

			}, 100);

		}

		return this.each(function() {

			var th, src;

			th = $(this);

			th.on('click', function() {

				src = th.data('src');

				if ( th.hasClass('active') ) {

					$.collapseClose( $(src) );
					th.removeClass('active');

					if ( settings.itemActive == true ) {
						th.closest('.accordion-item, .item').removeClass('active');
					}

				} else {

					if ( th.closest('.accordion').hasClass('accordion-parent') ) {

						th.closest('.accordion').find('.active[data-codeum="collapse"]').removeClass('active');

						th.closest('.accordion').find('.collapse.show').each(function() {
							$.collapseClose( $(this) );

							if ( settings.itemActive == true ) {
								th.closest('.accordion').find('.accordion-item.active').removeClass('active');
							}
						});

						$.collapseOpen( $(src) );
						th.addClass('active');

						if ( settings.itemActive == true ) {
							th.closest('.accordion-item').addClass('active');
						}

					} else {
						
						$.collapseOpen( $(src) );
						th.addClass('active');

						if ( settings.itemActive == true ) {
							th.closest('.item').addClass('active');
						}

					}

				}

			});

		});

	};

})( jQuery );
(function($) {

	$.fn.codeumTabs = function() {

		return this.each(function() {

			var th, src;

			th = $(this);

			th.on('click', function() {

				src = th.data('src');

				if ( ! th.hasClass('active') ) {

					th.closest('.tabs').find('.active[data-codeum="tab"]').removeClass('active');
					th.closest('.tabs').find('.tab-pane.show').removeClass('show');

					th.addClass('active');
					$(src).addClass('show');

				}

			});

		});

	};

})( jQuery );