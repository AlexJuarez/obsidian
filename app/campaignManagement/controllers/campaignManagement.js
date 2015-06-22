/**
 * Created by Alex on 3/2/2015.
 */
/* jshint camelcase: false */
/* jshint -W098 */
/* jshint -W004 */
/* jshint -W101 */

'use strict';

define(function (require) {
    var app = require('./../module');
    //var ng = require('angular');

    app.controller('campaignManagementCtrl', ['$scope', function ($scope) {
        $scope.remove = function () {
            console.log('remove clicked');
        };
    }]);
});
