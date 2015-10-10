angular.module('webtools.controllers', [])

angular.module('webtools.controllers').controller('FoodEntryCtrl', function(
	$scope, 
	$q,
	FoodEntryModel,
	IngredientsModel
	) {

	$scope.totalEntryCount = 0;
	$scope.entries = []
	$scope.ingredients = []
	$scope.selectedEntry = null
	$scope.showInfo = false;

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
	}

	//
	//
	//
	$scope.next = function() {
		if (_entryIndex === $scope.totalEntryCount) {
			return
		}

		if (_entryIndex === $scope.entries.length - 1) {
			_page += 1
			$scope.getAllEntries(_page).then(function() {
				_entryIndex += 1;
				$scope.selectedEntry = $scope.entries[_entryIndex];
			})
		} else {
			_entryIndex += 1;
			$scope.selectedEntry = $scope.entries[_entryIndex];
		}
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