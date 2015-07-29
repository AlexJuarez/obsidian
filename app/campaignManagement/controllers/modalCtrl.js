define(function (require) {
    'use strict';

    var app = require('./../module');

    app.controller('modalCtrl', ['$scope', '$window', function ($scope, $window) {
        console.log( 'controller scope: ', $scope );

        
        //$scope.showOnClick = showOnClick;
        //$scope.hideOnClick = hideOnClick;
        $scope.openPreviewPage = openPreviewPage;
        $scope.openStudio = openStudio;

        // function showOnClick(event) {
        //     console.log( 'showOnClick', event.data );
            
        //     //$scope.isOpen = true;
        //     //event.data.wrapper.addClass('show');
        //     $scope.setPreviewModalHandlers();
        // }
        // function hideOnClick() {
        //     console.log( 'hideOnClick' );
        //     $scope.toggleVisible();
        //     $scope.removePreviewModalHandlers();
            
        // }
        function openPreviewPage(event) {
            console.log( 'open page ', event.data );
            //$window.open();
        }
        function openStudio() {
            console.log( 'open studio ' );
            $window.open();
        }


    }]);
});
