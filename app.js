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

/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);
