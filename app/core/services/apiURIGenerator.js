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
        {paramKey: 'order', template: 'order={{order}}&'}
    ];

    var requiredParams = [
        'endpoint',
        'dimensions'
    ];

    // TODO: add the API_URI constant, replace domainInterceptor.js
    module.service('apiUriGeneratorService', ['$interpolate', function ($interpolate) {
        function getApiUri(params) {
            setupDefaultParams(params);
            if (validate(params)) {
                return createApiUri(params);
            } else {
                return false;
            }
        }

        function setupDefaultParams(params) {
            ng.extend(params, defaultConfig);
            params.dimensions = params.dimensions.join(',');
            params.metrics = params.metrics.join(',');
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

            return uri;
        }

        return getApiUri;
    }]);
});
