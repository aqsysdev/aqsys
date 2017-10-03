//
//
// wave 設定データベース CRUD
//
//

const Decimal = require('decimal');
const knex = require('./knex'); // the connection!
const table = 'waves';
var config = {
  schemaname: 'aqsyssample',
  basedate: '2017/12/31'
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
    var fromTimeSplit = (fromTime+"").split(/[:.]/);
    var toTimeSplit = (toTime+"").split(/[:.]/);
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
    var milisec=calcTime(fromTime,toTime);
    return((milisec<0?"-":"")+formTime(Math.abs(milisec)));
}

function addTime(fromTime, toTime) {
  var fromTimeSplit = (fromTime+"").split(/[:.]/);
  var toTimeSplit = (toTime+"").split(/[:.]/);
  var milisec =
    (fromTimeSplit[0]||0)*100*60*60+
    (fromTimeSplit[1]||0)*100*60+
    (fromTimeSplit[2]||0)*100+
    (fromTimeSplit[3]||0)*1+
    (toTimeSplit[0]||0)*100*60*60+
    (toTimeSplit[1]||0)*100*60+
    (toTimeSplit[2]||0)*100+
    (toTimeSplit[3]||0)*1;
    return(formTime(milisec));
}

function formTime(ms) {
    var milisec=new Decimal(ms);
    return(
      ("00"+parseInt(milisec.div(60*60*100),0)%24).slice(-2)+":"+
      ("00"+parseInt(milisec.div(60*100),0)%60).slice(-2)+":"+
      ("00"+parseInt(milisec.div(100),0)%60).slice(-2)+"."+
      ("00"+parseInt(milisec%100,0)).slice(-2)
    );
}

function reformTime(ft) {
  if(ft){
    var ftime=ft.split(/[-:]/).reverse();
    var sec=parseInt(ftime[0]||0);
    var milisec=parseInt(Decimal.mul(ftime[0]||0,100)-sec*100);
    return(
      ("00"+(ftime[2]||0)).slice(-2)+":"+
      ("00"+(ftime[1]||0)).slice(-2)+":"+
      ("00"+(sec||0)).slice(-2)+"."+
      ("00"+(parseInt((milisec||0),0))).slice(-2)
    );
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
    ("00" + (parseInt((time.getTime()||0),0))).slice(-2)
  );
}

//console.log("db/waves.js end");
