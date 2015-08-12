define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!../../core/modal/creativePreview.html');

    app.controller('modalCtrl', ['$scope', '$rootScope', '$state', '$filter', '$timeout', '$window', '$location', function ($scope, $rootScope, $state, $filter, $timeout, $window, $location) {


        var urlPrefix = function() {
            if ($location.$$host === 'localhost') {
                return 'thorwhal-dev-studio.mixpo.com';
            } else {
                return $location.$$host;
            }
        };

        if( $scope.creativeData ) {
            var thumbnailPrefix = $scope.creativeData.thumbnailurlprefix;
            $scope.thumbnailURL = 'http://thorwhal-dev-swf.mixpo.com' + thumbnailPrefix + 'JPG640.jpg';
        }
        
        $scope.openPreviewPage = function(id, name) {
            var n = name.split(' ').join('-');
            var previewUrl = '//'+ urlPrefix() + '/videoad/' + id + '/' + n;
            $window.open(previewUrl, '_blank');
        };
        $scope.openStudio = function(id) {
            var studioUrl = '//'+ urlPrefix() + '/studio?sdf=open&guid=' + id;
            $window.open(studioUrl, '_blank');
        };

        // var filter = $state.params.filter;

        // $rootScope.$on('$stateChangeSuccess', function () {
        //     filter = $state.params.filter;
        // });

        // function updateCreatives() {
        //     var allCreatives = creatives.all();
        //     var duplicateCreatives = [];
        //     //console.log( 'allCreatives ', allCreatives );

        //     duplicateCreatives = $filter('filter')(allCreatives.data, {type: filter});
        //     $scope.creatives = duplicateCreatives;
        //     //console.log( 'duplicateCreatives ', $scope.creatives );
        // }

        // creatives.observe(updateCreatives, $scope);


    }]);
});
