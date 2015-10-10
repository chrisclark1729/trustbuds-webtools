angular.module('webtools.controllers', [])

angular.module('webtools.controllers').controller('FoodEntryCtrl', function(
	$scope, 
	FoodEntryModel,
	IngredientsModel
	) {

	$scope.totalEntryCount = 0;
	$scope.entries = []
	$scope.ingredients = []
	$scope.selectedEntry = null

	// Get all the food entries.
	$scope.getAllEntries = function(page, direction) {
		FoodEntryModel.getAll(page, direction).then(function(entries) {
			$scope.entries = entries 
		}, function(reason) {

		});

	}

	$scope.selectEntry = function(entry) {
		if ($scope.selectedEntry !== null) {
			if ($scope.selectedEntry.id == entry.id) {
				// deselect current selected entry.
				$scope.selectedEntry = null;

				return
			}
		}
		$scope.selectedEntry = entry
	}

	$scope.isSelected = function(entry) {
		if ($scope.selectedEntry === null) {
			return false;
		}

		return entry.id === $scope.selectedEntry.id
	}

	$scope.getAllIngredients = function() {
		IngredientsModel.getAll().then(function(ingredients) {
			$scope.ingredients = ingredients; 
		}, function() {

		});
	}

	$scope.getEntryCount = function() {
		FoodEntryModel.getCount().then(function(count) {
			$scope.totalEntryCount = count;
		}, function() {

		})
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
	$scope.getEntryCount();

})