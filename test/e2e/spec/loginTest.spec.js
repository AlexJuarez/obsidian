var LoginPage = require('../pages/loginPage');
var DivisionPage = require('../pages/divisionPage'); 
var NavBar = require('../pages/navBar');

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
      var loginPage = new LoginPage('automated-tester-employee','b1xR5*h-D$#h@2(8aCm!V&');
      var navBar = new NavBar();
      loginPage.loginToWebsite()
        .click(navBar.clientDrop)
        .setValue(navBar.clientSearch, 'Cobal')
        .isExisting(navBar.clientResults).then(function (isExisting) {
          expect(isExisting).toBe(true);
        })
        .call(done);
    });

});
