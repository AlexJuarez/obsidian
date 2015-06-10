define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('domainInterceptor', [function () {
        function request(config) {
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
