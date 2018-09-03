//
//
//   サーバー用エントリーリスト操作javascript
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

console.log("routes/entry begin");

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

console.log("routes/entry2");

router.get('/', user.ensureAuthenticated, function(req, res){
  console.log('entry3');
  entry.getAll().then( function(entrylist) {
    console.log('entry4');
    console.log(entrylist);
    entrylist = entrylist.filter(function(row){
      return(!row.disabled);
    });
    for(var row of entrylist){
      entry.decodeRow(row);
    }
    console.log(entrylist);
    res.render('entry',{entrylist: entrylist});
//    done();
  });
});


module.exports = router;
console.log("routes/entry end");
