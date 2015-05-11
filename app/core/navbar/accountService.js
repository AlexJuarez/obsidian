define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');

    var accounts = [];
    var observers = [];

    module.service('accountService', ['$http', function ($http) {
        var initialized = false;

        function init(url) {
            if (initialized) {
                throw 'Client service has already been initialized';
            }

            initialized = true;

            url = url || 'fixtures/accounts.json';

            return $http.get(url).success(function (data) {
                accounts = data.accounts;
                notifyObservers();
            });
        }

        function setData(data) {
            accounts = data;
            notifyObservers();
        }

        function all() {
            return accounts;
        }

        function sortByName() {
            var output = accounts.slice();

            output.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

            return output;
        }

        function alphabetMap() {
            var sorted = sortByName();
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
            notifyObservers();
        }

        function unpin(client) {
            client.pinned = false;
            notifyObservers();
        }

        function pinned() {
            var output = [];

            ng.forEach(sortByName(), function (client) {
                if (client.pinned) {
                    output.push(client);
                }
            });

            return output;
        }

        function observe(callback) {
            observers.push(callback);
        }

        function notifyObservers() {
            ng.forEach(observers, function (fn) {
                fn();
            });
        }

        function get(id) {
            ng.forEach(accounts, function (client) {
                if (client.id === id) {
                    return client;
                }
            });
        }

        return {
            init: init,
            setData: setData,
            alphabetMap: alphabetMap,
            observe: observe,
            pinned: pinned,
            unpin: unpin,
            pin: pin,
            all: all,
            get: get
        };
    }]);
});
