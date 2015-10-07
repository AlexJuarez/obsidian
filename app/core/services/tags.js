define(function (require) {
    'use strict';

    var module = require('./../module');

    module.service('adTagService', ['dataFactory', function (dataFactory) {
        var data = dataFactory();

        function transform(data) {
            return data;
        }

        function init() {
            var apiConfig = {
                version: 'crud',
                endpoint: 'adtags'
            };

            return data.init(apiConfig, transform);
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
