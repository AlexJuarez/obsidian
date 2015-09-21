define(function(require){
    'use strict';

    require('./navbar');
    require('angularMocks');

    var ng = require('angular');

    describe('navbar', function() {
        var state, rootScope, compile, scope, el;

        beforeEach(function () {
            module('app.core');

            inject(function($state, $rootScope, $compile, $templateCache) {
                state = $state;
                rootScope = $rootScope;
                compile = $compile;

                $templateCache.put('core/navbar/navbar.html', '<div></div>');
            });

            el = ng.element('<div navbar>');
            var compiled = compile(el)(rootScope.$new());
            rootScope.$digest();
            scope = compiled.isolateScope();
        });

        describe('transition', function() {
            var args, includes = false;

            beforeEach(function() {
                spyOn(state, 'includes').and.callFake(function() { return includes; });
                spyOn(state, 'go').and.callFake(function() {
                    args = [].slice.call(arguments);
                });
            });

            afterEach(function() {
                expect(state.includes).toHaveBeenCalled();
            });

            it('should set clientId', function() {
                state.params.clientId = 1;
                scope.transition('cm');
                expect(args[1].clientId).toEqual(1);
                expect(state.go).toHaveBeenCalled();
            });

            it('should set divisionId', function() {
                state.params.divisionId = 1;
                scope.transition('cm');
                expect(args[1].divisionId).toEqual(1);
                expect(state.go).toHaveBeenCalled();
            });

            it('should set accountId', function() {
                state.params.accountId = 1;
                scope.transition('cm');
                expect(args[1].accountId).toEqual(1);
                expect(state.go).toHaveBeenCalled();
            });

            it('should set campaignId', function() {
                state.params.campaignId = 1;
                scope.transition('cm');
                expect(args[1].campaignId).toEqual(1);
                expect(state.go).toHaveBeenCalled();
            });

            it('should just transition to the area', function() {
                scope.transition('cm');
                expect(args[0]).toEqual('cm');
                expect(state.go).toHaveBeenCalled();
            });

            it('should not change areas', function() {
                includes = true;
                scope.transition('cm');
            });
        });

        it('should close the navbar when the state changes', function() {
            scope.open = true;
            rootScope.$broadcast('$stateChangeSuccess');
            expect(scope.open).toEqual(false);
        });
    });
});
