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
      if(recordlist.length==0) {
        console.log("init the first row");
        record.create(recordNum,{
          racenum: -1,
          ftime: "00:00:00.00"
        }).then(function(recordlist) {
          app.get('/record', function (req, res) {
            res.send('/record');
          });
        }).catch(function(err) {
          console.log("create recodelist the first row error:"+err);
        });
      }
      for(var row of recordlist){
        record.decodeRow(row);
      }
      if(recordNum==0) {
        recordlist = recordlist.filter(function(row){
          return(!(row.disabled||(!row.racenum&&!row.ftime)));
        }).sort(function(a,b) {
          return(a.rid-b.rid);
        });
      }else{
        var firstRow=null;
        //console.log(recordlist.length);
        for(var i in recordlist) {
          //console.log(recordlist[i]);
          if(recordlist[i].rid==1){
            firstRow = recordlist[i];
            recordlist[i].disabled=false;
            recordlist.splice(i,1);
          }
        }
        //console.log(recordlist.length);
        recordlist = recordlist.filter(function(row){
          return(!(row.disabled||(!row.racenum&&!row.ftime)));
        });
        var startTime = (firstRow&&firstRow.ftime)||"00:00:00.00";
        //console.log(recordlist.length);
        recordlist=recordlist.sort(function(a,b) {
          return(record.calcTime(
            record.diffTime(startTime,b.ftime),
            record.diffTime(startTime,a.ftime)
          ));
        });
        //console.log(recordlist.length);
        // 先頭の行を戻す。
        if(firstRow) {
          recordlist.unshift(firstRow);
        }
        //console.log(recordlist.length);
      }
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
    //
    //  record0 のレコード数が足りなければ、予め作っておく
    //
    record.getAll(0)
    .then(function(record0) {
      console.log("record0.length:"+record0.length);
      console.log("recordTable.length:"+recordTable.length);
      var a;
      if(recordTable.length-record0.length>0){
        a = new Array( recordTable.length-record0.length );
        for (var i = 0 ; i< recordTable.length - record0.length; i++) {
          a[i] = i+record0.length;
        }
      }else{
        a =[];
      }
      console.log("a.length:"+a.length);
      Promise.all( a.map(function(rid){
        return(record.create(0,{racenum:-1}));
      }))
      .then(function(){
        recordTable.forEach(function(row,index){
          row.rid0=index+1;
        });
        res.render('record',{recordTable: recordTable});
      })
      .catch( function(err) {
        console.log("post record0 error:"+err);
      });
    })
    .catch( function(err) {
      console.log("get record0 error:"+err);
    });
  })
  .catch( function(err) {
    console.log("rendering recordlist error:"+err);
  });

});
module.exports = router;
console.log("routes/record end");
