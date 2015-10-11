angular.module('webtools.directives').directive('wtPopover', function($compile, $sce) {
	link = function(scope, element, attributes) {
		trusted = {}

		scope.popoverUrl = 'remove-popover.html'

		scope.close = function() {
			element.triggerHandler('click')
		}

		element.attr('uib-popover-template', 'popoverUrl')
		element.attr('popover-title', 'Remove?')
		element.attr('popover-placement', 'right')
		element.attr('popover-trigger', 'click')
		$compile(element)(scope)

		return
	}

	return {
		replace: true,
		link: link,
		scope: true,
		restrict: 'E',
		template: "<button class='btn btn-danger btn-xs'>remove</button>" 
	}

})