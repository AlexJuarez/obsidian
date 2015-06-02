/**
 * If the --proxy flag is set, this server will attempt to proxy requests
 * to the address specified when the url matches the  API prefix. If the
 * request to the proxy API returns a 404, this server falls back to mock data.
 **/

var url = require("url");
var getAuth = require("./getAuth");

var proxyServer = getProxyServer();
var cookies = {};

if (proxyServer) {
    var proxyUrl = url.parse(proxyServer);
    // Get authentication for use with the proxy server API
    getAuth({url: proxyUrl.protocol + "//" + proxyUrl.host + "/account/signin"}, cookies);
}

module.exports = function (app) {

    var globSync = require("glob").sync;
    var bodyParser = require("body-parser");
    var mocks = globSync("./mocks/**/*.js", {cwd: __dirname}).map(require);
    var attemptProxy = require("./attemptProxy");

    if (proxyServer) {

        // Attempt to proxy to a production server. If the server 404s, fall back
        // to the mock data
        app.use(apiPrefix, attemptProxy(
            {url: proxyServer},
            cookies
        ));
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(require("connect-restreamer")());

    mocks.forEach(function (route) {
        route(app);
    });
};

function getProxyServer() {
    for (var i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === "--proxy") {
            if (process.argv.length >= i + 1) {

                var nextArg = process.argv[i + 1];
                if (nextArg && nextArg.indexOf('http') > -1) {
                    return nextArg;
                } else {

                    // Default if no server is set
                    return "https://thor-studio.mixpo.com";
                }
            }
        }
    }
    return undefined;
}
