angular.module('webtools.controllers', [])

angular.module('webtools.controllers').controller('FoodEntryCtrl', function($scope, FoodEntryModel) {
	$scope.entries = []

	// Get all the food entries.
	$scope.getAll = function() {
		FoodEntryModel.getAll().then(function() {

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

	$scope.load();

})