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
            controller: ['$scope', '$element', '$compile', '$templateRequest', 'creativeService', '$window',
                function($scope, $element, $compile, $templateRequest, creativeService, $window) {
                    var htmlContent = ng.element('<div>' + $element.html() + '</div>');

                    $scope.isOpen = false;
                    $scope.previewInPage = previewInPage;
                    $scope.openInStudio = openInStudio;

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
                        var compiledContent = $compile(htmlContent)($scope.$parent);

                        el.html(compiledContent.html());

                        var compiledEl = $compile(el)($scope);
                        $element.html(compiledEl);
                    });

                }
            ]
        };
    }]);
});
