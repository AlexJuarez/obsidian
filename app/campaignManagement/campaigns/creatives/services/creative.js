define(function(require) {
    'use strict';

    var module = require('./../../../module');
    var ng = require('angular');

    var apiConfig = {
        endpoint: 'creatives',
        queryParams: {
            dimensions: [
                'id', 'name', 'live', 'type', 'device', 'embedWidth',
                'embedHeight', 'expandedWidth', 'expandedHeight',
                'countPlacements',
                'live', 'modifiedDate', 'thumbnailUrlPrefix'
            ]
        }
    };

    module.service('creativeService', ['$http', 'dataFactory', 'apiUriGenerator', function($http, dataFactory, apiUriGenerator) {
        var creatives = dataFactory();
        var pendingRequest = {};

        function find(id, data) {
            var output;

            for (var i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    output = data[i];
                    break;
                }
            }

            return output;
        }

        function get(id){
            var item = find(id, creatives.all());

            if (!item && !pendingRequest[id]) {
                pendingRequest[id] = true;
                var config = ng.copy(apiConfig);
                config.queryParams.filters = ['id:eq:' + id];
                var url = apiUriGenerator(config);

                $http.get(url).success(function (d) {
                    creatives.addData(d.creatives, id);
                });
            }

            return item;
        }

        return {
            observe: creatives.observe,
            all: creatives.all,
            get: get
        };
    }]);
});
