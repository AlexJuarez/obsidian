define(function (require) {
    'use strict';

    require('./date');
    require('angularMocks');

    describe('dateFilter', function () {
        var filter;
        var minute = 60000;
        var hour = minute * 60;
        var day = hour * 24;
        var month = day * 30;
        var year = month * 12;


        beforeEach(function () {
            module('app.core');
            inject(function ($filter) {
                filter = $filter('dateFormatter');
            });
        });

        it('should filter to moments ago.', function () {
            var date = new Date();
            expect(filter(date)).toEqual('moments ago');
        });

        it('should filter to minutes ago.', function () {
            var date = new Date();
            date -= 3*minute;
            expect(filter(date)).toContain('minutes');
        });

        it('should filter to hours ago.', function () {
            var date = new Date();
            date -= 3*hour;
            expect(filter(date)).toContain('hours ago');
        });

        it('should filter to days ago.', function () {
            var date = new Date();
            date -= 3*day;
            expect(filter(date)).toContain('days ago');
        });

        it('should filter to months ago.', function () {
            var date = new Date();
            date -= 3*month;
            expect(filter(date)).toContain('months ago');
        });

        it('should filter to hours ago.', function () {
            var date = new Date();
            date -= 3*year;
            expect(filter(date)).toContain('years ago');
        });

        it('should return never when date is null', function() {
           expect(filter(null)).toContain('Never');
        });
    });
});
