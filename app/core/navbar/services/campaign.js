define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('campaignService', ['$http', 'dataFactory', 'accountService', '$state', function ($http, dataFactory, accounts, $state) {
        var campaigns = dataFactory(sortByStartDate);

        function init(url) {
            url = url || 'fixtures/campaigns.json';

            return campaigns.init(url, function (data) {
                return data.campaigns;
            });
        }

        function search(query) {
            var max = 5;
            var results = utils.search(all(), query);
            if (query && results.length < max) {
                $http.get('/narwhal/campaigns/search?q=' + query + '&limit=5').success(function (res) {
                    campaigns.addData(res);
                });
            }
            return results;
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
            var item, key;

            for (var i = 0; i < sorted.length; i++) {
                item = sorted[i];
                key = getYearQuarter(item.startDate);
                if (typeof map[key] === 'undefined') {
                    map[key] = [item];
                } else {
                    map[key].push(item);
                }
            }

            var output = [];

            for (key in map) {
                output.push({
                    key: key,
                    value: map[key]
                });
            }

            return output;
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
                if (list.length === accounts.all().length) {
                    return sorted;
                }

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
            campaigns.notifyObservers('pin');
        }

        function unpin(campaign) {
            campaign.pinned = false;
            campaigns.notifyObservers('pin');
        }

        function pinned() {
            return utils.pinned(all());
        }

        function isInFlight(campaign) {
            return campaign.status === 'inFlight';
        }

        function inFlight() {
            var output = [];
            var campaigns = all();
            var campaign;

            for (var i in campaigns) {
                campaign = campaigns[i];
                if (isInFlight(campaign)) {
                    output.push(campaign);
                }
            }

            return output;
        }

        function isPreFlight(campaign) {
            return campaign.status === 'preFlight';
        }

        function preFlight() {
            var output = [];
            var campaigns = all();
            var campaign;

            for (var i in campaigns) {
                campaign = campaigns[i];
                if (isPreFlight(campaign)) {
                    output.push(campaign);
                }
            }

            return output;
        }

        function isCompleted(campaign) {
            return campaign.status === 'completed';
        }

        function completed() {
            var output = [];
            var campaigns = all();
            var campaign;

            for (var i in campaigns) {
                campaign = campaigns[i];
                if (isCompleted(campaign)) {
                    output.push(campaign);
                }
            }

            return output;
        }

        function get(id) {
            return utils.get(all(), id);
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
            search: search,
            pin: pin,
            all: all,
            get: get
        };
    }]);
});
