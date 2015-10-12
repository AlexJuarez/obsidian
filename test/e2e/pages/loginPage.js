function loginPage (email, password){
  this._email = email;
  this._password = password;
}

var userField = '#account',
    passwordField = '#password';

loginPage.prototype.goToWebsite = function () {
    return browser.url('http://studio.mixpo.com', function () {
        console.log('went to http://studio.mixpo.com');
    })
    .getTitle(function (err, title) {
        expect(err).toBeFalsy();
        expect(title).toBe('Sign in to your Mixpo SmartVideo advertising account');
        console.log('made it to the mixpo homepage!');
    });
}

loginPage.prototype.loginToWebsite = function () {
    return this.goToWebsite()
        .getTitle(function (err, title) {
            expect(err).toBeFalsy();
            expect(title).toBe('Sign in to your Mixpo SmartVideo advertising account');
            console.log('checkin it twice!');
        })
        .setValue(userField, this._email)
        .setValue(passwordField, this._password)
        .click(passwordField)
        .keys('Enter')
        .getTitle(function (err, title) {
            expect(err).toBeFalsy();
            expect(title).not.toBe('Sign in to your Mixpo SmartVideo advertising account');
        });
}

module.exports = loginPage;
