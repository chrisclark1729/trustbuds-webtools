angular.module('webtools.directives').directive('frameExpand', function() {
	link = function(scope, element, attribute) {

		element.bind('dblclick', function(event) {
			height = element[0].offsetHeight;
			if (height === 525) {
				element.removeClass('frame')
			} else {
				element.addClass('frame')
			}

		})
	}

	return {
		link: link,
		scope: true,
		replace: true
	}
})