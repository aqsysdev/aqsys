//
//
//   サーバー用ナンバーカード印刷
//
//

console.log("routes/numbercards begin");

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
    res.render('numbercards',
      {
        numbercards: JSON.parse(req.body.json).numbercards.map( function(elm){
          return({
            racenum: elm.racenum,
            parsedRacenum: 1*elm.racenum,
            numbercardheader: config.numbercardheader,
            numbercardfooter: config.numbercardfooter
          });
        })
      }
    );
});

var config = {
  numbercardheader: "",
  numbercardfooter: ""
};

router.setConfig =function(argconfig) {
  config = argconfig;
};


module.exports = router;
console.log("routes/numbercards end");
