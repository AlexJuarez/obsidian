define(function (require) {
	'use strict';

	var app = require('./../module');
	var d3 = require('d3');
	require('tpl!./quartiles.html');

	app.directive('quartiles', ['$timeout', function () {
		return {
			restrict: 'A',
			templateUrl: 'core/directives/quartiles.html',
			link: function (scope, elem, attr) {
                //console.log( 'quartiles', elem );
                // var key = attr.pacingChart;

                // scope.$watch(key, function (data) {
                //     var fill;

                //     if (data) {
                //         scope.max = data.max;
                //         scope.current = data.current;
                //         scope.target = data.target;


                //         if (data.current > data.max) {
                //             var target = Math.round(data.max/data.current*100);
                //             scope.target = true;
                //             fill = d3.select(elem.find('.target > rect')[0]);
                //             fill.attr('x', target + '%');
                //         }

                //         if (data.max) {
                //             fill = d3.select(elem.find('.fill > rect')[0]);
                //             fill.attr('width', Math.min(Math.round(data.current/data.max*100), 100) + '%');
                //         }

                //         //var target = d3.select(elem.find('.target > rect')[0]);
                //         //target.attr('x', '80%');
                //     }
                // });
			}
		};
	}]);

});
