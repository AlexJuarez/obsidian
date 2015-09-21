/* globals spyOn */
define(function (require) {
    'use strict';

    require('./../../../core/modal/index');
    require('./newEditCampaign');
    require('angularMocks');

    describe('newEditCampaignCtrl', function () {
        var mockAccounts, mockModalInstance, httpBackend, state, scope, controller, campaignRecords;

        mockAccounts = {
            filtered: function() {
                return [
                    { name: 'account' }
                ];
            },
            observe: function(callback) {
                callback();
            }
        };

        mockModalInstance = {
            dismiss: function() {}
        };

        function all(){
            return {id: 1, keywords: [], requireRepInfo: false};
        }

        beforeEach(function () {
            module('app.campaign-management');
            module('app.core');

            module(function($provide) {
                $provide.value('campaignRecordService', {
                    getById: function() {
                        return { then: function(fn) { fn({all: all}); }};
                    },
                    create: function() { return { then: function(fn) { fn({all: all}); }}; },
                    update: function() { return { then: function(fn) { fn({all: all}); }}; }
                });
                $provide.value('accountRecordService', {
                    getById: function() {
                        return { then: function(fn) {
                            fn({all: all});
                        }};
                    }
                });
                $provide.value('divisionRecordService', {
                    getById: function() {
                        return { then: function(fn) {
                            fn({all: all});
                        }};
                    }
                });
                $provide.value('clientRecordService', {
                    getById: function() {
                        return { then: function(fn) {
                            fn({all: all});
                        }};
                    }
                });

            });

            spyOn(mockAccounts, 'observe').and.callThrough();

            inject(function ($controller, $httpBackend, $state, $rootScope, campaignRecordService) {
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
                controller = $controller;
                campaignRecords = campaignRecordService;
            });
        });

        function setUp(modalState) {
            modalState = modalState || {};

            return controller('newEditCampaignCtrl',
                {
                    $scope: scope,
                    $modalInstance: mockModalInstance,
                    modalState: modalState,
                    accountService: mockAccounts
                }
            );
        }

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of newCampaignCtrl', function () {
            var newCampaign = setUp();
            expect(newCampaign).not.toEqual(null);
        });

        it('should observe accounts', function() {
            setUp();

            expect(mockAccounts.observe).toHaveBeenCalled();
        });

        it('should confirm closing and not close when false with unsaved changes', function() {
            setUp();

            spyOn(window, 'confirm').and.returnValue(false);
            spyOn(mockModalInstance, 'dismiss');
            scope.campaign.change = 'test';
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss.calls.any()).toEqual(false);
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should confirm closing and close when true with unsaved changes', function() {
            setUp();

            spyOn(window, 'confirm').and.returnValue(true);
            spyOn(mockModalInstance, 'dismiss');
            scope.campaign.change = 'test';
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss).toHaveBeenCalled();
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should just close when there are no changes', function() {
            setUp();

            spyOn(window, 'confirm');
            spyOn(mockModalInstance, 'dismiss');
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss).toHaveBeenCalled();
            expect(window.confirm.calls.any()).toEqual(false);
        });

        it('should submit', function() {
            setUp();

            scope.ok('errors');
            expect(scope.errors).toEqual('errors');
            expect(scope.submitted).toEqual(true);
        });

        it('should open a picker', function() {
            setUp();

            scope.datePickers = {
                'one': true,
                'two': false
            };
            var expected = {
                'one': false,
                'two': true
            };
            var event = new Event('test');
            scope.openPicker(event, 'two');
            expect(scope.datePickers).toEqual(expected);
        });

        describe('ok', function() {
            it('should work without errors', function() {
                setUp({ campaignId: 1 });

                scope.ok({});

                expect(scope.errors).toEqual({});
            });

            it('should update the campaign', function() {
                setUp({ campaignId: 1 });
                scope.campaign.name = 'New Name';
                spyOn(campaignRecords, 'update').and.callThrough();
                spyOn(mockModalInstance, 'dismiss');

                scope.ok({});

                expect(campaignRecords.update).toHaveBeenCalled();
                expect(mockModalInstance.dismiss).toHaveBeenCalled();
                expect(scope.errors).toEqual({});
            });

            it('should create the campaign', function() {
                setUp();
                scope.campaign.name = 'New Name';
                spyOn(campaignRecords, 'create').and.callThrough();
                spyOn(mockModalInstance, 'dismiss');

                scope.ok({});

                expect(campaignRecords.create).toHaveBeenCalled();
                expect(mockModalInstance.dismiss).toHaveBeenCalled();
                expect(scope.errors).toEqual({});
            });
        });

        it('should save the campaign on scope.$destroy', function() {
            var modalState = {
                campaign: { name: 'test' }
            };

            setUp(modalState);

            scope.campaign.other = 'test';

            scope.$destroy();

            expect(modalState.campaign.other).toEqual('test');
        });


    });
});
