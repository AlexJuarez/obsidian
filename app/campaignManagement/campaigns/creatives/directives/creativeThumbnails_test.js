/* globals spyOn */
define(function (require) {
    'use strict';

    require('./creativeThumbnails');
    require('angularMocks');

    var template = require('tpl!./creativeThumbnails.html');

    describe('creativeThumbnails', function () {
        var compile, state, rootScope, mockCreatives;

        mockCreatives = {
            all: function() {
                return {
                    headers: 'headers',
                    rules: 'rules',
                    data: [
                        {type: 'IBV'},
                        {type: 'RM'},
                        {type: 'IS'},
                        {type: 'IBV'}
                    ]
                };
            },
            observe: function(callback) {
                callback();
            }
        };

        beforeEach(function () {
            spyOn(mockCreatives, 'observe').and.callThrough();
            module('app.campaign-management', function($provide) {
                $provide.value('creatives', mockCreatives);
            });
        });

        beforeEach(inject(function ($compile, $state, $rootScope, $templateCache) {
            $templateCache.put('campaignManagement/campaigns/creatives/directives/creativeThumbnails.html', template);

            state = $state;
            compile = $compile;
            rootScope = $rootScope;
        }));

        function createThumbnails() {
            var parentScope = rootScope.$new();
            var html = compile('<div creative-thumbnails></div>')(parentScope);
            parentScope.$apply();

            return html.scope();
        }

        describe('controller', function () {

            it('should observe creatives', function() {
                createThumbnails();
                expect(mockCreatives.observe).toHaveBeenCalled();
            });

            it('should filter creatives by type based on state', function(){
                state.params.filter = 'IBV';
                var expected = [
                    {type: 'IBV'},
                    {type: 'IBV'}
                ];

                var scope = createThumbnails();

                expect(scope.creatives).toEqual(expected);
            });

            it('should return the proper studio URL', function() {
                var thumbnails = createThumbnails();
                var hostname;
                hostname = 'thorwhal-studio.mixpo.com';
                expect(thumbnails.getStudioUrl(hostname)).toEqual('//thorwhal-studio.mixpo.com');
                hostname = 'thorwhal.mixpo.com';
                expect(thumbnails.getStudioUrl(hostname)).toEqual('//thorwhal-studio.mixpo.com');
                hostname = 'studio.mixpo.com';
                expect(thumbnails.getStudioUrl(hostname)).toEqual('//studio.mixpo.com');
                hostname = 'other.com';
                expect(thumbnails.getStudioUrl(hostname)).toEqual('//studio.mixpo.com');
            });
        });
    });
});
