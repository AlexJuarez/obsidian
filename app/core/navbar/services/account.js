define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    var apiConfig = {
        endpoint: 'accounts',
        queryParams: {
            dimensions: ['id', 'name', 'pinned', 'division.id'],
            order: 'name:asc'
        }
    };

    module.service('accountService', ['$http', 'dataFactory', 'divisionService', '$state', 'accountRecordService', 'notification', function ($http, dataFactory, divisions, $state, accountRecordService, notification) {
        var accounts = dataFactory(utils.sortByName, { sort: { key: 'name', sorted: true }});

        accountRecordService.observe(accountUpdate, undefined, true);

        function init() {
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

        function accountUpdate(event, record) {
            if (event === 'create' || event === 'update') {
                var data = record.get();
                var division = divisions.get(data.divisionId);

                accounts.addData([{
                    id: data.id,
                    name: data.name,
                    pinned: data.pinned,
                    division: {
                        id: data.divisionId
                    },
                    client: {
                        id: division.client.id
                    }
                }]);
            }
        }

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
            } else {
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

        function togglePin(account, value) {
            var record = accountRecordService.get(account.id);
            record.set({ pinned: value });
            return record.save();
        }

        function pin(account) {
            return togglePin(account, true).then(function() {
                notification.info('<a ui-sref="cm.campaigns.account({ accountId: id})">{{name}}</a> has been pinned', { locals: { name: account.name, id: account.id }});
            });
        }

        function unpin(account) {
            return togglePin(account, false).then(function() {
                notification.info('<a ui-sref="cm.campaigns.account({ accountId: id})">{{name}}</a> has been unpinned', { locals: { name: account.name, id: account.id }});
            });
        }

        function pinned() {
            return utils.pinned(all());
        }

        function get(id) {
            return accounts.getById(id);
        }

        return {
            _apiConfig: apiConfig,
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
