angular.module('webtools.service', [])

angular.module('webtools.service').service('Geocode', function($q) {

	this.reverseGeocode = function(latitude, longitude) {
		deferred = $q.defer();

		deferred.resolve();
		return deferred.promise
	}
	return this;
})