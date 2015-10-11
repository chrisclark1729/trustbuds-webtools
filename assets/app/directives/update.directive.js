angular.module('webtools.directives').directive('update', function($compile, $window) {

	var templateDisplay = '<div>{{value}}</div>'
	var	templateEdit = '<div class="input-group" style="width:100px"><input type="text" class="form-control" ng-model="value" aria-describedby="basic-addon2"><span class="input-group-addon" id="basic-addon2" ng-click="close()"><span class="glyphicon glyphicon-ok"></span></span></div>'

	setContent = function(element, scope, content) {
		element.empty()
		compiledElement = $compile(content)(scope)
		element.append(compiledElement);
	}

	link = function(scope, element, attribute) {
		_state = 'display'

		element.on('mouseup', function(event) {
			event.preventDefault()
			if(_state == 'display') {
				setContent(element, scope, templateEdit)
				angular.element(element.find('input'))[0].focus()
				_state = 'edit'
			}
		})

		scope.close = function() {
			setContent(element, scope, templateDisplay)
			_state = 'display'
		}

		element.on('keypress', function(event) {
			if(_state === 'edit') {
				switch(event.keyCode) {
					case 27:
						setContent(element, scope, templateDisplay)
						_state = 'display'
						break;
					case 13:
						setContent(element, scope, templateDisplay)
						scope.$digest()
						_state = 'display'
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
			'value' : '='
		}
	}
})
