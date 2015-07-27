define(function(require) {
    'use strict';

    require('./campaignsFilter');
    require('angularMocks');

    describe('campaignsFilter', function() {
        var filter, state;

        beforeEach(function() {
            module('app.campaign-management');
            inject(function(campaignsFilter, $state) {
                filter = campaignsFilter;
                state = $state;
            });
        });

        it('should return an empty object', function() {
            expect(filter()).toEqual([]);
        });

        it('should return &filters=division.id:eq:division1', function() {
            state.params.divisionId = 'division1';
            expect(filter()).toEqual(['division.id:eq:division1']);
        });

        it('should return &filters=account.id:eq:account1', function() {
            state.params.accountId = 'account1';
            expect(filter()).toEqual(['account.id:eq:account1']);
        });

        it('should add just the optional filter', function() {
            expect(filter('test')).toEqual(['test']);
        });

        it('should properly handle a state param and a option', function() {
            state.params.clientId = 'clientId1';
            expect(filter('test')).toEqual(['client.id:eq:clientId1', 'test']);
        });
    });
});
