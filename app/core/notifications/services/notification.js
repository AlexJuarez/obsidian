define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.service('notificationService', ['$rootScope', '$notification', function ($rootScope, $notification) {
        //var data = [];

        $rootScope.$on('notifications:success', notificationHandler);
        $rootScope.$on('notifications:warn', notificationHandler);
        $rootScope.$on('notifications:error', notificationHandler);
        $rootScope.$on('notifications:info', notificationHandler);
        $rootScope.$on('notifications:dismissAll', dismissNotifications);


        function notificationHandler(event, args, type) {
            $notification[type](args);
        }

        function dismissNotifications() {
            $notification.clearAll();
        }
    }]);
});
