angular.module('webtools.controllers').controller('AttachIngredientsCtrl', function($scope, $modalInstance, ingredients) {
	$scope.ingredients = ingredients;

	$scope.searchFilter = {
		'attributes' : {
			'ingredientName' : ''
		}
	}

	$scope.selectedIngredients = []

	find = function(ingredient) {
		var _index = null
		angular.forEach($scope.selectedIngredients, function(_ingredient, index) {
			if(_ingredient.id === ingredient.id) {
				_index = index
			}
		})

		return _index;
	}

	add = function(ingredient) {
		if (find(ingredient)) {
			return
		}

		$scope.selectedIngredients.push(ingredient)
	}

	remove = function(ingredient) {
		index = find(ingredient)
		if (index === null) return

		$scope.selectedIngredients.splice(index, 1)
	}

	$scope.isSelected = function(ingredient) {
		return (find(ingredient) !== null)
	}

	$scope.toggleSelect = function(ingredient) {
		if ($scope.isSelected(ingredient)) {
			remove(ingredient)
		} else {
			add(ingredient)
		}
	}

	$scope.ok = function() {
		$modalInstance.close($scope.selectedIngredients)
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}

	return;
})