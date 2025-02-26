define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');
    var template = require('tpl!./preview.html');
    var wrapperTemplate = require('tpl!./wrapper.html');

    app.directive('creativePreview', [function () {
        return {
            restrict: 'A',
            scope: {
                id: '=creativePreview'
            },
            controller: ['$scope', '$element', '$compile', '$templateRequest', 'creativeService', '$window', '$document', 'studioLocation', 'openCreativeService', '$interval',
                function($scope, $element, $compile, $templateRequest, creativeService, $window, $document, studioLocation, openCreativeService, $interval) {
                    $scope.isOpen = false;
                    $scope.clicked = false;
                    $scope.previewInPage = previewInPage;
                    $scope.openInStudio = openInStudio;

                    var element, updatePos;

                    $scope.close = function() {
                        console.log( 'close this' );
                        $scope.isOpen = false;
                    };

                    $scope.$watch(function() { return $scope.isOpen; }, function (val) {
                        if (val) {
                            placeCreativePreview();
                        } else {
                            removeCreativePreview();
                        }
                    });

                    $element.on('click', function () {
                        $scope.clicked = true;
                        $scope.isOpen = !$scope.isOpen;
                        creativeService.get($scope.id);
                    });

                    function documentClickHandler(e) {
                        var target = e.target;

                        if (!$scope.clicked && !target.closest('.wrapper')) {
                            $scope.$apply(function () {
                                $scope.isOpen = false;
                            });
                        } else {
                            $scope.clicked = false;
                        }
                    }

                    $document.on('click', documentClickHandler);

                    $scope.$on('$destroy', function () {
                        $document.off('click', documentClickHandler);
                        if(updatePos) {
                            $interval.cancel(updatePos);
                        }
                    });

                    creativeService.observe(update, $scope, true);

                    var mixpoURL = studioLocation.host();

                    function update(id) {
                        if(id === $scope.id) {
                            $scope.creative = creativeService.get($scope.id);
                        }
                    }

                    function previewInPage() {
                        $window.open(mixpoURL + '/container?id=' + $scope.id, '_blank');
                    }

                    function openInStudio() {
                        var creative = {
                            id: $scope.id,
                            campaignId: $scope.campaignId
                        };
                        openCreativeService(creative, mixpoURL);
                    }

                    function calculateSpace() {
                        var elementOffset = $element[0].getBoundingClientRect();
                        var doc = $document[0].documentElement;

                        return {
                            right: doc.clientWidth - elementOffset.right,
                            left: elementOffset.left,
                            top: elementOffset.top,
                            bottom: doc.clientHeight - elementOffset.bottom
                        };
                    }

                    function calculatePosition(height, width) {
                        var dims = calculateSpace();
                        var doc = $document[0].documentElement;

                        var output = '';
                        var offset = $element.offset();
                        var top, left;
                        if (dims.top > height + 20) {
                            output += 'top-';
                            top = offset.top;
                        } else {
                            output += 'bottom-';
                            top = offset.top + $element.height();

                        }

                        if (dims.left > width && dims.right > width) {
                            output += 'center';
                            left = offset.left + Math.round($element.width()/2);
                        } else if (doc.clientWidth < 500) { //special condition for mobile sizing
                            output += 'center';
                            left = doc.clientWidth/2;
                        } else if (dims.left > dims.right) {
                            output += 'left';
                            left = offset.left;
                        } else {
                            output += 'right';
                            left = offset.left + $element.width();
                        }

                        return { class: output, top: top, left: left };
                    }

                    function updatePosition(height, width) {
                        if (element) {
                            if (element.hasClass('hide')) {
                                element.removeClass('hide');
                            }
                            var position = calculatePosition(height, width);
                            element.css('top', position.top);
                            element.css('left', position.left);
                            $scope.classes = position.class;
                        }
                    }

                    function placeCreativePreview() {
                        var wrapper = ng.element(wrapperTemplate);
                        wrapper.find('.wrapper').attr('id', $scope.id).append(template);
                        element = $compile(wrapper)($scope);
                        element.addClass('hide');
                        $document.find('body').append(element);
                        var height = element.find('.wrapper').height();
                        var width = element.find('.wrapper').width();
                        updatePos = $interval(function() { updatePosition(height, width); }, 100);
                    }

                    function removeCreativePreview() {
                        if (element) {
                            element.remove();
                            $interval.cancel(updatePos);
                            element = null;
                        }
                    }
                }
            ]
        };
    }]);
});
