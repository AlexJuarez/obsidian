define(function (require) {
    'use strict';

    require('./division');
    require('angularMocks');

    describe('divisionService', function () {
        var division, httpBackend;

        var divisions = [
            {
                'id': 'divisionId0',
                'name': 'Division 0',
                'pinned': true,
                'active': false,
                'lastViewed': '2015-01-01T12:00:00Z',
                'client': {'id': 'clientId0'}
            }
        ];

        beforeEach(function () {
            module('app.core');

            module(function ($provide) {
                $provide.value('$state', {
                    params: {
                        clientId: 'clientId0'
                    }
                });
            });

            inject(function (divisionService, $httpBackend) {
                division = divisionService;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of divisionService', function () {
            expect(division).not.toEqual(null);
        });

        it('should make a request on init', function () {
            httpBackend.when('GET', '/test')
                .respond({
                    'divisions': divisions
                });

            division.init('/test').then(function () {
                expect(division.all()).toEqual(divisions);
            });
            httpBackend.flush();
        });

        it('should pin an division', function () {
            division.setData(divisions);
            var a = division.all()[0];
            division.pin(a);
            expect(division.pinned().length).toEqual(1);
        });

        it('should unpin an division', function () {
            division.setData(divisions);
            var a = division.all()[0];
            division.pin(a);
            division.unpin(a);
            expect(division.pinned().length).toEqual(0);
        });

        it('should return a map containing a key of the first letter by name', function () {
            division.setData(divisions);
            expect(division.alphabetMap()).toEqual([{key: "d", value: [divisions[0]]}]);
        });

        it('should get an division by id', function () {
            division.setData(divisions);
            expect(division.get('divisionId0')).toEqual(divisions[0]);
        });

        it('should make a request to search', function () {
            division.setData(divisions);
            httpBackend.when('GET', '/narwhal/divisions/search?q=test&limit=5').respond(
                []
            );
            expect(division.search('test')).toEqual([]);
            httpBackend.flush();
        });
    });
});
