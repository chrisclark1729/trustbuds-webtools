angular.module('webtools.directives').directive('update', function($compile, $window, $rootScope) {

	var templateDisplay = '<div>{{value}}</div>'
	var	templateEdit = '<div class="input-group" style="width:100px;"><input type="text" class="form-control" ng-model="value" aria-describedby="basic-addon2"><span class="input-group-addon" id="basic-addon2" ng-click="close(); $event.stopPropagation();"><span class="glyphicon glyphicon-ok"></span></span></div>'

	setContent = function(element, scope, content) {
		element.empty()
		compiledElement = $compile(content)(scope)
		element.append(compiledElement);
	}

	link = function(scope, element, attribute) {
		var _state = 'display'
		var _oldValue = null
		borderElement = angular.element(element[0].querySelector('div'))

		element.on('mouseup', function(event) {
			event.preventDefault()

			if(_state == 'display') {
				_oldValue = scope.value

				setContent(element, scope, templateEdit)
				angular.element(element.find('input'))[0].focus()
				_state = 'edit'
			}
		})

		canDivide = function(value) {
			div = value.toString().split("/")
			return (div.length == 2) && (div[1].length > 0) 
		}

		validDivide = function(value) {
			div = value.split("/")
			num = Number(div[0])
			dem = Number(div[1])

			if (validateZPlus(num) && validateZPlus(dem)) {
				return true;
			}
			
		}

		validateZPlus = function(value) {
			if (value === undefined || value === null) return false

			if (canDivide(value)) {
				if (validDivide(value)) {
					return true;
				}
			}

			if (isNaN(value)) return false
			if (value < 0) return false	
			return true
		}

		scope.close = function() {
			setContent(element, scope, templateDisplay)
			_state = 'display'

			if(scope.value == "") {
				scope.value = 0;
				_oldValue = 0;
				return
			}

			if(!validateZPlus(scope.value)) {
					scope.value = _oldValue;
					return
			}

			if (canDivide(scope.value)) {
					div = scope.value.split("/")
					num = Number(div[0]);
					dem = Number(div[1]);

					scope.value = num / dem; 
				}

			// message up to parent scope that the servings have been updated
			scope.$emit('update-servings', {ingredientId: scope.key, servings: [Number(scope.value), Number(_oldValue)]})
		}

		element.on('keypress', function(event) {
			if(_state === 'edit') {
				switch(event.keyCode) {
					case 27:
						scope.close()
						break;
					case 13:
						scope.close()
						scope.$digest()
						break;
				}
			}

		})

	}

	return {
		restrict: 'E',
		link: link,
		template: templateDisplay,
		scope: {
			'value' : '=',
			'key' : '@'
		}
	}
})
