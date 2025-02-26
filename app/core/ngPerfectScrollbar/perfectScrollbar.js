define(function(require){
    'use strict';

    var ng = require('angular');
    var module = require('./../module');

    module.directive('perfectScrollbar',
        ['$parse', '$window', 'IS_MOBILE', function($parse, $window, IS_MOBILE) {
            var psOptions = [
                'wheelSpeed', 'wheelPropagation', 'minScrollbarLength', 'useBothWheelAxes',
                'useKeyboard', 'suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset',
                'scrollYMarginOffset', 'includePadding'//, 'onScroll', 'scrollDown'
            ];

            return {
                restrict: 'EA',
                transclude: true,
                template: '<div><div ng-transclude></div></div>',
                replace: true,
                link: function($scope, $elem, $attr) {
                    if (!IS_MOBILE) {
                        var jqWindow = ng.element($window);
                        var options = {};

                        for (var i=0, l=psOptions.length; i<l; i++) {
                            var opt = psOptions[i];
                            if ($attr[opt] !== undefined) {
                                options[opt] = $parse($attr[opt])();
                            }
                        }

                        $scope.$evalAsync(function() {
                            $elem.perfectScrollbar(options);
                            var onScrollHandler = $parse($attr.onScroll);
                            $elem.scroll(function(){
                                var scrollTop = $elem.scrollTop();
                                var scrollHeight = $elem.prop('scrollHeight') - $elem.height();
                                $scope.$apply(function() {
                                    onScrollHandler($scope, {
                                        scrollTop: scrollTop,
                                        scrollHeight: scrollHeight
                                    });
                                });
                            });
                        });

                        // This is necessary when you don't watch anything with the scrollbar
                        $elem.bind('mouseenter', update('mouseenter'));

                        // Possible future improvement - check the type here and use the appropriate watch for non-arrays
                        if ($attr.refreshOnChange) {
                            $scope.$watchCollection($attr.refreshOnChange, function() {
                                update();
                            });
                        }

                        // this is from a pull request - I am not totally sure what the original issue is but seems harmless
                        if ($attr.refreshOnResize) {
                            jqWindow.on('resize', update);
                        }

                        $elem.bind('$destroy', function() {
                            jqWindow.off('resize', update);
                            $elem.perfectScrollbar('destroy');
                        });
                    } else {
                        $elem.css('overflow-y', 'scroll');
                    }

                    function update(event) {
                        $scope.$evalAsync(function() {
                            if ($attr.scrollDown === 'true' && event !== 'mouseenter') {
                                setTimeout(function () {
                                    $elem.scrollTop($elem.prop('scrollHeight'));
                                }, 100);
                            }
                            $elem.perfectScrollbar('update');
                        });
                    }
                }
            };
        }]);
});
