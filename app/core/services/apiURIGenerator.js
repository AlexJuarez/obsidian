/**
 * Generate an API URI based on a parameters object. Possible parameters are:
 */
define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');

    // TODO: add the API_URI constant, replace domainInterceptor.js
    module.service('apiUriGenerator', ['DEFAULT_API_VERSION', function (DEFAULT_API_VERSION) {
        function getApiUri(apiConfig) {

            // NOTE: this is for use with fixtures and scaffolding the application.
            // only use this flag when absolutely necessary.
            if (apiConfig.override) {
                return apiConfig.uri;
            }

            if (!isValid(apiConfig)) {
                return false;
            }

            var endpoint = getEndpoint(apiConfig);

            return endpoint + expandParams(apiConfig.queryParams || {});
        }

        function getVersion(config) {
            return config.version || DEFAULT_API_VERSION;
        }

        function getEndpoint(config) {
            var version = getVersion(config);
            return '/api/' + version + '/' + config.endpoint;
        }

        function expandParams(params) {
            var paramsArray = [];

            //Convert all arrays into comma-separated strings
            //NOTE: Sorting is done to make sure any config object will produce
            //the same url
            var item;

            for(var key in params) {
                if (ng.isArray(params[key])) {
                    item = params[key].sort().join(',');
                } else {
                    item = params[key];
                }

                paramsArray.push(key + '=' + item);
            }

            if (paramsArray.length > 0) {
                return '?' + paramsArray.sort().join('&');
            } else {
                return '';
            }
        }

        function isValid(config) {
            var valid = true;

            if (!config || !config.endpoint) {
                valid = false;
            }

            return valid;
        }

        return getApiUri;
    }]);
});
