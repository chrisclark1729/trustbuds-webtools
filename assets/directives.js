angular.module('webtools.directives', [])

angular.module('webtools.directives').directive('frameExpand', function() {
	link = function(scope, element, attribute) {

		element.bind('dblclick', function(event) {
			height = element[0].offsetHeight;
			if (height === 525) {
				element.removeClass('frame')
			} else {
				element.addClass('frame')
			}

		})
	}

	return {
		link: link,
		scope: true,
		replace: true
	}
})

angular.module('webtools.directives').directive('imageAdjust', function($document) {
	link = function(scope, element, attribute) {
		var startY = 0, y = 0;

		scope.$watch(function() {
			return element[0].offsetHeight
		}, function(newHeight, oldHeight) {
			if (newHeight != oldHeight) {
				// reset the image offset.
				element.css({top: '0px'})
			}
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
				return;
			}
			
			y = offset
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