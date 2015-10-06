define(function(require){
    'use strict';

    require('./trackValues');
    require('angularMocks');

    var ng = require('angular');

    describe('trackValues', function() {
        var tracked;

        beforeEach(function() {
            module('app.core');

            inject(function(trackValuesFactory) {
                tracked = trackValuesFactory();
            });
        });

        it('should add a value', function() {
            tracked.add(1, 'test', 'test', 'test');
            expect(tracked._data[1].index).toEqual(1);
        });

        it ('should get a value', function() {
            tracked.add(1, 'test', 'test', 'test');
            var o = tracked.get('test');
            expect(o.index).toEqual(1);
            o = tracked.get(1);
            expect(o.index).toEqual(1);
        });

        it ('should return is empty', function() {
            expect(tracked.isEmpty()).toEqual(true);
            tracked.add(1, 'test', 'test', 'test');
            expect(tracked.isEmpty()).toEqual(false);
        });

        it ('should reset the container', function() {
            tracked.add(1, 'test', 'test', 'test');
            expect(tracked.isEmpty()).toEqual(false);
            tracked.reset();
            expect(tracked.isEmpty()).toEqual(true);
        });

        it ('should contain a index', function() {
            tracked.add(1, 'test', 'test', 'test');
            expect(tracked.contains(1)).toEqual(true);
        });
    });
});
