//
//
// 記録データベース CRUD
//
//
const Decimal = require('decimal');
const knex = require('./knex'); // the connection!
const table = 'record';
var config = {
  schemaname: 'aqsyssample',
  basedate: '2017/12/31'
};

// console.log("db/record.js begin");

module.exports = {
  getAll(tNum) {
    return( knex.withSchema(config.schemaname).from(table+tNum));
  },
  getOne(tNum,rid) {
    return( knex.withSchema(config.schemaname).from(table+tNum).where('rid', rid).first());
  },
  create(tNum,row) {
//    console.log("create");
    return knex.withSchema(config.schemaname).from(table+tNum).insert(row, '*');
  },
  update(tNum,rid,row) {
    console.log("update");
    console.log(tNum);
    console.log(rid);
    console.log(row);
    return knex.withSchema(config.schemaname).from(table+tNum).where('rid', rid).update(row, '*');
  },
  delete(iNum,rid) {
    return knex.withSchema(config.schemaname).from(table+tNum).where('rid', rid).del();
  },
  setConfig(argconfig) {
    config = argconfig;
  } ,
  decodeRow,
  encodeRow,
  calcTime,
  diffTime,
  addTime,
  formTime,
  reformTime,
  encodeTime,
  decodeRacenum,
  encodeRacenum
};

function decodeRow(row) {
  if(row.disabled) {
    row.ftime="";
  }else{
    row.ftime=reformTime(row.ftime);
  }
  row.racenum = decodeRacenum(row.racenum);
}

function encodeRow(row) {
  if(row.ftime) {
    row.ftime = reformTime(row.ftime);
  }else{
    delete row.ftime;
    row.disabled = true;
  }
  if(row.racenum != undefined ) {
    row.racenum = encodeRacenum(row.racenum);
  }
  return true;
}

function calcTime(fromTime, toTime) {
    var fromTimeSplit = (fromTime+"").split(/\D/);
    var toTimeSplit = (toTime+"").split(/\D/);
    return(
      (toTimeSplit[0]||0)*100*60*60+
      (toTimeSplit[1]||0)*100*60+
      (toTimeSplit[2]||0)*100+
      (toTimeSplit[3]||0)*1-
      (fromTimeSplit[0]||0)*100*60*60-
      (fromTimeSplit[1]||0)*100*60-
      (fromTimeSplit[2]||0)*100-
      (fromTimeSplit[3]||0)*1
    );
}

function diffTime(fromTime, toTime) {
    return(formTime(calcTime(fromTime,toTime)));
}

function addTime(fromTime, toTime) {
  var fromTimeSplit = (fromTime+"").split(/\D/);
  var toTimeSplit = (toTime+"").split(/\D/);
  var centisec =
    (toTimeSplit[0]||0)*100*60*60+
    (toTimeSplit[1]||0)*100*60+
    (toTimeSplit[2]||0)*100+
    (toTimeSplit[3]||0)*1+
    (fromTimeSplit[0]||0)*100*60*60+
    (fromTimeSplit[1]||0)*100*60+
    (fromTimeSplit[2]||0)*100+
    (fromTimeSplit[3]||0)*1;
    return(formTime(centisec));
}

function formTime(ms) {
    var centisec=new Decimal(ms);
    return(
      ("00"+parseInt(centisec.div(60*60*100),0)%24).slice(-2)+":"+
      ("00"+parseInt(centisec.div(60*100),0)%60).slice(-2)+":"+
      ("00"+parseInt(centisec.div(100),0)%60).slice(-2)+"."+
      ("00"+parseInt(centisec%100,0)).slice(-2)
    );
}

function reformTime(ft) {
  console.log(ft);
  if(ft){
    if(ft.indexOf(".")<0){
      ft="00"+ft+".00";
    }
    var ftime = (""+ft).split(/\D/);
    console.log(ftime);
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

function encodeTime(time) {
  return(
    ("0000"+(time.getFullYear()||0)).slice(-4)+"/"+
    ("00" + (time.getMonth()+1)).slice(-2)+"/"+
    ("00" + (time.getDate()||0)).slice(-2)+" "+
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

//console.log("db/record.js end");
