
// PAGE ELEMENTS
// Selectors:
// #  = id
// .  = class
// =  = contains specific text
// *= = contains partial text match
// xpath, css3 selectors also work.
//
describe('New Ad Build by LMP Creative Producer', function () {

    it('will have client Cobalt', function(done) {
      browser.login()
      .searchClient('Cob','Cobalt')
      .call(done);

    });
  
    it('will have division WTVZ', function(done) {
      browser
      .searchDivision('WTV','WTVZ')
      .call(done);
    });

    it('will have account apollo', function(done) {
      browser
      .searchAccount('apol','apollo')
      .call(done);
    });

    it('will have campaign celino', function(done) {
      browser
      .searchCampaign('celli','cellino')
      .call(done);
    });
    
});
