define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.factory('notification', ['$rootScope', 'notificationService', function ($rootScope) {
        function error(message, options) {
            $rootScope.$broadcast('notifications:error', message, options);
        }

        function warn(message, options) {
            $rootScope.$broadcast('notifications:warn', message, options);
        }

        function info(message, options) {
            $rootScope.$broadcast('notifications:info', message, options);
        }

        function success(message, options) {
            $rootScope.$broadcast('notifications:success', message, options);
        }

        function dismissAll() {
            $rootScope.$broadcast('notifications:dismissAll');
        }

        return {
            error: error,
            warn: warn,
            info: info,
            success: success,
            dismissAll: dismissAll
        };
    }]);
});
