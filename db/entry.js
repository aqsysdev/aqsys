//
//
// エントリーリストデータベース CRUD
//
//
const Decimal = require('decimal');
const knex = require('./knex'); // the connection!
const table = 'entrylist';
var config = {
  };

console.log("db/entry.js begin");

module.exports = {
  getAll() {
    return knex.withSchema(config.schemaname).from(table);
  },
  getOne(id) {
    return knex.withSchema(config.schemaname).from(table).where('id', id).first();
  },
  create(row) {
    return knex.withSchema(config.schemaname).from(table).insert(row, '*');
  },
  update(id, row) {
    return knex.withSchema(config.schemaname).from(table).where('id', id).update(row, '*');
  },
  delete(id) {
    return knex.withSchema(config.schemaname).from(table).where('id', id).del();
  },
  setConfig(argconfig) {
    console.log("entry setConfig:"+JSON.stringify(argconfig));
    config = argconfig;
  } ,
  getConfig() {
    return(config);
  },
  katakanaToHiragana,
  hiraganaToKatakana,
  calcAge,
  decodeRow
};


var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var sex={M:"男",F:"女"};

console.log("db/entry.js 1");
/** カタカナをひらがなに変換する関数
 * @param {String} src - カタカナ
 * @returns {String} - ひらがな
 */

function katakanaToHiragana(src) {
	return src.replace(/[\u30a1-\u30f6]/g, function(match) {
		var chr = match.charCodeAt(0) - 0x60;
		return String.fromCharCode(chr);
	});
}


/** ひらがなをカタカナに変換する関数
 * @param {String} src - ひらがな
 * @returns {String} - カタカナ
 */

function hiraganaToKatakana(src) {
	return src.replace(/[\u3041-\u3096]/g, function(match) {
		var chr = match.charCodeAt(0) + 0x60;
		return String.fromCharCode(chr);
	});
}

function calcAge(birthdate, targetdate) {
  	birthdate = birthdate.replace(/[/-]/g, "");
  	if (targetdate) {
  		targetdate = targetdate.replace(/[/-]/g, "");
  	} else {
  		var today = new Date();
  		targetdate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  	}
  	return (Math.floor((targetdate - birthdate) / 10000));
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
    ("00" + (time.getTime()||0)).slice(-2)
  );
}


function decodePrize(prize) {
  if( prize == null ) {
    return(null);
  }else if( prize=="" || isNaN(prize) || prize==0){
    return("");
  }else if( prize<0 ){
    return("-");
  }else{
    return(prize);
  }
}

function encodePrize(prize) {
  if(prize == null || prize == "") {
    return(0);
  }else if(!isNaN(prize) && prize>=0){
    return(prize);
  }else{
    return(-1);
  }
}

function decodeRow(row) {
    console.log("decodeRow:"+JSON.stringify(row));
    row.lname  = katakanaToHiragana((row.lname||"").replace(/　/g," ").trim().split(" ")[0]);
    row.myouji = (row.myouji||"").replace(/　/g," ").trim().split(" ")[0];
    row.fname  = katakanaToHiragana((row.fname||"").replace(/　/g," ").trim().split(" ").pop());
    row.namae  = (row.namae||"").replace(/　/g," ").trim().split(" ").pop();
    var birthday = row.birthday.toString().split(" ");
    row.birthday = ('0000'+birthday[3]).slice(-4)+"/"+
    ('00'+(months.indexOf(birthday[1],0)+1)).slice(-2)+"/"+
    ('00'+birthday[2]).slice(-2);
    row.grade = (row.grade && config.grades[row.grade]) ? config.grades[row.grade] : calcAge(row.birthday, config.basedate)+ "才";
    row.sex = sex[(row.sex||"M")] || sex.M ;
    row.zip1 = ('000'+(row.zip1)).slice(-3);
    row.zip2 = ('0000'+(row.zip2)).slice(-4);
    row.address1 = (row.address1||"").trim();
    row.address2 = (row.address2||"").trim();
    row.email = (row.email||"").trim() || "dummy@domain.com";
    row.lname2  = katakanaToHiragana((row.lname2||"").replace(/　/g," ").trim().split(" ")[0]);
    row.myouji2 = (row.myouji2||"").replace(/　/g," ").trim().split(" ")[0];
    row.fname2  = katakanaToHiragana((row.fname2||"").replace(/　/g," ").trim().split(" ").pop());
    row.namae2  = (row.namae2||"").replace(/　/g," ").trim().split(" ").pop();
    var birthday2 = (row.birthday2||"").toString().split(" ");
    row.birthday2 = row.birthday2 &&
      ('0000'+birthday2[3]).slice(-4)+"/"+
      ('00'+(months.indexOf(birthday2[1],0)+1)).slice(-2)+"/"+
      ('00'+birthday2[2]).slice(-2);
    row.sex2 = row.sex2 && sex[(row.sex2||"M")];
    row.regist = row.regist == true ? "checked" : "" ;
    row.start = row.start == true ? "checked" : "" ;
    row.confirmation = row.confirmation == true ? "checked" : "" ;
    row.cate = (row.cate&&config.cate[row.cate])?config.cate[row.cate]:"";
    row.wave = (row.wave || row.wave*1 != 0) ? ('00' + row.wave*1).slice(-2) : "";
    row.racenum = (row.racenum || row.racenum*1 != 0 )? ('000'+row.racenum*1).slice(-3) : "";
    if( row.DNF ) {
      row.ttime= "DNF";
    }else{
      row.ttime = reformTime(row.ttime);
    }
    row.prize1= decodePrize(row.prize1);
    row.prize2= decodePrize(row.prize2);
    row.prize3= decodePrize(row.prize3);
}



console.log("db/entry.js end");
