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
            for (var i = 0; i < sorted.length; i++) {
                item = sorted[i];

                if (query.length > 3) {
                    if (checkName(item, query) || checkId(item, query)) {
                        output.push(item);
                    }
                } else {
                    if (checkName(item, query)) {
                        output.push(item);
                    }
                }

                if (output.length > max) {
                    break;
                }
            }
        }

        return output;
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
        search: search,
        alphabetMap: alphabetMap,
        pinned: pinned,
        get: get
    };
});
