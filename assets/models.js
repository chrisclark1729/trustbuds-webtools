angular.module('webtools.models', []);

angular.module('webtools.models').service('FoodEntryModel', function($q) {

	var FoodEntry = Parse.Object.Extend('FoodDairyEntry');
	foodEntry = new FoodEntry();

	this.getAll = function() {
		var deferred = $q.defer();

		deferred.resolve();
		return deferred.promise();
	}

	this.get = function(id) {
		var deferred = $q.defer();

		deferred.resolve();
		return deferred.promise();
	}

	this.update = function(id) {
		var deferred = $q.defer();

		deferred.resolve();
		return deferred.promise(); 
	}

	this.delete = function(id) {
		var deferred = $q.defer();

		deferred.resolve();
		return deferred.promise();
	}


	return this;
})