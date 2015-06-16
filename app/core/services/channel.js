define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');

    module.service('channelService', ['dataFactory', '$http', function (dataFactory) {
        var data = dataFactory(function (data) {
            data.sort(sortFn);
            return data;
        });

        function transform(data) {
            data = data.clients;

            var channelSet = {};

            for (var i = 0; i < data.length; i++) {
                channelSet[data[i].channel] = true;
            }

            var output = [];

            ng.forEach(channelSet, function (value, key) {
                output.push(key);
            });

            return output;
        }

        function init() {
            return data.init('/api/v3/clients?dimensions=channel', transform);
        }

        function sortFn(a, b) {
            return b.localeCompare(a);
        }

        return {
            init: init,
            all: data.all,
            observe: data.observe,
            notifyObservers: data.notifyObservers,
            addData: data.addData,
            setData: data.setData
        };
    }]);
});
