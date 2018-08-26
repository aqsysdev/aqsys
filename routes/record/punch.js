//
//
//   サーバー用記録操作javascript
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

// var pg = require('pg');

// include user functions
var user = require('../../db/user');
var record = require('../../db/record');
var seqnum = 0;


// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var recordlist=[];
router.get('/:tnum(\\d+)', user.ensureAuthenticated, function(req, res){
  record.getAll(req.params.tnum).then(recordlist => {
    console.log(recordlist);
    recordlist.forEach(
      function(row){record.decodeRow(row);}
    );
    console.log(recordlist.length);
    recordlist = recordlist.filter(function(row){
      return(!(row.disabled||(!row.racenum&&!row.ftime)));
    });
    seqnum = recordlist.lentgh; 
    console.log(seqnum);
    res.render('record/punch',{
      tnum: req.params.tnum,
      recordlist: recordlist,
      seqnum: seqnum
    });
  });
});

module.exports = router;
console.log("routes/record end");
