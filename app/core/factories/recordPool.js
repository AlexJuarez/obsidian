
/**
 * Read, create and update a single record from the database
 */

define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('recordPoolFactory', ['recordFactory', 'observerFactory', function (recordFactory, observerFactory) {
        return function (apiConfig) {
            var observers = observerFactory();
            var records = {};

            function get(id) {
                if (records[id]) {
                    return records[id];
                } else {
                    var record = recordFactory({apiConfig: apiConfig, attributes: { id: id }});
                    records[id] = record;
                    record.observe(observers.notifyObservers, undefined, true);
                    return record;
                }
            }

            function fetch(id) {
                var record = get(id);
                return record.fetch();
            }

            function update(id, data) {
                var record = get(id);
                record.set(data);
                return record.save();
            }

            function _delete(id) {
                var record = get(id);
                return record.destroy();
            }

            function create(attrs) {
                var record = recordFactory({
                    apiConfig: apiConfig,
                    successFn: function(resp) {
                        var data = resp.data;
                        records[data.id] = record;
                        record.observe(observers.notifyObservers, undefined, true);
                    },
                    attributes: attrs
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
