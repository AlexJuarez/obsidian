define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.factory('recordFactory', ['$interpolate', 'apiUriGenerator', '$http', 'observerFactory', '$log', function($interpolate, apiUriGenerator, $http, observerFactory, $log) {
        /**
         * @param {{attributes: Object, idAttribute: String, rules: {key: {ignore: Boolean, noCompare: Boolean}}, apiConfig: Object, transform: function }} - options
         */
        return function(options) {
            var observers = observerFactory();
            var validationErrorFn = options.validationErrorFn || function(errors){};
            var successFn = options.successFn || function() {};

            /**
             * see the documentation here
             * https://docs.angularjs.org/api/ng/service/$http
             * @param resp
             */
            function errorHandler(resp){
                this.saving = false;
                if (resp.status === 400) { //if the response is a bad-request
                    validationErrorFn.call(this, resp.data);
                    if (resp.data.errors) {
                        this.setErrors(resp.data.errors);
                    }
                } else {
                    $log.warn('an unexpected server error has occurred');
                }
            }

            function successHandler(resp) {
                this.saving = false;
                if (resp.status === 200) {
                    successFn.call(this, resp.data);
                    this.set(resp.data);
                }
            }

            var model = function(options) {
                this._attributes = {};
                this.attributes = {};
                this.saving = false;
                this.saved = false;
                this.idAttribute = options.idAttribute || 'id';
                this.rules = ng.merge({}, options.rules);

                this.rules[this.idAttribute] = { ignore: true };

                this.transform = options.transform || function (data) { return data; };
                this.apiConfig = ng.copy(options.apiConfig);

                this.set(options.attributes);
            };

            model.prototype = {
                id: null,
                _errors: {},
                set: function(attrs, saved){
                    //do nothing if empty
                    if (attrs == null) {
                        return this;
                    }

                    //update the id
                    if (attrs[this.idAttribute]) {
                        this.id = attrs[this.idAttribute];
                    }

                    //create a _attributes hash that can be modified outside
                    this.attributes = ng.merge({}, this.attributes, this.transform(attrs));
                    this._attributes = ng.copy(this.attributes);
                    observers.notifyObservers(this);
                },
                fetch: function() {
                    var getConfig = ng.copy(this.apiConfig.read || this.apiConfig.update);
                    var method = getConfig.method || 'get';
                    return this.makeRequest(method, getConfig);
                },
                get: function() {
                    return this._attributes;
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
                    observers.notifyObservers(this);
                },
                validConfig: function(config) {
                    if (!config || ng.equals({}, config)) {
                        $log.warn('invalid api configuration');
                        return false;
                    }

                    return true;
                },
                makeRequest: function(method, config, data){
                    if(this.validConfig(config)) {
                        config.endpoint = $interpolate(config.endpoint)(this.attributes);
                        var url = apiUriGenerator(config);
                        var that = this;
                        this.saving = true;
                        var requestFn = $http[method];
                        var result = (requestFn.length === 3) ? requestFn(url, data) : requestFn(url);

                        result.then(function (resp) {
                            successHandler.call(that, resp);
                        }, function (resp) {
                            errorHandler.call(that, resp);
                        });

                        return result;
                    }
                },
                hasChanges: function() {
                    return !ng.equals({}, this.diff(this._attributes, this.attributes)) || !this.id;
                },
                create: function() {
                    var createConfig = ng.copy(this.apiConfig.create);
                    var data = this._filter(this._attributes);
                    var method = createConfig.method || 'post';
                    return this.makeRequest(method, createConfig, data);
                },
                update: function() {
                    var updateConfig = ng.copy(this.apiConfig.update);
                    var data = this.diff(this._attributes, this.attributes);
                    var method = updateConfig.method || 'put';
                    if (!ng.equals({}, data)) {
                        return this.makeRequest(method, updateConfig, data);
                    }
                },
                destroy: function() {
                    var destroyConfig = ng.copy(this.apiConfig.delete);
                    var method = destroyConfig || 'put';
                    if (method === 'put') {
                        var data = { deleted: true };
                        return this.makeRequest(method, destroyConfig, data);
                    } else {
                        return this.makeRequest(method, destroyConfig);
                    }
                },
                observe: observers.observe,
                notifyObservers: observers.notifyObservers,
                save: function() {
                    if (!this.saving) {
                        if (this.id) {
                            return this.update();
                        } else {
                            return this.create();
                        }
                    } else {
                        $log.info('A save is already in progress')
                    }
                }
            };

            return new model(options);
        }
    }]);
});
