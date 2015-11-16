angular.module('webtools.models').service('IngredientModel', function($q) {

	var Ingredient = Parse.Object.extend('Ingredients', {
		initialize: function(attrs, options) {
			this.brand = null;
			this.genericIngredientName = null;
			this.ingredientCategory = null;
			this.ingredientName = null;
			this.unitOfMeasurement = null;

			this.calories = 0;
			this.gramsFat = 0;
			this.gramsSaturatedFat = 0;
			this.gramsTransFat = 0;
			this.gramsCholesterol = 0;
			this.gramsSodium = 0;
			this.gramsCarbs = 0;
			this.gramsFiber = 0;
			this.gramsSugar = 0;
			this.gramsProtein = 0;
		}
	});

	this.getAll = function(page) {
		var deferred = $q.defer();

		var query = new Parse.Query(Ingredient);
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

	this.newModel = function() {
		return new Ingredient();
	}

	this.create = function(model) {
		var deferred = $q.defer();

		model.save({
			brand: model.brand,
			genericIngredientName: model.genericIngredientName,
			ingredientCategory: model.ingredientCategory,
			ingredientName: model.ingredientName,
			unitOfMeasurement: model.unitOfMeasurement,
			calories: Number(model.calories),
			gramsFat: Number(model.gramsFat),
			gramsSaturatedFat: Number(model.gramsSaturatedFat),
			gramsTransFat: Number(model.gramsTransFat),
			gramsCholesterol: Number(model.gramsCholesterol),
			gramsSodium: Number(model.gramsSodium),
			gramsCarbs: Number(model.gramsCarbs),
			gramsFiber: Number(model.gramsFiber),
			gramsSugar: Number(model.gramsSugar),
			gramsProtein: Number(model.gramsProtein)
		}, {
			success: function(data) {
				deferred.resolve(data);
			}, 
			error: function(data, reason) {
				deferred.reject(reason);
			}
		})

		return deferred.promise;
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