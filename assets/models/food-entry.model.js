angular.module('webtools.models').service('FoodEntryModel', function($q) {

	var FoodEntry = Parse.Object.extend('FoodDiaryEntries');
	var _pageSize = 30;

	this.getAll = function(page, direction) {
		page = page || 0;
		direction = direction || 'desc'

		var deferred = $q.defer();
		var query = new Parse.Query(FoodEntry);

		// set the page to get.
		query.skip(page * _pageSize);
		query.limit(_pageSize);

		if (direction == 'asc') {
			query.ascending('createdAt');
		} else {
			query.descending('createdAt');
		}

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

	this.getCount = function() {
		var deferred = $q.defer();
		var query = new Parse.Query(FoodEntry);

		query.count({
			success: function(count) {
				deferred.resolve(count);
			}, error: function(reason) {
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