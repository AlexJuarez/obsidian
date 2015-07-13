'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativeListCtrl', [
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
                        name: 'InBanner_Ad1_300x600<br />Creative ID: a576-0058-kde7-90ea',
                        delivering: '<span class="icon-status success"></span>',
                        type: 'RM',
                        device: 'Tablet',
                        size: '300x600',
                        expandedSize: '600x600',
                        numPlacements: 15,
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InBanner_Ad1_300x600<br />Creative ID: a576-0058-kde7-90ea',
                        delivering: '<span class="icon-status success"></span>',
                        type: 'IBV',
                        device: 'Desktop',
                        size: '300x600',
                        expandedSize: 'N/A',
                        numPlacements: 13,
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InBanner_Ad1_300x600<br />Creative ID: a576-0058-kde7-90ea',
                        delivering: '<span class="icon-status"></span>',
                        type: 'IBV',
                        device: 'Multidevice',
                        size: '300x600',
                        expandedSize: '600x600',
                        numPlacements: 11,
                        options: options
                    },
                    {
                        checked: '<input type="checkbox">',
                        name: 'InBanner_Ad1_300x600<br />Creative ID: a576-0058-kde7-90ea',
                        delivering: '<span class="icon-status"></span>',
                        type: 'IS',
                        device: 'Mobile',
                        size: '300x600',
                        expandedSize: 'N/A',
                        numPlacements: 10,
                        options: options
                    }
                ]
            };
        }
    ]);
});
