define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.factory('notification', ['$rootScope', 'notificationService', function ($rootScope) {
        function error(message, options) {
            var args = ng.extend({ message: message}, options);
            $rootScope.$broadcast('notifications:error', args, 'error');
        }

        function warn(message, options) {
            var args = ng.extend({ message: message}, options);
            $rootScope.$broadcast('notifications:warn', args, 'warn');
        }

        function info(message, options) {
            var args = ng.extend({ message: message}, options);
            $rootScope.$broadcast('notifications:info', args, 'info');
        }

        function success(message, options) {
            var args = ng.extend({ message: message}, options);
            $rootScope.$broadcast('notifications:success', args, 'success');
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
