define(function (require) {
    'use strict';

    require('./creativesList');
    require('angularMocks');

    describe('creativesListCtrl', function () {
        var list, mockCreatives, httpBackend, state, scope;

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
                }
            },
            observe: function(callback) {
                callback();
            }
        };

        beforeEach(function () {
            module('app.campaign-management');

            spyOn(mockCreatives, 'observe').and.callThrough();

            inject(function ($controller, $httpBackend, $state, $rootScope) {
                httpBackend = $httpBackend;
                state = $state;
                state.params.filter = 'IBV';
                scope = $rootScope.$new();
                list = $controller('creativesListCtrl', {$scope: scope, creatives: mockCreatives});
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
                    {type: 'IBV'},
                    {type: 'IBV'}
                ]
            };

            expect(scope.creatives).toEqual(expected);
        });

    });
});
