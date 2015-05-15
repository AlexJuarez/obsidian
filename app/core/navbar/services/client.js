define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.service('clientService', ['$http', 'dataFactory', function ($http, dataFactory) {
        var clients = dataFactory(sortByName);

        function init(url) {

            url = url || 'fixtures/clients.json';

            return clients.init(url, function (data) {
                return data.clients;
            });
        }

        function all() {
            return clients.all();
        }

        function sortByName(data) {
            data.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

            return data;
        }

        function alphabetMap() {
            var sorted = all();
            var map = {};

            ng.forEach(sorted, function (item) {
                var key = item.name.charAt(0).toLowerCase();
                if (/\d/.test(key)) {
                    if (typeof map['#'] === 'undefined') {
                        map['#'] = [item];
                    } else {
                        map['#'].push(item);
                    }
                } else {
                    if (typeof map[key] === 'undefined') {
                        map[key] = [item];
                    } else {
                        map[key].push(item);
                    }
                }
            });

            return map;
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
            var output = [];

            ng.forEach(all(), function (client) {
                if (client.pinned) {
                    output.push(client);
                }
            });

            return output;
        }

        function get(id) {
            ng.forEach(all(), function (client) {
                if (client.id === id) {
                    return client;
                }
            });
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
