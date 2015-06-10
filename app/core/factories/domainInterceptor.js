define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiPrefixes = ['/api/v3', '/api/v2', '/narwhal'];

    module.factory('domainInterceptor', [function () {
        function request(config) {
            if(window.apiURI) {
                apiPrefixes.forEach(function(apiPrefix) {
                    if (config.url.indexOf(apiPrefix) > -1) {
                        config.url = window.apiURI + config.url;
                    }
                });
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
