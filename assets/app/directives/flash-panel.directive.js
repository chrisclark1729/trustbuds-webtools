angular.module('webtools.directives').directive('flashPanel', function($rootScope) {
	link = function(scope, element, attribute) {
		scope.alertClass = 'alert-'
		scope.displayPanel = false
		// Watch for an update
		$rootScope.$on('flash-update', function(event, data) {
			scope.message = data.message
			scope.displayPanel = true
			scope.alertClass += data.state
		})

		scope.close = function() {
			scope.displayPanel = false
			scope.alertClass = 'alert-'
		}
	}

	return {
		scope: false,
		link: link,
		templateUrl: 'flash-panel.html'
	}

})