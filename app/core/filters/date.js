var minute = 60000;
var hour = minute * 60;
var day = hour * 24;
var month = day * 30;
var year = month * 12;

define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('dateFormatter', [function () {
        return function (date) {
            if (date === null) {
                return 'Never';
            }
            var then = new Date(date);
            var now = new Date();
            var timePassed = now - then;

            if (timePassed < minute) {
                return 'moments ago';
            }
            if (timePassed < hour) {
                return Math.floor(timePassed / minute) + ' minutes ago';
            }
            if (timePassed < day) {
                return Math.floor(timePassed / hour) + ' hours ago';
            }
            if (timePassed < month) {
                return Math.floor(timePassed / day) + ' days ago';
            }
            if (timePassed < year) {
                return Math.floor(timePassed / month) + ' months ago';
            }
            return Math.floor(timePassed / year) + ' years ago';
        };
    }]);
});
