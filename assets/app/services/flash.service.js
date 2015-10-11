angular.module('webtools.service').service('Flash', function($rootScope) {
	this.sendMessage = function(message, state, error) {
		$rootScope.$emit('flash-update', {message: message, error: error, state: state})
	}

	return this;
})