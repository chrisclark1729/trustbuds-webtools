angular.module('webtools.service').service('Loaded', function($q) {

	var deferred = $q.defer();

	this.defer = function() {
		deferred = $q.defer()
	}

	this.resolve = function() {
		deferred.resolve()
	}

	this.promise = function() {
		return deferred.promise;
	}

	return this;
})