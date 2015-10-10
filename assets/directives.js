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

angular.module('webtools.directives').directive('script', function(Credentials) {
	link = function(scope, element, attribute) {
		if(attribute.type === 'text/geo-key') {
			element.attr('src', "https://maps.googleapis.com/maps/api/js?key=" + Credentials.google_maps_key)
			element.attr('type', 'text/javascript')
		}
		return;
	}

	return {
		scope: false,
		restrict: 'E',
		link: link
	}
})