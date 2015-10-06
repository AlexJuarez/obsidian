define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./loadingIndicator.html');

    app.directive('loadingIndicator', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {},
            templateUrl: 'core/directives/loadingIndicator.html',
            controller: function ($scope, $attrs, $injector) {

                $scope.isLoaded = false;

                var loadedService = $injector.get($attrs.loadingService);
                
                loadedService.observe(updateService, $scope);

                function updateService(newValue, oldValue) {
                    if ( typeof loadedService.isLoaded === 'function' ) {
                        
                        $scope.isLoaded = loadedService.isLoaded();
                    
                    }
                    if ( typeof loadedService.data().isLoaded === 'function' ) {
                        
                        $scope.isLoaded = loadedService.data().isLoaded();
                    
                    }
                }
                
            }
        };
    }]);
});
