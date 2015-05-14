define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');

    module.service('campaignService', ['$http', 'dataFactory', function ($http, dataFactory) {
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
            var sorted = all();
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
            ng.forEach(all(), function (campaign) {
                if (campaign.id === id) {
                    return campaign;
                }
            });
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
