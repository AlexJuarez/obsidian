define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.service('divisionService', ['$http', 'dataFactory', '$state', function ($http, dataFactory, $state) {
        var divisions = dataFactory(sortByName);

        function init(url) {
            url = url || 'fixtures/divisions.json';

            return divisions.init(url, function (data) {
                return data.divisions;
            });
        }

        function sortByName(data) {
            data.sort(function (a, b) {
                if (a.name && b.name) {
                    return a.name.localeCompare(b.name);
                } else {
                    return 0;
                }
            });

            return data;
        }

        function alphabetMap() {
            var sorted = filtered();
            var map = {};

            ng.forEach(sorted, function (item) {
                if (item.name) {
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
                }
            });

            return map;
        }

        function filtered() {
            var sorted = all();
            var output = [];
            var clientId = $state.params.clientId;
            var item;

            if (!clientId) {
                return sorted;
            }

            for (var i = 0; i < sorted.length; i++) {
                item = sorted[i];
                if (clientId && item.client.id === clientId) {
                    output.push(item);
                }
            }

            return output;
        }

        function all() {
            return divisions.all();
        }

        function pin(division) {
            division.pinned = true;
            divisions.notifyObservers();
        }

        function unpin(division) {
            division.pinned = false;
            divisions.notifyObservers();
        }

        function pinned() {
            var output = [];

            ng.forEach(all(), function (division) {
                if (division.pinned) {
                    output.push(division);
                }
            });

            return output;
        }

        function get(id) {
            var items = all();
            var length = items.length;
            for (var i = 0; i < length; i++) {
                if (items[i].id === id) {
                    return items[i];
                }
            }
        }

        return {
            init: init,
            setData: divisions.setData,
            addData: divisions.addData,
            alphabetMap: alphabetMap,
            observe: divisions.observe,
            filtered: filtered,
            pinned: pinned,
            unpin: unpin,
            pin: pin,
            all: all,
            get: get
        };
    }]);
});
