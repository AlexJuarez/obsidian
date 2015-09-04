define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.service('notificationService', ['$rootScope', function ($rootScope) {
        //var data = [];

        $rootScope.$on('notifications:success', notificationHandler);
        $rootScope.$on('notifications:warn', notificationHandler);
        $rootScope.$on('notifications:error', notificationHandler);
        $rootScope.$on('notifications:info', notificationHandler);

        function notificationHandler(event, message, options) {
            console.log(event, message, options);
        }
    }]);
});
