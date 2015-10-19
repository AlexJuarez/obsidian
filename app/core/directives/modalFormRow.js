define(function (require) {
	'use strict';

	var app = require('./../module');
	//Check https://github.com/LPology/Simple-Ajax-Uploader for docs
	var ss = require('simpleUpload');

	require('tpl!./modalFormRow.html');

	app.directive('modalFormRow', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			scope: {
				name: '@',
				contentId: '@',
				required: '@',
				submitted: '='
			},
			transclude: true,

			templateUrl: 'core/directives/modalFormRow.html',
			link: function (scope, element, attrs, ctrl, transclude) {
				if (scope.name) {
					scope.lowerCaseName = scope.name.toLowerCase();
				}

				// Give the transcluded content access to the parent scope
				transclude(scope.$parent, function(clone) {
					var transcludeElement = $(element[0].querySelector('[ng-transclude]'))[0];
					while (transcludeElement.firstChild) {
						transcludeElement.removeChild(transcludeElement.firstChild);
					}
					$(transcludeElement).append(clone);
				});
			}
		};
	}]);
});
