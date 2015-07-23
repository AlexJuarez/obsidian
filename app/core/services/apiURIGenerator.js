/**
 * Generate an API URI based on a parameters object. Possible parameters are:
 */
define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');

    var defaultConfig = {
        version: 3
    };

    // Note: These are concatenated in order
    var uriTemplates = [
        {paramKey: 'version', template: '/api/v{{version}}/'},
        {paramKey: 'endpoint', template: '{{endpoint}}?'},
        {paramKey: 'dimensions', template: 'dimensions={{dimensions}}&'},
        {paramKey: 'metrics', template: 'metrics={{metrics}}&'},
        {paramKey: 'offset', template: 'offset={{offset}}&'},
        {paramKey: 'limit', template: 'limit={{limit}}&'},
        {paramKey: 'order', template: 'order={{order}}&'},
        {paramKey: 'filters', template: 'filters={{filters}}&'}
    ];

    var requiredParams = [
        'endpoint'
    ];

    // TODO: add the API_URI constant, replace domainInterceptor.js
    module.service('apiUriGenerator', ['$interpolate', function ($interpolate) {
        function getApiUri(apiConfig) {

            if (!apiConfig) {
                return false;
            }

            // NOTE: this is for use with fixtures and scaffolding the application.
            // only use this flag when absolutely necessary.
            if (apiConfig.override) {
                return apiConfig.uri;
            }

            var params = setupDefaultParams(apiConfig);
            if (validate(params)) {
                return createApiUri(params);
            } else {
                return false;
            }
        }

        function setupDefaultParams(params) {
            var mergedParams = ng.extend({}, defaultConfig, params);

            //NOTE: Sorting is done to make sure any config object will produce
            //the same url
            for(var key in mergedParams) {
                if (Object.prototype.toString.call(mergedParams[key]) === '[object Array]') {
                    mergedParams[key] = mergedParams[key].sort().join(',');
                }
            }

            return mergedParams;
        }

        function validate(params) {
            var valid = true;
            requiredParams.forEach(function(requiredParam) {
                if (typeof params[requiredParam] === 'undefined') {
                    valid = false;
                }
            });

            return valid;
        }

        function createApiUri(params) {
            var uri = '';
            uriTemplates.forEach(function(uriTemplate) {
                var paramKey = uriTemplate.paramKey;
                if (typeof params[paramKey] !== 'undefined') {
                    var template = $interpolate(uriTemplate.template);
                    uri = uri + template(params);
                }
            });

            return removeTrailingAnd(uri);
        }

        function removeTrailingAnd(uri) {
            if (uri[uri.length - 1] === '&') {
                uri = uri.slice(0, -1);
            }
            return uri;
        }

        return getApiUri;
    }]);
});
