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

angular.module('webtools.directives').directive('script', function(Credentials, $q, $window) {

	function load_script() {
		var script = document.createElement('script')
		script.type = 'text/javascript'
		script.src = "https://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize&key=" + Credentials.google_maps_key 
		document.body.appendChild(script);
	}

	function lazyLoadApi() {
		var deferred = $q.defer();
		$window.initialize = function() {
			deferred.resolve()
		}

		if($window.attachEvent) {
			$window.attachEvent('onLoad', load_script);
		} else {
			$window.addEventListener('load', load_script, false);
		}

		return deferred.promise

	}

	link = function(scope, element, attribute) {

		if(attribute.type === 'text/google_maps_key') {
			if($window.google && $window.google.maps) {

			} else {
				lazyLoadApi().then(function() {
					if($window.google && $window.google.maps) {
						element.remove();
					}
				})
			}

		}
		return;
	}

	return {
		scope: false,
		restrict: 'E',
		link: link
	}
})