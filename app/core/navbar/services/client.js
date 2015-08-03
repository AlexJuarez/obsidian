define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');
    var ng = require('angular');

    module.service('clientService', ['$http', '$window', 'dataFactory', 'apiUriGenerator', function ($http, $window, dataFactory, apiUriGenerator) {
        var clients = dataFactory(utils.sortByName);

        var _apiPinConfig = {
            version: 2,
            endpoint: 'clients/'
        };

        function init(apiConfig) {
            return clients.init(apiConfig, function (data) {
                return data.clients;
            });
        }

        function all() {
            return clients.all();
        }

        function search(query) {
            return utils.search(all(), query);
        }

        function alphabetMap() {
            return utils.alphabetMap(all());
        }

        function togglePin(client, boolean) {
            client.pinned = boolean;
            clients.notifyObservers('pin');
            var apiConfig = ng.extend({}, _apiPinConfig);
            apiConfig.endpoint += client.id;
            $http.put(apiUriGenerator(apiConfig), {pinned: boolean})
                .error(function(error) {
                    client.pinned = boolean;
                    clients.notifyObservers('pin');
                    console.log(error);
                    $window.alert('Failed to pin/unpin client ' + client.name);
                });
        }

        function pin(client) {
            togglePin(client, true);
        }

        function unpin(client) {
            togglePin(client, false);
        }

        function pinned() {
            return utils.pinned(all());
        }

        function get(id) {
            return utils.get(all(), id);
        }

        return {
            _apiPinConfig: _apiPinConfig,
            init: init,
            setData: clients.setData,
            addData: clients.addData,
            alphabetMap: alphabetMap,
            observe: clients.observe,
            pinned: pinned,
            unpin: unpin,
            pin: pin,
            search: search,
            all: all,
            get: get
        };
    }]);
});
