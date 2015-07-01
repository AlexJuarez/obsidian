define(function (require) {
	'use strict';

	var app = require('./../module');
	var d3 = require('d3');
	require('tpl!./pacingChart.html');

	app.directive('pacingChart', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			scope: {},
			require: '?ngModel',
			templateUrl: 'core/directives/pacingChart.html',
			link: function (scope, elem) {
				$timeout(function () {
					var fill = d3.select(elem.find('.fill > rect')[0]);
					fill.attr('width', '60%');
					var target = d3.select(elem.find('.target > rect')[0]);
					target.attr('x', '80%');
					scope.$apply();
				});
			}
		};
	}]);

});
