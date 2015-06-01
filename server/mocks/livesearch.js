module.exports = function (app) {
    app.get("/narwhal/livesearch/*", function (req, res) {
        res.send([]);
    });
};
