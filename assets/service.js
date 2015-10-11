angular.module('webtools.service', [])

angular.module('webtools.service').service('Geocode', function($q, $window, $rootScope, localStorageService) {
	var geocoder = null
	
	// watch window for google attachment
	$rootScope.$watch(function() {
		return $window.google
	}, function(newValue, oldValue) {
		if(typeof newValue !== 'undefined') {
			geocoder = new $window.google.maps.Geocoder;
		}
	})

	geoKey = function(lng, lat) {
		return lng + ":" + lat
	}


	this.reverseGeocode = function(GeoPoint) {
		deferred = $q.defer();

		key = geoKey(GeoPoint.longitude, GeoPoint.latitude)
		address = localStorageService.get(key);

		if (address !== null ) {
			deferred.resolve(address)
			return deferred.promise
		}

		var latlong = {lat: parseFloat(GeoPoint.latitude), lng: parseFloat(GeoPoint.longitude)}

		geocoder.geocode({'location': latlong}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK){
				if (results[1]) {
					localStorageService.set(key, results[1].formatted_address)
					deferred.resolve(results[1].formatted_address);
				} else {
					deferred.resolve('');
				}
			} else {
				deferred.reject(status)
			}
		})

		return deferred.promise
	}
	return this;
})