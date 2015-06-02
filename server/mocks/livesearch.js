module.exports = function (app) {
    app.get("/api/v3/livesearch/*", function (req, res) {
        res.send([]);
    });
};
