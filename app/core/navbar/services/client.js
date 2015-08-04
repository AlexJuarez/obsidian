define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('clientService', ['$http', '$window', 'dataFactory', 'apiUriGenerator', 'clientRecordService', function ($http, $window, dataFactory, apiUriGenerator, clientRecordService) {
        var clients = dataFactory(utils.sortByName);

        var _apiPinConfig = {
            version: 'crud',
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

        // Observe for new/updated clients
        clientRecordService.observe(function(newUpdatedRecord) {
            var existingRecord = get(newUpdatedRecord.id);
            var pinned = false;
            if (existingRecord) {
                pinned = existingRecord.pinned;
            }

            clients.addData([{
                id: newUpdatedRecord.id,
                name: newUpdatedRecord.name,
                pinned: pinned
            }]);
        }, undefined, true);

        function search(query) {
            return utils.search(all(), query);
        }

        function alphabetMap() {
            return utils.alphabetMap(all());
        }

        function togglePin(client, boolean) {
            client.pinned = boolean;
            clientRecordService.update(client.id, {pinned: boolean});
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
