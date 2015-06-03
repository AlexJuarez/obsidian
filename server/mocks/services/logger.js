module.exports = function( app ) {
    app.post( "/api/v3/log", function( req, res ) {
        res.status( 200 ).end();
    } );
};
