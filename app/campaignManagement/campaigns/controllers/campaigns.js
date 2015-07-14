// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignsCtrl', ['$scope', '$state', function ($scope, $state) {
        //Needed for viewBy query Parameter
        $scope.params = $state.params;
    }]);
});
