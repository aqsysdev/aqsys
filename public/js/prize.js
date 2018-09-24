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
        [11,"asc"],[1,"asc"],[2,"asc"],[6,"asc"],[0,"asc"]
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
    $('#prize-cate-search').html(($("#prizelist").DataTable().column(1).search() || '<a><span class="caret"></span></a>').replace(/^cate/,""));
  });
  $('#prize-cate-search').html(($("#prizelist").DataTable().column(1).search() || '<a><span class="caret"></span></a>').replace(/^cate/,""));


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
    $('#prize-wave-search').html(($("#prizelist").DataTable().column(2).search() || '<a><span class="caret"></span></a>').replace(/^wave/,""));
  });
  $('#prize-wave-search').html(($("#prizelist").DataTable().column(2).search() || '<a><span class="caret"></span></a>').replace(/^wave/,""));

  ////////////////////////////////////////////////////////////////////
  //
  // prize 編集
  //
  ////////////////////////////////////////////////////////////////////

  for(var i=1; i < 4 ; i++) {
    $('#prize-'+i+'-editable').on('click', function () {
      var these = $(this).prop("id").split(/-/);
      var btn;
      var btns;
      var editable=$(this).prop("editable") == true ? false : true;
      $(this).prop("editable",editable);
      btns=$("."+these[0]+"-"+these[1]);
      for(btn of btns) {
        btn.disabled=(editable?false:"disabled");
        $(btn).off('change');
        $(btn).on('change',new Promise(function(resolve,reject){
            changePrize($(btn),resolve,reject);
        }));
      }
    });
    $('#prize-'+i+'-caret').on('click',  function () {
      var these = $(this).prop("id").split(/-/);
      var btn;
      var btns;
      $(this).prop("editable",false);
      btns=$("."+these[0]+"-"+these[1]);
      for(btn of btns) {
        btn.disabled="disabled";
      }
    });
    $('#prize-'+i+'-remove').on('click', function () {
      var these = $(this).prop("id").split(/-/);
      var btn;
      var btns;
      //      var yes=confirm('データを消去します。この操作は取り消しができません。');
      //if( yes ) {
        $(this).prop("editable",false);
        btns=$("."+these[0]+"-"+these[1]);
        var promises = [];
        for(btn of btns) {
          $(btn).val("");
          promises.push(new Promise( function(resolve,reject) {
            changePrize($(btn),resolve,reject);
          }));
        }
        Promise.all(promises).then( function() {
          location.reload();
        }).catch( function() {
          alert("順位データの消去に失敗しました。");
        });
      //}
    });
  }

  ////////////////////////////////////////////////////////////////////
  //
  // トータルタイム編集
  //
  ////////////////////////////////////////////////////////////////////

  $('#prize-ttime-editable').on('click', function () {
    var btn;
    var btns;
    $(this).prop("editable",true);
    var editable=($(this).prop("editable"));
    btns=$(".prize-ttime");
    for(btn of btns) {
      btn.disabled=(editable?false:"disabled");
    }
    $('.prize-ttime').off('change');
    $('.prize-ttime').on('change',function(){
      btn.disabled=(editable?false:"disabled");
      $(btn).off('change');
      $(btn).on('change',function(){
        var promise=new Promise( function(resolve,reject) {
          changeTtime(this,resolve,reject);
        });
        promise.then(function(){
          location.reload();
        });
      });
    });
    //location.reload();
  });

  $('#prize-ttime-caret').on('click',  function () {
    var btn;
    var btns;
    $(this).prop("editable",false);
    btns=$(".prize-ttime");
    for(btn of btns) {
      btn.disabled="disabled";
    }
  });
  $('#prize-ttime-remove').on('click',  function () {
    var btn;
    var btns;
    $(this).prop("editable",false);
    btns=$(".prize-ttime");
    var promises=[];
    for(btn of btns) {
      $(btn).val("");
      promises.push(new Promise( function(resolve,reject) {
        changeTtime($(btn),resolve,reject);
      }));
    }
    Promise.all(promises).then( function() {
      location.reload();
    }).catch( function() {
      alert("タイムの集計結果の消去に失敗しました。");
    });
  });
  $('#prize-ttime-autofill').on('click',  function () {
    autoFillTtime(this);
  });

  ////////////////////////////////////////////////////////////////////
  //
  // 自動集計
  //
  ////////////////////////////////////////////////////////////////////

  var waves = [];
  var record = [];

  function autoFillTtime(that) {
    $.getW("", waves,
    function(waves,stat) {
  //      alert(JSON.stringify(waves));
      $.getR("", record,
        function(record,stat){
  //          alert(JSON.stringify(record));
          var stime0 = waves.find(function(elm){return(elm.wid==1);}).stime;
          var ftime0 = record.find(function(elm){return(elm.rid==1);}).ftime;
          var ttimeBtns = $('.prize-ttime');
          var promises=[];
          for(btn of ttimeBtns) {
  //          if( !$(btn).val() || $(btn).val() == "DNF" ) {
              var id=$(btn).prop("id").split(/-/)[2];
              var racenum=($(btn).parents("tr").find(".prize-race-num").val()||0)*1;
              var wid=($(btn).parents("tr").find(".prize-wave").val()||0)*1;
  //              var id=$(btn).parent().parent().children().last().text().trim();
  //              var racenum=$(btn).parent().parent().children().first().children().next().val()*1;
  //              var wid=$(btn).parent().parent().children().next().next().children().next().val()*1;
              var waveObj=waves.find(function(elm){return((elm.wid)*1==wid && !elm.disabled);});
              var recodeObj=record.find(function(elm){return((elm.racenum)*1==racenum && !elm.disabled );});
              if(waveObj && waveObj.stime && recodeObj && recodeObj.ftime) {
                $(btn).val(aqsysCoder.diffTime(
                  aqsysCoder.diffTime(stime0,waveObj.stime),
                  aqsysCoder.diffTime(ftime0,recodeObj.ftime)
                ));
              }else{
                $(btn).val("DNF");
              }
              promises.push(new Promise( function(resolve,reject) {
                changeTtime($(btn),resolve,reject);
              }));
  //          }
          }
          Promise.all(promises).then( function() {
            location.reload();
          }).catch( function() {
            alert("タイムの集計結果の記録に失敗しました。");
          });
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
  function changeTtime(that,resolve,reject) {
    $(that).addClass("unconfirmed");
    var value=$(that).val();
    var id=$(that).prop("id").split("-")[2];
    $("#prize-ttime-"+id).find("a").text=value;
  //  alert("id:"+id+" value:"+value);
    //
    //  編集
    //
    var data = {};
    if(!value) {
      data.DNF = true;
    }else if(value=="DNF"){
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
          $("#prize-ttime-"+id).find("a").text="DNF";
        }else{
          $(that).val(data.ttime);
          $("#prize-ttime-"+id).find("a").text=data.ttime;
        }
        $(that).removeClass("unconfirmed");
        resolve();
      },
      function(req,stat,err){
        alert("記録の確認に失敗しました。");
        reject();
      });
    },
    function(req,stat,err){
      alert("記録の書き込みに失敗しました。");
      reject();
    });
  }
  ////////////////////////////////////////////////////////////////////
  //
  //  順位編集
  //
  ////////////////////////////////////////////////////////////////////
  function changePrize(that,resolve,reject) {
    $(that).addClass("unconfirmed");
    var value=$(that).val();
    var those=$(that).prop("name").split(/-/);
    var index=those[0]+those[1];
    var id=those[2];
    $($(that).prop("name")).find("a").text(value);
    //alert("id:"+id+" value:"+value);
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
        $($(that).prop("name")).find("a").text(aqsysCoder.decodePrize(data[index]));
        $(that).removeClass("unconfirmed");
        resolve();
      },
      function(req,stat,err){
        alert("記録の確認に失敗しました。");
        reject();
      });
    },
    function(req,stat,err){
      alert("記録の書き込みに失敗しました。");
      reject();
    });
  }

  ////////////////////////////////////////////////////////////////////
  //
  // カテゴリー順位自動集計
  //
  ////////////////////////////////////////////////////////////////////

  $(document).on('click', '#prize-1-autofill', function () {
    var these = $(this).prop("id").split(/-/);
    var btn;
    var btns;
    $(this).prop("editable",false);
    btns=$("."+these[0]+"-"+these[1]);
    var promises=[];
    var prevNums={};

    for(btn of btns) {
      var those = $(btn).prop("name").split(/-/);
      if($("#prize-ttime-"+those[2]).val()!="" && $("#prize-ttime-"+those[2]).val()!="DNF" ) {
        var cateName = $("#prize-cate-"+those[2]).text();
        if(!prevNums[cateName]) {
          prevNums[cateName]=0;
        }
        if($(btn).val()=="") {
          $(btn).val(++prevNums[cateName]);
        }
        if($(btn).val()=="-" || $(btn).val() == "1") {
          var btn2 = $("#prize-2-"+those[2]).parents("td").find("input");
          $(btn2).val("-");
          promises.push(new Promise( function(resolve,reject) {
            changePrize($(btn2),resolve,reject);
          }));
        }
      }
      promises.push(new Promise( function(resolve,reject) {
        changePrize($(btn),resolve,reject);
      }));
      //          }
    }
    Promise.all(promises).then( function() {
      location.reload();
    }).catch( function() {
      alert("順位の記録に失敗しました。");
    });
  });


  ////////////////////////////////////////////////////////////////////
  //
  // 年齢別順位自動集計
  //
  ////////////////////////////////////////////////////////////////////


  $(document).on('click', '#prize-2-autofill', function () {
    var these = $(this).prop("id").split(/-/);
    var btn;
    var btns;
    $(this).prop("editable",false);
    btns=$("."+these[0]+"-"+these[1]);
    var promises=[];
    var prevNums={};

    for(btn of btns) {
      var those = $(btn).prop("name").split(/-/);
      if($("#prize-ttime-"+those[2]).val()!="" && $("#prize-ttime-"+those[2]).val()!="DNF" ) {
        if($("prise-fname-"+those[2]).text()==""){
          var cateName  = $("#prize-cate-"+those[2]).text();
          var gradeName = $("#prize-grade-"+those[2]).find("a").text();
          var sex       = $("#prize-sex-"+those[2]).find("a").text();
          if( aqsysCoder.getConfig().grades.indexOf(gradeName)<0 ) {
            gradeName = cateName + "-" + gradeName.split("")[0] + "0才代";
          }else{
            gradeName = cateName + "-" + gradeName + "-" + sex;
          }
          if(!prevNums[gradeName]) {
            prevNums[gradeName]=0;
          }
          if($(btn).val()=="") {
            $(btn).val(++prevNums[gradeName]);
          }
        }
      }
      promises.push(new Promise( function(resolve,reject) {
        changePrize($(btn),resolve,reject);
      }));
      //          }
    }
    Promise.all(promises).then( function() {
      location.reload();
    }).catch( function() {
      alert("順位の記録に失敗しました。");
    });
  });


  ////////////////////////////////////////////////////////////////////
  //
  // 大田区賞自動集計
  //
  ////////////////////////////////////////////////////////////////////


  $(document).on('click', '#prize-3-autofill', function () {
    var these = $(this).prop("id").split(/-/);
    var btn;
    var btns;
    var prevNum=0;
    $(this).prop("editable",false);
    btns=$("."+these[0]+"-"+these[1]);
    var promises=[];
    for(btn of btns) {
      var those = $(btn).prop("name").split(/-/);
      if($("#prize-ttime-"+those[2]).val()!="" && $("#prize-ttime-"+those[2]).val()!="DNF" ) {
        if($(btn).val()=="") {
          $(btn).val(++prevNum);
        }else if(!isNaN($(btn).val())) {
          prevNum = $(btn).val();
        }
      }
      promises.push(new Promise( function(resolve,reject) {
        changePrize($(btn),resolve,reject);
      }));
      //          }
    }
    Promise.all(promises).then( function() {
      location.reload();
    }).catch( function() {
      alert("順位の記録に失敗しました。");
    });
  });


});
