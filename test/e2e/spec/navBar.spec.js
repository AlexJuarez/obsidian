// PAGE ELEMENTS
// Selectors:
// #  = id
// .  = class
// =  = contains specific text
// *= = contains partial text match
// xpath, css3 selectors also work.
//

describe('navBar', function () {

    it('will be loaded', function(){
        browser
            .url('https://thorwhal-dev-api.mixpo.com/campaign-management')
            .validateNavBar();
    });

//
//  it('will log in as employee', function (done) {
//    browser.login()
//    .call(done);
//  });
//
//  it('will have client Cobalt via partial search', function(done) {
//    browser
//    .searchClient('Cob','Cobalt')
//    .call(done);
//  });
//
//  it('will have division Florence Times via partial search', function(done) {
//    browser
//    .searchDivision('Florence','Florence Times')
//    .call(done);
//  });
//
//  it('will have account act_sf_napoli via partial search', function(done) {
//    browser
//    .searchAccount('act_sf_nap','act_sf_napoli')
//    .call(done);
//  });
//
//  it('will have campaign celino via partial search', function(done) {
//      browser
//      .searchCampaign('Test (Do','Test (Do not alter)')
//        .call(done);
//  });
//
//
});
