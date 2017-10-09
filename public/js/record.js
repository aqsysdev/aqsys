//
//
//  クライアント用記録リスト操作 javascript
//
//

//alert("/js/record 0");
var record = {};

$(function(){
  // CRUD 関数定義
  $.extend({
    "get" : function (url, data, success, error) {
      error = error || function() {};
      return $.ajax({
        "url" : url,
        "data" : data,
        "success" : success,
        "type" : "GET",
        "cache" : false,
        "error" : error,
        "dataType" : "json"
      });
    },
    "post" : function (url, data, success, error) {
  		error = error || function() {};
  		return $.ajax({
  			"url" : url,
  			"data" : data,
  			"success" : success,
  			"type" : "POST",
  			"cache" : false,
  			"error" : error,
  			"dataType" : "json"
  		});
  	},
  	"put" : function (url, data, success, error) {
      //alert(JSON.stringify(data));
  		error = error || function() {};
  		return $.ajax({
  			"url" : url,
  			"data" : data,
  			"success" : success,
  			"type" : "PUT",
  			"cache" : false,
  			"error" : error,
  			"dataType" : "json"
  		});
  	},
  	"delete" : function (url, data, success, error) {
  		error = error || function() {};
  		return $.ajax({
  			"url" : url,
  			"data" : data,
  			"success" : success,
  			"type" : "DELETE",
  			"cache" : false,
  			"error" : error,
  			"dataType" : "json"
  		});
  	}
  });

  $(".show-ftime").removeClass("hidden");
  $(".show-dtime").addClass("hidden");

  $("#diffTime").on('click',function(){
    if($(this).attr("aria-pressed")=="true") {
      $(".show-ftime").removeClass("hidden");
      $(".show-dtime").addClass("hidden");
    }else{
      $(".show-ftime").addClass("hidden");
      $(".show-dtime").removeClass("hidden");
    }
  });
  //
  //num ラジオボタン
  //
  $(document).on('click', '.record-num-radio', function(){
    $('.record-num-radio').removeClass("active");
    $(this).addClass("active");
    var id = $(this).eq(0).attr("id").split("-");
    copyToRecord0(id[1],id[3]);
  });

  //
  //ftime ラジオボタン
  //
  $(document).on('click', '.record-ftime-radio', function(){
    $('.record-ftime-radio').removeClass("active");
    $('.record-dtime-radio').removeClass("active");
    $(this).addClass("active");
    $(this).parent().next().children().addClass("active");
    var id = $(this).eq(0).attr("id").split("-");
    copyToRecord0(id[1],id[3]);
  });

  //
  //dtime ラジオボタン
  //
  $(document).on('click', '.record-dtime-radio', function(){
    $('.record-ftime-radio').removeClass("active");
    $('.record-dtime-radio').removeClass("active");
    $(this).parent().prev().children().addClass("active");
    $(this).addClass("active");
    var id = $(this).eq(0).attr("id").split("-");
    copyToRecord0(id[1],id[3]);
  });

//
//  レースナンバー編集可能ボタン
//


  $(document).on('click', '.btnRecordNumEditable', function(){checkNumEditable();});

  function checkNumEditable () {
    $(".btnRecordNumEditable").each( function() {
      var recordNum = $(this).attr("id").split("-")[1];
      var isChecked=$("#btnRecordNumEditable-"+recordNum).attr("aria-pressed") == "true" ? false : "disabled" ;
      $(".record-num-"+recordNum).each( function() {
        this.disabled=isChecked;
      });
      $('.record-num-'+recordNum).off('change')
      .on('change',function(req){ recordEditNum(this); });
    });
  }

  //
  //  フィニッシュ時刻編集可能ボタン
  //
  $(document).on('click', '.btnRecordFTimeEditable', function(){checkFTimeEditable();});

  function checkFTimeEditable() {
    $(".btnRecordFTimeEditable").each( function() {
      var recordNum = $(this).attr("id").split("-")[1];
      var isChecked=$("#btnRecordFTimeEditable-"+recordNum).attr("aria-pressed") == "true" ? false : "disabled" ;
      $(".record-ftime-"+recordNum).each( function() {
        this.disabled=isChecked;
      });
      $('.record-ftime-'+recordNum).off('change')
      .on('change',function(req){ recordEditFTime(this); });
    });
  }

  //
  //  時間編集可能ボタン
  //
  $(document).on('click', '.btnRecordDTimeEditable', function(){checkDTimeEditable();});

  function checkDTimeEditable() {
    $(".btnRecordDTimeEditable").each( function() {
      var recordNum = $(this).attr("id").split("-")[1];
      var isChecked=$("#btnRecordDTimeEditable-"+recordNum).attr("aria-pressed") == "true" ? false : "disabled" ;
      $(".record-dtime-"+recordNum).each( function() {
        this.disabled=isChecked;
      });
      $('.record-dtime-'+recordNum).off('change')
      .on('change',function(req){ recordEditDTime(this); });
    });
  }

  //
  //  レースナンバー編集
  //
  function recordEditNum(that){
    $(that).addClass("unconfirmed");
    var recordNum=$(that).attr("id").split("-")[2];
    var value=$(that).val();
    var rid=$(that).parent().prev().text().trim();
    //alert("that.id:"+$(that).attr("id")+" recordNum:"+recordNum+" rid:"+rid+" num:"+value);
    var data = {
      racenum: value,
      disabled: false
    };

    if($(that).parent().next().children().last().val()) {
      data.ftime = $(that).parent().next().children().last().val();
    }else{
      data.ftime = encodeTime( new Date() );
    }
    //alert(JSON.stringify(data));
    //
    //  追加
    //
    if(!rid || isNaN(rid)) {
      $.post("/api/record/"+recordNum, data,
      function(data,stat){
        //alert(JSON.stringify(data));
        $.get("/api/record/"+recordNum+"_"+data.rid,data,
        function(data,stat) {
        //  alert("that.id:"+$(that).attr("id")+" recordNum:"+data.recordNum+" rid:"+data.rid+" num:"+data.racenum);
          $(that).parent().prev().text(data.rid);
          $(that).val(decodeRacenum(data.racenum));
          $(that).parent().next().children().last().val(reformTime(data.ftime));
          $(that).parent().next().next().children().last().val(diffTime(reformTime(data.ftime),$("#record-ftime-"+recordNum+"-0").val()));
          $(that).removeClass("unconfirmed");
          addRow();
        },
        function(req,stat,err){
//          alert("get recorde data error:"+err);
          $(that).val("");
        });
      },
      function(req,stat,err){
//          alert("post recorde data error:"+err);
          $(that).val("");
      });
    //
    //  編集
    //
    }else{
      //alert(JSON.stringify(data));
      $.put("/api/record/"+recordNum+"_"+rid,data,
      function(data,stat){
        $.get("/api/record/"+recordNum+"_"+data.rid,data,
        function(data,stat) {
          //alert("that.id:"+$(that).attr("id")+" recordNum:"+data.recordNum+" rid:"+data.rid+" num:"+data.racenum);
          $(that).parent().prev().text(data.rid);
          $(that).val(decodeRacenum(data.racenum));
          $(that).parent().next().children().last().val(reformTime(data.ftime));
          $(that).parent().next().next().children().last().val(diffTime(reformTime(data.ftime),$("#record-ftime-"+recordNum+"-0").val()));
          $(that).removeClass("unconfirmed");
          addRow();
        },
        function(req,stat,err){
//          alert("get recorde data error:"+err);
          $(that).val("");
        });
      },
      function(data,stat,err){
//        alert("put recorde data error:"+err);
        $(that).val("");
      });
    }
  }

  //
  //  フィニッシュ時刻編集
  //

  function recordEditFTime(that){
    $(that).addClass("unconfirmed");
    var recordNum=$(that).eq(0).attr("id").split("-")[2];
    var value=$(that).val();
    var rid=$(that).parent().prev().prev().text().trim();
    var seqnum=$(that).parent().parent().first().text().trim();

    //
    //  削除
    //
    if(!value || value == "") {
      $.put("/api/record/"+recordNum+"_"+rid, {disabled: true},
        function(data,stat){
            $(that).parent().prev().prev().text(data.rid);
            $(that).parent().prev().children().eq(0).val("");
            $(that).parent().children().last().val("");
            $(that).parent().next().children().last().val("");
            $(that).removeClass("unconfirmed");
        },
        function(){
          alert("delete record ftime error:"+err);
        });
    //
    //  追加
    //
    } else if(!rid || isNaN(rid)) {
      $.post("/api/record/"+recordNum,
      {
        ftime: value
      },
      function(data,stat){
        $.get("/api/record/"+recordNum+"_"+data.rid, data,
        function(data,stat) {
          $(that).parent().prev().prev().text(data.rid);
          $(that).parent().children().last().val(reformTime(data.ftime));
          $(that).parent().next().children().last().val(diffTime(reformTime(data.ftime),$("#record-ftime-"+recordNum+"-0").val()));
          $(that).removeClass("unconfirmed");
          addRow();
        },
        function(req,stat,err){
//          alert("get record ftime error:"+err);
        });
      },
      function(req,stat,err){
//          alert("post record ftime error:"+err);
      });
    //
    //  編集
    //
    }else{
      $.put("/api/record/"+recordNum+"_"+rid,
      {
        ftime: value,
        disabled: false
      },
      function(data,stat){
        $.get("/api/record/"+recordNum+"_"+data.rid, data,
        function(data,stat) {
          $(that).parent().prev().prev().text(data.rid);
          $(that).parent().prev().children().last().val(data.racenum);
          $(that).removeClass("unconfirmed");
        },
        function(req,stat,err){
          $(that).val("");
        });
      },
      function(req,stat,err){
        $.get("/api/record/"+recordNum+"_"+rid, data,
        function(data,stat) {
          $(that).parent().prev().prev().text(data.rid);
          $(that).parent().prev().children().last().val(data.racenum);
          $(that).removeClass("unconfirmed");
        },
        function(req,stat,err){
          $(that).val("");
        });
      });
    }
  }

  //
  //  フィニッシュ時間編集
  //

  function recordEditDTime(that){
    $(that).addClass("unconfirmed");
    var recordNum=$(that).eq(0).attr("id").split("-")[2];
    var value=$(that).val();
    var rid=$(that).parent().prev().prev().prev().text().trim();
    var seqnum=$(that).parent().parent().first().text().trim();
    //
    //  削除
    //
    if(!value || value == "") {
        $.put("/api/record/"+recordNum+"_"+rid, {disabled: true},
        function(data,stat){
            $(that).parent().prev().prev().prev().text(data.rid);
            $(that).parent().prev().prev().children().eq(0).val("");
            $(that).parent().prev().children().last().val("");
            $(that).parent().children().last().val("");
            $(that).removeClass("unconfirmed");
        },
        function(){
          alert("delete record dtime error:"+err);
        });
    //
    //  追加
    //
    } else {
      var ftime=value;
      if(seqnum!=0) {
        ftime = addTime(value,$("#record-ftime-"+recordNum+"-0").val());
      }
      // alert(value+"+"+$("#record-ftime-"+recordNum+"-0").val()+"="+ftime);
      if(!rid || isNaN(rid)) {
        $.post("/api/record/"+recordNum,
        {
          ftime: ftime
        },
        function(data,stat){
          $.get("/api/record/"+recordNum+"_"+data.rid, data,
          function(data,stat) {
            $(that).parent().prev().prev().prev().text(data.rid);
            $(that).parent().prev().children().last().val(reformTime(data.ftime));
            $(that).parent().children().last().val(diffTime(reformTime(data.ftime),$("#record-ftime-"+recordNum+"-0").val()));
            $(that).removeClass("unconfirmed");
            addRow();
          },
          function(req,stat,err){
  //          alert("get record dtime error:"+err);
          });
        },
        function(req,stat,err){
  //          alert("post record dtime error:"+err);
        });
      //
      //  編集
      //
      }else{
        $.put("/api/record/"+recordNum+"_"+rid,
        {
          ftime: ftime,
          disabled: false
        },
        function(data,stat){
          $.get("/api/record/"+recordNum+"_"+data.rid, data,
          function(data,stat) {
            $(that).parent().prev().prev().prev().text(data.rid);
            $(that).parent().prev().prev().children().last().val(data.racenum);
            $(that).removeClass("unconfirmed");
          },
          function(req,stat,err){
            $(that).val("");
          });
        },
        function(req,stat,err){
          $.get("/api/record/"+recordNum+"_"+rid, data,
          function(data,stat) {
            $(that).parent().prev().prev().prev().text(data.rid);
            $(that).parent().prev().prev().children().last().val(data.racenum);
            $(that).removeClass("unconfirmed");
          },
          function(req,stat,err){
            $(that).val("");
          });
        });
      }
    }
  }


  var copyToRecord0 = record.copyToRecord0 = function(fieldName,recordNum) {
    var promises= $(".record-rid-0").map(function(seqnum) {
      var rid0=$(this).text().trim();
        if(rid0) {
          return(
            $.put("/api/record/0_"+rid0, {
              disabled: true
            })
          );
        }else{
          return(
            $.post("/api/record/0", {
              disabled: true
            })
          );
        }
    });
    $.when(promises).done( function(){
      $(".record-rid-0").map(function(seqnum){
        copyToRecord0One(fieldName,recordNum,seqnum);
      });
    });
  };



  var copyToRecord0One = record.copyToRecord0One =
  function(fieldName, recordNum, seqnum) {
    if(fieldName == "num" && $(".record-num-radio.active").text().trim()==="num"+recordNum){
//      if($('#btnRecordNumEditable-0.active').length){
        $("#record-num-0-"+seqnum).val(""+$("#record-num-"+recordNum+"-"+seqnum).val());
        $("#record-num-0-"+seqnum).trigger("change");
//      }
    }
    if($("#diffTime.active").length){
//      if($('#btnRecordDTimeEditable-0.active').length){
        if(fieldName == "dtime" && $(".record-dtime-radio.active").text().trim()==="dtime"+recordNum){
          $("#record-dtime-0-"+seqnum).val(""+$("#record-dtime-"+recordNum+"-"+seqnum).val());
          $("#record-dtime-0-"+seqnum).trigger("change");
        }
//      }
    }else{
//      if($('#btnRecordFTimeEditable-0.active').length){
        if(fieldName == "ftime" && $(".record-ftime-radio.active").text().trim()==="ftime"+recordNum){
          $("#record-ftime-0-"+seqnum).val(""+$("#record-ftime-"+recordNum+"-"+seqnum).val());
          $("#record-ftime-0-"+seqnum).trigger("change");
        }
//      }
    }
  };

  var calcTime = record.calcTime = function(fromTime, toTime) {
    var fromTimeSplit = (fromTime+"").split(/[:.+]/);
    var toTimeSplit = (toTime+"").split(/[:.+]/);
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
  };

  var diffTime = record.diffTime = function(fromTime, toTime) {
      return(formTime(calcTime(fromTime,toTime)));
  };

  var addTime = record.addTime = function(fromTime, toTime) {
    var fromTimeSplit = (fromTime+"").split(/[:.+]/);
    var toTimeSplit = (toTime+"").split(/[:.+]/);
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
  };

  var formTime = record.formTime = function(ms) {
      var milisec=new Decimal(ms);
      return(
        ("00"+parseInt(milisec.div(60*60*100),0)%24).slice(-2)+":"+
        ("00"+parseInt(milisec.div(60*100),0)%60).slice(-2)+":"+
        ("00"+parseInt(milisec.div(100),0)%60).slice(-2)+"."+
        ("00"+parseInt(milisec%100,0)).slice(-2)
      );
  };

  var reformTime = record.reformTime = function(ft) {
    if(ft){
      var ftime=ft.split(/[:.+]/).reverse();
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

  var encodeTime = record.encodeTime = function(time) {
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

  var decodeRacenum = record.decodeRaceNum = function(racenum) {
    if( racenum == null ) {
      return(null);
    }else if( racenum!="" && racenum>=0){
      return(("000"+racenum).slice(-3));
    }else{
      return("");
    }
  };

  var encodeRacenum = record.eecodeRaceNum = function(racenum) {
    if(racenum == null) {
      return(null);
    }else if(racenum != null && racenum!="" && racenum>=0){
      return(("000"+racenum).slice(-3));
    }else{
      return(-1);
    }
  };

  var addRow = record.addRow = function(){
    if( $("#record-time-tbody").children().length == 0  || $("#record-time-tbody").children().last().find(".record-rid-nz").text() ) {
      var seqnum=$("#record-time-tbody").children().length;
      var newRow = $("#record-time-tbody").append(`
        <tr valign="middle">
           <td class="record-seqnum" id="record-seqnum-${seqnum}">${seqnum}</td>
        </tr>
      `);
      for(var recordNum in [0,1,2,3,4]) {
        var numEditable=$("#btnRecordNumEditable-"+recordNum).attr("aria-pressed") == "true" ? "" : "disabled" ;
        var ftimeEditable=$("#btnRecordFTimeEditable-"+recordNum).attr("aria-pressed") == "true" ? "" : "disabled" ;
        var dtimeEditable=$("#btnRecordDTimeEditable-"+recordNum).attr("aria-pressed") == "true" ? "" : "disabled" ;

        var hiddenFTime="hidden";
        var hiddenDTime="hidden";
        if($("#diffTime").attr("aria-pressed")=="true") {
            hiddenDTime = "";
        }else{
            hiddenFTime= "";
        }
        var recordRidNz ;
        if(recordNum==0) {
          recordRidNz="";
        }else{
          recordRidNz="record-rid-nz";
        }
        $(newRow).children().last().append(`
          <td class="hidden record-rid-${recordNum} record-rid ${recordRidNz}" id="record-rid-${recordNum}-${seqnum}"></td>
          <td>
            <input class="record-num-${recordNum}" type="text" id="record-num-${recordNum}-${seqnum}" name="num${recordNum}-${seqnum}" value="" size="4" ${numEditable} />
          </td>
          <td class="show-ftime ${hiddenFTime}">
            <input class="record-ftime-${recordNum}" type="text" id="record-ftime-${recordNum}-${seqnum}" name="ftime${recordNum}-${seqnum}" value="" size="11" ${ftimeEditable} />
          </td>
          <td class="show-dtime ${hiddenDTime}">
            <input class="record-dtime-${recordNum}" type="text" id="record-dtime-${recordNum}-${seqnum}" name="dtime${recordNum}-${seqnum}" value="" size="11" ${dtimeEditable} />
          </td>
        `);
      }
      $("#record-rid-0-"+seqnum).text(seqnum+1);
    }
    checkNumEditable();
    checkFTimeEditable();
    checkDTimeEditable();
  };
  addRow();
});
