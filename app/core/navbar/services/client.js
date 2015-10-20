define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    var apiConfig = {
        endpoint: 'clients',
        queryParams: {
            dimensions: ['id', 'name', 'pinned'],
            order: 'name:asc'
        }
    };

    module.service('clientService', ['$http', '$window', 'dataFactory', 'apiUriGenerator', 'clientRecordService', 'notification', '$q', function ($http, $window, dataFactory, apiUriGenerator, clientRecordService, notification, $q) {
        var clients = dataFactory(utils.sortByName, { prepFn: prepFn, sync: 'create' });

        function init() {
            return clients.init(apiConfig, function (data) {
                return data.clients;
            });
        }

        function all() {
            return clients.all();
        }

        // Observe for new/updated clients

        function prepFn(data) {
            var deferred = $q.defer();

            deferred.resolve({
                id: data.id,
                name: data.name,
                pinned: data.pinned
            });

            return deferred.promise;
        }

        function search(query) {
            return utils.search(all(), query);
        }

        function alphabetMap() {
            return utils.alphabetMap(all());
        }

        function togglePin(client, value) {
            var record = clientRecordService.get(client.id);
            record.set({ pinned: value });
            return record.save();
        }

        function pin(client) {
            return togglePin(client, true).then(function() {
                notification.info('<a ui-sref="cm.campaigns.client({ clientId: id})">{{name}}</a> has been pinned', { locals: { name: client.name, id: client.id }});
            });
        }

        function unpin(client) {
            return togglePin(client, false).then(function() {
                notification.info('<a ui-sref="cm.campaigns.client({ clientId: id})">{{name}}</a> has been unpinned', { locals: { name: client.name, id: client.id }});
            });
        }

        function pinned() {
            return utils.pinned(all());
        }

        function get(id) {
            return clients.getById(id);
        }

        return {
            _apiConfig: apiConfig,
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
