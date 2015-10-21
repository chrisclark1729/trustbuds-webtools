angular.module('webtools.models').service('FoodEntryModel', function($q) {

	var FoodEntry = Parse.Object.extend('FoodDiaryEntries');
	var _pageSize = 30;

	this.getAll = function(page, direction) {
		page = page || 0;
		direction = direction || 'desc'

		var deferred = $q.defer();
		var query = new Parse.Query(FoodEntry);

		// set the page to get.
		query.skip(page * _pageSize);
		query.limit(_pageSize);

		if (direction == 'asc') {
			query.ascending('createdAt');
		} else {
			query.descending('createdAt');
		}

		query.equalTo('isVisible', true);

		query.find({
			success: function(results) {
				deferred.resolve(results);
			},
			error: function(reason) {
				deferred.reject(reason);
			}
		})

		return deferred.promise;
	}

	this.getCount = function() {
		var deferred = $q.defer();
		var query = new Parse.Query(FoodEntry);

		query.equalTo('isVisible', true)

		query.count({
			success: function(count) {
				deferred.resolve(count);
			}, error: function(entry, error) {
				deferred.reject(error);
			}
		})

		return deferred.promise;
	}

	// Update the foodEntry instance.
	this.update = function(foodEntry) {
		var deferred = $q.defer();

		foodEntry.save(null, {
			success: function(entry) {
				deferred.resolve(entry);
			}, error: function(entry, error) {
				deferred.reject(error);
			}
		})

		return deferred.promise; 
	}

	buildAmount = function(amount) {
		if(amount === undefined) return 0
		if(amount === 0 || amount >= 1) return amount	

		return measurement('Mass')
			.convert(amount)
			.from(measurement.Unit.Mass.GRAM)
			.to(measurement.Unit.Mass.MILLIGRAM)
	} 

	buildUnit = function(amount) {
		if(amount === undefined) return ''
		if (amount === 0 || amount >= 1) {
			return 'g'
		} else {
			return 'mg'
		}
	}

	buildHash = function(amount, name, size, type) {
		return {
			'amount' : buildAmount(amount),
			'unit' : buildUnit(amount),
			'name' : name,
			'size' : size,
			'type' : type
		}
	}

	// Builds an array of nutrition maps
	this.buildNutrition = function(entry) {
		return [
			buildHash(entry.get('calories'), 'Calories', 'large', 'calories'),
			buildHash(entry.get('gramsFat'), 'Total Fat', 'large', 'gramsFat'),
			buildHash(entry.get('gramsSaturatedFat'), 'Saturated Fat', 'medium', 'gramsSaturatedFat'),
			buildHash(entry.get('gramsTransFat'), 'Trans Fat', 'medium', 'gramsTransFat'),
			buildHash(entry.get('gramsCholesterol'), 'Cholesterol', 'large', 'gramsCholesterol'),
			buildHash(entry.get('gramsSodium'), 'Sodium', 'large', 'gramsSodium'),
			buildHash(entry.get('gramsCarbs'), 'Total Carbs', 'large', 'gramsCarbs'),
			buildHash(entry.get('gramsFiber'), 'Dietary Fiber', 'medium', 'gramsFiber'),
			buildHash(entry.get('gramsSugar'), 'Sugars', 'medium', 'gramsSugar'),
			buildHash(entry.get('gramsProtein'), 'Total Protein', 'large', 'gramsProtein')
		]
	}

	this.updateEntryNutrition = function(entry, type, newServings, oldServings, ingredient) {
		if(newServings === undefined) return

		baseValue = ingredient.get(type)
		if(baseValue === undefined || baseValue === null) return	

		diffServings = baseValue*(newServings - oldServings)
		entry.increment(type, diffServings)
	}

	return this;
})