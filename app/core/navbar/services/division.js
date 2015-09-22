define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('divisionService', ['$http', 'dataFactory', '$state', '$rootScope', 'divisionRecordService', 'notification', function ($http, dataFactory, $state, $rootScope, divisionRecordService, notification) {
        var divisions = dataFactory(utils.sortByName);
        var client = {};

        divisionRecordService.observe(divisionUpdate, undefined, true);

        $rootScope.$on('navStateChange', function (event, state) {
            if (state.client && state.client.id !== client.id) {
                client = state.client;
                divisions.notifyObservers();
            } else if (!state.client) {
                client = {};
                divisions.notifyObservers();
            }
        });

        // Observe for new/updated divisions

        function divisionUpdate(event, record) {
            if (event === 'create' || event === 'update') {
                var olddata = get(record.id);
                var data = record.get();

                if (olddata && olddata.pinned !== data.pinned || !olddata){
                    divisions.addData([{
                        id: data.id,
                        name: data.name,
                        pinned: data.pinned,
                        client: {
                            id: data.clientId
                        }
                    }]);
                }
            }
        }

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

        function togglePin(division, value) {
            var record = divisionRecordService.get(division.id);
            record.set({ pinned: value });
            return record.save();
        }

        function pin(division) {
            return togglePin(division, true).then(function() {
                notification.info('<a ui-sref="cm.campaigns.division({ divisionId: id})">{{name}}</a> has been pinned', { locals: { name: division.name, id: division.id }});
            });
        }

        function unpin(division) {
            return togglePin(division, false).then(function() {
                notification.info('<a ui-sref="cm.campaigns.division({ divisionId: id})">{{name}}</a> has been unpinned', { locals: { name: division.name, id: division.id }});
            });
        }

        function pinned() {
            return utils.pinned(all());
        }

        function get(id) {
            return divisions.getById(id);
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
