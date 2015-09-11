define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        update: {
            version: 'crud',
            endpoint: 'creatives/{id}'
        },
        create: {
            version: 'crud',
            endpoint: 'creatives'
        }
    };


    module.service('creativeRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
