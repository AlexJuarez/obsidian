define(function (require) {
	'use strict';

	var app = require('./../module');
	var d3 = require('d3');
	require('tpl!./pacingChart.html');

	app.directive('pacingChart', [function () {
		return {
			restrict: 'A',
			scope: {},
			require: '?ngModel',
			templateUrl: 'core/directives/pacingChart.html',
			link: function (scope, elem, attrs, ngModel) {
				var fill = d3.select(elem.find('.fill > rect')[0])
					.attr('width', '60%');
				var target = d3.select(elem.find('.target > rect')[0])
					.attr('x', '80%');
			}
		};
	}]);

});