define(function (require) {
    'use strict';

    var module = require('./module');
    var ng = require('angular');

    var clients = [];

    module.service('clientService', ['$http', function ($http) {
        var initialized = false;

        function init(url) {
            if(initialized) throw "Client service has already been initialized";
            initialized = true;

            url = url || 'fixtures/clients.json';

            return $http.get(url).success(function (data) {
                clients = data.clients;
            });
        }

        function setData (data) {
            clients = data;
        }

        function all() {
            return clients;
        }

        function get(id) {
            ng.forEach(clients, function(client) {
                if (client.id === id) {
                    return id;
                }
            });
        }

        return {
            init: init,
            setData: setData,
            all: all,
            get: get
        }
    }]);
});
