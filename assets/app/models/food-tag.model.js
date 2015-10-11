angular.module('webtools.models').service('FoodTagModel', function($q) {

	var FoodTag = Parse.Object.extend('FoodDiaryTags');

	// Gets a set of tags from a food entry.
	this.get = function(FoodEntry) {
		var deferred = $q.defer();
		var query = new Parse.Query(FoodTag);

		query.equalTo('foodDiaryEntryId', FoodEntry);

		query.find({
			success: function(tags) {
				deferred.resolve(tags);
			},
			error: function(reason) {
				deferred.reject(reason);
			}
		})

		return deferred.promise;
	}

	return this;
})