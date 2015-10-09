/* globals spyOn */
define(function (require) {
    'use strict';

    require('./creativesList');
    require('angularMocks');

    describe('creativesListCtrl', function () {
        var list, mockCreatives, httpBackend, state, scope, rootScope, enums;

        mockCreatives = {
            all: function() {
                return {
                    headers: 'headers',
                    rules: 'rules',
                    data: [
                        {type: 'In-Banner'},
                        {type: 'Rich Media'},
                        {type: 'In-Stream'},
                        {type: 'In-Banner'}
                    ]
                };
            },
            data: function() {
                return {
                    isLoaded: function() {
                        return true;
                    }
                };
            },
            observe: function(callback) {
                callback();
            }
        };

        beforeEach(function () {
            module('app.campaign-management');

            spyOn(mockCreatives, 'observe').and.callThrough();

            inject(function ($controller, $httpBackend, $state, $rootScope, ENUMS) {
                httpBackend = $httpBackend;
                state = $state;
                state.params.filter = 'inBannerVideo';
                scope = $rootScope.$new();
                rootScope = $rootScope;
                list = $controller('creativesListCtrl', {$scope: scope, creatives: mockCreatives});
                enums = ENUMS;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of creatiesList', function () {
            expect(list).not.toEqual(null);
        });

        it('should observe creatives', function() {
            expect(mockCreatives.observe).toHaveBeenCalled();
        });

        it('should set $scope.creatives appropriately for a filter', function() {
            var expected = {
                headers: 'headers',
                rules: 'rules',
                data: [
                    {type: 'In-Banner'},
                    {type: 'In-Banner'}
                ]
            };

            expect(scope.creatives).toEqual(expected);
        });

        it('should update the filter', function() {
            enums.up.creativeTypes.test = 'testup';
            rootScope.$broadcast('$stateChangeSuccess', 'newState', { filter: 'test' });

            expect(scope.filter).toEqual('testup');
        });

    });
});
