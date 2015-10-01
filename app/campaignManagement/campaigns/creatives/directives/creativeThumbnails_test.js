/* globals spyOn */
define(function (require) {
    'use strict';

    require('./creativeThumbnails');
    require('angularMocks');

    var template = require('tpl!./creativeThumbnails.html');

    describe('creativeThumbnails', function () {
        var compile, state, rootScope, mockCreatives, modal, window, records;

        mockCreatives = {
            all: function() {
                return {
                    headers: 'headers',
                    rules: 'rules',
                    data: [
                        {type: 'inBannerVideo'},
                        {type: 'richMedia'},
                        {type: 'inStream'},
                        {type: 'inBannerVideo'}
                    ]
                };
            },
            observe: function(callback) {
                callback();
            }
        };

        beforeEach(function () {
            spyOn(mockCreatives, 'observe').and.callThrough();

            module('app.campaign-management');

            module(function ($provide) {
                $provide.value('creatives', mockCreatives);
            });

            inject(function ($compile, $state, $rootScope, $templateCache, $modal, $window, creativeRecordService) {
                $templateCache.put('campaignManagement/campaigns/creatives/directives/creativeThumbnails.html', template);

                state = $state;
                compile = $compile;
                rootScope = $rootScope;
                modal = $modal;
                window = $window;
                records = creativeRecordService;
            });
        });

        function setUpScope() {
            var parentScope = rootScope.$new();
            var html = compile('<div creative-thumbnails></div>')(parentScope);
            parentScope.$apply();

            return html.isolateScope();
        }

        describe('controller', function () {
            it('should observe creatives', function () {
                setUpScope();
                expect(mockCreatives.observe).toHaveBeenCalled();
            });

            it('should filter creatives by type based on state', function (){
                state.params.filter = 'inBannerVideo';
                var expected = [
                    {type: 'inBannerVideo'},
                    {type: 'inBannerVideo'}
                ];

                var scope = setUpScope();

                expect(scope.creatives).toEqual(expected);
            });

            it('should open a modal with openSettings', function (){
                spyOn(modal, 'open').and.callFake(function (options) {
                    options.resolve.modalState();
                });

                var scope = setUpScope();

                scope.openSettings(1);
                scope.openSettings(1); //cover the else path case

                expect(modal.open).toHaveBeenCalled();
            });

            it('should open a preview page', function () {
                spyOn(window, 'open');

                var scope = setUpScope();

                scope.openPreviewPage({id: 1});

                expect(window.open).toHaveBeenCalled();
            });

            it('should open a studio page', function () {
                spyOn(window, 'open');

                var scope = setUpScope();

                scope.openStudio(1);

                expect(window.open).toHaveBeenCalled();
            });

            it('should update the filter on stateChange', function () {
                var scope = setUpScope();
                rootScope.$broadcast('$stateChangeSuccess', {}, { filter: 'test' });

                expect(scope.filter).toEqual('test');
            });

            it('should transform the creative Data', function () {
                var scope = setUpScope();
                var data = {
                    keywords: ['word1', 'word2']
                };

                expect(scope.transformCreativeData(data).keywords).toEqual('word1,word2');

                data = {
                    keywords: ['word1', 'word2'],
                    expandMode: 'test'
                };

                expect(scope.transformCreativeData(data).expandMode).toEqual('test');
            });

            it('should delete a creative', function () {
                var scope = setUpScope();
                spyOn(records, 'delete');

                scope.deleteCreative({ id: 1 });

                expect(records.delete).toHaveBeenCalled();
            });

            it('should create a creative', function () {
                var scope = setUpScope();
                spyOn(records, 'create').and.callThrough();
                spyOn(records, 'fetch').and.callFake(function () {
                    return {
                        then: function(fn) {
                            fn({
                                data: {
                                    id: 1,
                                    keywords: []
                                }
                            });
                        }
                    };
                });

                scope.copyCreative(1);

                expect(records.create).toHaveBeenCalled();
            });
        });
    });
});
