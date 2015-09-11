define(function (require) {
	'use strict';

	var app = require('./../module');
	var d3 = require('d3');
	require('tpl!./quartiles.html');

	app.directive('quartiles', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
            scope: {
                quartileData: '='
            },
			templateUrl: 'chart/directives/quartiles.html',
			link: function (scope, elem) {

                if (scope.quartileData) {
                    scope.$watch(scope.quartileData, function() {

                        var viewNum =       scope.quartileData.view;
                        scope.dataArray = [
                            {
                                'value': scope.quartileData.video25 / viewNum || 0,
                                'quartile': '25'
                            },
                            {
                                'value': scope.quartileData.video50 / viewNum || 0,
                                'quartile': '50'
                            },
                            {
                                'value': scope.quartileData.video75 / viewNum || 0,
                                'quartile': '75'
                            },
                            {
                                'value': scope.quartileData.video100 / viewNum || 0,
                                'quartile': '100'
                            }
                        ];

                        for (var i = 0; i < scope.dataArray.length; i++) {

                            var obj = scope.dataArray[i];
                            setGraph(obj.value, obj.quartile);

                        }
                    });

                }


                var graphHeight = 50;

                function setGraph(value, id) {
                    if (value === 0) {
                        return;
                    }

                    var percentage = 1*value.toFixed(4);

                    var h = graphHeight * percentage;

                    var yPos = graphHeight - h;

                    $timeout(function() {

                        var rect = d3.select( elem.find('#video'+id)[0] );
                        rect.attr('y', yPos)
                            .attr('height', h);

                    });

                }

			}
		};
	}]);

});
