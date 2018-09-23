//
//
// aqsys encoder and decoder
//
//

var aqsysCoder = {};
var Decimal = (typeof require === 'undefined') ? Decimal : require("../js/decimal.js");

(function() {


  //////////////////////////////////////////////////////////
  //
  // 規定値設定
  //
  //////////////////////////////////////////////////////////
  var config = {
        schemaname: 'aqsyssample',
        basedate: '2017/12/31',
        grades: [
          "小学１",
          "小学２",
          "小学３",
          "小学４",
          "小学５",
          "小学６",
          "中学１",
          "中学２",
          "中学３"
        ],
        cate: [
          "1:低学年男",
          "2:低学年女",
          "3:高学年男",
          "4:高学年女",
          "5:中学生男",
          "6:中学生女",
          "7:39才以下男",
          "8:39才以下女",
          "9:40才以上男",
          "A:40才以上女",
          "B:低学年リレー",
          "C:高学年リレー"
        ],
        localZips: [
          "143",
          "144",
          "145",
          "146"
        ],
        months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        sex: {M:"男",F:"女"}
  };


    // ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //


aqsysCoder = {
  config: config,
  setConfig(argconfig) {
    console.log("aqsysCoder setConfig:"+JSON.stringify(argconfig));
    for(var name in argconfig) {
      aqsysCoder.config[name]=argconfig[name];
    }
  } ,
  getConfig() {
    console.log("aqsysCoder getConfig:"+JSON.stringify(aqsysCoder.config));
    return(aqsysCoder.config);
  },

//  katakanaToHiragana,
  hiraganaToKatakana,
  calcAge,
  calcTime,
//  diffTime,
  addTime,
  formTime,
  reformTime,
  centisecTime,
  reformTime,
  encodeDateTime,
  encodeTime,
  decodePrize, encodePrize,
  decodeRow,
  decodeLname,
  decodeMyouji,
  decodeFname,
  decodeNamae,
  decodeBirthday,
  decodeGrade, encodeGrade,
  decodeSex, encodeSex,
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
  decodeCate, encodeCate,
  decodeWave, encodeWave,
  decodeRacenum,  encodeRacenum,
  decodeTtime,
  checkMail,
  checkDate

};

var diffTime = aqsysCoder.diffTime = function(fromTime, toTime) {
  alert("here");
  var diffCentisec;
  diffCentisec = calcTime(fromTime,toTime);
  alert("here");
  if(diffCentisec>=0) {
    return(formTime(diffCentisec));
    alert("here");
  }else{
    return(formTime(diffCentisec+centisecTime("24:00:00.00")));
    alert("here");
  }
};

console.log("js/aqsysCoder.js 1");
/** カタカナをひらがなに変換する関数
 * @param {String} src - カタカナ
 * @returns {String} - ひらがな
 */

var katakanaToHiragana=aqsysCoder.katakanaToHiragana = function(src) {
	return src.replace(/[\u30a1-\u30f6]/g, function(match) {
		var chr = match.charCodeAt(0) - 0x60;
		return String.fromCharCode(chr);
	});
};


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
    var tdate= targetdate;
  	var bdate = birthdate.replace(/[/-]/g, "");
  	if (tdate) {
  		tdate = tdate.replace(/[/-]/g, "");
  	} else if(aqsysCoder.config.basedate){
      tdate = aqsysCoder.config.basedate.replace(/[/-]/g, "");
    } else {
  		var today = new Date();
  		tdate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  	}
  	return (Math.floor((tdate - bdate) / 10000));
}

var calcTime = aqsysCoder.calcTime = function(fromTime, toTime) {
    return(centisecTime(toTime)-centisecTime(fromTime));
};


var addTime = aqsysCoder.addTime = function(fromTime, toTime) {
    return(formTime(centisecTime(fromTime)+centisecTime(toTime)));
};

var formTime = aqsysCoder.formTime = function(ms) {
    alert("there");
    var milisec=new Decimal(ms);
    alert("there");
    return(
      ("00"+parseInt(milisec.div(60*60*100),0)%24).slice(-2)+":"+
      ("00"+parseInt(milisec.div(60*100),0)%60).slice(-2)+":"+
      ("00"+parseInt(milisec.div(100),0)%60).slice(-2)+"."+
      ("00"+parseInt(milisec%100,0)).slice(-2)
    );
};

var reformTime = aqsysCoder.reformTime = function(ft) {
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
};

var centisecTime = aqsysCoder.centisecTime = function(time) {
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
};

function encodeDateTime(time) {
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

function encodeTime(time) {
  return(
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
    ('00'+(aqsysCoder.config.months.indexOf(birthday[1],0)+1)).slice(-2)+"/"+
    ('00'+birthday[2]).slice(-2)
  );
}

function decodeGrade(grade,birthday) {
  return((grade && aqsysCoder.config.grades[grade-1]) ? aqsysCoder.config.grades[grade-1] : calcAge(birthday, false)+ "才");
}

function encodeGrade(gradeName) {
  return(aqsysCoder.config.grades.indexOf(gradeName)+1);
}

function decodeSex(sex) {
  return(aqsysCoder.config.sex[(sex||"M")] || aqsysCoder.config.sex.M );
}

function encodeSex(sexKanji) {
  return(Object.keys(aqsysCoder.config.sex).filter(function(key){return(aqsysCoder.config.sex[key] == sexKanji);})[0]);
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
    ('00'+(aqsysCoder.config.months.indexOf(birthday2[1],0)+1)).slice(-2)+"/"+
    ('00'+birthday2[2]).slice(-2)
  );
}

function decodeSex2(sex2) {
  return(sex2 && aqsysCoder.config.sex[(sex2||"M")]);
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
  return((cate&&aqsysCoder.config.cate[cate-1])?aqsysCoder.config.cate[cate-1]:"");
}

function encodeCate(cateName) {
  return(aqsysCoder.config.cate.indexOf(cateName)+1);
}

function decodeWave(wave) {
  return((!wave || isNaN(wave) || wave*1 == 0 )? "" : ('00'+wave*1).slice(-2));
}

function encodeWave(wave) {
  return((!wave || isNaN(wave) || wave*1==0 )? 0 : ('00'+wave*1).slice(-2));
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


function checkMail( mail ) {
    var mail_regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
    var mail_regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
    if( mail.match( mail_regex1 ) && mail.match( mail_regex2 ) ) {
        // 全角チェック
        if( mail.match( /[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/ ) ) { return false; }
        // 末尾TLDチェック（〜.co,jpなどの末尾ミスチェック用）
        if( !mail.match( /\.[a-z]+$/ ) ) { return false; }
        return true;
    } else {
        return false;
    }
}


function checkDate( datestr ) {
	// 正規表現による書式チェック
	if(!datestr.match(/^\d{4}\/\d{2}\/\d{2}$/)){
		return false;
	}
	var vYear = datestr.substr(0, 4) - 0;
 	// Javascriptは、0-11で表現
	var vMonth = datestr.substr(5, 2) - 1;
	var vDay = datestr.substr(8, 2) - 0;
	// 月,日の妥当性チェック
	if(vMonth >= 0 && vMonth <= 11 && vDay >= 1 && vDay <= 31){
		var vDt = new Date(vYear, vMonth, vDay);
		if(isNaN(vDt)){
			return false;
		}else if(vDt.getFullYear() == vYear && vDt.getMonth() == vMonth	&& vDt.getDate() == vDay){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

module.exports  = aqsysCoder;


console.log("js/aqsysCoder.js end");

}());
