define(function (require) {
    'use strict';

    var module = require('./module');
    var ng = require('angular');

    var divisions = [];
    var observers = [];

    module.service('divisionService', ['$http', function ($http) {
        var initialized = false;

        function init(url) {
            if (initialized) {
                throw 'Client service has already been initialized';
            }

            initialized = true;

            url = url || 'fixtures/divisions.json';

            return $http.get(url).success(function (data) {
                divisions = data.divisions;
                notifyObservers();
            });
        }

        function setData(data) {
            divisions = data;
            notifyObservers();
        }

        function all() {
            return divisions;
        }

        function sortByName() {
            var output = divisions.slice();

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
            ng.forEach(divisions, function (client) {
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
