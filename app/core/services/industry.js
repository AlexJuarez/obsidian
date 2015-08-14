define(function (require) {
    'use strict';

    var module = require('./../module');

    module.service('industryService', ['dataFactory', '$http', function (dataFactory) {
        var data = dataFactory(function (data) {
            data.sort(sortFn);
            return data;
        });

        function transform(data) {
            return data;
        }

        function init() {
            var apiConfig = {
                version: 'crud',
                endpoint: 'industries'
            };

            return data.init(apiConfig, transform);
        }

        function sortFn(a, b) {
            return b.name.localeCompare(a.name);
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
