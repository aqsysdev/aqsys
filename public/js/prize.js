//
//
//  クライアント用表彰リスト操作 javascript
//
//

$(function(){
  $("#prizelist").DataTable(
    {
      lengthMenu: [ 10, 20, 50, 100, 500 ],
      displayLength: 50,
      stateSave: true,
      //scrollX: false,
      //scrollY: false,
      order: [
        [1,"asc"],[2,"asc"],[6,"asc"],[0,"asc"]
      ]
    }
  );

  // CRUD 関数定義
  $.extend({
    "getE" : function (id, data, success, error) {
      error = error || function() {};
      return $.ajax({
        "url" : '/api/entry/'+id,
        "data" : data,
        "success" : success,
        "type" : "GET",
        "cache" : false,
        "error" : error,
        "dataType" : "json"
      });
    },
    "putE" : function (id, data, success, error) {
  		error = error || function() {};
  		return $.ajax({
  			"url" : '/api/entry/'+id,
  			"data" : data,
  			"success" : success,
  			"type" : "PUT",
  			"cache" : false,
  			"error" : error,
  			"dataType" : "json"
  		});
  	},
    "getR" : function (rid, data, success, error) {
      error = error || function() {};
      return $.ajax({
        "url" : '/api/record/0'+((rid=="" || isNaN(rid))?"":"_"+rid),
        "data" : data,
        "success" : success,
        "type" : "GET",
        "cache" : false,
        "error" : error,
        "dataType" : "json"
      });
    },
    "getW" : function (wid, data, success, error) {
      error = error || function() {};
      return $.ajax({
        "url" : '/api/waves/'+wid,
        "data" : data,
        "success" : success,
        "type" : "GET",
        "cache" : false,
        "error" : error,
        "dataType" : "json"
      });
    }
  });

  // トータルタイム編集

  $(document).on('click', '#prize-ttime-editable', function () {
    var btn;
    var btns;
    var editable=$(this).prop("editable") == true ? false : true;
    $(this).prop("editable",editable);
    btns=$(".prize-ttime");
    for(btn of btns) {
      btn.disabled=(editable?false:"disabled");
    }
    $('.prize-ttime').off('change');
    $('.prize-ttime').on('change',function(){
        changeTtime(this);
    });
    //location.reload();
  });
  $(document).on('click', '#prize-ttime-caret', function () {
    var btn;
    var btns;
    $(this).prop("editable",false);
    btns=$(".prize-ttime");
    for(btn of btns) {
      btn.disabled="disabled";
    }
  });
  $(document).on('click', '#prize-ttime-remove', function () {
    var btn;
    var btns;
    $(this).prop("editable",false);
    btns=$(".prize-ttime");
    for(btn of btns) {
      $(btn).val("");
      changeTtime($(btn));
    }
  });
  $(document).on('click', '#prize-ttime-autofill', function () {
    autoFillTtime();
  });

  // prize 編集

  for(var i=1; i < 4 ; i++) {
    $(document).on('click', '#prize-'+i+'-editable', function () {
      var these = $(this).prop("id").split(/-/);
      var btn;
      var btns;
      var editable=$(this).prop("editable") == true ? false : true;
      $(this).prop("editable",editable);
      btns=$("."+these[0]+"-"+these[1]);
      for(btn of btns) {
        btn.disabled=(editable?false:"disabled");
        $(btn).off('change');
        $(btn).on('change',function(){
            changePrize($(bit));
        });
      }
    });
    $(document).on('click', '#prize-'+i+'-caret', function () {
      var these = $(this).prop("id").split(/-/);
      var btn;
      var btns;
      $(this).prop("editable",false);
      btns=$("."+these[0]+"-"+these[1]);
      for(btn of btns) {
        btn.disabled="disabled";
      }
    });
    $(document).on('click', '#prize-'+i+'-remove', function () {
      var these = $(this).prop("id").split(/-/);
      var btn;
      var btns;
      var yes=confirm('データを消去します。この操作は取り消しができません。');
      if( yes ) {
        $(this).prop("editable",false);
        btns=$("."+these[0]+"-"+these[1]);
        for(btn of btns) {
          $(btn).val("");
          changePrize($(btn));
        }
      }
    });
    $(document).on('click', '#prize-'+i+'-autofill', function () {
      var these = $(this).prop("id").split(/-/);
      var btn;
      var btns;
      var prevNum=0;
      $(this).prop("editable",false);
      btns=$("."+these[0]+"-"+these[1]);
      for(btn of btns) {
        var those = $(btn).prop("name").split(/-/);
        if($("#prize-ttime-"+those[2]).val()!="" && $("#prize-ttime-"+those[2]).val()!="DNF" ) {
          if($(btn).val()=="") {
            $(btn).val(++prevNum);
          }else if(!isNaN($(btn).val())) {
            prevNum = $(btn).val();
          }
        }
        changePrize($(btn));
      }
    });
  }
});

