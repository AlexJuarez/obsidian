'use strict';

define(function (require) {
    var app = require('./../../../module');

    app.controller('placementListCtrl', ['$scope', function ($scope) {
        $scope.placementTypes = [
            {
                name: 'Placement Type 1',
                value: '1'
            },
            {
                name: 'Placement Type 2',
                value: '2'
            },
            {
                name: 'Placement Type 3',
                value: '3'
            },
            {
                name: 'Placement Type 4',
                value: '4'
            },
            {
                name: 'Placement Type 5',
                value: '5'
            }
        ];

        $scope.placements = [
            {
                header: '<input type="checkbox"> <a>Brightroll</a> 30 Placements 10 Live 1,234,567 of 3,000,000 impressions</div>',
                content: {
                    rules: {
                        checked: '',
                        name: '',
                        type: '',
                        delivering: '',
                        start: 'date',
                        end: 'date',
                        assignedCreatives: '',
                        pacingAndImpressions: '',
                        options: ''
                    },
                    headers: [
                        {name: '', id: 'checked'},
                        {name: 'PLACEMENT NAME', id: 'name'},
                        {name: 'TYPE', id: 'type'},
                        {name: 'DELIVERING', id: 'delivering'},
                        {name: 'START', id: 'start'},
                        {name: 'END', id: 'end'},
                        {name: 'ASSIGNED CREATIVES', id: 'assignedCreatives'},
                        {name: 'PACING & IMPRESSIONS', id: 'pacingAndImpressions'},
                        {name: 'OPTIONS', id: 'options'}
                    ],
                    data: [
                        {
                            checked: '<input type="checkbox" checked>',
                            name: 'AOD_Q2_EveryDay_Desktop_RichMedia_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'RM',
                            delivering: '<span class="icon-status success"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a><br /><a>RichMedia_Ad2_300x600</a>',
                            pacingAndImpressions: '<div pacing-chart class="meter-wrapper meter-sm"></div>',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_IBV_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'RM',
                            delivering: '<span class="icon-status success"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a>',
                            pacingAndImpressions: '<div pacing-chart class="meter-wrapper meter-sm"></div>',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_Instream_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'IS',
                            delivering: '<span class="icon-status"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a>',
                            pacingAndImpressions: '100,000 booked impressions',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_Instream_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'IS',
                            delivering: '<span class="icon-status"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a></a>',
                            pacingAndImpressions: '100,000 booked impressions',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        }
                    ]
                }
            },
            {
                header: '<input type="checkbox"> <a>Google</a> 30 Placements 10 Live 1,234,567 of 3,000,000 impressions</div>',
                content: {
                    rules: {
                        checked: '',
                        name: '',
                        type: '',
                        delivering: '',
                        start: 'date',
                        end: 'date',
                        assignedCreatives: '',
                        pacingAndImpressions: '',
                        options: ''
                    },
                    headers: [
                        {name: '', id: 'checked'},
                        {name: 'PLACEMENT NAME', id: 'name'},
                        {name: 'TYPE', id: 'type'},
                        {name: 'DELIVERING', id: 'delivering'},
                        {name: 'START', id: 'start'},
                        {name: 'END', id: 'end'},
                        {name: 'ASSIGNED CREATIVES', id: 'assignedCreatives'},
                        {name: 'PACING & IMPRESSIONS', id: 'pacingAndImpressions'},
                        {name: 'OPTIONS', id: 'options'}
                    ],
                    data: [
                        {
                            checked: '<input type="checkbox" checked>',
                            name: 'AOD_Q2_EveryDay_Desktop_RichMedia_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'RM',
                            delivering: '<span class="icon-status success"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a><br /><a>RichMedia_Ad2_300x600</a>',
                            pacingAndImpressions: '<div pacing-chart class="meter-wrapper meter-sm"></div>',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_IBV_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'RM',
                            delivering: '<span class="icon-status success"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a>',
                            pacingAndImpressions: '<div pacing-chart class="meter-wrapper meter-sm"></div>',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_Instream_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'IS',
                            delivering: '<span class="icon-status"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a>',
                            pacingAndImpressions: '100,000 booked impressions',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_Instream_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'IS',
                            delivering: '<span class="icon-status"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a></a>',
                            pacingAndImpressions: '100,000 booked impressions',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        }
                    ]
                }
            },
            {
                header: '<input type="checkbox"> <a>NBCU</a> 30 Placements 10 Live 1,234,567 of 3,000,000 impressions</div>',
                content: {
                    rules: {
                        checked: '',
                        name: '',
                        type: '',
                        delivering: '',
                        start: 'date',
                        end: 'date',
                        assignedCreatives: '',
                        pacingAndImpressions: '',
                        options: ''
                    },
                    headers: [
                        {name: '', id: 'checked'},
                        {name: 'PLACEMENT NAME', id: 'name'},
                        {name: 'TYPE', id: 'type'},
                        {name: 'DELIVERING', id: 'delivering'},
                        {name: 'START', id: 'start'},
                        {name: 'END', id: 'end'},
                        {name: 'ASSIGNED CREATIVES', id: 'assignedCreatives'},
                        {name: 'PACING & IMPRESSIONS', id: 'pacingAndImpressions'},
                        {name: 'OPTIONS', id: 'options'}
                    ],
                    data: [
                        {
                            checked: '<input type="checkbox" checked>',
                            name: 'AOD_Q2_EveryDay_Desktop_RichMedia_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'RM',
                            delivering: '<span class="icon-status success"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a><br /><a>RichMedia_Ad2_300x600</a>',
                            pacingAndImpressions: '<div pacing-chart class="meter-wrapper meter-sm"></div>',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_IBV_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'RM',
                            delivering: '<span class="icon-status success"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a>',
                            pacingAndImpressions: '<div pacing-chart class="meter-wrapper meter-sm"></div>',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_Instream_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'IS',
                            delivering: '<span class="icon-status"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a>',
                            pacingAndImpressions: '100,000 booked impressions',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_Instream_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'IS',
                            delivering: '<span class="icon-status"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a></a>',
                            pacingAndImpressions: '100,000 booked impressions',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        }
                    ]
                }
            },
            {
                header: '<input type="checkbox"> <a>MSN</a> 30 Placements 10 Live 1,234,567 of 3,000,000 impressions</div>',
                content: {
                    rules: {
                        checked: '',
                        name: '',
                        type: '',
                        delivering: '',
                        start: 'date',
                        end: 'date',
                        assignedCreatives: '',
                        pacingAndImpressions: '',
                        options: ''
                    },
                    headers: [
                        {name: '', id: 'checked'},
                        {name: 'PLACEMENT NAME', id: 'name'},
                        {name: 'TYPE', id: 'type'},
                        {name: 'DELIVERING', id: 'delivering'},
                        {name: 'START', id: 'start'},
                        {name: 'END', id: 'end'},
                        {name: 'ASSIGNED CREATIVES', id: 'assignedCreatives'},
                        {name: 'PACING & IMPRESSIONS', id: 'pacingAndImpressions'},
                        {name: 'OPTIONS', id: 'options'}
                    ],
                    data: [
                        {
                            checked: '<input type="checkbox" checked>',
                            name: 'AOD_Q2_EveryDay_Desktop_RichMedia_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'RM',
                            delivering: '<span class="icon-status success"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a><br /><a>RichMedia_Ad2_300x600</a>',
                            pacingAndImpressions: '<div pacing-chart class="meter-wrapper meter-sm"></div>',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_IBV_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'RM',
                            delivering: '<span class="icon-status success"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a>',
                            pacingAndImpressions: '<div pacing-chart class="meter-wrapper meter-sm"></div>',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_Instream_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'IS',
                            delivering: '<span class="icon-status"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a>',
                            pacingAndImpressions: '100,000 booked impressions',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        },
                        {
                            checked: '<input type="checkbox">',
                            name: 'AOD_Q2_EveryDay_Desktop_Instream_Private<br />Marketplace_Time Inc_ROS_160x600_1x1_clk<br />ID: a576-0058-fde8-09ea',
                            type: 'IS',
                            delivering: '<span class="icon-status"></span>',
                            start: '07/07/2014',
                            end: '08/20/2014',
                            assignedCreatives: '<a>RichMedia_Ad1_300x600</a></a>',
                            pacingAndImpressions: '100,000 booked impressions',
                            options: '<a><i class="glyph-icon glyph-tag"></i></a><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a>'
                        }
                    ]
                }
            }
        ];
    }]);
});
