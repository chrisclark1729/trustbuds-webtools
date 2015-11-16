angular.module('webtools.controllers').controller('IngredientCtrl', function($scope, IngredientModel, Flash) {
	$scope.direction = 'asc'
	$scope.directionClass = 'glyphicon-sort-by-alphabet'

	$scope.newPanel = false;

	$scope.searchFilter = {
		'attributes' : {
			'ingredientName' : ''
		}
	}

	$scope.units = [
		'ounce',
		'teaspoon',
		'tablespoon',
		'cup',
		'pint',
		'quart',
		'gallon',
		'serving',
		'piece',
		'container',
		'gram',
		'fluid ounce'
	]

	$scope.nutritionFacts = null;
	$scope.newFlag  = true;
	$scope.ingredientModel = null;

	$scope.reverse = false
	$scope.predicate = 'attributes.ingredientName' 

	$scope.ingredients = []

	getIngredients = function(page) {
		IngredientModel.getAll(page).then(function(data){
			$scope.ingredients = data;
		})
	}

	$scope.toggleDirection = function() {
		$scope.reverse = !$scope.reverse;

		if ($scope.direction == 'asc') {
			$scope.direction = 'dsc'
			$scope.directionClass = 'glyphicon-sort-by-alphabet-alt'
		} else {
			$scope.direction = 'asc'
			$scope.directionClass = 'glyphicon-sort-by-alphabet'
		}
	}

	$scope.selectIngredient = function(ingredient) {
		$scope.newFlag = false;
		// console.log(ingredientModel);	
		$scope.ingredientModel = ingredient;
		$scope.ingredientModel.brand = ingredient.attributes.brand;
		$scope.ingredientModel.genericIngredientName = ingredient.attributes.genericIngredientName;
		$scope.ingredientModel.ingredientCategory = ingredient.attributes.ingredientCategory;
		$scope.ingredientModel.ingredientName = ingredient.attributes.ingredientName;
		$scope.ingredientModel.unitOfMeasurement = ingredient.attributes.unitOfMeasurement;
		$scope.ingredientModel.calories = ingredient.attributes.calories;
		$scope.ingredientModel.gramsFat = ingredient.attributes.gramsFat;
		$scope.ingredientModel.gramsSaturatedFat = ingredient.attributes.gramsSaturatedFat;
		$scope.ingredientModel.gramsTransFat = ingredient.attributes.gramsSaturatedFat;
		$scope.ingredientModel.gramsCholesterol = ingredient.attributes.gramsCholesterol;
		$scope.ingredientModel.gramsSodium = ingredient.attributes.gramsSodium;
		$scope.ingredientModel.gramsCarbs = ingredient.attributes.gramsCarbs;
		$scope.ingredientModel.gramsFiber = ingredient.attributes.gramsFiber;
		$scope.ingredientModel.gramsSugar = ingredient.attributes.gramsSugar;
		$scope.ingredientModel.gramsProtein = ingredient.attributes.gramsProtein;


		$scope.editPanel = true;
	}

	$scope.newIngredient = function() {
		$scope.editPanel = true;
		$scope.newFlag = true;

		// new instance.
		$scope.ingredientModel = IngredientModel.newModel(); 
	}

	$scope.getUnit = function() {
		var _title = $scope.ingredientModel.unitOfMeasurement;

		if(_title === null) {
			return 'Select Unit'
		} else {
			return _title;
		}
	}

	$scope.setUnit = function(unit) {
		$scope.ingredientModel.unitOfMeasurement = unit;
	}


	buildAmount = function(amount) {
		if(amount === undefined) return 0
		if(amount === 0 || amount >= 1) return amount	

		return measurement('Mass')
			.convert(amount)
			.from(measurement.Unit.Mass.GRAM)
			.to(measurement.Unit.Mass.MILLIGRAM)
	} 

	buildUnit = function(amount, type) {
		if(amount === undefined) return '';
		if(type === 'calories') return '';

		if (amount === 0 || amount >= 1) {
			return 'g'
		} else {
			return 'mg'
		}
	}

	buildHash = function(amount, name, size, type) {
		return {
			'model' : type,
			'amount' : buildAmount(amount),
			'unit' : buildUnit(amount, type),
			'name' : name,
			'size' : size,
		}
	}

	// Builds an array of nutrition maps
	buildNutrition = function() {
		return [ 
			buildHash(0, 'Calories', 'large', 'calories'),
			buildHash(0, 'Total Fat', 'large', 'gramsFat'),
			buildHash(0, 'Saturated Fat', 'medium', 'gramsSaturatedFat'),
			buildHash(0, 'Trans Fat', 'medium', 'gramsTransFat'),
			buildHash(0, 'Cholesterol', 'large', 'gramsCholesterol'),
			buildHash(0, 'Sodium', 'large', 'gramsSodium'),
			buildHash(0, 'Total Carbs', 'large', 'gramsCarbs'),
			buildHash(0, 'Dietary Fiber', 'medium', 'gramsFiber'),
			buildHash(0, 'Sugars', 'medium', 'gramsSugar'),
			buildHash(0, 'Total Protein', 'large', 'gramsProtein')
		]
	}

	$scope.getType = function(type) {
		if(type === 'Total Fat' || 
			 type === 'Total Carbs') {
			return false;
		} else {
			return true;
		}
	}

	$scope.save = function() {
		if($scope.newFlag === false) return;
		if($scope.ingredientModel.ingredientName === null ||
			 $scope.ingredientModel.ingredientName === '') {
			Flash.sendMessage('Ingredient name blank!', 'danger')
		}

		IngredientModel.create($scope.ingredientModel).then(function(ingredient) {
			Flash.sendMessage('Ingredient Saved!', 'success');
			$scope.ingredients.push(ingredient);
		}, function(reason) {
			Flash.sendMessage(reason.message, 'danger')
		})	

	}

	$scope.nutritionFacts = buildNutrition();

	getIngredients(0);
})