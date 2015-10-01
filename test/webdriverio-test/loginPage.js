var LoginPage = (function() {

    var userField = '#account',
        passwordField = '#password';
     //   loginButton = '#signbutton';

    var LoginPage = {
        goToWebsite: function() {
            browser
                .url('http://studio.mixpo.com', function() {
                    console.log('went to http://somewebsite.com');
                });
        },

        setEmail: function(strEmail) {
            browser
                .setValue(userField, strEmail, function() {
                    console.log('set email');
                });
        },

        setPassword: function(strPassword) {
            browser
                .setValue(passwordInput, strPassword, function() {
                    console.log('set password');
                });
        },

        loginToWebsite: function(strEmail, strPassword) {
            LoginPage.goToWebsite()
            .setEmail(strEmail)
            .setPassword(strPassword)
            .client.click(passwordField)
	    .client.keys('Enter');
        }
    };

    return LoginPage;

});
