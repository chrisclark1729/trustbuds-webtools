angular.module('webtools.directives').directive('imageAdjust', function($document) {
	link = function(scope, element, attribute) {
		var startY = 0, y = 0;

		scope.$watch(function() {
			return element[0].offsetHeight
		}, function(newHeight, oldHeight) {
			element.css({top: '0px'})
			startY = 0, y = 0;
		})

		element.on('mousedown', function(event) {
			event.preventDefault();

			startY = event.pageY - y;

			// turn on event listeners
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		})

		function mousemove(event) {
			offset = event.pageY - startY;
			height = element[0].offsetHeight

			if (offset >= 0 || (height <= 525 - offset)) {
				offset = y;
				return;
			}
			
			y = offset;

			element.css({
				top: y + 'px'
			})
		}

		function mouseup(){
			// turn off event listeners
			$document.off('mousemove', mousemove);
			$document.off('mouseup', mouseup);
		}
	}

	return {
		link: link,
		scope: true,
		replace: true
	}
})