define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!../../core/modal/creativePreview.html');

    app.controller('modalCtrl', ['$scope', '$rootScope', '$state', '$filter', '$window', '$location', 'creatives', function ($scope, $rootScope, $state, $filter, $window, $location, creatives) {
        //console.log( $scope, creatives );
        
        
        $scope.openPreviewPage = function(id, name) {
            console.log( 'preview creative ' + id, name );
            var previewUrl = '//'+ $location.$$host + '/videoad/' + id + '/' + name;
            console.log( previewUrl );
            //$window.open(previewUrl, '_blank');
        };
        $scope.openStudio = function(id) {
            console.log( 'open studio ' + id );
            var studioUrl = '//'+ $location.$$host + '/studio?sdf=open&guid=/' + id;
            console.log( studioUrl );
            //$window.open(studioUrl '_blank');
        };

        var filter = $state.params.filter;

        $rootScope.$on('$stateChangeSuccess', function () {
            filter = $state.params.filter;
        });

        function updateCreatives() {
            var allCreatives = creatives.all();
            var duplicateCreatives = [];
            //console.log( allCreatives );

            duplicateCreatives = $filter('filter')(allCreatives.data, {type: filter});
            $scope.creatives = duplicateCreatives;
        }

        creatives.observe(updateCreatives, $scope);

    }]);
});
