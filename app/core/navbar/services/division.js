define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('divisionService', ['$http', 'dataFactory', '$state', function ($http, dataFactory, $state) {
        var divisions = dataFactory(utils.sortByName);

        function init(url) {
            url = url || 'fixtures/divisions.json';

            return divisions.init(url, function (data) {
                return data.divisions;
            });
        }

        function alphabetMap() {
            return utils.alphabetMap(filtered());
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
            return utils.pinned(all());
        }

        function get(id) {
            return utils.get(all(), id);
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
