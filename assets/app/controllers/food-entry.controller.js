angular.module('webtools.controllers').controller('FoodEntryCtrl', function(
	$scope, 
	$q,
	$uibModal,
	FoodEntryModel,
	IngredientModel,
	FoodDetailModel,
	FoodTagModel,
	Geocode,
	Flash
	) {

	$scope.totalEntryCount = 0;
	$scope.selectedEntry = null
	$scope.showInfo = false;
	$scope.nutritionFacts = []

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
			Flash.sendMessage(reason.message, 'danger')
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
					"servings" : detail.get('numberOfServings'),
					'detailId' : detail.id
				}

			})
		}, function(reason){
			Flash.sendMessage(reason.message, 'danger')
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
			Flash.sendMessage(reason.message, 'danger')
		});
	}

	$scope.getAddress = function(entry) {
		GeoPoint = entry.get('location')
		if(GeoPoint === null) return

		Geocode.reverseGeocode(GeoPoint).then(function(address) {
			entry.set('address', address)
		}, function(reason) {
			Flash.sendMessage(reason, 'danger')
		});
	}

	$scope.attachIngredients = function() {
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

		modalInstance.result.then(function (ingredients) {
			angular.forEach(ingredients, function(ingredient){
				$scope.foodDetails[ingredient.id] = {
					'ingredient': ingredient,
					'servings' : 0
				}
			})
    });
	}

	$scope.removeIngredient = function(detail) {
		if(detail.detailId === undefined) {
			delete $scope.foodDetails[detail.ingredient.id]
		} else {
			FoodDetailModel.remove(detail.detailId).then( function() {
				Flash.sendMessage('FoodDetail deleted', 'warning')
				delete $scope.foodDetails[detail.ingredient.id]
			}, function(reason) {
				Flash.sendMessage(reason.message, 'danger')
			})
		}
	}

	$scope.saveIngredient = function(detail) {
		if (detail.detailId === undefined) {
			FoodDetailModel.add($scope.selectedEntry, detail.ingredient, detail.servings).then( function(_detail){
				ingredientId = _detail.get('ingredientId').id

				$scope.foodDetails[ingredientId].detailId = _detail.id
				Flash.sendMessage('Ingredient successfully saved to FoodDiaryEntries', 'success')	
			}, function(reason) {
				Flash.sendMessage(reason.message, 'danger')
			})
		} else {

		}
		
	}

	$scope.buildNutrition = function(entry) {
		$scope.nutritionFacts = FoodEntryModel.buildNutrition(entry)
	}

	proccessEntry = function(entry) {
		$scope.foodTags = []
		$scope.foodDetails = {}

		$scope.buildNutrition(entry)
		$scope.getDetails(entry)
		$scope.getTags(entry)
		$scope.getAddress(entry)
	}

	reverseEntry = function(entry) {
		FoodEntryModel.reverseNutritionChanges(entry)
	}

	// Set the selectedEntry to a deep copy of entry.
	setEntry = function(entry) {
		$scope.selectedEntry = null
		$scope.selectedEntry = angular.copy(entry)
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

		setEntry(entry)
		_entryIndex = index

		proccessEntry($scope.selectedEntry)
	}

	$scope.isSelected = function(entry) {
		if ($scope.selectedEntry === null || 
			  $scope.selectedEntry === undefined || 
			  entry === null || entry === undefined) {
			return false;
		}

		return entry.id === $scope.selectedEntry.id
	}

	$scope.prev = function() {
		if (_entryIndex === 0) {
			return;
		}

		_entryIndex -= 1;

		entry = $scope.entries[_entryIndex]
		setEntry(entry)
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

				entry = $scope.entries[_entryIndex]
				setEntry(entry)
				proccessEntry($scope.selectedEntry)
			})
		} else {
			_entryIndex += 1;

			entry = $scope.entries[_entryIndex]
			setEntry(entry)
			proccessEntry($scope.selectedEntry)
		}

	}

	$scope.getAllIngredients = function() {
		IngredientModel.getAll().then(function(ingredients) {
			$scope.ingredients = ingredients; 
		}, function(reason) {
			Flash.sendMessage(reason.message, 'danger')
		});
	}

	$scope.getEntryCount = function() {
		FoodEntryModel.getCount().then(function(count) {
			$scope.totalEntryCount = count;
		}, function(reason) {
			Flash.sendMessage(reason.message, 'danger')
		})
	}

	// Listen for the servings to be updated
	$scope.$on('update-servings', function(event, message) {
		detail = $scope.foodDetails[message.ingredientId]
		ingredient = detail.ingredient
		servings = message.servings

		angular.forEach($scope.nutritionFacts, function(fact) {
			FoodEntryModel.updateEntryNutrition($scope.selectedEntry, fact.type, servings[0], servings[1], ingredient)
		})

		$scope.buildNutrition($scope.selectedEntry)

		// apply digest scope as the event happened async from digest cycle.
		$scope.$digest()
	})

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