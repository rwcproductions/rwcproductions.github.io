(function($) {
	
	skel.breakpoints({
		xlarge: '(max-width: 1800px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});
	
	$(function() {
		var $window = $(window),
			$body = $('body'),
			$header = $('#header');

		if (skel.vars.mobile) {
			$body.addClass('is-touch');

			// Height fix (mostly for iOS).
			window.setTimeout(function() {
				$window.scrollTop($window.scrollTop() + 1);
			}, 0);
		}
		
	});
})(jQuery);
