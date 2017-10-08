//
//
//   サーバー用表彰状印刷
//
//

console.log("routes/certificate begin");

var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');


// var pg = require('pg');

// include user functions
var user = require('../db/user');

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



router.post('/', function(req, res){
    console.log("post");
    console.log(JSON.parse(req.body.json));
    res.locals.print = 'success_msg';
    res.render('certificate',
      {
        certificates: JSON.parse(req.body.json).certificates.map( function(elm){
          return({
            myouji: elm.myouji,
            namae: elm.namae,
            tminute: elm.tminute,
            tsec: elm.tsec,
            tmilisec: elm.tmilisec
          });
        })
      }
    );
});

module.exports = router;
console.log("routes/certificate end");