var waves = [];
var record = [];

function autoFillTtime() {
  $.getW("", waves,
  function(waves,stat) {
    $.getR("", record,
      function(record,stat){
        var ttimeBtns = $('.prize-ttime');
        for(btn of ttimeBtns) {
          if( !$(btn).val() || $(btn).val() == "DNF" ) {
            var id=$(btn).parent().parent().children().last().text().trim();
            var racenum=$(btn).parent().parent().children().first().children().next().val()*1;
            var wid=$(btn).parent().parent().children().next().next().children().next().val()*1;
            //alert("id:"+id+" racenum:"+racenum+" wid:"+wid);
            var stimeObj=waves.find(function(elm){return((elm.wid)*1==wid && !elm.disabled);});
            var ftimeObj=record.find(function(elm){return((elm.racenum)*1==racenum && !elm.disabled );});
            if(stimeObj && stimeObj.stime && ftimeObj && ftimeObj.ftime) {
              $(btn).val(diffTime(stimeObj.stime,ftimeObj.ftime));
            }else{
              $(btn).val("");
            }
            changeTtime($(btn));
          }
        }
      },
      function(){
        alert("タイム記録の取得に失敗しました。");
      }
    );
  },
  function(req,stat,err){
    alert("wave 情報の取得に失敗しました。");
  });
}
//
//  トータル時間編集
//
function changeTtime(that) {
  $(that).addClass("unconfirmed");
  var value=$(that).val();
  var id=$(that).parent().parent().children().last().text().trim();
//  alert("id:"+id+" value:"+value);
  //
  //  編集
  //
  var data = {};
  if(!value) {
    data.DNF = true;
  }else{
    data.ttime=reformTime(value);
    data.DNF = false;
  }
  $.putE(id,data,
  function(data,stat){
    $.getE(data.id, data,
    function(data,stat) {
      if(data.DNF){
        $(that).val("DNF");
      }else{
        $(that).val(data.ttime);
      }
      $(that).removeClass("unconfirmed");
    },
    function(req,stat,err){
    //  alert("記録の確認に失敗しました。");
    });
  },
  function(req,stat,err){
  //  alert("記録の書き込みに失敗しました。");
    $(that).val(data.ttime);
  });
}

//
//  順位編集
//
function changePrize(that) {
  $(that).addClass("unconfirmed");
  var value=$(that).val();
  var those=$(that).prop("name").split(/-/);
  var index=those[0]+those[1];
  var id=$(that).parent().parent().children().last().text().trim();
//  alert("id:"+id+" value:"+value);
    //
    //  編集
    //
  var data={};
  data[index]=encodePrize(value);
  $.putE(id,data,
  function(data,stat){
    $.getE(data.id, data,
    function(data,stat) {
      $(that).val(decodePrize(data[index]));
      $(that).removeClass("unconfirmed");
    },
    function(req,stat,err){
      alert("記録の確認に失敗しました。");
    });
  },
  function(req,stat,err){
    alert("記録の書き込みに失敗しました。");
    $(that).val(data.ttime);
  });
}

var grades=[
  "",
  "小学１",
  "小学２",
  "小学３",
  "小学４",
  "小学５",
  "小学６",
  "中学１",
  "中学２",
  "中学３"];
var sex={M:"男",F:"女"};

var calcAge = function(birthdate, targetdate) {
  	birthdate = birthdate.replace(/[/-]/g, "");
  	if (targetdate) {
  		targetdate = targetdate.replace(/[/-]/g, "");
  	} else {
  		var today = new Date();
  		targetdate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  	}
  	return (Math.floor((targetdate - birthdate) / 10000));
};

function checkDate(datestr) {
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
		}else if(vDt.getFullYear() == vYear
		 && vDt.getMonth() == vMonth
		 && vDt.getDate() == vDay){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

function calcTime(fromTime, toTime) {
  var fromTimeSplit = (fromTime+"").split(/[:.-]/);
  var toTimeSplit = (toTime+"").split(/[:.-]/);
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
  var fromTimeSplit = (fromTime+"").split(/[:.-]/);
  var toTimeSplit = (toTime+"").split(/[:.-]/);
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
    return(null);
  }
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
