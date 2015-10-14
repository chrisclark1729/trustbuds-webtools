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

	this.add = function(foodEntry, ingredient, servings) {
		var deferred = $q.defer();

		foodDetail = new FoodDetail()

		foodDetail.set('foodDiaryEntryId', foodEntry)
		foodDetail.set('ingredientId', ingredient)
		foodDetail.set('numberOfServings', Number(servings))

		foodDetail.save( null, {
			success: function(result) {
				deferred.resolve(result);
			},
			error: function(detail, error) {
				deferred.reject(error);
			}

		})

		return deferred.promise
	}

	this.update = function(foodDetailId, servings) {
		var deferred = $q.defer();
	
		foodDetail = new FoodDetail();
		foodDetail.set('id', foodDetailId)
		foodDetail.set('numberOfServings', Number(servings))

		foodDetail.save(null, {
			success: function(results) {
				deferred.resolve();
			}, error: function(detail, error) {
				deferred.reject(error);
			}
		})

		return deferred.promise;
	}

	this.remove = function(foodDetailId) {
		var deferred = $q.defer();

		foodDetail = new FoodDetail();
		foodDetail.set('id', foodDetailId);

		foodDetail.destroy({
			success: function(result) {
				deferred.resolve()
			},
			error: function(detail, error) {
				deferred.reject(error)
			}
		})

		return deferred.promise
	}

	return this;
})