define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');

    module.factory('observerFactory', ['$timeout', '$rootScope', '$log', function ($timeout, $rootScope, $log) {
        var observerId = 0;

        return function (){
            var observers = {};

            function observe(callback, $scope, preventImmediate) {
                $scope = $scope || $rootScope;

                if (!ng.isFunction(callback)) {
                    $log.warn(callback + ' callback was not a function');
                } else {
                    var id = observerId++;
                    observers[id] = callback;

                    if (preventImmediate !== true) {
                        callback();
                    }

                    if ($scope) {
                        $scope.$on('$destroy', function() {
                            destroyObserver(id);
                        });
                    }

                    return id;
                }
            }

            function destroyObserver(id) {
                delete observers[id];
            }

            function notifyObservers() {
                var args = Array.prototype.slice.call(arguments);

                for (var x in observers) {
                    observers[x].apply(undefined, args);
                }

                $timeout(function () {
                    $rootScope.$apply();
                });
            }

            return {
                _observers: observers,
                observe: observe,
                destroyObserver: destroyObserver,
                notifyObservers: notifyObservers
            };
        };
    }]);
});
