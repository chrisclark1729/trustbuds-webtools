angular.module('webtools.models').service('FoodDetailModel', function($q) {
	
	var FoodDetail = Parse.Object.extend('FoodDiaryDetail');

	// Gets a set of details for a food entry.
	this.get = function(FoodEntry) {
		var deferred = $q.defer();
		var query = new Parse.Query(FoodDetail);

		query.equalTo('foodDiaryEntryId', FoodEntry);

		query.find({
			success: function(details) {
				deferred.resolve(details);
			},
			error: function(reason) {
				deferred.reject(reason);
			}
		})	

		return deferred.promise;
	}


	return this;
})