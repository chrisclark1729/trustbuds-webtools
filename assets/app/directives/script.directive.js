angular.module('webtools.directives').directive('script', function(Credentials, $q, $window, Loaded, $templateCache) {

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
				console.log('google maps loaded')
			} else {
				lazyLoadApi().then(function() {
					if($window.google && $window.google.maps) {
						element.remove();
						Loaded.resolve();
					} else {
						console.log('could not find window.google')
					}
				}, function() {
					console.log ('something went wrong')
				})
			}

		}

		return;
	}

	compile = function(element, attribute) {
		if(attribute.type === 'text/ng-template') {
			var templateUrl = attribute.id
			var text = element[0].text
			
			$templateCache.put(templateUrl, text)
		}
	}

	return {
		scope: false,
		restrict: 'E',
		link: link
	}
})