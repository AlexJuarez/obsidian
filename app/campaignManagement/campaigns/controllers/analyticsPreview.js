// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../analytics-preview.html');

    app.controller('analyticsPreviewCtrl', ['$scope', '$modalInstance', '$timeout', 'modalState', function ($scope, $modalInstance, $timeout, modalState) {
        console.log( 'analyticsPreviewCtrl', modalState );
        $scope.name =               modalState.name;
        $scope.impressions =        modalState.impressions;
        $scope.creativeData =       modalState.creativeData;
        
        // var adType;
        // $scope.showPlacements =         true;
        // $scope.showImpressions =        true;
        // $scope.showViewRate =           true;
        // $scope.showUseractionRate =     true;
        // $scope.showClickthroughRate =   true;
        // $scope.showCompletionRate =     true;
        // $scope.showQuartiles =          true;
        // //$scope.display = false;
        // //$timeout(function() {
        //     for (var i = 0; i < $scope.creativeData.length; i++) {
        //         adType = $scope.creativeData[i];
        //         console.log( 'adType', adType );
        //         switch(adType.type) {
        //             case 'Rich Media':
        //                 console.log( adType );
        //                 $scope.showCompletionRate = false;
        //                 $scope.showQuartiles = false;
        //                 break;
        //             case 'In-Stream':
        //                 $scope.showViewRate = false;
        //                 break;
        //             case 'Display':
        //                 $scope.showCompletionRate = false;
        //                 $scope.showQuartiles = false;
        //                 $scope.showViewRate = false;

        //         }
        //         //$scope.$apply();
        //     }

        // //});

        console.log( 'analyticsPreviewCtrl scope', $scope );


        $scope.cancel =             cancel;


        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }]);
});
