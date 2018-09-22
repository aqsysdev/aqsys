//
//
//  クライアント用表彰リスト操作 javascript
//
//

$(function(){
  aqsysCoder.setConfig(JSON.parse($("#variable-handler").val()));

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

  ////////////////////////////////////////////////////////////////////
  //
  // カテゴリー検索
  //
  ////////////////////////////////////////////////////////////////////

  $('.dropdown-cate-search li').on('click', function(ev){
    var table = $("#prizelist").DataTable();
    // #testhoge をクリックすると table の 2列目から 728を検索して返す
    // 列は 0 列目から始まる。
    //alert($(this).text().split(":")[0]);
    if($(this).text()) {
      table.column(1).search("cate"+$(this).text().split(":")[0]).draw();
    }else{
      table.column(1).search("").draw();
    }
    $('#prize-cate-search').html(($("#entrylist").DataTable().column(2).search() || '<a><span class="caret"></span></a>').replace(/^cate/,""));
  });
  $('#prize-cate-search').html(($("#entrylist").DataTable().column(2).search() || '<a><span class="caret"></span></a>').replace(/^cate/,""));


  ////////////////////////////////////////////////////////////////////
  //
  // ウェーブ検索
  //
  ////////////////////////////////////////////////////////////////////

  $('.dropdown-wave-search li').on('click', function(ev){
    var table = $("#prizelist").DataTable();
    // #testhoge をクリックすると table の 2列目から 728を検索して返す
    // 列は 0 列目から始まる。
    //alert($(this).text().split(":")[0]);
    $(this).parent().prev().html($(this).html());
    if($(this).text()) {
      table.column(2).search("wave"+$(this).text()).draw();
    }else{
      table.column(2).search("").draw();
    }
    $('#prize-wave-search').html(($("#entrylist").DataTable().column(3).search() || '<a><span class="caret"></span></a>').replace(/^wave/,""));
  });
  $('#prize-wave-search').html(($("#entrylist").DataTable().column(3).search() || '<a><span class="caret"></span></a>').replace(/^wave/,""));

  ////////////////////////////////////////////////////////////////////
  //
  // トータルタイム編集
  //
  ////////////////////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////////////////////
  //
  // prize 編集
  //
  ////////////////////////////////////////////////////////////////////

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
              $(btn).val(aqsysCoder.diffTime(stimeObj.stime,ftimeObj.ftime));
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
////////////////////////////////////////////////////////////////////
//
//  トータル時間編集
//
////////////////////////////////////////////////////////////////////
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
    data.ttime=aqsysCoder.reformTime(value);
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
////////////////////////////////////////////////////////////////////
//
//  順位編集
//
////////////////////////////////////////////////////////////////////
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
  data[index]=aqsysCoder.encodePrize(value);
  $.putE(id,data,
  function(data,stat){
    $.getE(data.id, data,
    function(data,stat) {
      $(that).val(aqsysCoder.decodePrize(data[index]));
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
