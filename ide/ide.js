var express = require("express"),
    bodyParser = require("body-parser");
var mongoose = require( "mongoose" );
var router = express.Router({ mergeParams: true });
var exec = require('exec');
var fs  = require('fs');
var php = require('exec-php');
var tmp = require('tmp');
require( 'dotenv' ).config();
var db = require( '../db' );
//let ruby = require('ruby');
var cmd=require('node-cmd');
//var Builder = require('opal-compiler').Builder;
  var exec = require('child_process').exec
const {c, cpp, node, python, java} = require('compile-run');
let r = Math.random().toString(36).substring(7);
console.log(r);
var dir = './'+r;
console.log(dir);

console.oldLog = console.log;
console.log = function(value)
{
console.oldLog(value);
return value;
};
//SCHEMA
var ide = require("./ide");


//COMPILEX
var compiler = require('compilex');
var options = { stats: true }; //prints stats on console
compiler.init(options);

//WEBCAM ACCESS
// var multer = require( "multer" ),
//   cloudinary = require( "cloudinary" );
// var photoSchema = new mongoose.Schema( {
//   image_url: { type: String }
// } );
// var Photo = mongoose.model( "Photo", photoSchema );
// const storage = multer.diskStorage( {
//   filename: function ( req, file, callback ) {
//     callback( null, Date.now() );
//   }
// } );
//
// const upload = multer( { storage: storage } )
//
//
// cloudinary.config( {
//   cloud_name: 'djzrabi2t',
//   api_key: '624819612224452',
//   api_secret: 'joASjiyDbCcPswiWCBEtg4ESZVU'
// } );


// router.get( "/photos", ( req, res ) => {
//   res.render( "photo" );
// } );

// router.post( "/photos", upload.single( 'image' ), ( req, res ) => {
//
// } );


router.get("/ide",function(req,res){
    res.render("home");
});
// router.post( "/photos", upload.single( 'image' ), function(req,res){
//   cloudinary.v2.uploader.upload( req.body.image, function ( err, result ) {
//     if ( err ) {
//       console.log( err );
//     } else {
//       var image_url = result.secure_url;
//       var text = {
//         image_url: image_url
//       }
//       Photo.create( text, function ( err, newPhoto ) {
//         if ( err ) {
//           console.log( err );
//         }
//         else {
//           console.log( text );
//           console.log( image_url );
//           // res.redirect("/photos");
//         }
//       } );
//     }
//
//   } );
  router.post("/photos",(req,res)=>{
  var x =  req.body.input1;
  var lang= req.body.optradio;
  const sourcecode = req.body.input1;
if (req.body.submit === "Submit Code") {
  cmd.get(
  `
      rm -r `+r+`
  `,
  function(err, data, stderr){
      if (!err) {
         console.log(data);
      } else {
         console.log('error', err)
      }

  }
);
    var newide = { code: sourcecode, language: lang };
    ide.create(newide, function (err, n_ide) {
      if (err)
        console.log(err);
      else {
        res.send(n_ide);
      }
    });
  }else{
  var y;
  switch(lang){
   case "Node": console.log(typeof (x));
                 y = eval(x);
                res.render("home",{y:y});
                //res.status(200).json({ output: y });
    break;
   case "Python":
                 y = python.runSource(sourcecode);//,executionPath:'/home/dhanu/anaconda3/bin/python3.6'
                y
                  .then(result => {
                    console.log(result);

                     res.render("home",{y:result.stdout});
                    //res.render("home",{y:result.stdout,err:result.stderr});
                    res.status(200).json({ output: y });
                  })
                  .catch(err => {
                    console.log(err);

                  });
     break;
   case "Cplus":  y = cpp.runSource(sourcecode);//,executionPath:'/home/dhanu/anaconda3/bin/python3.6'
                y
                  .then(result => {
                    console.log(result);

                    //  res.render("home",{y:result.stdout});
                    res.render("home",{y:result.stdout,err:result.stderr});
                  //  res.status(200).json({ output: y });
                  })
                  .catch(err => {
                    console.log(err);

                  });
     break;
   case "C":  y = c.runSource(sourcecode);//,executionPath:'/home/dhanu/anaconda3/bin/python3.6'
                y
                  .then(result => {
                    console.log(result);

                    //res.render("home",{y:result.stdout,err:result.stderr});
                    res.render("home",{y:result.stdout,err:result.stderr});
                    //res.status(200).json({ output: y });
                  })
                  .catch(err => {
                    console.log(err);

                  });
     break;
   case "Java":

      if ( !fs.existsSync( dir ) ) {
        fs.mkdirSync( dir );
      }
     fs.writeFile('./'+dir+'/main.java', sourcecode,function (err) {
                  if (err) throw err;
else{
                  console.log('saved');
                  cmd.get(
                  `
                      cd `+r+`
                      ls
                      javac main.java
                      java main
                  `,
                  function(err, data, stderr){
                      if (!err) {
                         console.log(data);
                         res.status(200).json({y:data});
                      } else {
                         console.log('error', err)
                      }

                  }
              );}
                });



     break;
   case "Php": fs.writeFile('hello.php', sourcecode, function (err) {
                if (err) throw err;
                console.log('saved');
              });

                php("../hello.php", function (err, php1, outprint) {
                  console.log(outprint);
                  res.render("home", { y: outprint });
                });
     break;
   case "Go": fs.writeFile('hello.go', sourcecode, function (err) {
                    if (err) throw err;
                    console.log('saved');
                  });
                    cmd.get(
                      'go run hello.go',
                      function (err, data, stderr) {
                        console.log(data);

                         res.render("home",{y:data});
                        //res.status(200).json({ output: data });
                      }

                    )


     break;
   case "Ruby": fs.writeFile('main.rb', sourcecode, function (err) {
                if (err) throw err;
                console.log('saved');
              });
                cmd.get(
                  'ruby main.rb',
                  function (err, data, stderr) {
                    console.log(data);
                    res.status(200).json({ output: data });
                  }
                )
     break;
   case "Kotlin":
     break;
 }}
});


module.exports = router;
