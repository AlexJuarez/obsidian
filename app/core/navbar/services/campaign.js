define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.service('campaignService', ['$http', 'dataFactory', 'accountService', '$state', function ($http, dataFactory, accounts, $state) {
        var campaigns = dataFactory(sortByStartDate);

        function init(url) {
            url = url || 'fixtures/campaigns.json';

            return campaigns.init(url, function (data) {
                return data.campaigns;
            });
        }

        function sortByStartDate(data) {
            data.sort(function (a, b) {
                return new Date(b.startDate) - new Date(a.startDate);
            });

            return data;
        }

        function getYearQuarter(date) {
            date = new Date(date);
            var quarter = Math.ceil((date.getUTCMonth() + 1) / 4);
            var year = date.getUTCFullYear();
            return year + ' ' + 'Q' + quarter;
        }

        function quarterMap() {
            var sorted = filtered();
            var map = {};

            ng.forEach(sorted, function (item) {
                var key = getYearQuarter(item.startDate);
                if (typeof map[key] === 'undefined') {
                    map[key] = [item];
                } else {
                    map[key].push(item);
                }
            });

            return map;
        }

        function filtered() {
            var sorted = all();
            var list = accounts.filtered();
            var accountId = $state.params.accountId;
            var output = [];
            var item, i;

            if (accountId) {
                for (i = 0; i < sorted.length; i++) {
                    item = sorted[i];
                    if (accountId === item.account.id) {
                        output.push(item);
                    }
                }
            } else {
                var idSet = {};

                for (i = 0; i < list.length; i++) {
                    item = list[i];
                    idSet[item.id] = true;
                }

                for (i = 0; i < sorted.length; i++) {
                    item = sorted[i];
                    if (idSet[item.account.id]) {
                        output.push(item);
                    }
                }
            }

            return output;
        }


        function all() {
            return campaigns.all();
        }

        function pin(campaign) {
            campaign.pinned = true;
            campaigns.notifyObservers();
        }

        function unpin(campaign) {
            campaign.pinned = false;
            campaigns.notifyObservers();
        }

        function pinned() {
            var output = [];

            ng.forEach(all(), function (campaign) {
                if (campaign.pinned) {
                    output.push(campaign);
                }
            });

            return output;
        }

        function isInFlight(campaign) {
            return campaign.status === 'inFlight';
        }

        function inFlight() {
            var output = [];

            ng.forEach(all(), function (campaign) {
                if (isInFlight(campaign)) {
                    output.push(campaign);
                }
            });

            return output;
        }

        function isPreFlight(campaign) {
            return campaign.status === 'preFlight';
        }

        function preFlight() {
            var output = [];

            ng.forEach(all(), function (campaign) {
                if (isPreFlight(campaign)) {
                    output.push(campaign);
                }
            });

            return output;
        }

        function isCompleted(campaign) {
            return campaign.status === 'completed';
        }

        function completed() {
            var output = [];

            ng.forEach(all(), function (campaign) {
                if (isCompleted(campaign)) {
                    output.push(campaign);
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
            setData: campaigns.setData,
            addData: campaigns.addData,
            quarterMap: quarterMap,
            completed: completed,
            inFlight: inFlight,
            preFlight: preFlight,
            observe: campaigns.observe,
            pinned: pinned,
            unpin: unpin,
            pin: pin,
            all: all,
            get: get
        };
    }]);
});
