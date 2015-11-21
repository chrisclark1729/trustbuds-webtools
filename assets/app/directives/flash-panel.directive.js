angular.module('webtools.directives').directive('flashPanel', function($rootScope, $timeout) {
	link = function(scope, element, attribute) {
		scope.alertClass = ''
		scope.displayPanel = false
		var timedClose = null;

		// Watch for an update
		$rootScope.$on('flash-update', function(event, data) {

			if(timedClose) {
				$timeout.cancel(timedClose);
			}

			scope.message = data.message
			scope.displayPanel = true
			scope.alertClass = 'alert-' + data.state;

			timedClose = $timeout(scope.close, 4*1000);
			
		})

		scope.close = function() {
			scope.displayPanel = false
			scope.alertClass = ''
		}
	}

	return {
		scope: false,
		link: link,
		templateUrl: 'flash-panel.html'
	}

})