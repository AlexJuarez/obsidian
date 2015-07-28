define(function (require) {
    'use strict';

    var app = require('./../module');
    var ng = require('angular');

    var directionClasses = [
        'tooltip-middle-left', 'tooltip-middle-right', 'tooltip-top-left', 'tooltip-top-center',
        'tooltip-top-right',
        'tooltip-bottom-left',
        'tooltip-bottom-center',
        'tooltip-bottom-right'
    ];

    require('tpl!./tooltip.html');

    app.directive('tooltip', ['$templateCache', '$rootScope', '$compile', '$document', '$parse', '$timeout', '$window', '$controller', function ($templateCache, $rootScope, $compile, $document, $parse, $timeout, $window, $controller) {
        return {
            restrict: 'A',
            scope: false,
            //controller: 'modalCtrl',
            link: function (scope, elem, attr) {

                scope.updatePosition = updatePosition;
                scope.calculateClass = calculateClass;
                scope.calculateDims = calculateDims;
                //showOnClick = scope.showOnClick;
                scope.hideOnClick = hideOnClick;
                scope.documentClickHandler = documentClickHandler;
                //scope.removePreviewModalHandlers = removePreviewModalHandlers;
                //scope.tooltipLink = tooltipLink;
                //scope.openPreviewPage = openPreviewPage;


                var tooltip = attr.tooltip;
                var overflow = attr.tooltipOverflow;
                scope.main = elem.html();
                var baseTemplate = $templateCache.get('core/directives/tooltip.html');
                var isBasicTooltip = true;
                var wrapper, closeBtn, toolTipTrigger, previewLink, ctrlInstance;


                scope.$watch(tooltip, function (newValue) {
                    var template = $templateCache.get(newValue);
                    if (!template) {
                        scope.content = newValue;
                    } else {
                        scope.content = template;
                        isBasicTooltip = false;

                        if (attr.customControl) {
                            //var newScope = $rootScope.$new(false, scope);
                            //console.log( newScope );
                            var customController = attr.customControl;
                            ctrlInstance = $controller( customController, { $scope: scope });
                            console.log( ctrlInstance );
                        }
                        
                        // Assign click event to show tooltip
                        $timeout(function() {
                            toolTipTrigger = elem.find('.main');
                            wrapper = elem.find('.wrapper');
                            toolTipTrigger.on( 'mouseup', function(e) {
                                setPreviewModalHandlers();
                                scope.showOnClick(e, wrapper);
                            } );
                            
                        });
                        
                    }
                    elem.html($compile(baseTemplate)(scope));
                });


                function setPreviewModalHandlers() {
                    console.log( 'setPreviewModalHandlers' );

                    previewLink = elem.find('.preview-link');
                    previewLink.on('click', scope.openPreviewPage);
                    
                    closeBtn = wrapper.find('.glyph-close');
                    closeBtn.on('mouseup', hideOnClick);

                    $document.on('mouseup', documentClickHandler);
                }
                

                function removePreviewModalHandlers() {
                    console.log( 'removeHandlers' );
                    $document.off('mouseup', documentClickHandler);
                    closeBtn.off('mouseup', hideOnClick);
                }

                function documentClickHandler(e) {
                    console.log( 'documentClickHandler' );
                    e.stopPropagation();
                    wrapper.removeClass('show');
                    removePreviewModalHandlers();
                }
               
                // function showOnClick(e, wrapper) {
                //     console.log( 'showOnClick ' );
                //     e.stopPropagation();
                    
                //     setPreviewModalHandlers();

                //     wrapper.addClass('show');
                    
                    
                //     //body.on('mouseup', documentClickHandler);
                    
                // }

                // function openPreviewPage(e) {
                //     console.log( 'open page' );
                //     e.stopPropagation();
                //     //$window.open();
                // }

                function hideOnClick(e) {
                    console.log( 'hideOnClick' );
                    e.stopPropagation();
                    wrapper.removeClass('show');
                    removePreviewModalHandlers();
                }

                function calculateClass(dims) {
                    ng.forEach(directionClasses, function (c) {
                        elem.removeClass(c);
                    });

                    var topBuffer, leftRightBuffer;
                    if (isBasicTooltip) {
                        topBuffer = 50;
                        leftRightBuffer = 200;
                    } else {
                        topBuffer = 410;
                        leftRightBuffer = 380;
                    }

                    if (dims.top > topBuffer) {
                        if (dims.left > leftRightBuffer && dims.right > leftRightBuffer) {
                            return 'tooltip-top-center';
                        } else if (dims.left > dims.right) {
                            return 'tooltip-top-left';
                        } else {
                            return 'tooltip-top-right';
                        }
                    } else {
                        if (dims.left > leftRightBuffer && dims.right > leftRightBuffer) {
                            return 'tooltip-bottom-center';
                        } else if (dims.left > dims.right) {
                            return 'tooltip-bottom-left';
                        } else {
                            return 'tooltip-bottom-right';
                        }
                    }
                }

                function calculateDims() {
                    var elementOffset = elem[0].getBoundingClientRect();
                    var doc = $document[0].documentElement;

                    return {
                        right: doc.clientWidth - elementOffset.right,
                        left: elementOffset.left,
                        top: elementOffset.top,
                        bottom: doc.clientHeight - elementOffset.bottom
                    };
                }

                function updatePosition() {
                    if (overflow) {
                        var element = elem.find('.main')[0];
                        if (element.offsetWidth >= element.scrollWidth) {
                            elem.find('.wrapper').addClass('ng-hide');
                        } else {
                            elem.find('.wrapper').removeClass('ng-hide');
                        }
                    }

                    var dims = calculateDims();
                    elem.addClass(calculateClass(dims));
                }

            }
        };
    }]);
});
