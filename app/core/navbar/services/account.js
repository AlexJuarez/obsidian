define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('accountService', ['$http', 'dataFactory', 'divisionService', '$state', 'accountRecordService', function ($http, dataFactory, divisions, $state, accountRecordService) {
        var accounts = dataFactory(utils.sortByName);

        function init(apiConfig) {
            return accounts.init(apiConfig, function (data) {
                return data.accounts;
            });
        }

        function all() {
            return accounts.all();
        }

        function search(query) {
            return utils.search(filtered(), query);
        }

        function alphabetMap() {
            return utils.alphabetMap(filtered());
        }

        // Observe for new/updated accounts
        accountRecordService.observe(function(newUpdatedRecord) {
            var existingRecord = get(newUpdatedRecord.id);
            var pinned = false;
            if (existingRecord) {
                pinned = existingRecord.pinned;
            }

            accounts.addData([{
                id: newUpdatedRecord.id,
                name: newUpdatedRecord.name,
                division: {
                    id: newUpdatedRecord.divisionId
                },
                client: {
                    id: newUpdatedRecord.clientId
                },
                pinned: pinned
            }]);
        }, undefined, true);

        //TODO: grab the current divisionId from campaign
        function filtered() {
            var sorted = all();
            var list = divisions.filtered();
            var account = get($state.params.accountId);
            var divisionId = $state.params.divisionId || account && account.division.id;
            var output = [];
            var item, i;

            if (divisionId) {
                for (i = 0; i < sorted.length; i++) {
                    item = sorted[i];
                    if (divisionId === item.division.id) {
                        output.push(item);
                    }
                }
            } else if (divisionId) {
                if (list.length === divisions.all().length) {
                    return sorted;
                }

                var divisionIdSet = {};

                for (i = 0; i < list.length; i++) {
                    item = list[i];
                    divisionIdSet[item.id] = true;
                }

                for (i = 0; i < sorted.length; i++) {
                    item = sorted[i];
                    if (divisionIdSet[item.division.id]) {
                        output.push(item);
                    }
                }
            }

            return output;
        }


        function pin(account) {
            account.pinned = true;
            accounts.notifyObservers('pin');
        }

        function unpin(account) {
            account.pinned = false;
            accounts.notifyObservers('pin');
        }

        function pinned() {
            return utils.pinned(all());
        }

        function get(id) {
            return utils.get(all(), id);
        }

        return {
            init: init,
            setData: accounts.setData,
            addData: accounts.addData,
            alphabetMap: alphabetMap,
            observe: accounts.observe,
            filtered: filtered,
            search: search,
            pinned: pinned,
            unpin: unpin,
            pin: pin,
            all: all,
            get: get
        };
    }]);
});
