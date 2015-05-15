define(function (require) {
    'use strict';

    require('./storeService');
    require('angularMocks');

    describe('storeService', function () {
        var store;

        beforeEach(function () {
            module('app.core');
            inject(function (storeService) {
                store = storeService;
            });
        });

        it('should set data for an id', function() {
            store.setData('test', 1);
            expect(store.all('test')).toEqual(1);
        });

        it('should call a callback for an id', function() {
            function callback() {
                expect(store.all('test')).toEqual(1);
            }

            store.observe('test', callback);

            store.setData('test', 1);
        });
    });
});
