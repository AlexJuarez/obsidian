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
    module.service('openCreativeService', ['$q', 'studioUrlBuilder', 'studioWindow', function($q, studioUrlBuilder, studioWindow) {

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

            var tabWindow = studioWindow.open(url);
            // map any Studio API callbacks
            tabWindow.onClose = function(code, detail) {
                if(code && detail) {
                    //return deferred.reject(err);
                }
                tabWindow.close();
                deferred.resolve(detail);
            };
            return deferred.promise;
        };
    }]);
});
