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

	// checks if an object is non-null and defined
	isDefined = function(object) {
		return (object !== null) && (object !== undefined)
	}

	// Get all the food entries by page number and sort order (asc / desc).
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
		return Object.keys($scope.foodDetails).length
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

	// Update all nutrition facts for the selected entry,
	// then if the detail doesn't exist, delete it from the hash, otw
	// remove the detail from the backend, and update the 
	// Food entry model with.
	$scope.removeIngredient = function(detail) {

		angular.forEach($scope.nutritionFacts, function(fact) {
			FoodEntryModel.updateEntryNutrition($scope.selectedEntry, fact.type, 0, detail.servings, detail.ingredient)
		})

		$scope.buildNutrition($scope.selectedEntry)

		if(detail.detailId === undefined) {
			delete $scope.foodDetails[detail.ingredient.id]
			return
		}

		FoodDetailModel.remove(detail.detailId).then( function() {

			// Update the selected food entry with new quantities
			FoodEntryModel.update($scope.selectedEntry).then( function(entry) {
				setEntryArray(entry)

				Flash.sendMessage('FoodDetail deleted, FoodEntry updated.', 'warning')
				delete $scope.foodDetails[detail.ingredient.id]
			})

		}, function(reason) {
			Flash.sendMessage(reason.message, 'danger')
		})

	}

	// Update the array instances of the entries with entry.
	setEntryArray = function(entry) {
		for(var i = 0; i < $scope.entries.length; ++i) {
			if ($scope.entries[i].id === entry.id) {
				$scope.entries[i] = entry
				break;
			}
		}
	}

	// Save ingredient to food detail and food entry.
	$scope.saveIngredient = function(detail) {
		if (detail.detailId === undefined) {

			FoodDetailModel.add(
				$scope.selectedEntry, 
				detail.ingredient, 
				detail.servings
			).then( function(_detail){

				ingredientId = _detail.get('ingredientId').id
				$scope.foodDetails[ingredientId].detailId = _detail.id

				// Update the selected food entry with new quantites
				FoodEntryModel.update($scope.selectedEntry).then( function(entry) {
					setEntryArray(entry)
					Flash.sendMessage('Ingredient successfully saved to FoodDiaryEntries', 'success')	
				})

			}, function(reason) {
				Flash.sendMessage(reason.message, 'danger')
			})

		} else {
			FoodDetailModel.update(detail.detailId, detail.servings)
			.then(function(_detail) {
				FoodEntryModel.update($scope.selectedEntry).then( function(entry) {

					setEntryArray(entry);
					Flash.sendMessage('Ingredient successfully updated.', 'success')
				})

			})
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

	// Returns true if the entry is the 
	// selected entry.
	$scope.isSelected = function(entry) {
		if (!isDefined($scope.selectedEntry) || 
			  !isDefined(entry)) {
			return false;
		}

		return entry.id === $scope.selectedEntry.id
	}

	// Get the previous entry in the 
	// entries array.
	$scope.prev = function() {
		if (_entryIndex === 0) {
			return;
		}

		_entryIndex -= 1;

		entry = $scope.entries[_entryIndex]
		setEntry(entry)
		proccessEntry($scope.selectedEntry)
	}

	// Load more entries.
	$scope.more = function() {
		_page += 1
		$scope.getAllEntries(_page)
	}

	// Attempts to get the next entry from the
	// entries array. If there are more entries
	// on the backend, but we are at the limit of 
	// available entries, increment the page and get 
	// more entries.
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

	// Get all ingredients from the backend.
	$scope.getAllIngredients = function() {
		IngredientModel.getAll().then(function(ingredients) {
			$scope.ingredients = ingredients; 
		}, function(reason) {
			Flash.sendMessage(reason.message, 'danger')
		});
	}

	// Gets the total entries saved on the backend.
	$scope.getEntryCount = function() {
		FoodEntryModel.getCount().then(function(count) {
			$scope.totalEntryCount = count;
		}, function(reason) {
			Flash.sendMessage(reason.message, 'danger')
		})
	}

	// Listen for update-servings command. Then update each 
	// nutrition fact for the selected Entry and rebuild 
	// the nutrition object. 
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

	$scope.getAllEntries(0);
	$scope.getAllIngredients();
	$scope.getEntryCount();
	return;
})