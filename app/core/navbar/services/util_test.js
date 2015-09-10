//jshint ignore:start

define(function (require) {
    'use strict';

    var utils = require('./util');
    require('angularMocks');

    describe('Navbar Utils', function () {
        it('should sort objects by name', function () {
            var data = [{name: 'b'}, {name: 'a'}, {name: null}];

            expect(utils.sortByName(data)).toEqual([{name: 'a'}, {name: 'b'}, {name: null}]);
        });

        it('should search and return the results for name', function () {
            var data = [{name: 'a'}, {name: 'b'}];
            var query = 'a';

            expect(utils.search(data, query)).toEqual([{name: 'a'}]);
        });

        it('should respect the max number of results', function () {
            var data = [{name: 'a'}, {name: 'ab'}];
            var query = 'a';
            var max = 1;

            expect(utils.search(data, query, max).length).toEqual(max);
        });

        it('should return no data for an empty query', function () {
            var data = [{name: 'a'}, {name: 'ab'}];
            var query = '';

            expect(utils.search(data, query)).toEqual([]);
        });

        it('should search by id', function () {
            var data = [{name: 'a', id: '1000'}, {name: 'ab', id: '1010'}];
            var query = '100';

            expect(utils.search(data, query)).toEqual([{name: 'a', id: '1000'}]);
        });

        it('should search by id', function () {
            var data = [{name: 'a', id: '1000'}, {name: 'ab', id: '1010'}];
            var query = '100';

            expect(utils.search(data, query)).toEqual([{name: 'a', id: '1000'}]);
        });

        it('should return alphabet map of the data', function () {
            var data = utils.sortByName([{'id':'divisionId0','name':'_0','pinned':true,'client':{'id':'clientId0'}},{'id':'divisionId1','name':null,'client':{'id':'clientId0'}},{'id':'divisionId1','name':'-1','client':{'id':'clientId0'}},{'id':'divisionId2','name':'Division 2','client':{'id':'clientId0'}},{'id':'divisionId3','name':'Division 3','client':{'id':'clientId0'}},{'id':'divisionId4','name':'Division 4','client':{'id':'clientId0'}}]);

            expect(utils.alphabetMap(data).length).toEqual(2);
            expect(utils.alphabetMap(data)[0].key).toEqual('#');
            expect(utils.alphabetMap(data)[1].key).toEqual('d');
        });

        it('should get the item by id', function () {
            var data = utils.sortByName([{'id':'divisionId0','name':'_0','pinned':true,'client':{'id':'clientId0'}},{'id':'divisionId1','name':null,'client':{'id':'clientId0'}},{'id':'divisionId1','name':'-1','client':{'id':'clientId0'}},{'id':'divisionId2','name':'Division 2','client':{'id':'clientId0'}},{'id':'divisionId3','name':'Division 3','client':{'id':'clientId0'}},{'id':'divisionId4','name':'Division 4','client':{'id':'clientId0'}}]);

            expect(utils.get(data, '')).toEqual();
        });

        it('January should be Q1', function () {
            var date = new Date('2015-01-20');
            expect( utils.getYearQuarter(date)).toEqual('2015 Q1');
        });

        it('March should be Q1', function () {
            var date = new Date('2015-03-20');
            expect( utils.getYearQuarter(date)).toEqual('2015 Q1');
        });

        it('April should be Q2', function () {
            var date = new Date('2015-04-20');
            expect( utils.getYearQuarter(date)).toEqual('2015 Q2');
        });

        it('June should be Q2', function () {
            var date = new Date('2015-06-20');
            expect( utils.getYearQuarter(date)).toEqual('2015 Q2');
        });

        it('July should be Q3', function () {
            var date = new Date('2015-07-20');
            expect( utils.getYearQuarter(date)).toEqual('2015 Q3');
        });

        it('September should be Q3', function () {
            var date = new Date('2015-09-20');
            expect( utils.getYearQuarter(date)).toEqual('2015 Q3');
        });

        it('October should be Q4', function () {
            var date = new Date('2015-10-20');
            expect( utils.getYearQuarter(date)).toEqual('2015 Q4');
        });

        it('December should be Q4', function () {
            var date = new Date('2015-12-20');
            expect( utils.getYearQuarter(date)).toEqual('2015 Q4');
        });
    });
});
