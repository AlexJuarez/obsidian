define(function(require) {
    'use strict';

    var module = require('./../../../module');

    /**
     * The openCreativeService wraps the setup of opening Studio in a
     * new tab and creating the expected JS callback object Studio's
     * js is looking for.
     *
     * @memberof app
     * @ngdoc service
     * @name newCreativeService
     * @ngInject
     */
    module.service('openCreativeService', ['$q', '$window', 'studioUrlBuilder', 'studioConnector', function($q, $window, studioUrlBuilder, studioConnector) {

        /**
         * construct the StudioDirectHandler window object
         *
         * @param tabWindow
         * @param deferred
         */
        function createStudioDirectHandler(tabWindow, deferred) {
            tabWindow.StudioDirectHandler = (function(){
                function onClose(code, detail) {
                    if(code && detail) {
                        //return deferred.reject(err);
                    }
                    tabWindow.close();
                    deferred.resolve();
                }

                return {
                    onClose: onClose
                };
            })();
        }

        /**
         * Opens studio and returns a promise.
         *
         * @param creative
         * @returns {Object} promise
         */
        return function(creative, hostname) {
            var deferred = $q.defer();

            var url = studioUrlBuilder
                .open(creative.id, creative.campaignId)
                .setHostname(hostname)
                .build();
            var tabWindow = $window.open(
                url,
                'mixpo_studio'
            );

            var connector = studioConnector(window, tabWindow, function onConnection(err, notifier) {
                if(err) {
                    // studio Connect error does not team open failed,
                    // just that supporting postMessage() failed.
                    createStudioDirectHandler(tabWindow, deferred);
                    return deferred.promise;
                }

                notifier(function(command, data){
                    if(command === 'closeStudio') {
                        tabWindow.close();
                        deferred.resolve(data);
                        connector.shutdown();
                    } else {
                        // unhandled event type
                    }
                });
            });
            return deferred.promise;
        };
    }]);
});
