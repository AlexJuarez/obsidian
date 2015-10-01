define(function (require) {
    'use strict';

    var module = require('./../../module');
    var utils = require('./util');

    module.service('campaignService', ['$http', 'dataFactory', 'accountService', '$state', 'campaignRecordService', 'notification', function ($http, dataFactory, accounts, $state, campaignRecordService, notification) {
        var campaigns = dataFactory(sortByStartDateDescending);

        campaignRecordService.observe(campaignUpdate, undefined, true);

        function init(apiConfig) {
            return campaigns.init(apiConfig, function (data) {
                return data.campaigns;
            });
        }

        function search(query) {
            return utils.search(filtered(), query);
        }

        function sortByStartDateDescending(data) {
            data.sort(function (a, b) {
                return new Date(b.startDate) - new Date(a.startDate);
            });

            return data;
        }

        // Observe for new/updated campaigns

        function campaignUpdate(event, record) {
            if (event === 'create' || event === 'update') {
                var data = record.get();
                var account = accounts.get(data.accountId);

                campaigns.addData([{
                    id: data.id,
                    name: data.name,
                    pinned: data.pinned,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    account: {
                        id: data.accountId
                    },
                    division: {
                        id: account.division.id
                    },
                    client: {
                        id: account.client.id
                    }
                }]);
            }
        }

        function quarterMap() {
            var sorted = filtered();
            var map = {};
            var item, key;

            for (var i = 0; i < sorted.length; i++) {
                item = sorted[i];
                key = utils.getYearQuarter(item.startDate);
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
            var campaign = get($state.params.campaignId);
            var accountId = $state.params.accountId || campaign && campaign.account.id;
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

                var accountIdSet = {};

                for (i = 0; i < list.length; i++) {
                    item = list[i];
                    accountIdSet[item.id] = true;
                }

                for (i = 0; i < sorted.length; i++) {
                    item = sorted[i];
                    if (accountIdSet[item.account.id]) {
                        output.push(item);
                    }
                }
            }

            return output;
        }


        function all() {
            return campaigns.all();
        }

        function togglePin(campaign, value) {
            var record = campaignRecordService.get(campaign.id);
            record.set({ pinned: value });
            return record.save();
        }

        function pin(campaign) {
            return togglePin(campaign, true).then(function() {
                notification.info('<a ui-sref="cm.campaigns.account({ campaignId: id})">{{name}}</a> has been pinned', { locals: { name: campaign.name, id: campaign.id }});
            });
        }

        function unpin(campaign) {
            return togglePin(campaign, false).then(function() {
                notification.info('<a ui-sref="cm.campaigns.account({ campaignId: id})">{{name}}</a> has been unpinned', { locals: { name: campaign.name, id: campaign.id }});
            });
        }

        function pinned() {
            return utils.pinned(all());
        }

        function isInFlight(campaign) {
            return campaign.status === 'inFlight';
        }

        function inFlight() {
            var output = [];
            var campaigns = filtered();
            var campaign;

            for (var i = 0; i < campaigns.length; i++) {
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
            var campaigns = filtered();
            var campaign;

            for (var i = 0; i < campaigns.length; i++) {
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
            var campaigns = filtered();
            var campaign;

            for (var i = 0; i < campaigns.length; i++) {
                campaign = campaigns[i];
                if (isCompleted(campaign)) {
                    output.push(campaign);
                }
            }

            return output;
        }

        function get(id) {
            return campaigns.getById(id);
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
            filtered: filtered,
            pinned: pinned,
            unpin: unpin,
            search: search,
            pin: pin,
            all: all,
            get: get
        };
    }]);
});
