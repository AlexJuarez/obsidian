/**
 * Created by Alex on 3/2/2015.
 */
/* jshint camelcase: false */
/* jshint -W098 */
/* jshint -W004 */
/* jshint -W101 */

'use strict';

define(function (require) {
    var app = require('./../module');
    var ng = require('angular');

    app.controller('styleGuideCtrl', ['$scope', '$state', '$http', '$timeout', '$window', '$location', '$anchorScroll', 'storeService', 'clientService', 'divisionService', 'campaignService', '$modal',
    function ($scope, $state, $http, $timeout, $window, $location, $anchorScroll, store, clients, divisions, campaigns, $modal) {
        $scope.navigation = [];
        $scope.state = '';
        $scope.sort = sort;
        $scope.changeGlyph = changeGlyph;
        $scope.scrollTo = scrollTo;
        $scope.navOpen = false;
        $scope.user = {
            name: '',
            email: 'invalid@e,'
        };

        $timeout(function () {
            $location.hash($location.hash());
            $anchorScroll();
        }, 250);

        $scope.open = open;

        $scope.selected = [];

        $scope.select = [
            // {
            //     name: '',
            //     value: '0'
            // },
            {
                name: 'First Choice',
                value: '1'
            },
            {
                name: 'Second',
                value: '2'
            },
            {
                name: 'Choice #3',
                value: '3'
            },
            {
                name: 'Pick me, pick me, pick me!',
                value: '4'
            },
            {
                name: 'Sheeple',
                value: '5'
            }
        ];

        $scope.multiselect = [
            {
                name: 'First Choice',
                value: '1'
            },
            {
                name: 'Second',
                value: '2'
            },
            {
                name: 'Choice #3',
                value: '3'
            },
            {
                name: 'Pick me, pick me, pick me!',
                value: '4'
            },
            {
                name: 'Sheeple',
                value: '5'
            }
        ];

        $http.get('fixtures/table.json').then(function (res) {
            $scope.table = res.data;
        });

        $http.get('fixtures/table_complex.json').then(function (res) {
            $scope.tableComplex = res.data;
        });

        $http.get('fixtures/accordion_table.json').success(function (data) {
            $scope.test = data;
            $timeout(function () {
                $scope.$apply();
            });
        });

        /**
         * A bunch of code around building out menus dynamically
         */

        $timeout(function () {
            var output = [];
            var $headers = ng.element($window.document).find('h1');
            ng.forEach($headers, function (d, i) {
                var $elem = ng.element(d);
                if ($elem.attr('id')) {
                    var children = [];
                    var $children = $elem.parent().find('h2');
                    ng.forEach($children, function (d, i) {
                        var $child = ng.element(d);
                        if ($child.attr('id')) {
                            children.push({
                                value: $child.text(),
                                id: $child.attr('id'),
                                elem: $child,
                                active: false
                            });
                        }
                    });
                    output.push({
                        value: $elem.text(),
                        id: $elem.attr('id'),
                        children: children,
                        elem: $elem,
                        active: false
                    });
                }
            });
            output[0].active = true;
            $scope.navigation = output;
            ng.element($window).bind('scroll',
                debounce(function () {
                    var scrollTop = this.pageYOffset;
                    var closest = '';
                    var offsetTop;
                    for (var i = 0; i < output.length; i++) {
                        var children = output[i].children;
                        offsetTop = output[i].elem[0].offsetTop;
                        /* jshint -W083 */
                        ng.forEach(children, function (v, k) {
                            v.active = false;
                        });

                        if (offsetTop <= scrollTop && i + 1 >= output.length ||
                            i + 1 < output.length &&
                            offsetTop <= scrollTop &&
                            scrollTop < output[i + 1].elem[0].offsetTop) {
                            closest = output[i].id;

                            for (var k = 0; k < children.length; k++) {
                                offsetTop = children[k].elem[0].offsetTop;
                                if (offsetTop <= scrollTop && k + 1 >= children.length ||
                                    k + 1 < children.length &&
                                    offsetTop <= scrollTop &&
                                    scrollTop < children[k + 1].elem[0].offsetTop) {
                                    closest = children[k].id;
                                    children[k].active = true;
                                } else {
                                    children[k].active = false;
                                }
                            }
                        }
                        output[i].active = closest === output[i].id;
                    }
                    $scope.$apply(function () {
                        $location.hash(closest);
                    });
                }, 100)
            );
        });

        function debounce(func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                function later() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                }
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        }

        function scrollTo(id) {
            $location.hash(id);
            $anchorScroll();
        }

        function changeGlyph(e) {
            e = e || window.event;
            var name = e.target.getAttribute('data-name') || e.target.parentNode.getAttribute('data-name');
            if (name) {
                document.getElementById('glyph-name').childNodes[0].childNodes[0].innerHTML = name;
            }
        }

        function sort(column, event) {
            var $elem = ng.element(event.currentTarget);
            var isSelected = $elem.hasClass('selected');

            if (isSelected) {
                $elem.removeClass('selected');
                $elem.removeClass('desc');
                $elem.addClass('asc');
            } else {
                $elem.addClass('selected');
                $elem.removeClass('asc');
                $elem.addClass('desc');
            }

            $scope.tableComplex.data.sort(function (a, b) {
                a = a.row[column].value;
                b = b.row[column].value;

                if (typeof a === 'number') {
                    if (isSelected) {
                        return b - a;
                    } else {
                        return a - b;
                    }
                } else if (typeof a === 'string') {
                    if (isSelected) {
                        return b.localeCompare(a);
                    } else {
                        return a.localeCompare(b);
                    }
                }
            });
        }

        function open(size) {
            var modalInstance = $modal.open({
                animation: 'true',
                templateUrl: 'style-guide/new-account-form.html',
                controller: 'modalInstanceCtrl',
                size: size
            });
        }
    }]);

});

