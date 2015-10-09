angular.module('webtools.controllers', [])

angular.module('webtools.controllers').controller('FoodEntryCtrl', function(
	$scope, 
	FoodEntryModel,
	IngredientsModel
	) {

	$scope.entries = []
	$scope.ingredients = []
	$scope.entry = null

	// Get all the food entries.
	$scope.getAllEntries = function(page, direction) {
		FoodEntryModel.getAll(page, direction).then(function(entries) {
			$scope.entries = entries 
		}, function(reason) {

		});

	}

	$scope.getAllIngredients = function() {
		IngredientsModel.getAll().then(function() {

			}, function() {

			});
	}

	// Get a single food entry by id.
	$scope.get = function(entryId) {
		FoodEntryModel.get(entryId).then(function() {

		}, function() {

		})
	}

	// Update a food entry by id.
	$scope.update = function(entryId) {
		FoodEntryModel.update(entryId).then(function() {

		}, function() {

		})
	}

	// Delete a food entry by id.
	$scope.delete = function(entryId) {
		FoodEntryModel.delete(entryId).then(function() {

		}, function() {

		})
	}

	$scope.getAllEntries(0);
	$scope.getAllIngredients();

})