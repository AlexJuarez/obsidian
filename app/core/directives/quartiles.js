define(function (require) {
	'use strict';

	var app = require('./../module');
	//var d3 = require('d3');
	require('tpl!./quartiles.html');

	app.directive('quartiles', ['$timeout', '$controller', function ($controller) {
		return {
			restrict: 'A',
            scope: {
                quartileData: '='
            },
			templateUrl: 'core/directives/quartiles.html',
			link: function (scope, elem, attr) {


                var adUnit = attr.quartileData;
                var quartileController = attr.quartileController;


                scope.$watch(adUnit, function() {
                    
                    if (quartileController) {
                        $controller(quartileController, { $scope: scope });    
                    }

                    if (adUnit) {
                        var viewNum =       scope.quartileData.metrics.view;
                        scope.video25 =     scope.quartileData.metrics.video25 / viewNum || 0;
                        scope.video50 =     scope.quartileData.metrics.video50 / viewNum || 0;
                        scope.video75 =     scope.quartileData.metrics.video75 / viewNum || 0;
                        scope.video100 =    scope.quartileData.metrics.video100 / viewNum || 0;
                    }
                       
                });


                console.log( 'directive scope', scope );


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
