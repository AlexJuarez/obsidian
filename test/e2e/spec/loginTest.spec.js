var LoginPage = require('../pages/loginPage');
var DivisionPage = require('../pages/divisionPage'); 

// PAGE ELEMENTS
// Selectors:
// #  = id
// .  = class
// =  = contains specific text
// *= = contains partial text match
// xpath, css3 selectors also work.
//
describe('New Ad Build by LMP Creative Producer', function () {

    it('will have no account ____', function(done) {
      var loginPage = new LoginPage('rawr','lulz');
      loginPage.loginToWebsite()
        .call(done);
    });

});
