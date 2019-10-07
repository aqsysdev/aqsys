//
//
// QR コード受付
//
//

$(function() {

  //
  // パラメータの受け取り
  //
  aqsysCoder.setConfig(JSON.parse($("#variable-handler").val()));

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


  ////////////////////////////////////////////////////////////////////
  //
  // カテゴリー編集ボタン
  //
  ////////////////////////////////////////////////////////////////////

  $('#btnEntryCateEditable').on('click', function () {
    var isChecked;
    isChecked=($(this).attr("aria-pressed") == "true");
    $(".entry-cate").prop("disabled",isChecked);
  });

  ////////////////////////////////////////////////////////////////////
  //
  // レースナンバー編集ボタン
  //
  ////////////////////////////////////////////////////////////////////

  $('#btnEntryRaceNumEditable').on('click', function () {
    var isChecked;
    isChecked=($(this).attr("aria-pressed") == "true");
    $(".entry-race-num").prop("disabled",isChecked);
  });

  ////////////////////////////////////////////////////////////////////
  //
  // wave　編集ボタン
  //
  ////////////////////////////////////////////////////////////////////

  $('#btnEntryWaveEditable').on('click', function () {
    var isChecked;
    isChecked=($(this).attr("aria-pressed") == "true");
    $(".entry-wave").prop("disabled",isChecked);
  });
  ////////////////////////////////////////////////////////////////////
  //
  // カテゴリー変更
  //
  ////////////////////////////////////////////////////////////////////

  $('.dropdown-cate li').on('click', function(){
    if($(this).html()!=$(this).parent().prev().html()){
      $(this).parent().prev().addClass("unconfirmed");
      $(this).parent().prev().html($(this).html());
      var num=$(this).attr('name');
      var id=$(this).parents('.dropdown-cate').attr("id").split('-')[2];
      var that=this;
      $.put("/api/entry/"+id, {cate: num},
      function(data,stat){
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(data.id==id){
            $(that).parent().prev().removeClass("unconfirmed");
          }
        },
        function(req,stat,err){
        });
      },
      function(req,stat,err){
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(data.id==id){
            $(that).removeClass("unconfirmed");
          }
        },
        function(req,stat,err){
        });
      });
    }
  });

  ////////////////////////////////////////////////////////////////////
  //
  // カテゴリー検索
  //
  ////////////////////////////////////////////////////////////////////

  $('.dropdown-cate-search li').on('click', function(ev){
    var table = $("#entrylist").DataTable();
    // #testhoge をクリックすると table の 2列目から 728を検索して返す
    // 列は 0 列目から始まる。
    //alert($(this).text().split(":")[0]);
    if($(this).text()) {
      table.column(2).search("cate"+$(this).text().split(":")[0]).draw();
    }else{
      table.column(2).search("").draw();
    }
    $('#entry-cate-search').html(($("#entrylist").DataTable().column(2).search() || '<a><span class="caret"></span></a>').replace(/^cate/,""));
    location.reload();
  });
  $('#entry-cate-search').html(($("#entrylist").DataTable().column(2).search() || '<a><span class="caret"></span></a>').replace(/^cate/,""));

  ////////////////////////////////////////////////////////////////////
  //
  // レースナンバー変更
  //
  ////////////////////////////////////////////////////////////////////
  $('.entry-race-num').on('change',function(req){
    $(this).addClass("unconfirmed");
    var racenum=aqsysCoder.encodeRacenum($(this).val());
    $(this).val(aqsysCoder.decodeRacenum(racenum));
    $(this).parents("td").find("a").text(aqsysCoder.decodeRacenum(racenum));
    var id=$(this).attr("id").split('-')[2];
    var that=this;
    $.put("/api/entry/"+id, {racenum: racenum},
    function(data,stat){
      $.get("/api/entry/"+id, data, function(data,stat) {
        if(aqsysCoder.decodeRacenum(data.racenum)==racenum){
          $(that).removeClass("unconfirmed");
        }else{
          $(that).val(aqsysCoder.decodeRacenum(data.racenum));
          $(that).parents("td").find("a").text(aqsysCoder.decodeRacenum(data.racenum));
        }
      },
      function(req,stat,err){
        $.get("/api/entry/"+id, data, function(data,stat) {
          var racenum=aqsysCoder.decodeRacenum(data.racenum);
          $(that).val(racenum);
          $(that).parents("td").find("a").text(racenum);
        },
        function(req,stat,err){
          $(that).val("");
          $(that).parents("td").find("a").text("");
        });
      });
    },
    function(req,stat,err){
    });
  });

  ////////////////////////////////////////////////////////////////////
  //
  // ウェーブ変更
  //
  ////////////////////////////////////////////////////////////////////

  $('.entry-wave').on('change',function(req) {
    $(this).addClass("unconfirmed");
    var wave=aqsysCoder.encodeWave($(this).val());
    $(this).val(aqsysCoder.decodeWave(wave));
    $(this).parents("td").find("a").text(aqsysCoder.decodeWave(wave));
    var id=$(this).attr("id").split('-')[2];
    var that=this;
    $.put("/api/entry/"+id, {wave: wave},
    function(data,stat){
      $.get("/api/entry/"+id, data, function(data,stat) {
        var wave=aqsysCoder.decodeWave(data.wave);
        $(that).removeClass("unconfirmed");
        $(that).val(wave);
        $(that).parents("td").find("a").text(wave);
      },
      function(req,stat,err){
      });
    },
    function(req,stat,err){
      $.get("/api/entry/"+id, data, function(data,stat) {
        var wave=aqsysCoder.decodeWave(data.wave);
        $(that).val(wave);
        $(that).parents("td").find("a").text(wave);
      },
      function(req,stat,err){
        $(that).val("");
        $(that).parents("td").find("a").text("");
      });
    });
  });


  ////////////////////////////////////////////////////////////////////
  //
  // ウェーブ検索
  //
  ////////////////////////////////////////////////////////////////////

  $('.dropdown-wave-search li').on('click', function(ev){
    var table = $("#entrylist").DataTable();
    // #testhoge をクリックすると table の 2列目から 728を検索して返す
    // 列は 0 列目から始まる。
    //alert($(this).text().split(":")[0]);
    $(this).parent().prev().html($(this).html());
    if($(this).text()) {
      table.column(3).search("wave"+$(this).text()).draw();
    }else{
      table.column(3).search("").draw();
    }
    $('#entry-wave-search').html(($("#entrylist").DataTable().column(3).search() || '<a><span class="caret"></span></a>').replace(/^wave/,""));
    location.reload();
  });
  $('#entry-wave-search').html(($("#entrylist").DataTable().column(3).search() || '<a><span class="caret"></span></a>').replace(/^wave/,""));


  ////////////////////////////////////////////////////////////////////
  //
  //   誓約書編集可能ボタン
  //
  ////////////////////////////////////////////////////////////////////


  $('#btnEntryConfirmationEditable').on('click',  function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryConfirmationEditable').attr("aria-pressed") == "true" ? true : false;
    btns=$(".entry-confirmation");
    for(btn of btns) {
      $(btn).prop("disabled",isChecked);
    }
  });


  ////////////////////////////////////////////////////////////////////
  //
  //   誓約書ボタン
  //
  ////////////////////////////////////////////////////////////////////

  $('.entry-confirmation').on('click',function(req){
    var that=this;
    var isChecked=$(that).prop("checked");
    $(that).removeClass("confirmed");
    var id=$(this).attr("id").split('-')[2];
    $.put("/api/entry/"+id, {confirmation: isChecked},
    function(data,stat){
      $.get("/api/entry/"+id, data, function(data,stat) {
        if(data.id==id){
          $(that).addClass("confirmed");
          $(that).prop("checked",data.confirmation);
        }else{
          $(that).prop("checked",true);
        }
      },
      function(req,stat,err){
        $(that).prop("checked",true);
      });
    },
    function(req,stat,err){
      $.get("/api/entry/"+id, data, function(data,stat) {
        if(data.id==id){
          $(that).addClass("confirmed");
          $(that).prop("checked".data.confirmation);
        }else{
          $(that).prop("checked",true);
        }
      },
      function(req,stat,err){
        $(that).prop("checked",true);
      });
    });
  });

  ////////////////////////////////////////////////////////////////////
  //
  // 受付編集可能ボタン
  //
  ////////////////////////////////////////////////////////////////////
  $('#btnEntryRegistEditable').on('click',  function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryRegistEditable').attr("aria-pressed") == "true" ? true : false;
    btns=$(".entry-regist");
    for(btn of btns) {
      $(btn).prop("disabled",isChecked);
    }
  });

  ////////////////////////////////////////////////////////////////////
  //
  // 受付ボタン
  //
  ////////////////////////////////////////////////////////////////////

  $('.entry-regist').on('click',function(req){
    var that=this;
    var isChecked=$(that).prop("checked");
    $(that).removeClass("confirmed");
    var id=$(this).attr("id").split('-')[2];
    $.put("/api/entry/"+id, {regist: isChecked},
    function(data,stat){
      $.get("/api/entry/"+id, data, function(data,stat) {
        if(data.id==id){
          $(that).addClass("confirmed");
          $(that).prop("checked",data.regist);
        }else{
          $(that).prop("checked",true);
        }
      },
      function(req,stat,err){
        $(that).prop("checked",true);
      });
    },
    function(req,stat,err){
      $.get("/api/entry/"+id, data, function(data,stat) {
        if(data.id==id){
          $(that).addClass("confirmed");
          $(that).prop("checked".data.regist);
        }else{
          $(that).prop("checked",true);
        }
      },
      function(req,stat,err){
        $(that).prop("checked",true);
      });
    });
  });

  ////////////////////////////////////////////////////////////////////
  //
  // 召集編集可能ボタン
  //
  ////////////////////////////////////////////////////////////////////

  $('#btnEntryStartEditable').on('click', function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryStartEditable').attr("aria-pressed") == "true" ? true : false;
    btns=$(".entry-start");
    for(btn of btns) {
      $(btn).prop("disabled",isChecked);
    }
  });

  ////////////////////////////////////////////////////////////////////
  //
  // 召集編集可能ボタン
  //
  ////////////////////////////////////////////////////////////////////
  $('.entry-start').on('click',function(req){
    var that=this;
    var isChecked=$(that).prop("checked");
    $(that).removeClass("confirmed");
    var id=$(this).attr("id").split('-')[2];
    $.put("/api/entry/"+id, {start: isChecked},
    function(data,stat){
      $.get("/api/entry/"+id, data, function(data,stat) {
        if(data.id==id){
          $(that).addClass("confirmed");
          $(that).prop("checked",data.start);
        }else{
          $(that).prop("checked",true);
        }
      },
      function(req,stat,err){
      });
    },
    function(req,stat,err){
      $.get("/api/entry/"+id, data, function(data,stat) {
        if(data.id==id){
          $(that).addClass("confirmed");
          $(that).prop("checked".data.start);
        }else{
          $(that).prop("checked",true);
        }
      },
      function(req,stat,err){
        $(that).prop("checked",true);
      });
    });
  });
});
