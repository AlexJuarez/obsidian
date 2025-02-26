define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiPrefixes = ['/api/v3', '/api/v2', '/narwhal'];

    module.factory('domainInterceptor', ['API_URI', function (apiURI) {
        function request(config) {
            var apiPrefix;

            if(apiURI) {
                for (var i = 0; i < apiPrefixes.length; i++) {
                    apiPrefix = apiPrefixes[i];
                    if (config.url.indexOf(apiPrefix) > -1) {
                        config.url = apiURI + config.url;
                        break;
                    }
                }
            }
            return config;
        }

        function response(resp) {
            return resp;
        }

        return {
            request: request,
            response: response
        };
    }]);
});
