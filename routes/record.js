//
//
//   サーバー用記録リスト操作javascript
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
var user = require('../db/user');
var record = require('../db/record');

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var recordTable=[];
router.get('/', user.ensureAuthenticated, function(req, res){
  recordTable=[];
  Promise.all( [0,1,2,3,4].map(function(recordNum){
    return(record.getAll(recordNum)
    .then( function(recordlist) {
      for(var row of recordlist){
        record.decodeRow(row);
      }
      recordlist = recordlist.filter(function(row){
        return(!(row.disabled||(!row.racenum&&!row.ftime)));
      }).sort(function(a,b) {
        return(record.calcTime(b.ftime, a.ftime));
      });
      for(var seqnum in recordlist){
        row = recordlist[seqnum];
        if(recordTable[seqnum]==undefined){
          recordTable[seqnum] = {seqnum: seqnum*1};
        }
        recordTable[seqnum]["rid"+recordNum]=row.rid;
        recordTable[seqnum]["racenum"+recordNum]=row.racenum;
        recordTable[seqnum]["ftime"+recordNum]=row.ftime;
        if(seqnum==0){
          recordTable[seqnum]["dtime"+recordNum]=recordTable[seqnum]["ftime"+recordNum];
        }else{
          recordTable[seqnum]["dtime"+recordNum]=record.diffTime(recordTable[0]["ftime"+recordNum],row.ftime);
        }
      }
    })
    .catch( function(err) {
      console.log("read recordlist error:"+err);
    }));
  }))
  .then( function(){
    res.render('record',{recordTable: recordTable});
  })
  .catch( function(err) {
    console.log("rendering recordlist error:"+err);
  });

});
module.exports = router;
console.log("routes/record end");
