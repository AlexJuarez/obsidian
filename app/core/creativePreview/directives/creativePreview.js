define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');
    require('tpl!./preview.html');
    require('tpl!./wrapper.html');

    app.directive('creativePreview', [function () {
        return {
            restrict: 'A',
            scope: {
                id: '@creativePreview'
            },
            controller: ['$scope', '$element', '$compile', '$templateRequest', 'creativeService', '$window', '$document',
                function($scope, $element, $compile, $templateRequest, creativeService, $window, $document) {
                    var htmlContent = ng.element('<div>' + $element.html() + '</div>');

                    $scope.isOpen = false;
                    $scope.clicked = false;
                    $scope.previewInPage = previewInPage;
                    $scope.openInStudio = openInStudio;
                    $scope.parent = parentScope;

                    function parentScope() {
                        return $scope.$parent;
                    }

                    $element.on('click', function () {
                        $scope.clicked = true;
                    });

                    function documentClickHandler() {
                        if (!$scope.clicked) {
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
                    });

                    creativeService.observe(update, $scope);

                    var mixpoURL = getStudioUrl($window.location.hostname);

                    function getStudioUrl(domain) {
                        if (domain.indexOf('studio') > -1) {
                            return '//' + domain;
                        } else if (domain.indexOf('mixpo.com') > -1) {
                            return '//' + domain.replace(/(w*)\.mixpo\.com/, '$1-studio.mixpo.com');
                        } else {
                            return '//studio.mixpo.com';
                        }
                    }

                    function update() {
                        $scope.creative = creativeService.get($scope.id);
                    }

                    function previewInPage() {
                        $window.open(mixpoURL + '/container?id=' + $scope.id, '_blank');
                    }

                    function openInStudio() {
                        $window.open(mixpoURL + '/studio?sdf=open&guid=' + $scope.id, '_blank');
                    }

                    $templateRequest('core/creativePreview/directives/wrapper.html').then(function(wrapper) {

                        var el = ng.element(wrapper);
                        el.html(htmlContent);
                        var compiledEl = $compile(el)($scope);
                        $element.html(compiledEl);
                    });

                }
            ]
        };
    }]);
});
