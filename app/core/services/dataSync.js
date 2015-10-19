define(function (require) {
    'use strict';

    var module = require('./../module');

    module.service('dataSyncService', [function () {
        var data = {};

        function register(dataFactory, endpoint) {
            if (!data[endpoint]) {
                data[endpoint] = [];
            }

            data[endpoint].push(dataFactory);
        }

        function update(endpoint, resp) {
            var factories = data[endpoint];

            for (var i = 0; i < factories.length; i++) {
                factories.addData()
            }
        }

        return {
            broadcast: broadcast,
            register: register
        };
    }]);
});
