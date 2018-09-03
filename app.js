//
//
//  Aquathlon System (aqsys) アプリケーションサーバ用メインプログラム
//
//

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var app = express();
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

console.log('here1');


// include user unctions
//var entry = require('./entry');

console.log('here2');
//
//var mongoUri='mongodb://localhost/loginapp';

const environment = process.env.NODE_ENV || 'development';
const config = require('./mongoconfig');
console.log("environment:" +environment);
console.log("config:" +config);

var mongoUri=config[environment].connection;
console.log("mongoUri:"+mongoUri);

mongoose.connect(mongoUri).then(function(){
  console.log("mongoDB connected");
}).catch(function(err){
  console.log("mongoDB connection error:"+err);
});

var loginappdb = mongoose.connection;

console.log('here3');

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

console.log('here4');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

console.log('here5');


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
          root    = namespace.shift(),
          formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var dbRecord = require('./db/record');
var dbEntry = require('./db/entry');
var dbWaves = require('./db/waves');
var dbUser = require('./db/user');

var routes = require('./routes/index');
var users  = require('./routes/users');
var entry  = require('./routes/entry');
var waves = require('./routes/waves');
var record = require('./routes/record');
var punch  = require('./routes/record/punch');
var QRread  = require('./routes/record/qrread');
var numbercards  = require('./routes/numbercards');
var prize  = require('./routes/prize');
var certificate  = require('./routes/certificate');
var entrylist = require('./api/entry');
var recordlist = require('./api/record');
var waveslist = require('./api/waves');
//var printcard = require('./api/printcard');

app.use(flash());


// Connect Flash

// Global Vars
app.use(function (req, res, next) {

  res.locals = {
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
    error: req.flash('error'),
    name: (req.user && req.user.name) || null,
    user: (req.user && req.user.username) || null,
    schemaname: (req.user && req.user.schemaname) || null,
    basedate: (req.user && req.user.basedate) || dbUser.getConfig().basedate,
    numbercardheader: (req.user && req.user.numbercardheader) || dbUser.getConfig().numbercardheader || "",
    numbercardfooter: (req.user && req.user.numbercardfooter) || dbUser.getConfig().numbercardfooter || "",
    grades: (req.user && req.user.grades) || [],
    cate: (req.user && req.user.cate) || [],
    useradmin: (req.user && (req.user.username=="aqsysadmin"))
  };


  if(!Array.isArray(res.locals.grades) || res.locals.grades.length<=1){
    res.locals.grades = dbUser.getConfig().grades;
  }
  if(!Array.isArray(res.locals.cate) || res.locals.cate.length<=1){
    res.locals.cate = dbUser.getConfig().cate;
  }
  res.locals.gradesString=res.locals.grades.join(",");
  res.locals.cateString=res.locals.cate.join(",");

  console.log("setConfig begin");
  console.log("res.locals.grades:"+res.locals.grades);
  console.log("res.locals.gradesString:"+res.locals.gradesString);
  console.log("res.locals.cate:"+res.locals.cate);
  console.log("res.locals.cateString:"+res.locals.cateString);
  var config={
    schemaname: res.locals.schemaname,
    basedate: res.locals.basedate,
    numbercardheader: res.locals.numbercardheader,
    numbercardfooter: res.locals.numbercardfooter,
    grades: res.locals.grades,
    gradesString: res.locals.gradesString,
    cate: res.locals.cate,
    cateString: res.locals.cateString,
  };

  dbRecord.setConfig(config);
  dbEntry.setConfig(config);
  dbWaves.setConfig(config);
  numbercards.setConfig(config);

  console.log("config.schemaname:"+config.schemaname);
  console.log("config.numbercardheader:"+config.numbercardheader);
  console.log("setConfig end");
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/entry', entry);
app.use('/waves', waves);
app.use('/record', record);
app.use('/record/punch', punch);
app.use('/record/qrread', QRread);
app.use('/numbercards', numbercards);
app.use('/prize', prize);
app.use('/certificate', certificate);
app.use('/api/entry', entrylist);
app.use('/api/record', recordlist);
app.use('/api/waves', waveslist);
//app.use('/api/printcard', printcard);

//app.listen(process.env.PORT || 3000, function(){
//  console.log("Express server listening on port %d in %s mode", //this.address().port, app.settings.env);
//});

console.log('mod_socket end');


var PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = app
//    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));


const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });

const url = require('url');
//接続確立時の処理

wss.on('connection', (ws, req) => {
  console.log("Client connected");
  ws.onmessage = function (event) {
    console.log("message");
    var data=JSON.parse(event.data);
    if(data.type=="punchConnect") {
      ws.tnum = data.tnum ;
    }else if(data.type=="punch") {
      wss.clients.forEach((client) => {
        if(client.tnum==data.tnum) {
          client.send(JSON.stringify(data));
        }
      });
    }else if(data.type=="punchBreath") {
//      ws.send(JSON.stringify(data));
      console.log("punchBreath");
    }
    console.log("end");
  };

  // 切断したときに送信
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({
      type: "punchBreath"
    }));
    console.log("send punchBreath");
  });
}, 30000);

console.log('mod_socket end');
console.log('here7');
