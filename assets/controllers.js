angular.module('webtools.controllers', [])

angular.module('webtools.controllers').controller('FoodEntryCtrl', function(
	$scope, 
	$q,
	$uibModal,
	FoodEntryModel,
	IngredientModel,
	FoodDetailModel,
	FoodTagModel,
	Geocode
	) {

	$scope.totalEntryCount = 0;
	$scope.selectedEntry = null
	$scope.showInfo = false;

	$scope.entries = []
	$scope.ingredients = []

	$scope.foodDetails = {}
	$scope.foodTags = []

	_entryIndex = null;
	_page = 0

	isDefined = function(object) {
		return (object !== null) && (object !== undefined)
	}

	// Get all the food entries.
	$scope.getAllEntries = function(page, direction) {
		deferred = $q.defer()
		FoodEntryModel.getAll(page, direction).then(function(entries) {
			$scope.entries = $scope.entries.concat(entries)
			deferred.resolve()
		}, function(reason) {
			deferred.reject()
		});

		return deferred.promise
	}

	$scope.getDetails = function(entry) {
		FoodDetailModel.get(entry).then(function(details) {
			// Create a hash of ingredient id to ingredient.
			angular.forEach(details, function(detail) {
				ingredientId = detail.get('ingredientId').id
				ingredient = IngredientModel.find(ingredientId, $scope.ingredients)

				$scope.foodDetails[ingredientId] = {
					"ingredient" : ingredient,
					"servings" : detail.get('numberOfServings')
				}

			})
		}, function(reason){

		})
	}

	$scope.detailsLength = function() {
		length = Object.keys($scope.foodDetails).length
		return length;
	}

	$scope.getTags = function(entry) {
		FoodTagModel.get(entry).then(function(tags) {
			$scope.foodTags = tags
		}, function(reason) {

		});
	}

	$scope.getAddress = function(entry) {
		GeoPoint = entry.get('location')

		Geocode.reverseGeocode(GeoPoint).then(function(address) {
			entry.set('address', address)
		}, function(reason) {

		});
	}

	$scope.attachIngredient = function() {
		var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'attach-ingredients.html',
      controller: 'AttachIngredientsCtrl',
      resolve: {
        ingredients: function () {
          return $scope.ingredients;
        }
      }	
		});


		modalInstance.result.then(function (ingredient) {
			$scope.foodDetails[ingredient.id] = {
				'ingredient': ingredient,
				'servings' : 0
			}
    });

	}

	proccessEntry = function(entry) {
		$scope.foodTags = []
		$scope.foodDetails = {}

		$scope.getDetails(entry)
		$scope.getTags(entry)
		$scope.getAddress(entry)
	}

	$scope.selectEntry = function(entry, index) {
		if (isDefined($scope.selectedEntry) && isDefined(entry)) {
			if ($scope.selectedEntry.id == entry.id) {

				// deselect current selected entry.
				$scope.selectedEntry = null;
				_entryIndex = null;
				return
			}
		}
		$scope.selectedEntry = entry
		_entryIndex = index

		proccessEntry($scope.selectedEntry)
	}

	$scope.isSelected = function(entry) {
		if ($scope.selectedEntry === null || $scope.selectedEntry === undefined || entry === null || entry === undefined) {
			return false;
		}

		return entry.id === $scope.selectedEntry.id
	}

	$scope.prev = function() {
		if (_entryIndex === 0) {
			return;
		}

		_entryIndex -= 1;
		$scope.selectedEntry = $scope.entries[_entryIndex];
		proccessEntry($scope.selectedEntry)
	}

	$scope.more = function() {
		_page += 1
		$scope.getAllEntries(_page)
	}

	$scope.next = function() {
		if (_entryIndex === $scope.totalEntryCount) {
			return
		}

		if (_entryIndex === $scope.entries.length - 1) {
			_page += 1
			$scope.getAllEntries(_page).then(function() {
				_entryIndex += 1;
				$scope.selectedEntry = $scope.entries[_entryIndex];

				proccessEntry($scope.selectedEntry)
			})
		} else {
			_entryIndex += 1;
			$scope.selectedEntry = $scope.entries[_entryIndex];

			proccessEntry($scope.selectedEntry)
		}

	}

	$scope.getAllIngredients = function() {
		IngredientModel.getAll().then(function(ingredients) {
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
	return;
})


angular.module('webtools.controllers').controller('AttachIngredientsCtrl', function($scope, $modalInstance, ingredients) {
	$scope.ingredients = ingredients;
	$scope.searchFilter = {
		'attributes' : {
			'ingredientName' : ''
		}
	}
	$scope.selectedIngredient = null

	$scope.ok = function() {
		$modalInstance.close($scope.selectedIngredient)
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}

	$scope.select = function(ingredient) {
		$scope.selectedIngredient = ingredient
	}


	return;
})



