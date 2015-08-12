define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!../../core/modal/creativePreview.html');

    app.controller('modalCtrl', ['$scope', '$rootScope', '$state', '$filter', '$timeout', '$window', '$location', 'creatives', function ($scope, $rootScope, $state, $filter, $timeout, $window, $location, creatives) {

        var thumbnailPrefix = $scope.creativeData.thumbnailurlprefix;
        $scope.thumbnailURL = 'http://thorwhal-dev-swf.mixpo.com' + thumbnailPrefix + 'JPG640.jpg';
        
        $scope.openPreviewPage = function(id, name) {
            var n = name.split(' ').join('-');
            // var previewUrl = '//'+ $location.$$host + '/videoad/' + id + '/' + n;
            var previewUrl = '//thorwhal-dev-studio.mixpo.com/videoad/' + id + '/' + n;
            $window.open(previewUrl, '_blank');
        };
        $scope.openStudio = function(id) {
            //var studioUrl = '//'+ $location.$$host + '/studio?sdf=open&guid=' + id;
            var studioUrl = '//thorwhal-dev-studio.mixpo.com/studio?sdf=open&guid=' + id;
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
