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

        function inStream() {
            var allTags = data.all();
            var inStreamTags = [];
            allTags.forEach(function(tag) {
                if (isInStream(tag)) {
                    inStreamTags.push(tag);
                }
            });

            return inStreamTags;
        }

        function all() {
            var allTags = data.all();
            var normalTags = [];
            allTags.forEach(function(tag) {
                if (!isInStream(tag)) {
                    normalTags.push(tag);
                }
            });

            return normalTags;
        }

        function isInStream(tag) {
            return tag.attributes && tag.attributes.inStream;
        }

        return {
            init: init,
            all: all,
            inStream: inStream,
            observe: data.observe,
            notifyObservers: data.notifyObservers,
            addData: data.addData,
            setData: data.setData
        };
    }]);
});
