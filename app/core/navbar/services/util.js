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

    function alphabetMap(sorted) {
        var map = {};
        var item;

        for (var i = 0; i < sorted.length; i++) {
            item = sorted[i];
            if (item.name) {
                var key = item.name.charAt(0).toLowerCase();
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

        return map;
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

    function get(items, id) {
        var length = items.length;
        for (var i = 0; i < length; i++) {
            if (items[i].id === id) {
                return items[i];
            }
        }
    }

    return {
        sortByName: sortByName,
        alphabetMap: alphabetMap,
        pinned: pinned,
        get: get
    };
});
