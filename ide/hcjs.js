var express = require( "express" ),
    mongoose = require( "mongoose" );
var router = express.Router( { mergeParams: true } );
require( 'dotenv' ).config();
var db = require( '../db' );

// mongoose.connect("mongodb://localhost:27017/ide", { useNewUrlParser: true });

var editorSchema = new mongoose.Schema( {
    html: String,
    css: String,
    js: String
} );

var Editor = mongoose.model( "Editor", editorSchema );

router.get( "/:id/hcjs", ( req, res ) => {
    res.render( "home2.ejs" );
} );

router.post( "/hcjs", ( req, res ) => {
    var text = {
        html: req.body.html,
        css: req.body.css,
        js: req.body.js
    }
    Editor.create( text, ( err, newText ) => {
        if ( err ) {
            console.log( err );
        }
        else {
            res.render( "home2" );
        }
    } );
} );

module.exports = router;
