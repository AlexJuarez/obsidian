define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('clientService', ['$http', '$window', 'dataFactory', function ($http, $window, dataFactory) {
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
            return utils.search(all(), query);
        }

        function alphabetMap() {
            return utils.alphabetMap(all());
        }

        function pin(client) {
            debugger;
            client.pinned = true;
            clients.notifyObservers('pin');
            $http.put('/api/v2/clients/' + client.id, {pinned: true})
                .error(function(error) {
                    client.pinned = false;
                    clients.notifyObservers('pin');
                    console.log(error);
                    $window.alert('Failed to pin client ' + client.name);
                });
        }

        function unpin(client) {
            client.pinned = false;
            clients.notifyObservers('pin');
            $http.put('/api/v2/clients/' + client.id, {pinned: false})
                .error(function(error) {
                    client.pinned = true;
                    clients.notifyObservers('pin');
                    console.log(error);
                    $window.alert('Failed to unpin client ' + client.name);
                });
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
