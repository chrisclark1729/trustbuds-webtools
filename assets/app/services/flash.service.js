angular.module('webtools.service').service('Flash', function($rootScope) {
	this.sendMessage = function(message, state) {
		$rootScope.$emit('flash-update', {message: message.message, error: message.error, state: state})
	}

	return this;
})