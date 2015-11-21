angular.module('webtools.controllers').controller('MainCtrl', function($scope) {
	$scope.panel = 'ingredient';

	$scope.setPanel = function(panel) {
		switch(panel) {
			case 'main':
				$scope.panel = panel;
				break;
			case 'ingredient':
				$scope.panel = panel;
				break;
			default:
				$scope.panel = 'main';
		}
	}

})