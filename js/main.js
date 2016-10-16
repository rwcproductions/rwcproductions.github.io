(function($) {
	var canvas = null;
	var renderer = null;
	var siteIndex = null;

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
			$background = $('#background')
		;

		if (skel.vars.mobile) {
			$body.addClass('is-touch');

			// Height fix (mostly for iOS).
			window.setTimeout(function() {
				$window.scrollTop($window.scrollTop() + 1);
			}, 0);
		}

		canvas = $background[0];

		loadIndex();

		$.getScript("/js/starfield_oldscool.js", function(){
			renderer = new BackroundRenderer(canvas);
		});

		$window.on('load', function() {
			$window.resize(resizeCanvas);
			window.requestAnimationFrame(draw);
			resizeCanvas();
		});
	});

	function loadIndex() {
		$.get(remotehost + "/index.json", function(data, status) {
			if (status == "success") {
				siteIndex = data;
				loadData(remotehost + siteIndex[siteIndex.config.start].texturl, function(data) {
					displayOverlay(data);
					ready();
				});
			}
		});
	}
	
	function loadData(url, success) {
		$.get(url, function(data, status) {
			success(data);
		});
	}
	
	function displayOverlay(data) {
		var overlay = $("#hudoverlay > div");
		overlay.html(data);
		overlay.show();
	}
	
	function ready() {
		window.setTimeout(function() {$("#loading").fadeOut(2000);}, 1000);
	}

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	var start = null;
	function draw(timestamp) {
		if (!start) start = timestamp;
		var progress = timestamp - start;
		start = timestamp;
		
		var ctx = document.getElementById('background').getContext('2d');
		//ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (renderer) {
			renderer.draw(progress, ctx, canvas);
		}

		window.requestAnimationFrame(draw);
	}
})(jQuery);

// Polyfill requestAnimationFrame and related.
(function() {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame =
		window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
																 timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
})();
