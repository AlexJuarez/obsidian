module.exports = function( app ) {
    app.post( "/narwhal/log", function( req, res ) {
        res.status( 200 ).end();
    } );
};
