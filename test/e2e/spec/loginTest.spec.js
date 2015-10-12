var LoginPage = require('../pages/loginPage');

describe('New Ad Build by LMP Creative Producer', function () {

    it('will have no account ____', function(done) {
      var loginPage = new LoginPage('rawr','lulz');
      loginPage.loginToWebsite()
        .call(done);
    });

});
