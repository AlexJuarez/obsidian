// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignsCtrl', ['$scope', '$http', '$timeout', 'campaignsByStatus', function ($scope, $http, $timeout, campaignsByStatus) {
        for(var status in campaignsByStatus) {
            (function(status) {
                var accordionTable = campaignsByStatus[status];
                accordionTable.allReady.then(function () {
                    $scope[status] = accordionTable.all();
                    debugger;
                    $timeout(function() {
                        $scope.$apply();
                    });
                });
            }(status))
        }
    }]);
});
