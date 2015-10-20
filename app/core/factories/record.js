define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.factory('recordFactory', ['$interpolate', 'apiUriGenerator', '$http', 'observerFactory', '$log', '$q', 'notification', 'dataSyncService', function($interpolate, apiUriGenerator, $http, observerFactory, $log, $q, notification, dataSyncService) {
        //destroy, update, create, error, change
        /**
         * @param {{attributes: Object, idAttribute: String, rules: {key: {ignore: Boolean, noCompare: Boolean}}, apiConfig: Object, transform: function }} - options
         */
        return function(options) {
            options = options || {};
            var observers = observerFactory();
            var validationErrorFn = options.validationErrorFn || function(){};
            var successFn = options.successFn || function() {};

            /**
             * see the documentation here
             * https://docs.angularjs.org/api/ng/service/$http
             * @param resp
             */
            function errorHandler(resp, record){
                record.saving = false;
                if (resp.status === 400) { //if the response is a bad-request
                    validationErrorFn.call(record, resp);
                    if (resp.data.errors) {
                        record.setErrors(resp.data.errors);
                    }
                } else {
                    $log.warn('An unexpected server error has occurred.');
                    $log.warn(resp);
                    notification.error('An unexpected server error has occurred.');
                }
            }

            function successHandler(resp, record) {
                record.saving = false;
                if (resp.status === 200) {
                    var endpoint = record.apiConfig.read || record.apiConfig.update;
                    //dataSyncService.update(endpoint, resp.data);
                    record._isNew = false;
                    successFn.call(record, resp);
                    record._set(resp.data);
                }
            }

            var Model = function(options) {
                this._attributes = {};
                this.attributes = {};
                this.saving = false;
                this.idAttribute = options.idAttribute || 'id';
                this.rules = ng.merge({}, options.rules);

                this._isNew = true;
                this.rules[this.idAttribute] = { ignore: true };

                this.transform = options.transform || function (data) { return data; };
                this.apiConfig = ng.copy(options.apiConfig);

                this._set(options.attributes);
            };

            Model.prototype = {
                id: null,
                _errors: {},
                set: function(attrs) {
                    ng.merge(this._attributes, attrs);
                },
                _set: function(attrs){
                    //do nothing if empty
                    if (attrs == null || ng.equals({}, attrs)) {
                        return this;
                    }

                    //update the id
                    if (attrs[this.idAttribute]) {
                        this.id = attrs[this.idAttribute];
                    }

                    //create a _attributes hash that can be modified outside
                    this.attributes = ng.merge({}, this.attributes, this.transform(attrs));
                    this.reset();
                    observers.notifyObservers('change', this);
                },
                fetch: function() {
                    var getConfig = ng.copy(this.apiConfig.read || this.apiConfig.update);
                    var method = getConfig.method || 'get';
                    return this.makeRequest(method, getConfig);
                },
                isNew: function() {
                    return this._isNew;
                },
                get: function() {
                    return this._attributes;
                },
                reset: function() {
                    this._attributes = ng.copy(this.attributes);
                },
                changes: function() {
                    return this.diff(this._attributes, this.attributes);
                },
                diff: function(changed, original){
                    var _diff = {}, val;

                    for (var attr in changed) {
                        val = changed[attr];
                        if(!ng.equals(original[attr], val) && !this.noCompare(attr)) {
                            _diff[attr] = val;
                        }
                    }

                    return this._filter(_diff);
                },
                intersect: function(changed, original) {
                    var _intersection = {}, val;

                    for (var attr in changed) {
                        val = changed[attr];
                        if(ng.equals(original[attr], val)) {
                            _intersection[attr] = val;
                        }
                    }

                    return this._filter(_intersection);
                },
                ignore: function(key){
                    return this.rules[key] && this.rules[key].ignore;
                },
                noCompare: function(key){
                    return this.rules[key] && this.rules[key].noCompare;
                },
                errors: function() {
                    return this._errors;
                },
                _filter: function(attributes) {
                    var attrs = ng.copy(attributes);

                    ng.forEach(this.rules, function(d, v) {
                        if (d.ignore) {
                            delete attrs[v];
                        }
                    });

                    return attrs;
                },
                setErrors: function(errors) {
                    this._errors = errors;
                    observers.notifyObservers('error', this);
                },
                validConfig: function(config) {
                    if (!config || ng.equals({}, config)) {
                        $log.warn('invalid api configuration');
                        return false;
                    }

                    return true;
                },
                createUrl: function(config) {
                    var conf = ng.copy(config);
                    if(this.validConfig(conf)) {
                        conf.endpoint = $interpolate(conf.endpoint)(this.attributes);
                        return apiUriGenerator(conf);
                    }
                },
                makeRequest: function(method, config, data){
                    var deferred = $q.defer();
                    var url = this.createUrl(config);
                    if(method && url) {
                        var that = this;
                        this.saving = true;
                        var requestFn = $http[method];
                        var result = (requestFn.length === 3) ? requestFn(url, data) : requestFn(url);

                        result.then(function (resp) {
                            successHandler.call(that, resp, that);
                            deferred.resolve(resp);
                        }, function (resp) {
                            errorHandler.call(that, resp, that);
                            deferred.reject(resp);
                        });
                    } else {
                        deferred.reject('invalid method or url');
                    }

                    return deferred.promise;
                },
                hasChanges: function() {
                    return !ng.equals({}, this.changes());
                },
                create: function() {
                    var createConfig = ng.copy(this.apiConfig.create);
                    var data = this._filter(this._attributes);
                    var method = createConfig.method || 'post';
                    var request = this.makeRequest(method, createConfig, data);

                    var that = this;

                    request.then(function() {
                        that.notifyObservers('create', that);
                    });

                    return request;
                },
                update: function() {
                    var deferred = $q.defer();
                    var updateConfig = ng.copy(this.apiConfig.update);
                    var data = this.changes();
                    var method = updateConfig.method || 'put';
                    var request;
                    var that = this;

                    if (!ng.equals({}, data)) {
                        request = this.makeRequest(method, updateConfig, data);
                        request.then(deferred.resolve, deferred.reject);
                        request.then(function() {
                            that.notifyObservers('update', that);
                        });
                    } else {
                        deferred.reject('No change');
                    }

                    return deferred.promise;
                },
                destroy: function() {
                    var deferred = $q.defer();
                    var destroyConfig = ng.copy(this.apiConfig.delete || this.apiConfig.update);
                    var method = destroyConfig.method || 'put';
                    var request;
                    var that = this;

                    if (method === 'put') {
                        var data = { deleted: true };
                        request = this.makeRequest(method, destroyConfig, data);
                        request.then(deferred.resolve, deferred.reject);
                        request.then(function() {
                            that.notifyObservers('destroy', that);
                        });
                    } else {
                        this.makeRequest(method, destroyConfig).then(deferred.resolve, deferred.reject);
                    }

                    return deferred.promise;
                },
                observe: observers.observe,
                notifyObservers: observers.notifyObservers,
                save: function() {
                    var deferred = $q.defer();

                    if (!this.saving) {
                        if (this.id) {
                            this.update().then(deferred.resolve, deferred.reject);
                        } else {
                            this.create().then(deferred.resolve, deferred.reject);
                        }
                    } else {
                        $log.info('A save is already in progress');
                        deferred.reject('A save is in progress');
                    }

                    return deferred.promise;
                }
            };

            return new Model(options);
        };
    }]);
});
