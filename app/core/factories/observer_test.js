define(function (require) {
    'use strict';

    require('./observer');
    require('angularMocks');

    describe('observerFactory', function() {
        var observers, scope, log, timeout, rootScope;

        beforeEach(function () {
            module('app.core');

            inject(function (observerFactory, $rootScope, $log, $timeout) {
                observers = observerFactory();
                scope = $rootScope.$new();
                log = $log;
                timeout = $timeout;
                rootScope = $rootScope;
            });
        });

        it('should call a callback', function() {
            var called = 0;
            spyOn(log, 'warn');
            spyOn(rootScope, '$apply');

            var id = observers.observe(function() {
                called++;
            }, scope);

            expect(called).toEqual(1);

            observers.observe(1);

            expect(log.warn).toHaveBeenCalled();

            observers.notifyObservers();

            timeout.flush();

            expect(rootScope.$apply).toHaveBeenCalled();

            expect(called).toEqual(2);

            scope.$destroy();

            observers.notifyObservers();

            expect(called).toEqual(2);
        });

    });
});
