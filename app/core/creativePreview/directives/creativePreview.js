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
                id: '=creativePreview'
            },
            controller: ['$scope', '$element', '$compile', '$templateRequest', 'creativeService',
                function($scope, $element, $compile, $templateRequest, creativeService) {
                    var htmlContent = $element.html();

                    $scope.previewInPage = previewInPage;
                    $scope.openInStudio = openInStudio;

                    creativeService.observe(update, $scope);

                    function update() {
                        $scope.creative = creativeService.get($scope.id);
                    }

                    function previewInPage() {
                        console.log('test');
                    }

                    function openInStudio() {
                        console.log('studio link');
                    }

                    $templateRequest('core/creativePreview/directives/wrapper.html').then(function(wrapper) {
                        var el = ng.element(wrapper);

                        el.append(htmlContent);

                        var compiledEl = $compile(el)($scope);
                        $element.html(compiledEl);
                    });

                }
            ]
        };
    }]);
});
