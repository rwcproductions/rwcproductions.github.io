// Code originally from http://codentronix.com/2011/07/22/html5-canvas-3d-starfield/

var BackroundRenderer = function(canvas) {
	var stars = new Array(512);
	var MAX_DEPTH = 32;
	var radiusRange = {
		min: (canvas.width > canvas.height ? canvas.width : canvas.height) / 200,
		max:(canvas.width > canvas.height ? canvas.width : canvas.height) / 20
	}
	
	for( var i = 0; i < stars.length; i++ ) {
		var location = randomPosition(radiusRange.min, radiusRange.max)
		
		stars[i] = {
			x: location.x,
			y: location.y,
			z: Math.randomRangeInt(1, MAX_DEPTH),
			hue: Math.randomRangeInt(0, 360),
			sat: Math.randomRangeInt(5, 20),
		}
	}
	
	function randomPosition(minRadius, maxRadius) {
		var radius = Math.randomRange(minRadius, maxRadius);
		var angle = Math.randomRange(0, Math.PI*2);
		
		var location = {
			x: radius * Math.cos(angle),
			y: radius * Math.sin(angle),
		};
		
		return location;
	}
	
	this.draw = function(dt, ctx, canvas) {
		var halfWidth  = canvas.width / 2;
		var halfHeight = canvas.height / 2;
		
		for (var i = 0; i < stars.length; i++) {
			stars[i].z -= 0.02;// * dt;
			
			if (stars[i].z <= 0) {
				var location = randomPosition(radiusRange.min, radiusRange.max)
				
				stars[i].x = location.x;
				stars[i].y = location.y;
				stars[i].z = MAX_DEPTH;
			}
			
			var k  = 128.0 / stars[i].z;
			var px = stars[i].x * k + halfWidth;
			var py = stars[i].y * k + halfHeight;
			
			if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
				var size = (1 - stars[i].z / 32.0) * 5;
				var halfsize = size * 0.5;
				var shade = parseInt((1 - stars[i].z / 32.0) * 100);
				ctx.fillStyle = "hsl(" + stars[i].hue + "," + stars[i].sat + "%," + shade + "%)";
				if (size <= 2) {
					ctx.fillRect(px - halfsize, py - halfsize, size, size);
				}
				else {
					ctx.beginPath();
					ctx.arc(px, py, halfsize, 0, Math.PI*2); 
					ctx.closePath();
					ctx.fill();
				}
			}
		}
	}
};

// Polyfill Math.randomRangeInt.
(function() {
	if (!Math.randomRange) {
		Math.randomRange = function(minVal,maxVal) {
			return Math.random() * (maxVal - minVal) + minVal;
		};
	}
	if (!Math.randomRangeInt) {
		Math.randomRangeInt = function(minVal,maxVal) {
			return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
		};
	}
})();
