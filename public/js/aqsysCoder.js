//
//
// aqsys encoder and decoder
//
//

;(function (globalScope) {
  'user strict';
  //////////////////////////////////////////////////////////
  //
  // 規定値設定
  //
  //////////////////////////////////////////////////////////
  var Decimal = require("../js/decimal.js");
  var Decode = {
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
        months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        sex: {M:"男",F:"女"}
  };


    // ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //


  var inexact, noConflict, quadrant,
      external = true,

      decodeError = '[DecodelError] ',
      invalidArgument = decodeError + 'Invalid argument: ',

  //    precisionLimitExceeded = decodeError + 'Precision limit exceeded',
  //    cryptoUnavailable = decodeError + 'crypto unavailable',

      isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
      isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
      isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
      isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

  // aqsysCoder prototype object
     P={};

  // console.log("js/aqsysCoder.js 1");
  //   カタカナをひらがなに変換する関数
  //   * @param {String} src - カタカナ
  //   * @returns {String} - ひらがな
  //

  P.katakanaToHiragana = function (src) {
    return src.replace(/[\u30a1-\u30f6]/g, function(match) {
      var chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  };


  //  ** ひらがなをカタカナに変換する関数
  //   * @param {String} src - ひらがな
  //   * @returns {String} - カタカナ
  //
  P.hiraganaToKatakana = function (src) {
  	return src.replace(/[\u3041-\u3096]/g, function(match) {
  		var chr = match.charCodeAt(0) + 0x60;
  		return String.fromCharCode(chr);
  	});
  };

  //////////////////////////////////////////////////////////////
  //
  //  年齢を計算する
  //
  //////////////////////////////////////////////////////////////
  P.calcAge = function (birthdate, targetdate) {
    	birthdate = birthdate.replace(/[/-]/g, "");
    	if (targetdate) {
    		targetdate = targetdate.replace(/[/-]/g, "");
    	} else {
    		var today = new Date();
    		targetdate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    	}
    	return (Math.floor((targetdate - birthdate) / 10000));
  };

  //////////////////////////////////////////////////////////////
  //
  //  ms 単位の時間から hh:mm:ss.cs 形式に変換する
  //
  //////////////////////////////////////////////////////////////
  P.formTime = function (ms) {
      var milisec=new Decimal(ms);
      return(
        ("00"+parseInt(milisec.div(60*60*100),0)%24).slice(-2)+":"+
        ("00"+parseInt(milisec.div(60*100),0)%60).slice(-2)+":"+
        ("00"+parseInt(milisec.div(100),0)%60).slice(-2)+"."+
        ("00"+parseInt(milisec%100,0)).slice(-2)
      );
  };

  //////////////////////////////////////////////////////////////
  //
  //  hh[:-]mm:-ss[:-][.cs] 単位の時間から hh:mm:ss.cs 形式に変換する
  //
  //////////////////////////////////////////////////////////////
  P.reformTime = function(ft) {
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
  };

  //////////////////////////////////////////////////////////////
  //
  //  time 形式の時間データを YYYY/MM/DD hh:mm:ss.cs 形式に変換する
  //
  //////////////////////////////////////////////////////////////
  P.encodeTime = function(time) {
    return(
      ("0000"+(time.getFullYear()||0)).slice(-4)+"/"+
      ("00" + (time.getMonth()+1)).slice(-2)+"/"+
      ("00" + (time.getDate()||0)).slice(-2)+" "+
      ("00" + (time.getHours()||0)).slice(-2)+":"+
      ("00" + (time.getMinutes()||0)).slice(-2)+":"+
      ("00" + (time.getSeconds()||0)).slice(-2)+"."+
      ("00" + (time.getTime()||0)).slice(-2)
    );
  };

  //////////////////////////////////////////////////////////////
  //
  //  prize データを表示形式へ変換
  //
  //////////////////////////////////////////////////////////////
  P.decodePrize = function(prize) {
    if( prize == null ) {
      return(null);
    }else if( prize=="" || isNaN(prize) || prize==0){
      return("");
    }else if( prize<0 ){
      return("-");
    }else{
      return(prize);
    }
  };

  //////////////////////////////////////////////////////////////
  //
  //  表示形式 prizeをデータ形式へ変換
  //
  //////////////////////////////////////////////////////////////

  P.encodePrize = function(prize) {
    if(prize == null || prize == "") {
      return(0);
    }else if(!isNaN(prize) && prize>=0){
      return(prize);
    }else{
      return(-1);
    }
  };

  //////////////////////////////////////////////////////////////
  //
  //  一人分の　entry データを表示形式へ変換する
  //
  //////////////////////////////////////////////////////////////
  P.decodeRow = function (row) {
  //    console.log("decodeRow:"+JSON.stringify(row));
  //    console.log("config:"+JSON.stringify(config));
      row.lname  = katakanaToHiragana((row.lname||"").replace(/　/g," ").trim().split(" ")[0]);
      row.myouji = (row.myouji||"").replace(/　/g," ").trim().split(" ")[0];
      row.fname  = katakanaToHiragana((row.fname||"").replace(/　/g," ").trim().split(" ").pop());
      row.namae  = (row.namae||"").replace(/　/g," ").trim().split(" ").pop();
      var birthday = row.birthday.toString().split(" ");
      row.birthday = ('0000'+birthday[3]).slice(-4)+"/"+
      ('00'+(months.indexOf(birthday[1],0)+1)).slice(-2)+"/"+
      ('00'+birthday[2]).slice(-2);
      row.grade = (row.grade && config.grades[row.grade-1]) ? config.grades[row.grade-1] : calcAge(row.birthday, config.basedate)+ "才";
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
      row.cate = (row.cate&&config.cate[row.cate-1])?config.cate[row.cate-1]:"";
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
  };

  function clone(obj) {
    var i, p, ps;

    function Decode(v) {
      var e, i, t,
        x = this;

      // Decimal called without new.
      if (!(x instanceof Decimal)) return new Decimal(v);

      // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
      // which points to Object.
      x.constructor = Decimal;

      // Duplicate.
      if (v instanceof Decimal) {
        x.s = v.s;
        x.e = v.e;
        x.d = (v = v.d) ? v.slice() : v;
        return;
      } else if (t !== 'string') {
        throw Error(invalidArgument + v);
      }
      return;
    }

    Decode.prototype = P;
    Decode.config = Decode.set = config;
    Decode.clone=clone;
    if (obj === void 0) obj = {};
    if (obj) {
      ps = [
//        'precision', 'rounding', 'toExpNeg', 'toExpPos', 'maxE', 'minE', 'modulo', 'crypto'
      ];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }
    Decode.config(obj);

    return Decode;
  }

  // * Configure global settings for a Decimal constructor.
  // *
  // * `obj` is an object with one or more of the following properties,
  // *
  // *   precision  {number}
  // *   rounding   {number}
  // *   toExpNeg   {number}
  // *   toExpPos   {number}
  // *   maxE       {number}
  // *   minE       {number}
  // *   modulo     {number}
  // *   crypto     {boolean|number}
  // *
  // * E.g. Decode.config({ precision: 20, rounding: 4 })
  // *
  // */
  function config(obj) {
    if (!obj || typeof obj !== 'object') throw Error(decodeError + 'Object expected');
    var i, p, v,
      ps = [
  //      'precision', 1, MAX_DIGITS,
  //      'rounding', 0, 8,
  //      'toExpNeg', -EXP_LIMIT, 0,
  //      'toExpPos', 0, EXP_LIMIT,
  //      'maxE', 0, EXP_LIMIT,
  //      'minE', -EXP_LIMIT, 0,
  //      'modulo', 0, 9
      ];

    for (i = 0; i < ps.length; i += 3) {
      if ((v = obj[p = ps[i]]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    if ((v = obj[p = 'crypto']) !== void 0) {
      if (v === true || v === false || v === 0 || v === 1) {
        if (v) {
          if (typeof crypto != 'undefined' && crypto &&
            (crypto.getRandomValues || crypto.randomBytes)) {
            this[p] = true;
          } else {
            throw Error(cryptoUnavailable);
          }
        } else {
          this[p] = false;
        }
      } else {
        throw Error(invalidArgument + p + ': ' + v);
      }
    }

    return this;
  }

  // Create and configure initial Decode constructor.
  Decode = clone(Decode);

  Decode['default'] = Decode.Decode = Decode;
  // Export.

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return Decode;
    });

  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = Decode;

  // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self
        ? self : Function('return this')();
    }

    noConflict = globalScope.Decode;
    Decode.noConflict = function () {
      globalScope.Decode = noConflict;
      return Decode;
    };

    globalScope.Decode = Decode;
  }

})(this);  // end function (globalSope)

// console.log("js/aqsysCoder.js end");
