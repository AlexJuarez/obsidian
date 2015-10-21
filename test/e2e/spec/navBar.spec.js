// PAGE ELEMENTS
// Selectors:
// #  = id
// .  = class
// =  = contains specific text
// *= = contains partial text match
// xpath, css3 selectors also work.
//
describe('New Ad Build by LMP Creative Producer', function () {

    it('will have client Cobalt via partial search', function(done) {
      browser
      .searchClient('Cob','Cobalt')
      .call(done);

    });
  
    it('will have division Florence Times via partial search', function(done) {
      browser
      .searchDivision('Florence','Florence Times')
      .call(done);
    });

    it('will have account act_sf_napoli via partial search', function(done) {
      browser
      .searchAccount('act_sf_nap','act_sf_napoli')
      .call(done);
    });

    it('will have campaign celino via partial search', function(done) {
      browser
      .searchCampaign('Test (Do','Test (Do not alter)')
      .call(done);
    });
    
});
