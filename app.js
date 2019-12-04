var express = require('express');
var morgan = require('morgan');
var fs = require('fs');

var path = require('path');
var uuid = require('node-uuid');
var bodyParser = require("body-parser"),
    os = require( "os" );
const httpsLocalhost = require("https-localhost");
var app = express();
// var app = httpsLocalhost();
// var bodyParser = require('body-parser');
require('dotenv').config();
morgan.token('id', function getId(req) {
    if (req.headers['x-forwarded-for'] != undefined)
        return req.id + ": " + req.headers['x-forwarded-for']
    else
        return req.id + ": " + req.connection.remoteAddress;
})
const helmet = require( 'helmet' );

app.use( helmet.frameguard( {
    action: "allow-from",
    domain: "https://www.example.com"
} ) );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(assignId);

app.use(morgan(':id :method :url :response-time', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
        flags: 'a'
    })
}))

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())

var db = require('./db');
global.__root = __dirname + '/';

// app.get('/api', function (req, res) {
//   res.status(200).send('API works.');
// });

app.set( "view engine", "ejs" );
app.use( express.static( __dirname + "/public" ) )
console.log( typeof ( os.type() ) );
function assignId(req, res, next) {
    req.id = uuid.v1()
    next()
}

var RateLimit = require('express-rate-limit');

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

var apiLimiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    delayMs: 0 // disabled
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



// app.set("views", path.join(__dirname, "public/views"));

app.use('/api/', apiLimiter);

//User Controller with POST, GET, PUT methods
var registercontroller = require(__root + 'Register/registercontroller');
var jobpostcontroller = require(__root + 'jobpost/jobpostcontroller');
var ide = require(__root + 'ide/hcjs.js');
var proide = require(__root + 'ide/ide.js');




app.get("/",function (req,res) {
        res.render("index.ejs");
});
app.use('/register', registercontroller);
app.use('/job',jobpostcontroller);
app.use('/ide',ide);
app.use('/proide',proide);
app.listen(3000, (req, res) => {
    console.log('connected to port');

});

module.exports = app;
