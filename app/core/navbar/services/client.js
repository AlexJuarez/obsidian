define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var utils = require('./util');

    module.service('clientService', ['$http', 'dataFactory', function ($http, dataFactory) {
        var clients = dataFactory(utils.sortByName);

        function init(url) {

            url = url || 'fixtures/clients.json';

            return clients.init(url, function (data) {
                return data.clients;
            });
        }

        function all() {
            return clients.all();
        }

        function alphabetMap() {
            return utils.alphabetMap(all());
        }

        function pin(client) {
            client.pinned = true;
            clients.notifyObservers();
        }

        function unpin(client) {
            client.pinned = false;
            clients.notifyObservers();
        }

        function pinned() {
            return utils.pinned(all());
        }

        function get(id) {
            return utils.get(all(), id);
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
            all: all,
            get: get
        };
    }]);
});
