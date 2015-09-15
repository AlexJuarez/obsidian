var initFilter = function(client) {
    //The first 3 args are node karma start
    var args = process.argv.slice(3);

    args.some(function(v, i) {
        if (v.indexOf('filter') > -1 &&
            i + 1 < args.length) {
            client.filter = args[i+1];
            return true;
        }
    });
};

initFilter.$inject = ['config.client'];

module.exports = {
    'framework:filter': ['factory', initFilter]
};
