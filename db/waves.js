//
//
// wave 設定データベース CRUD
//
//

const Decimal = require('decimal');
const knex = require('./knex'); // the connection!
const table = 'waves';
var config = {
};

// console.log("db/waves.js begin");

module.exports = {
  getAll() {
    return knex.withSchema(config.schemaname).from(table);
  },
  getOne(wid) {
    return knex.withSchema(config.schemaname).from(table).where('wid', wid).first();
  },
  create(row) {
    return knex.withSchema(config.schemaname).from(table).insert(row, '*');
  },
  update(wid, row) {
    return knex.withSchema(config.schemaname).from(table).where('wid', wid).update(row, '*');
  },
  delete(wid) {
    return knex.withSchema(config.schemaname).from(table).where('wid', wid).del();
  },
  setConfig(argconfig) {
    config = argconfig;
  } ,
  getConfig(){
    return config;
  },
  decodeRow,
  encodeRow,
  calcTime,
  diffTime,
  addTime,
  formTime,
  reformTime,
  encodeTime,
};

function decodeRow(row) {
  if(row.disabled) {
    row.stime="";
  }else{
    row.stime=reformTime(row.stime);
  }
}

function encodeRow(row) {
  if(row.stime=="") {
    delete row.stime;
    row.disabled = true;
  }else{
    row.stime = reformTime(row.stime);
  }
  return true;
}

function calcTime(fromTime, toTime) {
    return(centisecTime(toTime)-centisecTime(fromTime));
}

function diffTime(fromTime, toTime) {
  var diffCentisec;
  diffCentisec = calcTime(fromTime,toTime);
  if(diffCentisec>=0) {
    return(formTime(diffCentisec));
  }else{
    return(formTime(diffCentisec+centisecTime("24:00:00.00")));
  }
}

function addTime(fromTime, toTime) {
    return(formTime(centisecTime(fromTime)+centisecTime(toTime)));
}

function formTime(cs) {
    var centisec=new Decimal(cs);
    return(
      ("00"+parseInt(centisec.div(60*60*100),0)%24).slice(-2)+":"+
      ("00"+parseInt(centisec.div(60*100),0)%60).slice(-2)+":"+
      ("00"+parseInt(centisec.div(100),0)%60).slice(-2)+"."+
      ("00"+parseInt(centisec%100,0)).slice(-2)
    );
}

function reformTime(ft) {
  if(ft){
    if(ft.indexOf(".")<0){
      ft="00"+ft+".00";
    }
    var ftime = (""+ft).split(/\D/);
    if(ftime[0].length>=6&&ftime[1]&&!ftime[3]) {
      return(reformTime(
        ftime[0].substr(-6,2)+":"+
        ftime[0].substr(-4,2)+":"+
        ftime[0].substr(-2,2)+"."+
        ftime[1].substr(0,2)
      ));
    }else{
      return(
        ("00"+(""+(ftime[0]||0))).slice(-2)+":"+
        ("00"+(""+(ftime[1]||0))).slice(-2)+":"+
        ("00"+(""+(ftime[2]||0))).slice(-2)+"."+
        (((ftime[3]||0)+"00").substring(0,2))
      );
    }
  } else {
    return(ft);
  }
}

function centisecTime(time) {
  var ft=time;
  if(ft.indexOf(".")<0){
    ft="00"+ft+".00";
  }
  var timeSplit = (ft+"").split(/\D/);
  return(
    (timeSplit[0]||0)*100*60*60+
    (timeSplit[1]||0)*100*60+
    (timeSplit[2]||0)*100+
    (timeSplit[3]||0)*1
  );
}

function encodeTime(time) {
  return(
//    ("0000"+(time.getFullYear()||0)).slice(-4)+"/"+
//    ("00" + (time.getMonth()+1)).slice(-2)+"/"+
//    ("00" + (time.getDate()||0)).slice(-2)+" "+
    ("00" + (time.getHours()||0)).slice(-2)+":"+
    ("00" + (time.getMinutes()||0)).slice(-2)+":"+
    ("00" + (time.getSeconds()||0)).slice(-2)+"."+
    ("000" + (time.getTime()||0)).slice(-3).slice(2)
  );
}

function decodeRacenum(racenum) {
  if( racenum == null ) {
    return(null);
  }else if( racenum!="" && racenum>=0){
    return(("000"+racenum).slice(-3));
  }else{
    return("");
  }
}


function encodeRacenum(racenum) {
  if(racenum == null) {
    return(null);
  }else if(racenum != null && racenum!="" && racenum>=0){
    return(("000"+racenum).slice(-3));
  }else{
    return(-1);
  }
}


//console.log("db/waves.js end");
