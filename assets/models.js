angular.module('webtools.models', []);

angular.module('webtools.models').service('FoodEntryModel', function($q) {

	var FoodEntry = Parse.Object.extend('FoodDiaryEntries');
	var _pageSize = 100;

	this.getAll = function(page) {
		page = page || 0;
		var deferred = $q.defer();

		var query = new Parse.Query(FoodEntry);

		// set the page to get.
		query.skip(page * _pageSize);
		query.limit(_pageSize);

		query.find({
			success: function(results) {
				deferred.resolve(results);
			},
			error: function(reason) {
				deferred.reject(reason);
			}
		})

		return deferred.promise;
	}

	this.get = function(id) {
		var deferred = $q.defer();

		deferred.resolve();
		return deferred.promise;
	}

	this.update = function(id) {
		var deferred = $q.defer();

		deferred.resolve();
		return deferred.promise; 
	}

	this.delete = function(id) {
		var deferred = $q.defer();

		deferred.resolve();
		return deferred.promise;
	}

	return this;
})

angular.module('webtools.models').service('IngredientsModel', function($q) {

	var Ingredients = Parse.Object.extend('Ingredients');

	this.getAll = function(page) {
		var deferred = $q.defer();

		var query = new Parse.Query(Ingredients);
		query.limit(1000)

		query.find({
			success: function(results) {
				deferred.resolve(results);
			},
			error: function(reason) {
				deferred.reject(reason);
			}
		})

		return deferred.promise;
	}

	this.get = function(id) {

	}

	this.create = function(params) {

	}

	this.update = function(id) {

	}

	this.delete = function(id) {

	}

	return this;
})