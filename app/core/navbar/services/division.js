define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('divisionService', ['$http', 'dataFactory', '$state', '$rootScope', function ($http, dataFactory, $state, $rootScope) {
        var divisions = dataFactory(utils.sortByName);
        var client = {};

        $rootScope.$on('navStateChange', function (event, state) {
            if (state.client && state.client.id !== client.id) {
                client = state.client;
                divisions.notifyObservers();
            } else if (!state.client) {
                client = {};
                divisions.notifyObservers();
            }

        });

        function init(apiConfig) {
            return divisions.init(apiConfig, function (data) {
                return data.divisions;
            });
        }

        function search(query) {
            return utils.search(filtered(), query);
        }

        function alphabetMap() {
            return utils.alphabetMap(filtered());
        }

        //TODO: grab the current clientID from account or campaign
        function filtered() {
            var sorted = all();
            var output = [];
            var division = get($state.params.divisionId);
            var clientId = $state.params.clientId || division && division.client.id;

            if(client && !clientId) {
                clientId = client.id;
            }

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
            divisions.notifyObservers('pin');
        }

        function unpin(division) {
            division.pinned = false;
            divisions.notifyObservers('pin');
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
            search: search,
            all: all,
            get: get
        };
    }]);
});
