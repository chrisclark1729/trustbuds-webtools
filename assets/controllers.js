angular.module('webtools.controllers', [])

angular.module('webtools.controllers').controller('FoodEntryCtrl', function($scope, FoodEntryModel) {
	$scope.entries = []

	// Load all the food entries.
	$scope.load = function() {
		FoodEntryModel.getAll().then(function() {

		}, function() {

		});

	}

	// Load a single food entry by id.
	$scope.get = function(entryId) {
		FoodEntryModel.get(entryId).then(function() {

		}, function() {

		})
	}

	// Update a food entry.
	$scope.update = function(entryId) {
		FoodEntryModel.update(entryId).then(function() {

		}, function() {

		})
	}

	// Delete a food entry.
	$scope.delete = function(entryId) {
		FoodEntryModel.delete(entryId).then(function() {

		}, function() {

		})
	}

})