//
//
//   サーバー用 wave 設定　javascript
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
var waves = require('../db/waves');

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var wavesList;
router.get('/', user.ensureAuthenticated, function(req, res){
  waves.getAll().then( function(wavesList) {
    var valid=false;
    wavesList.forEach(function(row){
      waves.decodeRow(row);
    });
    wavesList=wavesList.sort(function(a,b) {
      return(b.wid-a.wid);
    }).filter(function(row){
      return(valid = valid || !(row.disabled||(!row.stime)));
    }).reverse();
    var lastStime="";
    for(var index in wavesList){
      if(wavesList[index].stime) {
        if(lastStime) {
          wavesList[index].dtime=waves.diffTime(lastStime,wavesList[index].stime);
        }else{
          wavesList[index].dtime="00:00:00.00";
        }
        lastStime=wavesList[index].stime;
      }else{
        wavesList[index].dtime="";
      }
    }
        // console.log(entrylist);
    res.render('waves',{wavesList: wavesList});
//    done();
  });
});
module.exports = router;
console.log("routes/waves end");
