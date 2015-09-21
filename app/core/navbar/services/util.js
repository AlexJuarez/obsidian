/* jshint -W101 */

define(function () {
    'use strict';

    function sortByName(data) {
        data.sort(function (a, b) {
            if (a.name && b.name) {
                return a.name.localeCompare(b.name);
            } else {
                return 0;
            }
        });

        return data;
    }

    function getYearQuarter(date) {
        date = new Date(date);
        var quarter = Math.floor(date.getMonth() / 3) + 1;
        var year = date.getUTCFullYear();
        return year + ' ' + 'Q' + quarter;
    }

    function checkName(item, query) {
        return item.name && item.name.toLowerCase().indexOf(query) > -1;
    }

    function checkId(item, query) {
        return item.id && item.id.toLowerCase().indexOf(query) > -1;
    }

    function search(sorted, query, max) {
        var output = [];
        max = max || 5;
        var item;

        if (query) {
            query = query.toLowerCase();
            for (var i = 0; i < sorted.length && output.length < max; i++) {
                item = sorted[i];

                if (query.length >= 3) {
                    if (checkName(item, query) || checkId(item, query)) {
                        output.push(item);
                    }
                } else {
                    if (checkName(item, query)) {
                        output.push(item);
                    }
                }
            }
        }

        return output;
    }

    function alphabetMap(sorted) {
        var map = {};
        var item, key;

        for (var i = 0; i < sorted.length; i++) {
            item = sorted[i];
            if (item.name && item.name !== null) {
                key = item.name.trim().charAt(0).toLowerCase();

                //Check non-alphanumeric
                if (!/\d|[a-z]/.test(key)) {
                    var name = item.name.trim();
                    key = name.replace(/[^a-z0-9]|\W+|\r?\n|\r/gmi, '').charAt(0);
                }

                //Check if its a digit
                if (/\d/.test(key)) {
                    if (typeof map['#'] === 'undefined') {
                        map['#'] = [item];
                    } else {
                        map['#'].push(item);
                    }
                } else {
                    if (typeof map[key] === 'undefined') {
                        map[key] = [item];
                    } else {
                        map[key].push(item);
                    }
                }
            }
        }

        var output = [];

        for (key in map) {
            output.push({
                key: key,
                value: map[key]
            });
        }

        output.sort(function (a, b) {
            return a.key.localeCompare(b.key);
        });

        return output;
    }

    function pinned(sorted) {
        var output = [];
        var item;

        for (var i = 0; i < sorted.length; i++) {
            item = sorted[i];
            if (item.pinned) {
                output.push(item);
            }
        }

        return output;
    }

    return {
        sortByName: sortByName,
        search: search,
        alphabetMap: alphabetMap,
        pinned: pinned,
        getYearQuarter: getYearQuarter
    };
});
