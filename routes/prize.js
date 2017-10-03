//
//
//   サーバー用表彰操作javascript
//
//

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

console.log("routes/prize begin");

// var pg = require('pg');

// include user functions
var user = require('../db/user');
var entry = require('../db/entry');

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

console.log("routes/prize 2");

router.get('/', user.ensureAuthenticated, function(req, res){
  console.log('entry3');
  entry.getAll().then( function(entrylist) {
    entrylist = entrylist.filter(function(row){
      return(!row.disabled);
    });
    for(var row of entrylist){
      entry.decodeRow(row);
    }
    var prizelist = entrylist.filter(function(row){
      return(row.start) ;
    }).map(function(row) {return({
      id: row.id,
      lname: row.lname,
      fname: row.fname,
      myouji: row.myouji,
      namae: row.namae,
      grade: row.grade,
      sex: row.sex,
      zip1: row.zip1,
      zip2: "",
      address1: row.address1,
      address2: row.address2,
      lname2: row.lname2,
      fname2: row.fname2,
      myouji2: row.myouji2,
      namae2: row.namae2,
      sex2: row.sex2,
      racenum: row.racenum,
      cate: row.cate,
      wave: row.wave,
      disabled: row.disabled,
      ttime: row.ttime,
      prize1: row.prize1,
      prize2: row.prize2,
      prize3: row.prize3
    });});
        // console.log(entrylist);
    res.render('prize',{prizelist: prizelist});
//    done();
  });
});


module.exports = router;
console.log("routes/prize end");
