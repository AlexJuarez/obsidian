'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var app = express();
var port = 3000;

/*
 * Use Handlebars for templating
 */
// For gzip compression
app.use(express.compress());

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
    // Locate the views
    app.use(express.static(__dirname + '/dist/views'));

    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    // Locate the views
    app.use(express.static(__dirname + '/views'));

    // Locate the assets
    app.use(express.static(__dirname + '/assets'));

    app.use(express.static(__dirname + '/app'));
    app.use(express.static(__dirname + '/build'));
    app.use(express.static(__dirname + '/components'));
}

app.get('/narwhal/accounts', function (req, res, next) {
    res.sendfile('assets/fixtures/accounts.json');
});
app.get('/narwhal/clients', function (req, res, next) {
    if (req.query.filters) {
        res.sendfile('assets/fixtures/clients_youworkon.json');
    } else {
        res.sendfile('assets/fixtures/clients.json');
    }
});
app.get('/narwhal/divisions', function (req, res, next) {
    res.sendfile('assets/fixtures/divisions.json');
});
app.get('/narwhal/campaigns', function (req, res, next) {
    res.sendfile('assets/fixtures/campaigns.json');
});
app.get('/narwhal/clientSet', function (req, res, next) {
    res.sendfile('assets/fixtures/clientSet.json');
});

/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);
