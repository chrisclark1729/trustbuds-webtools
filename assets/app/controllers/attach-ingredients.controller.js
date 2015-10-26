angular.module('webtools.controllers').controller('AttachIngredientsCtrl', function($scope, $modalInstance, ingredients) {
	$scope.ingredients = ingredients;
	$scope.direction = 'asc'
	$scope.directionClass = 'glyphicon-arrow-down'

	$scope.searchFilter = {
		'attributes' : {
			'ingredientName' : ''
		}
	}

	$scope.reverse = false
	$scope.predicate = 'attributes.ingredientName' 

	$scope.selectedIngredients = []


	// Listen for update-servings command. Then update each 
	// nutrition fact for the selected Entry and rebuild 
	// the nutrition object. 
	$scope.$on('update-servings', function(event, message) {
		detail = $scope.foodDetails[message.ingredientId]
		ingredient = detail.ingredient
		servings = message.servings

		console.log(ingredient)
	})

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

	$scope.toggleDirection = function() {
		$scope.reverse = !$scope.reverse;

		if ($scope.direction == 'asc') {
			$scope.direction = 'dsc'
			$scope.directionClass = 'glyphicon-arrow-up'
		} else {
			$scope.direction = 'asc'
			$scope.directionClass = 'glyphicon-arrow-down'
		}
	}

	return;
})