define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.service('accountService', ['$http', 'dataFactory', function ($http, dataFactory) {
        var accounts = dataFactory(sortByName);

        function init(url) {

            url = url || 'fixtures/accounts.json';

            return accounts.init(url, function (data) {
                return data.accounts;
            });
        }

        function all() {
            return accounts.all();
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

        function pin(account) {
            account.pinned = true;
            accounts.notifyObservers();
        }

        function unpin(account) {
            account.pinned = false;
            accounts.notifyObservers();
        }

        function pinned() {
            var output = [];

            ng.forEach(all(), function (account) {
                if (account.pinned) {
                    output.push(account);
                }
            });

            return output;
        }

        function get(id) {
            var items = all();
            var length = items.length;
            for (var i = 0; i < length; i++) {
                if(items[i].id === id) {
                    return items[i];
                }
            }
        }

        return {
            init: init,
            setData: accounts.setData,
            addData: accounts.addData,
            alphabetMap: alphabetMap,
            observe: accounts.observe,
            pinned: pinned,
            unpin: unpin,
            pin: pin,
            all: all,
            get: get
        };
    }]);
});
