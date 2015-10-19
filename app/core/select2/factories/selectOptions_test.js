define(function(require){
    'use strict';

    require('./selectOptions');
    require('./trackValues');
    require('angularMocks');

    var ng = require('angular');

    describe('trackValues', function() {
        var selectOptions, options, scope, tracked;

        beforeEach(function() {
            module('app.core');

            inject(function(selectOptionsFactory, trackValuesFactory, $rootScope) {
                selectOptions = selectOptionsFactory;
                tracked = trackValuesFactory();
                scope = $rootScope.$new();
            });
        });

        function createOptions(ngOptions, locals) {
            ng.extend(scope, locals);
            options = selectOptions(ngOptions, scope, tracked);
        }

        describe('!ngOptions', function(){
            it('should return not null', function() {
                createOptions();

                expect(options).not.toEqual(null);
                expect(options.valuesFn).toBeFalsy();
            });

            it('should work with no values', function() {
                createOptions();

                expect(options.getOptions()).toEqual([]);
            });

            it('should return a list of the options when no value', function() {
                createOptions();
                var o = ng.element('<option>test</option><option>test2</option>');

                var expected = [{id: 'test', text: 'test'}, {id: 'test2', text: 'test2'}];
                expect(options.getOptions(o)).toEqual(expected);
            });

            it('should return a list of the options when a value is present', function() {
                createOptions();
                var o = ng.element('<option value="1">test</option><option value="2">test2</option>');

                var expected = [{id: '1', text: 'test'}, {id: '2', text: 'test2'}];
                expect(options.getOptions(o)).toEqual(expected);
            });
        });

        describe('ngOptions', function(){
            it('should work for the base case', function() {
                var locals = {
                    selection: [{id: 1, name: 'test'}, {id: 2, name: 'test2'}]
                };
                var ngOptions = 'item as item.name for item in selection track by item.id';

                var expected = [{id: 1, text: 'test'}, {id: 2, text: 'test2'}];

                createOptions(ngOptions, locals);

                var values = options.valuesFn(scope);
                var data = options.getOptions(values);

                expect(data).toEqual(expected);
            });

            it('should work with a disable function', function() {
                var locals = {
                    selection: [{id: 1, name: 'test', red: true}, {id: 2, name: 'test2', red: false}]
                };

                var ngOptions = 'item as item.name disable when item.red for item in selection track by item.id';

                var expected = [{id: 1, text: 'test', disabled: true}, {id: 2, text: 'test2', disabled: false}];

                createOptions(ngOptions, locals);

                var values = options.valuesFn(scope);
                var data = options.getOptions(values);

                expect(data).toEqual(expected);
            });

            it('should work with a group by function', function() {
                var locals = {
                    selection: [
                        {id: 1, name: 'test', group: 'red'},
                        {id: 2, name: 'test2', group: 'black'},
                        {id: 3, name: 'black1', group: 'black'}
                    ]
                };

                var ngOptions = 'item as item.name group by item.group for item in selection track by item.id';

                var expected = [
                    { text: 'red', children: [{ id: 1, text: 'test'}]},
                    {
                        text: 'black',
                        children: [
                            { id: 2, text: 'test2'},
                            { id: 3, text: 'black1'}
                        ]
                    }
                ];

                createOptions(ngOptions, locals);

                var values = options.valuesFn(scope);
                var data = options.getOptions(values);

                expect(data).toEqual(expected);
            });

            it('should work with out track by', function() {
                var locals = {
                    selection: [{id: 1, name: 'test'}, {id: 2, name: 'test2', $$hashKey: function() { return 'object:1'; }}]
                };
                var ngOptions = 'item as item.name for item in selection';

                var expected = [{id: 'object:0', text: 'test'}, {id: 'object:1', text: 'test2'}];

                createOptions(ngOptions, locals);

                var values = options.valuesFn(scope);
                var data = options.getOptions(values);

                expect(data).toEqual(expected);
            });

            it('should work with out track by on a hash map', function() {
                var locals = {
                    selection: {
                        1: 'test',
                        2: 'test2'
                    }
                };
                var ngOptions = 'value for (key, value) in selection';

                var expected = [{id: 'string:test', text: 'test'}, {id: 'string:test2', text: 'test2'}];

                createOptions(ngOptions, locals);

                var values = options.valuesFn(scope);
                var data = options.getOptions(values);

                expect(data).toEqual(expected);
            });
        });

    });
});
