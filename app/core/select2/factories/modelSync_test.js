define(function(require){
    'use strict';

    require('./modelSync');
    require('angularMocks');

    var ng = require('angular');

    describe('modelSync', function() {
        var sync, ngModel, scope, value;

        describe('ngModel', function() {
            beforeEach(function() {
                module('app.core');

                inject(function(modelSyncFactory, $compile, $rootScope) {
                    var element = ng.element('<form name="form"><select name="selector" ng-model="select"><option value="1">option</option></select></form>');
                    scope = $rootScope.$new();
                    scope.select = '';

                    $compile(element)(scope);
                    scope.$digest();

                    ngModel = scope.form.selector;
                    sync = modelSyncFactory(ngModel);
                });
            });

            it('should get the viewValue', function() {
                expect(sync.get()).toEqual('');
            });

            it('should get the updated viewValue', function() {
                expect(sync.get()).toEqual('');
                ngModel.$setViewValue('test');
                scope.$digest();
                expect(sync.get()).toEqual('test');
            });
        });

        describe('getterSetter', function() {
            beforeEach(function() {
                module('app.core');

                inject(function(modelSyncFactory, $compile, $rootScope) {
                    var element = ng.element('<form name="form"><select name="selector" ng-model="select" ng-model-options="{ getterSetter: true }"><option value="1">option</option></select></form>');
                    scope = $rootScope.$new();
                    scope.select = function(newvalue) {
                        return arguments.length ? (value = newvalue) : value;
                    };

                    $compile(element)(scope);
                    scope.$digest();

                    ngModel = scope.form.selector;
                    sync = modelSyncFactory(ngModel);
                });
            });

            it('should get the viewValue', function() {
                value = '';
                scope.$digest();
                expect(sync.get()).toEqual('');
                value = 'test';
                scope.$digest();
                expect(sync.get()).toEqual('test');
            });
        });
    });
});
