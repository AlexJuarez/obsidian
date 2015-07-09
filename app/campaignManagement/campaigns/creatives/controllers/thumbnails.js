'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativeThumbnailsCtrl', [
        '$scope', function($scope) {
            var options = '<a style="padding-right:20px;">Edit in Studio</a><span style="font-size:2rem"><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a></span>';
            $scope.creatives = {
                rules: {
                    checked: '',
                    name: '',
                    delivering: '',
                    type: '',
                    device: '',
                    size: '',
                    expandedSize: '',
                    numPlacements: '',
                    options: ''
                },
                headers: [
                    {name: '', id: 'checked'},
                    {name: 'CREATIVE NAME', id: 'name'},
                    {name: 'DELIVERING', id: 'delivering'},
                    {name: 'DEVICE', id: 'device'},
                    {name: 'SIZE', id: 'size'},
                    {name: 'EXPANDABLE', id: 'expandedSize'},
                    {name: 'NO PLACEMENTS', id: 'numPlacements'},
                    {name: 'OPTIONS', id: 'options'}
                ],
                data: [
                    {
                        checked: '<input type="checkbox" checked>',
                        name: 'RichMedia1024x90_Tablet',
                        delivering: 'inFlight',
                        type: 'RM',
                        device: 'Tablet',
                        size: '1024x90',
                        expandedSize: '1024x768',
                        numPlacements: 630,
                        lastModified: '2015-08-09',
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InBanner_Ad1_300x600',
                        delivering: 'archived',
                        type: 'IBV',
                        device: 'Desktop',
                        size: '300x600',
                        expandedSize: undefined,
                        numPlacements: 130,
                        lastModified: '2015-03-15',
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InBanner_Ad1_300x600',
                        delivering: 'preFlight',
                        type: 'IBV',
                        device: 'Multidevice',
                        size: '300x600',
                        expandedSize: '600x600',
                        lastModified: '2015-08-09',
                        numPlacements: 154,
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InStreamVideoName',
                        delivering: 'delivering',
                        type: 'ISV',
                        device: 'Mobile',
                        size: '300x600',
                        expandedSize: undefined,
                        lastModified: '2015-10-22',
                        numPlacements: 230,
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InBanner_Ad1_300x600',
                        delivering: 'inFlight',
                        type: 'IBV',
                        device: 'Multidevice',
                        size: '300x600',
                        expandedSize: '600x600',
                        lastModified: '2015-08-09',
                        numPlacements: 154,
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InBanner_Ad1_300x600',
                        delivering: 'preFlight',
                        type: 'IBV',
                        device: 'Multidevice',
                        size: '300x600',
                        expandedSize: '600x600',
                        lastModified: '2015-08-09',
                        numPlacements: 154,
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InBanner_Ad1_300x600',
                        delivering: 'inFlight',
                        type: 'IBV',
                        device: 'Multidevice',
                        size: '300x600',
                        expandedSize: '600x600',
                        lastModified: '2015-08-09',
                        numPlacements: 154,
                        options: options
                    }
                ]
            };

        }
    ]);
});
