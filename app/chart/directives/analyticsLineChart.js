//jshint ignore: start
define(function (require) {
    'use strict';

    var ng = require('angular');
    var app = require('./../module');
    var d3 = require('d3');
    require('tpl!./analyticsLineChart.html');

    var css = require('text!./analyticsLineChart.css');

    var tooltipTemplate = require('tpl!./analyticsLineChartTooltip.html');

    var formatDayTooltip = d3.time.format('%b %d, %Y'),
        formatMonthTooltip = d3.time.format('%b, %Y'),
        formatYear = d3.time.format('%Y');

    var margin = {
        top: 25,
        right: 40,
        bottom: 25,
        left: 60
    };

    var formatTooltip = function (date, interval) {
        switch (interval) {
            case 'day':
                return formatDayTooltip(date);
            case 'weekStarting': //TODO: Validate this output week tooltip seems wrong
                return 'Week of ' + formatDayTooltip(date);
            case 'monthStarting':
                return formatMonthTooltip(date);
            case 'yearStarting':
                return formatYear(date);
        }
    };

    var xTickFormatter = {
        'day': d3.time.format('%m/%d'),
        'week': d3.time.format('%m/%d/%y'),
        'month': d3.time.format('%b-%y'),
        'year': d3.time.format('%Y')
    };

    app.directive('analyticsLineChart', [function () {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            scope: {},
            templateUrl: 'chart/directives/analyticsLineChart.html',
            controller: ['$scope', '$element', '$filter', '$window', '$interpolate', 'analyticsChartService', function ($scope, $element, $filter, $window, $interpolate, analyticChartService) {
                $scope.showOptions = [
                    {name: 'Impressions', value: 'impression'}
                    //{name: 'Views', value: 'view'},
                    //{name: 'Completion Rate', value: 'averagePercentComplete'}
                ];

                $scope.intervalOptions = [
                    {name: 'Day', value: 'day'},
                    {name: 'Week', value: 'weekStarting'},
                    {name: 'Month', value: 'monthStarting'},
                    {name: 'Year', value: 'yearStarting'}
                ];

                $scope.show = 'impression';
                $scope.interval = 'day';

                $scope.openPicker = openPicker;
                $scope.startDate = '';

                $scope.format = 'yyyy-MM-dd';
                $scope.downloadImage = downloadImage;

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 0,
                    maxMode: 'day'
                };

                function openPicker($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                }

                function getMetricName(value) {
                    var name = '';
                    ng.forEach($scope.showOptions, function (d) {
                        if (d.value === value) {
                            name = d.name;
                        }
                    });

                    return name;
                }

                function transformData(data, interval) {
                    var parseDate = d3.time.format('%Y-%m-%d').parse;

                    data.forEach(function(d) {
                        d[interval] = parseDate(d[interval]);
                    });
                }

                //Chart Creation
                function createChart(chartArea, data, interval, show) {
                    var width = chartArea.clientWidth - margin.left - margin.right;
                    var mobile = false;
                    if (width < 600) { //if width is less than 600 than overflow
                        width = 1200;
                        mobile = true;
                    }
                    var height = chartArea.clientHeight - margin.top - margin.bottom;

                    if (height < 0) {
                        height = 0;
                    }

                    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

                    var x = d3.time.scale()
                        .range([0, width]);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var color = d3.scale.category10();

                    var truncateNumber = $filter('truncateNumber');

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient('bottom')
                        .tickFormat(xTickFormatter[interval]);

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .ticks(6)
                        .orient('left')
                        .innerTickSize(-width)
                        .outerTickSize(0)
                        .tickFormat(function (d) { return ''; });

                    var yAxisExternal = d3.svg.axis()
                        .scale(y)
                        .ticks(6)
                        .orient('left')
                        .innerTickSize(0)
                        .outerTickSize(0)
                        .tickFormat(function (d) { return truncateNumber(d); });

                    var line = d3.svg.line()
                        .interpolate('linear')
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(d.datum); });

                    var chartContainer = d3.select(chartArea)
                        .append('div')
                            .attr('class', 'chart-container');

                    var svg = chartContainer.append('svg')
                        .attr('xmlns', 'http://www.w3.org/2000/svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom);

                    svg.append('style')
                        .text(css);

                    var chart = svg.append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    color.domain(['Line 1']);

                    var lineData = color.domain().map(function(name) {
                        return {
                            name: name,
                            values: data.map(function(d) {
                                return {
                                    name: name,
                                    date: d[interval],
                                    datum: +d.metrics[show],
                                    metrics: d.metrics
                                }
                            })
                        }
                    });

                    x.domain(d3.extent(data, function(d) { return d[interval]; }));

                    y.domain([
                        0,
                        d3.max(lineData, function (d) {
                            return d3.max(d.values, function(v) { return v.datum; });
                        })
                    ]);

                    //Create the x axis label
                    chart.append('g')
                        .attr('class', 'x-axis')
                        .attr('transform', 'translate(0, ' + height + ')')
                        .call(xAxis);

                    //Create the y axis label
                    chart.append('g')
                        .attr('class', 'y-axis')
                        .call(yAxis)
                    .append('text')
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(getMetricName(show));

                    var yAxisExternalContainer = d3.select(chartArea)
                        .append('div')
                            .attr('class', 'chart-y-axis')
                        .append('svg')
                            .attr('xmlns', 'http://www.w3.org/2000/svg')
                            .attr('width', margin.left + 1)
                            .attr('height', height + margin.top + 5);

                    yAxisExternalContainer.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                        .attr('class', 'y-axis')
                        .call(yAxisExternal);

                    var lines = chart.selectAll('.lines')
                        .data(lineData)
                        .enter().append('g')
                            .attr('class', 'lines');

                    //Create the path
                    lines.append('path')
                        .attr('class', 'line')
                        .attr('d', function(d) { return line(d.values); })
                        .style('fill', 'none')
                        .style('stroke', function(d) { return color(d.name) });

                    if (!mobile) {
                        //Create the circles
                        lines.selectAll('circle')
                            .data(function (d) { return d.values; })
                            .enter().append('circle')
                                .attr('r', 3.5)
                                .attr('cx', function(d) { return x(d.date); })
                                .attr('cy', function(d) { return y(d.datum); })
                                .style('fill', 'white')
                                .style('stroke', function(d) { return color(d.name) });


                        var overlay = chartContainer.append('div')
                            .attr('class', 'overlay')
                            .attr('style', 'left:' +  margin.left +
                            'px;top:' + margin.top + 'px; bottom:' + (margin.bottom - 10) + 'px')
                            .on('mousemove', mousemove)
                            .on('mouseout', mouseout);

                        //Create the tooltips for hover
                        var tooltip = overlay
                            .append('div')
                            .attr('class', 'tooltip-wrapper');
                    }

                    function mouseout() {
                        var event = this;
                        tooltip.style('opacity', 0);
                    }

                    function mousemove() {
                        var event = this;
                        ng.forEach(lineData, function (data){
                            var x0 = x.invert(d3.mouse(event)[0]),
                                i = bisectDate(data.values, x0, 1),
                                d0 = data.values[i -1],
                                d1 = data.values[i];
                            //which point on the line is closer
                            if(d0 && d1) {
                                var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                                tooltip.style('opacity', 1);
                                tooltip.style('top', (y(d.datum) - 15) + 'px')
                                    .style('left', x(d.date) + 'px');

                                tooltip.html($interpolate(tooltipTemplate)({
                                    title: getMetricName(show),
                                    value: d.datum,
                                    date: formatTooltip(d.date, interval)
                                }));
                            }
                        });
                    }
                }

                function downloadImage($event) {
                    var svg = $element.find('.chart-area svg')[0];

                    var link = $event.currentTarget;
                    link.href = "data:image/svg+xml;utf8," + svg.outerHTML;
                    link.download = 'chart.svg';
                }

                function setUpChart() {
                    var chartArea = $element.find('.chart-area');
                        chartArea.addClass('loading');
                        chartArea.empty();

                    if(!analyticChartService.exists($scope.interval, $scope.startDate)) {
                        analyticChartService.get($scope.interval, $scope.startDate).observe(function() {
                            var data = analyticChartService.get($scope.interval, $scope.startDate).all();
                            transformData(data, $scope.interval);
                            createChart(chartArea[0], data, $scope.interval, $scope.show);
                            chartArea.removeClass('loading');
                            $scope.noData = data.length === 0; //check for no data
                        }, $scope, true);
                    } else {
                        var data = analyticChartService.get($scope.interval, $scope.startDate).all();

                        createChart(chartArea[0], data, $scope.interval, $scope.show);
                        chartArea.removeClass('loading');
                    }
                }

                $element.find('.chart-area').addClass('loading');

                analyticChartService.get($scope.interval, $scope.startDate).observe(function() {
                    $element.find('.chart-area').empty();
                    var data = analyticChartService.get($scope.interval, $scope.startDate).all();
                    transformData(data, $scope.interval);
                    createChart($element.find('.chart-area')[0], data, $scope.interval, $scope.show);
                    $element.find('.chart-area').removeClass('loading');
                    $scope.noData = data.length === 0; //check for no data
                }, $scope, true);

                $scope.$watch('interval', function() {
                    setUpChart();
                });

                $scope.$watch('startDate', function() {
                    setUpChart();
                });

                $scope.$watch('show', function(newValue) {
                    $element.find('.chart-area').empty();
                    var data = analyticChartService.get($scope.interval, $scope.startDate).all();

                    createChart($element.find('.chart-area')[0], data, $scope.interval, newValue);
                });

                ng.element($window).on('resize', function() {
                    $element.find('.chart-area').empty();
                    var data = analyticChartService.get($scope.interval, $scope.startDate).all();

                    createChart($element.find('.chart-area')[0], data, $scope.interval, $scope.show);
                });

            }]
        };
    }]);
});
