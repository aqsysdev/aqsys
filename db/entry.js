//
//
// エントリーリストデータベース CRUD
//
//
const Decimal = require('decimal');
const knex = require('./knex'); // the connection!
const table = 'entrylist';
const monthsArray =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const sexList ={M:"男",F:"女"};

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
//    console.log("entry setConfig:"+JSON.stringify(argconfig));
    config = argconfig;
  } ,
  getConfig() {
    return(config);
  },
  katakanaToHiragana,
  hiraganaToKatakana,
  calcAge,
  formTime,
  reformTime,
  encodeTime,
  decodePrize, encodePrize,
  decodeRow,
  decodeLname,
  decodeMyouji,
  decodeFname,
  decodeNamae,
  decodeBirthday,
  decodeGrade,
  decodeSex,
  decodeZip1,
  decodeZip2,
  decodeAddress1,
  decodeAddress2,
  decodeEmail,
  decodeLname2,
  decodeMyouji2,
  decodeFname2,
  decodeNamae2,
  decodeBirthday2,
  decodeSex2,
  decodeRegist,
  decodeStart,
  decodeConfirmation,
  decodeCate,
  decodeWave,
  decodeRacenum,  encodeRacenum,
  decodeTtime,
  decodePrize
};


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
//    console.log("decodeRow:"+JSON.stringify(row));
//    console.log("config:"+JSON.stringify(config));
    row.lname  = decodeLname(row.lname);
    row.myouji = decodeMyouji(row.myouji);
    row.fname  = decodeFname(row.fname);
    row.namae  = decodeNamae(row.namae);
    row.birthday = decodeBirthday(row.birthday);
    row.grade = decodeGrade(row.grade,row.birthday);
    row.sex = decodeSex(row.sex);
    row.zip1 = decodeZip1(row.zip1);
    row.zip2 = decodeZip2(row.zip2);
    row.address1 = decodeAddress1(row.address1);
    row.address2 = decodeAddress2(row.address2);
    row.email = decodeEmail(row.email);
    row.lname2  = decodeLname2(row.lname2);
    row.myouji2 = decodeMyouji2(row.myouji2);
    row.fname2  = decodeFname2(row.fname2);
    row.namae2  = decodeNamae2(row.namae2);
    row.birthday2 = decodeBirthday2(row.birthday2);
    row.sex2 = decodeSex2(row.sex2);
    row.regist = decodeRegist( row.regist );
    row.start = decodeStart(row.start);
    row.confirmation = decodeConfirmation(row.confirmation);
    row.cate = decodeCate(row.cate);
    row.wave = decodeWave(row.wave);
    row.racenum = decodeRacenum(row.racenum);
    row.ttime = decodeTtime(row.DNF,row.ttime);
    row.prize1= decodePrize(row.prize1);
    row.prize2= decodePrize(row.prize2);
    row.prize3= decodePrize(row.prize3);
}

function decodeLname(lname) {
  return(katakanaToHiragana((lname||"").replace(/　/g," ").trim().split(" ")[0]));
}

function decodeMyouji(myouji) {
  return((myouji||"").replace(/　/g," ").trim().split(" ")[0]);
}

function decodeFname(fname) {
  return(katakanaToHiragana((fname||"").replace(/　/g," ").trim().split(" ").pop()));
}

function decodeNamae(namae) {
  return((namae||"").replace(/　/g," ").trim().split(" ").pop());
}

function decodeBirthday(argBirthday) {
  var birthday = argBirthday.toString().split(" ");
  return(
    ('0000'+birthday[3]).slice(-4)+"/"+
    ('00'+(monthsArray.indexOf(birthday[1],0)+1)).slice(-2)+"/"+
    ('00'+birthday[2]).slice(-2)
  );
}

function decodeGrade(grade,birthday) {
  return((grade && config.grades[grade-1]) ? config.grades[grade-1] : calcAge(birthday, config.basedate)+ "才");
}

function decodeSex(sex) {
  return(sexList[(sex||"M")] || sexList.M );
}

function decodeZip1(zip1) {
  return(('000'+(zip1)).slice(-3));
}

function decodeZip2(zip2) {
  return(('0000'+(zip2)).slice(-4));
}

function decodeAddress1(address1) {
  return((address1||"").trim());
}

function decodeAddress2(address2) {
  return((address2||"").trim());
}

function decodeEmail(email) {
  return((email||"").trim() || "dummy@domain.com");
}

function decodeLname2(lname2) {
  return(katakanaToHiragana((lname2||"").replace(/　/g," ").trim().split(" ")[0]));
}

function decodeMyouji2(myouji2) {
  return((myouji2||"").replace(/　/g," ").trim().split(" ")[0]);
}

function decodeFname2(fname2) {
  return( katakanaToHiragana((fname2||"").replace(/　/g," ").trim().split(" ").pop()));
}

function decodeNamae2(namae2) {
  return((namae2||"").replace(/　/g," ").trim().split(" ").pop());
}

function decodeBirthday2(argBirthday2) {
  var birthday2 = (argBirthday2||"").toString().split(" ");
  return(
    argBirthday2 && ('0000'+birthday2[3]).slice(-4)+"/"+
    ('00'+(monthsArray.indexOf(birthday2[1],0)+1)).slice(-2)+"/"+
    ('00'+birthday2[2]).slice(-2)
  );
}

function decodeSex2(sex2) {
  return(sex2 && sexList[(sex2||"M")]);
}

function decodeRegist(regist) {
  return(regist == true ? "checked" : "");
}

function decodeStart( start ) {
  return(start == true ? "checked" : "") ;
}

function decodeConfirmation( confirmation ) {
  return(confirmation == true ? "checked" : "");
}

function decodeCate(cate) {
  return((cate&&config.cate[cate-1])?config.cate[cate-1]:"");
}

function decodeWave(wave) {
  return((wave || wave*1 != 0) ? ('00' + wave*1).slice(-2) : "");
}

function encodeWave(wave) {
  return((!wave || isNaN(wave) || wave==0 )? "" : ('00'+wave*1).slice(-2));
}

function decodeRacenum(racenum) {
  return((!racenum || isNaN(racenum) || racenum*1 == 0 )? "" : ('000'+racenum*1).slice(-3));
}

function encodeRacenum(racenum) {
  return((!racenum || isNaN(racenum) || racenum*1==0 )? 0 : ('000'+racenum*1).slice(-3));
}



function decodeTtime(DNF,ttime) {
  if( DNF ) {
    return("DNF");
  }else{
    return(reformTime(ttime));
  }
}

console.log("db/entry.js end");
