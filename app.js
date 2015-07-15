'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var server = require('./server/index');
var compression = require('compression');
var app = express();
var port = 3000;

// For gzip compression
app.use(compression());

app.engine('.html', require('ejs').__express);

app.set('view engine', 'html');

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {

    //Set up the views
    app.set('views', __dirname + '/dist/views');

    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {

    //Set up the views
    app.set('views', __dirname + '/views');
    // Locate the assets
    app.use(express.static(__dirname + '/assets'));

    app.use(express.static(__dirname + '/app'));
    app.use(express.static(__dirname + '/build'));
    app.use(express.static(__dirname + '/components'));
}

app.get('/core', function(req, res) {
    res.render('core');
});

app.get('/', function(req, res) {
    res.render('index',
        { production: (process.env.NODE_ENV === 'production') }
    );
});

server(app);
/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);
