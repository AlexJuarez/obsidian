define(function (require) {
    'use strict';

    var app = require('./../module');
    var d3 = require('d3');

    app.directive('barChart', [function () {
        return {
            link: function (scope, elem, attr) {
                var key = attr.barChart;

                scope.$watch(key, function (raw) {
                    if (raw) {
                        var height = 12;
                        var width = 40;

                        var data = [raw.value];

                        var x = d3.scale.linear()
                            .domain([0, raw.max])
                            .range([0, width]);

                        d3.select(elem[0])
                            .selectAll('div')
                                .data(data)
                            .enter().append('div')
                                    .style('width', function (d) { return x(d) + 'px'; })
                                .style('height', height + 'px');
                    }
                });
            }
        };
    }]);
});
