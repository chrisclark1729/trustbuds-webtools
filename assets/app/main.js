angular.module('webtools', [
	'webtools.constants',
	'webtools.directives',
	'webtools.service',
	'webtools.models',
	'webtools.controllers',
	'LocalStorageModule',	
	'ui.bootstrap'
]).run(function(Credentials) {
	Parse.initialize(Credentials.application_id, Credentials.javascript_key);
})