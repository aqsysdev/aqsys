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


////////////////////////////////////////////////////////////
//
//    ボタンにコールバック設定
//
////////////////////////////////////////////////////////////
  $("#diffTime").addClass("active");
  $("#absTime").removeClass("active");
  $("#viewMode").addClass("active");
  $("#editMode").removeClass("active");

//
// 時間ボタン
//
  $("#diffTime").on('click',function(){
    $("#diffTime").addClass("active");
    $("#absTime").removeClass("active");

    $(".show-dtime").removeClass("hidden");
    $(".show-ftime").addClass("hidden");
    if($("#viewMode.active").length) {
      $(".show-edit").addClass("hidden");
    }
    if($("#editMode.active").length) {
      $(".show-view").addClass("hidden");
    }
  });

//
//  時刻ボタン
//
  $("#absTime").on('click',function(){
    $("#diffTime").removeClass("active");
    $("#absTime").addClass("active");

    $(".show-dtime").addClass("hidden");
    $(".show-ftime").removeClass("hidden");

    if($("#viewMode.active").length) {
      $(".show-edit").addClass("hidden");
    }
    if($("#editMode.active").length) {
      $(".show-view").addClass("hidden");
    }
  });

//
//  表示ボタン
//
  $("#viewMode").on('click',function(){
    $("#viewMode").addClass("active");
    $("#editMode").removeClass("active");

    $(".show-view").removeClass("hidden");
    $(".show-edit").addClass("hidden");

    if($("#absTime.active").length) {
      $(".show-dtime").addClass("hidden");
    }
    if($("#diffTime.active").length) {
      $(".show-ftime").addClass("hidden");
    }
  });

  //
  //  編集ボタン
  //
  $("#editMode").on('click',function(){
    $("#viewMode").removeClass("active");
    $("#editMode").addClass("active");

    $(".show-view").addClass("hidden");
    $(".show-edit").removeClass("hidden");

    if($("#absTime.active").length) {
      $(".show-dtime").addClass("hidden");
    }
    if($("#diffTime.active").length) {
      $(".show-ftime").addClass("hidden");
    }
    addRow();
  });

  //
  //num 選択ラジオボタン
  //
  $('.record-num-radio').on('click',  function(){
    $('.record-num-radio').removeClass("active");
    $(this).addClass("active");
    var id = $(this).eq(0).attr("id").split("-");
    copyToRecord0(id[1],id[3]);
  });

  //
  //ftime 選択ラジオボタン
  //
  $('.record-ftime-radio').on('click', function(){
    $('.record-ftime-radio').removeClass("active");
    $('.record-dtime-radio').removeClass("active");
    $(this).addClass("active");
    var id = $(this).eq(0).attr("id").split("-");
    copyToRecord0(id[1],id[3]);
  });

  //
  //dtime 選択ラジオボタン
  //
  $('.record-dtime-radio').on('click',  function(){
    $('.record-ftime-radio').removeClass("active");
    $('.record-dtime-radio').removeClass("active");
    $(this).addClass("active");
    var id = $(this).eq(0).attr("id").split("-");
    copyToRecord0(id[1],id[3]);
  });


