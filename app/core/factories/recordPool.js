
/**
 * Read, create and update a single record from the database
 */

define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.factory('recordPoolFactory', ['recordFactory', 'observerFactory', function (recordFactory, observerFactory) {
        return function (apiConfig) {
            var observers = observerFactory();
            var records = {};

            function makeRecord() {

            }

            function get(id) {
                if (records[id]) {
                    return records[id];
                } else {
                    var record = recordFactory({apiConfig: apiConfig, attributes: { id: id }});
                    records[id] = record;
                    record.observe(function() {
                        observers.notifyObservers(record.get());
                    }, undefined, true);

                    return record;
                }
            }

            function fetch(id) {
                var record = get(id);
                return record.fetch();
            }

            function update(id) {
                var record = get(id);
                return record.save();
            }

            function _delete(id) {
                var record = get(id);
                return record.destroy();
            }

            function create() {
                var record = recordFactory({ apiConfig: apiConfig,
                    successFn: function(data) {
                        records[data.id] = record;
                        record.observe(function() {
                            observers.notifyObservers(record.get());
                        }, undefined, true);
                    }
                });

                return record;
            }

            return {
                _records: records,
                get: get,
                fetch: fetch,
                update: update,
                create: create,
                delete: _delete,
                observe: observers.observe,
                notifyObservers: observers.notifyObservers
            };
        };
    }]);
});
