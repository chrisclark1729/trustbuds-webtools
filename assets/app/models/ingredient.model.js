angular.module('webtools.models').service('IngredientModel', function($q) {

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

	this.find = function(ingredientId, ingredients) {
		var _ingredient = null
		angular.forEach(ingredients, function(ingredient) {
			if(ingredient.id === ingredientId) {
				_ingredient = ingredient
			}
		})

		return _ingredient;
	}

	return this;
})