//
//  レースナンバー編集可能ボタン
//
  $('.btnRecordNumEditable').on('click', function(){
    var recordNum = $(this).attr("id").split("-")[1];
    var isChecked=($("#btnRecordNumEditable-"+recordNum).attr("aria-pressed") == "true");

    $(".record-num-"+recordNum).each( function() {
      this.disabled=isChecked;
    });
    $('.record-num-'+recordNum).off('change')
    .on('change',function(req){ recordEditNum(this); });
    $('.record-num-'+recordNum).off('keyup')
    .on('keyup',function(req){
      if(req.keyCode == 13) {
      var these=$(this).attr("id").split("-");
        $("#"+these[0]+"-"+these[1]+"-"+these[2]+"-"+(1+1*these[3])).focus();
        $("#"+these[0]+"-"+these[1]+"-"+these[2]+"-"+(1+1*these[3])).select();
      }
    });
  });

  //
  //  フィニッシュ時刻編集可能ボタン
  //
  $('.btnRecordFTimeEditable').on('click', function(){
    var recordNum = $(this).attr("id").split("-")[1];
    var isChecked=($("#btnRecordFTimeEditable-"+recordNum).attr("aria-pressed") == "true");
    $(".record-ftime-"+recordNum).each( function() {
      this.disabled=isChecked;
    });
    $('.record-ftime-'+recordNum).off('change')
    .on('change',function(req){ recordEditFTime(this); });
    $('.record-ftime-'+recordNum).off('keyup')
    .on('keyup',function(req){
      if(req.keyCode == 13) {
      var these=$(this).attr("id").split("-");
        $("#"+these[0]+"-"+these[1]+"-"+these[2]+"-"+(1+1*these[3])).focus();
        $("#"+these[0]+"-"+these[1]+"-"+these[2]+"-"+(1+1*these[3])).select();
      }
    });
  });

  //
  //  時間編集可能ボタン
  //
  $('.btnRecordDTimeEditable').on('click',  function(){
    var recordNum = $(this).attr("id").split("-")[1];
    var isChecked=($("#btnRecordDTimeEditable-"+recordNum).attr("aria-pressed") == "true");
    $(".record-dtime-"+recordNum).each( function() {
      this.disabled=isChecked;
    });
    $('.record-dtime-'+recordNum).off('change')
    .on('change',function(req){ recordEditDTime(this); });
    $('.record-dtime-'+recordNum).off('keyup')
    .on('keyup',function(req){
      if(req.keyCode == 13) {
      var these=$(this).attr("id").split("-");
        $("#"+these[0]+"-"+these[1]+"-"+these[2]+"-"+(1+1*these[3])).focus();
        $("#"+these[0]+"-"+these[1]+"-"+these[2]+"-"+(1+1*these[3])).select();
      }
    });
  });

  //////////////////////////////////////////////////////////////////////////
  //
  //  レースナンバー編集
  //
  //////////////////////////////////////////////////////////////////////////
  function recordEditNum(that){
    $(that).addClass("unconfirmed");
    var recordNum=$(that).attr("id").split("-")[2];
    var seqnum=$(that).attr("id").split("-")[3];
    var value=$(that).val();
    var rid=$(that).parent().prev().text().trim();
    //alert("that.id:"+$(that).attr("id")+" recordNum:"+recordNum+" rid:"+rid+" num:"+value);
    var data = {
      racenum: value,
      disabled: false
    };
    var ftime;
    //    if((ftime=$(that).parent().next().children().last().text())) {
    if((ftime=$("#record-ftime-"+recordNum+"-"+seqnum).val())){
      data.ftime = ftime;
    }else if((ftime=$("#record-ftime-"+recordNum+"-"+(seqnum-1)).val())) {
      data.ftime = addTime(ftime,"00:00:01.00");
    }else{
      data.ftime = encodeTime( new Date() );
    }
    $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
    if(seqnum==0) {
      $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
    }else{
      $("#record-dtime-"+recordNum+"-"+seqnum).val(
        diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
      );
    }
    //
    //  追加
    //
    if(!rid || isNaN(rid)) {
      $.post("/api/record/"+recordNum, data,
      function(data,stat){
        //alert(JSON.stringify(data));
        $.get("/api/record/"+recordNum+"_"+data.rid,data,
        function(data,stat) {
          //alert("that.id:"+$(that).attr("id")+" recordNum:"+data.recordNum+" rid:"+data.rid+" num:"+data.racenum+" seqnum:"+seqnum);
          $("#record-rid-"+recordNum+"-"+seqnum).text(data.rid);
          $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          if(seqnum==0) {
            $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          }else{
            $("#record-dtime-"+recordNum+"-"+seqnum).val(
              diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
            );
          }
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
          $("#record-rid-"+recordNum+"-"+seqnum).text(data.rid);
          $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          if(seqnum==0) {
            $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          }else{
            $("#record-dtime-"+recordNum+"-"+seqnum).val(
              diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
            );
          }
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

  //////////////////////////////////////////////////////////////////////////
  //
  //  フィニッシュ時刻編集
  //
  //////////////////////////////////////////////////////////////////////////
  function recordEditFTime(that){
    $(that).addClass("unconfirmed");
    var recordNum=$(that).eq(0).attr("id").split("-")[2];
    var seqnum=$(that).attr("id").split("-")[3];
    var value=reformTime($(that).val());
    var rid=$(that).parent().prev().prev().text().trim();

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
          $("#record-rid-"+recordNum+"-"+seqnum).text(data.rid);
          $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          if(seqnum==0) {
            $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          }else{
            $("#record-dtime-"+recordNum+"-"+seqnum).val(
              diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
            );
          }
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
          $("#record-rid-"+recordNum+"-"+seqnum).text(data.rid);
          $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          if(seqnum==0) {
            $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          }else{
            $("#record-dtime-"+recordNum+"-"+seqnum).val(
              diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
            );
          }
          $(that).removeClass("unconfirmed");
        },
        function(req,stat,err){
          $(that).val("");
        });
      },
      function(req,stat,err){
        $.get("/api/record/"+recordNum+"_"+rid, data,
        function(data,stat) {
          $("#record-rid-"+recordNum+"-"+seqnum).text(data.rid);
          $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          if(seqnum==0) {
            $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
          }else{
            $("#record-dtime-"+recordNum+"-"+seqnum).val(
              diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
            );
          }
          $(that).removeClass("unconfirmed");
        },
        function(req,stat,err){
          $(that).val("");
        });
      });
    }
  }

  //////////////////////////////////////////////////////////////////////////
  //
  //  フィニッシュ時間編集
  //
  //////////////////////////////////////////////////////////////////////////
  function recordEditDTime(that){
    $(that).addClass("unconfirmed");
    var recordNum=$(that).eq(0).attr("id").split("-")[2];
    var seqnum=$(that).attr("id").split("-")[3];
    var value=reformTime($(that).val());
    var rid=$(that).parent().prev().prev().prev().text().trim();
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
            $("#record-rid-"+recordNum+"-"+seqnum).text(data.rid);
            $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
            if(seqnum==0) {
              $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
            }else{
              $("#record-dtime-"+recordNum+"-"+seqnum).val(
                diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
              );
            }
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
            $("#record-rid-"+recordNum+"-"+seqnum).text(data.rid);
            $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
            if(seqnum==0) {
              $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
            }else{
              $("#record-dtime-"+recordNum+"-"+seqnum).val(
                diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
              );
            }
            $(that).removeClass("unconfirmed");
          },
          function(req,stat,err){
            $(that).val("");
          });
        },
        function(req,stat,err){
          $.get("/api/record/"+recordNum+"_"+rid, data,
          function(data,stat) {
            $("#record-rid-"+recordNum+"-"+seqnum).text(data.rid);
            $("#record-ftime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
            if(seqnum==0) {
              $("#record-dtime-"+recordNum+"-"+seqnum).val(reformTime(data.ftime));
            }else{
              $("#record-dtime-"+recordNum+"-"+seqnum).val(
                diffTime($("#record-dtime-"+recordNum+"-"+0).val(),data.ftime)
              );
            }
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
    if(
      (fieldName=="num" && $("#btnRecordNumEditable-0").attr("aria-pressed") == "true") ||
      (fieldName=="ftime" && $("#btnRecordFTimeEditable-0").attr("aria-pressed") == "true") ||
      (fieldName=="dtime" && $("#btnRecordDTimeEditable-0").attr("aria-pressed") == "true")
    ) {
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
    }else{
      alert("採用記録の編集ボタンを押してください。");
    }
  };



  var copyToRecord0One = record.copyToRecord0One =
  function(fieldName, recordNum, seqnum) {
    if(fieldName == "num" ){
      $("#record-num-0-"+seqnum).val(""+$("#record-num-"+recordNum+"-"+seqnum).val());
      $("#record-num-0-"+seqnum).trigger("change");
    }else{
      $("#record-ftime-0-"+seqnum).val(""+$("#record-ftime-"+recordNum+"-"+seqnum).val());
      $("#record-ftime-0-"+seqnum).trigger("change");
    }
  };

  var calcTime = record.calcTime =
  function calcTime(fromTime, toTime) {
      return(centisecTime(toTime)-centisecTime(fromTime));
  };

  var diffTime = record.diffTime =
  function(fromTime, toTime) {
    var diffCentisec;
    diffCentisec = calcTime(fromTime,toTime);
    if(diffCentisec>=0) {
      return(formTime(diffCentisec));
    }else{
      return(formTime(diffCentisec+centisecTime("24:00:00.00")));
    }
  };

  var addTime = record.addTime =
  function(fromTime, toTime) {
      return(formTime(centisecTime(fromTime)+centisecTime(toTime)));
  };

  var formTime = record.formTime =
  function(cs) {
      var centisec=new Decimal(cs);
      return(
        ("00"+parseInt(centisec.div(60*60*100),0)%24).slice(-2)+":"+
        ("00"+parseInt(centisec.div(60*100),0)%60).slice(-2)+":"+
        ("00"+parseInt(centisec.div(100),0)%60).slice(-2)+"."+
        ("00"+parseInt(centisec%100,0)).slice(-2)
      );
  };

  var reformTime = record.reformTime =
  function(ft) {
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

  var centisecTime = record.centisecTime =
  function(time) {
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

  var encodeTime = record.encodeTime =
  function(time) {
    return(
  //    ("0000"+(time.getFullYear()||0)).slice(-4)+"/"+
  //    ("00" + (time.getMonth()+1)).slice(-2)+"/"+
  //    ("00" + (time.getDate()||0)).slice(-2)+" "+
      ("00" + (time.getHours()||0)).slice(-2)+":"+
      ("00" + (time.getMinutes()||0)).slice(-2)+":"+
      ("00" + (time.getSeconds()||0)).slice(-2)+"."+
      ("000" + (time.getTime()||0)).slice(-3).slice(2)
    );
  };

  var decodeRacenum = record.decodeRaceNum =
  function(racenum) {
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
    //alert("addRow");
    if( $("#recordTimeTbody").children().length == 0  || $("#recordTimeTbody").children().last().find(".record-rid-nz").text() ) {
      alert("addRow:"+$("#recordTimeTbody").children().last().find(".record-rid-nz").text());
      var seqnum=$("#recordTimeTbody").children().length+1;
      var newRow = $("#recordTimeTbody").append(`
        <tr align="center" valign="middle">
           <td style="width:60px" class="record-seqnum" id="record-seqnum-${seqnum}">${seqnum}</td>
        </tr>
      `);
      alert("seqnum:"+seqnum+" newRow:"+newRow);
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
        alert("recordRidNz:"+recordRidNz+" recordNum:"+recordNum);
        $(newRow).children().last().append(`
          <td class="hidden record-rid-${recordNum} record-rid ${recordRidNz}" id="record-rid-${recordNum}-${seqnum}"></td>
          <td  style="width:60px">
            <input class="record-num-${recordNum}" type="text" id="record-num-${recordNum}-${seqnum}" name="num${recordNum}-${seqnum}" value="" size="4" ${numEditable} /><div class="hidden"></div>
          </td>
          <td style="width:120px" class="show-ftime ${hiddenFTime}">
            <input class="record-ftime-${recordNum}" type="text" id="record-ftime-${recordNum}-${seqnum}" name="ftime${recordNum}-${seqnum}" value="" size="11" ${ftimeEditable} /><div class="hidden"></div>
          </td>
          <td style="width:120px" class="show-dtime ${hiddenDTime}">
            <input class="record-dtime-${recordNum}" type="text" id="record-dtime-${recordNum}-${seqnum}" name="dtime${recordNum}-${seqnum}" value="" size="11" ${dtimeEditable} /><div class="hidden"></div>
          </td>
        `);
      }
      $("#record-rid-0-"+seqnum).text(seqnum+1);
      $("#record-ftime-1-"+seqnum).parent().addClass("show-edit");
      $("#record-dtime-1-"+seqnum).parent().addClass("show-edit");
      $("#record-num-2-"+seqnum).parent().addClass("show-edit");
      $("#record-ftime-3-"+seqnum).parent().addClass("show-edit");
      $("#record-dtime-3-"+seqnum).parent().addClass("show-edit");
      $("#record-num-4-"+seqnum).parent().addClass("show-edit");
    }
    setHidden();
  };

  var setHidden = record.setHidden = function(){
    $(".show-ftime").removeClass("hidden");
    $(".show-dtime").removeClass("hidden");
    $(".show-view").removeClass("hidden");
    $(".show-edit").removeClass("hidden");
    if($("#viewMode.active").length) {
      $(".show-edit").addClass("hidden");
    }
    if($("#editMode.active").length) {
      $(".show-view").addClass("hidden");
    }
    if($("#absTime.active").length) {
      $(".show-dtime").addClass("hidden");
    }
    if($("#diffTime.active").length) {
      $(".show-ftime").addClass("hidden");
    }
  };

  $("#recordTable").find("tbody").attr('id', "recordTimeTbody");
  addRow();
});
