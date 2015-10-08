angular.module('webtools.controllers', [])

angular.module('webtools.controllers').controller('FoodEntryCtrl', function($scope, FoodEntryModel) {
	$scope.entries = []

	$scope.load = function() {
		FoodEntryModel.getAll().then(function() {

		}, function() {

		});

	}

})