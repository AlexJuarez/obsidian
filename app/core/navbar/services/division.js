define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.service('divisionService', ['$http', 'dataFactory', function ($http, dataFactory) {
        var divisions = dataFactory(sortByName);

        function init(url) {
            url = url || 'fixtures/divisions.json';

            return divisions.init(url, function (data) {
                return data.divisions;
            });
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
            pinned: pinned,
            unpin: unpin,
            pin: pin,
            all: all,
            get: get
        };
    }]);
});
