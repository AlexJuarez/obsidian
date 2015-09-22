define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('clientService', ['$http', '$window', 'dataFactory', 'apiUriGenerator', 'clientRecordService', function ($http, $window, dataFactory, apiUriGenerator, clientRecordService) {
        var clients = dataFactory(utils.sortByName);

        function init(apiConfig) {
            return clients.init(apiConfig, function (data) {
                return data.clients;
            });
        }

        function all() {
            return clients.all();
        }

        // Observe for new/updated clients

        function clientUpdate(event, record) {
            if (event === 'change') {
                var olddata = get(record.id);
                var data = record.get();

                if (olddata && olddata.pinned !== data.pinned || !olddata){
                    clients.addData([{
                        id: data.id,
                        name: data.name,
                        pinned: data.pinned
                    }]);
                }
            }
        }

        clientRecordService.observe(clientUpdate, undefined, true);

        function search(query) {
            return utils.search(all(), query);
        }

        function alphabetMap() {
            return utils.alphabetMap(all());
        }

        function pin(client) {
            var record = clientRecordService.get(client.id);
            record.set({ 'pinned': true });
            return record.save();
        }

        function unpin(client) {
            var record = clientRecordService.get(client.id);
            record.set({ 'pinned': false });
            return record.save();
        }

        function pinned() {
            return utils.pinned(all());
        }

        function get(id) {
            return clients.getById(id);
        }

        return {
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
