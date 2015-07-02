define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('accountService', ['$http', 'dataFactory', 'divisionService', '$state', function ($http, dataFactory, divisions, $state) {
        var accounts = dataFactory(utils.sortByName);

        function init(url) {
            return accounts.init(url, function (data) {
                return data.accounts;
            });
        }

        function all() {
            return accounts.all();
        }

        function search(query) {
            return utils.search(all(), query);
        }

        function alphabetMap() {
            return utils.alphabetMap(filtered());
        }

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
