define(function (require) {
    'use strict';

    var app = require('./../module');

    app.controller('modalCtrl', ['$scope', '$rootScope', '$state', '$filter', '$timeout', '$window', '$location', 'studioUrlBuilder',
        function ($scope, $rootScope, $state, $filter, $timeout, $window, $location, studioUrlBuilder) {


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

        $scope.openStudio = function(id, campaignId) {
            var url = studioUrlBuilder
                .open(id)
                .setFilter({
                    campaignId: campaignId
                })
                .setHostname('//'+ urlPrefix())
                .build();
            $window.open(url, '_blank');
        };
    }]);
});
