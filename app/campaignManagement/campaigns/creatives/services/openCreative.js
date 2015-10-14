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
    module.service('openCreativeService', ['$q', '$window', 'studioUrlBuilder',
        function($q, $window, studioUrlBuilder) {
            /**
             * Opens studio and returns a promise.
             *
             * @param creative
             * @returns {Object} promise
             */
            return function(creative, hostname) {
                var deferred = $q.defer();
                var url = studioUrlBuilder.open(creative.id, creative.campaignId)
                    .setHostname(hostname)
                    .build();
                var tabWindow = $window.open(
                    url,
                    'mixpo_studio'
                );

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

                return deferred.promise;
            };
        }]);
});
