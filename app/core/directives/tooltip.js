/* globals $ */

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
            scope: {},
            link: function (scope, elem, attr) {
                //console.log( 'directive scope: ', scope );
                scope.updatePosition = updatePosition;
                scope.calculateClass = calculateClass;
                scope.calculateDims = calculateDims;
                
                scope.isOpen = false;
                scope.toggleVisible = function() {
                    console.log( 'we are toggling', elem );
                    scope.isOpen = !scope.isOpen;
                    //scope.isOpen ? scope.setPreviewModalHandlers() : scope.removePreviewModalHandlers();
                };
                scope.documentClickHandler = documentClickHandler;
                scope.setPreviewModalHandlers = setPreviewModalHandlers;
                scope.removePreviewModalHandlers = removePreviewModalHandlers;
                
                //scope.tooltipLink = tooltipLink;
                //scope.openPreviewPage = openPreviewPage;


                var tooltip = attr.tooltip;
                var overflow = attr.tooltipOverflow;
                scope.main = elem.html();
                var baseTemplate = $templateCache.get('core/directives/tooltip.html');
                var isBasicTooltip = true;
                var doc, wrapper, closeBtn, toolTipTrigger, previewLink, editLink, ctrlInstance;


                scope.$watch(tooltip, function (newValue) {
                    var template = $templateCache.get(newValue);
                    if (!template) {
                        scope.content = newValue;
                    } else {
                        scope.content = template;
                        isBasicTooltip = false;

                        if (attr.customControl) {
                            var customController = attr.customControl;
                            ctrlInstance = $controller( customController, { $scope: scope });
                        }
                        
                        // Assign click event to show tooltip
                        $timeout(function() {
                            doc = $(document);
                            // toolTipTrigger = elem.find('.main');
                            // wrapper = elem.find('.wrapper');
                            
                            // toolTipTrigger.on( 'click', {
                            //     wrapper: wrapper
                            // }, scope.toggleVisible );
                            //console.log( scope );
                        });
                        
                    }
                    elem.html( $compile(baseTemplate)(scope) );
                });


                function setPreviewModalHandlers() {
                    console.log( 'setPreviewModalHandlers' );

                    // Assign Preview Page Event Handler
                    //previewLink = elem.find('.preview-link');
                    // previewLink.on( 'click', {
                    //     url: 'http://www.mixpo.com',
                    //     guid: 'GUID_FOR_PREVIEWING'
                    // }, scope.openPreviewPage);
                    
                    // Assign Edit in Studio Event Handler
                    // editLink = elem.find('.edit-link');
                    // editLink.on( 'click', {
                    //     url: 'http://www.mixpo.com',
                    //     guid: 'GUID_FOR_EDITING'
                    // }, scope.openStudio);

                    // Assign Close Btn Event Handler
                    closeBtn = elem.find('.glyph-close');
                    closeBtn.on( 'click', scope.toggleVisible );
                    
                    // Add document click handler after modal opens
                    // $timeout(function() {
                    //     doc.on('click', documentClickHandler);
                    // }, 500);
                }


                function removePreviewModalHandlers() {
                    console.log( 'removeHandlers' );
                    //doc.off('click', documentClickHandler);
                    //closeBtn.off('click', scope.hideOnClick);
                    //previewLink.off('click', scope.openPreviewPage);
                }

                function documentClickHandler(e) {
                    if (elem !== e.target && !elem[0].contains(e.target)) {
                        console.log( 'documentClickHandler' );
                        scope.$apply(function() {
                            console.log( 'hit' );
                            scope.isOpen = false;
                        });
                    }

                    // if (!$(event.target).closest('.wrapper').length) {
                    //     console.log( 'documentClickHandler' );
                    //     // Hide the menus.
                    //     //wrapper.removeClass('show');
                    //     scope.isOpen = false;
                    //     removePreviewModalHandlers();
                    //     scope.$apply();
                    // }
                }
               
                // function showOnClick(e, wrapper) {
                //     console.log( 'showOnClick ' );
                //     e.stopPropagation();
                    
                //     setPreviewModalHandlers();

                //     wrapper.addClass('show');
                    
                    
                //     //body.on('mouseup', documentClickHandler);
                    
                // }

                // function openPreviewPage() {
                //     console.log( 'open page' );
                //     //e.stopPropagation();
                //     //$window.open();
                // }

                // function hideOnClick() {
                //     console.log( 'hideOnClick' );
                //     //e.stopPropagation();
                //     wrapper.removeClass('show');
                //     removePreviewModalHandlers();
                // }

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
