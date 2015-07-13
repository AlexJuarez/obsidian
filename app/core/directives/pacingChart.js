define(function (require) {
	'use strict';

	var app = require('./../module');
	var d3 = require('d3');
	require('tpl!./pacingChart.html');

	app.directive('pacingChart', ['$timeout', function () {
		return {
			restrict: 'A',
			templateUrl: 'core/directives/pacingChart.html',
			link: function (scope, elem, attr) {
                var key = attr.pacingChart;

                scope.$watch(key, function (data) {
                    console.log(key, data);
                    if (data) {
                        scope.max = data.max;
                        scope.current = data.current;
                        scope.target = data.target;

                        var fill = d3.select(elem.find('.fill > rect')[0]);

                        fill.attr('width', Math.min(Math.round(data.current/data.max*100), 100) + '%');
                        //var target = d3.select(elem.find('.target > rect')[0]);
                        //target.attr('x', '80%');
                    }
                });
			}
		};
	}]);

});
