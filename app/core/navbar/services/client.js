define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('clientService', ['$http', 'dataFactory', function ($http, dataFactory) {
        var clients = dataFactory(utils.sortByName);

        function init(url) {
            return clients.init(url, function (data) {
                return data.clients;
            });
        }

        function all() {
            return clients.all();
        }

        function search(query) {
            //var max = 5;
            var results = utils.search(all(), query);
            /*if (query && results.length < max) {
                $http.get('/narwhal/clients/search?q=' + query + '&limit=5').success(function (res) {
                    clients.addData(res);
                });
            }*/
            return results;
        }

        function alphabetMap() {
            return utils.alphabetMap(all());
        }

        function pin(client) {
            client.pinned = true;
            clients.notifyObservers('pin');
        }

        function unpin(client) {
            client.pinned = false;
            clients.notifyObservers('pin');
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
            search: search,
            all: all,
            get: get
        };
    }]);
});
