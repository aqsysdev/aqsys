//
//
//  クライアント用エントリーリスト操作 javascript
//
//


$(function(){

  $("#entrylist").DataTable(
    {
      lengthMenu: [ 10, 20, 50, 100, 500 ],
      displayLength: 50,
      stateSave: true,
      //,scrollX: false
      //,scrollY: false
      order: [
        [3,"asc"],[2,"asc"],[1,"asc"],[17,"asc"],[11,"desc"],[10,"asc"],[7,"asc"],[8,"asc"]
      ]
//      columnDefs: [{ "orderable": false, "targets": 2 }]
    }
  );

  //alert("public/entry.js end");


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
    $(this).parent().prev().html($(this).html());
    if($(this).text()) {
      table.column(2).search("cate"+$(this).text().split(":")[0]).draw();
    }else{
      table.column(2).search("").draw();
    }
  });


    ////////////////////////////////////////////////////////////////////
    //
    // レースナンバー変更
    //
    ////////////////////////////////////////////////////////////////////
    $('.entry-race-num').on('change',function(req){
      $(this).addClass("unconfirmed");
      var racenum=aqsysCoder.encodeRacenum($(this).val());
      $(this).val(aqsysCoder.decodeRacenum(racenum));
      var id=$(this).attr("id").split('-')[2];
      var that=this;
      $.put("/api/entry/"+id, {racenum: racenum},
      function(data,stat){
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(aqsysCoder.decodeRacenum(data.racenum)==racenum){
            $(that).removeClass("unconfirmed");
          }
        },
        function(req,stat,err){
          $(that).val("");
        });
      },
      function(req,stat,err){
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(aqsysCoder.decodeRecenum(data.racenum)==racenum){
            $(that).removeClass("unconfirmed");
          }else{
            $(that).val(aqsysCoder.decodeRacenum(data.racenum));
          }
        },
        function(req,stat,err){
          $.get("/api/entry/"+id, data, function(data,stat) {
            $(that).val(aqsysCoder.decodeRacenum(data.racenum));
          },
          function(req,stat,err){
            $(that).val("");
          });
        });
      });
    });

    ////////////////////////////////////////////////////////////////////
    //
    // ウェーブ変更
    //
    ////////////////////////////////////////////////////////////////////

    $('.entry-wave').on('change',function(req){
      $(this).addClass("unconfirmed");
      var wave=aqsysCoder.encodeWave($(this).val());
      $(this).val(aqsysCoder.decodeWave(wave));
      var id=$(this).attr("id").split('-')[2];
      var that=this;
      $.put("/api/entry/"+id, {wave: wave},
      function(data,stat){
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(aqsysCoder.decodeWave(data.wave)==wave){
            $(that).removeClass("unconfirmed");
          }else{
            $(that).val(aqsysCoder.decodeWave(data.wave));
          }
        },
        function(req,stat,err){
          $(that).val("");
        });
      },
      function(req,stat,err){
        $.get("/api/entry/"+id, data, function(data,stat) {
          $(that).val(aqsysCoder.decodeWave(data.wave));
        },
        function(req,stat,err){
          $(that).val("");
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
    });


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

    ////////////////////////////////////////////////////////////////////
    //
    // 編集 modal フォーム表示
    //
    ////////////////////////////////////////////////////////////////////

    $('#formEditEntryModal').on('show.bs.modal', function (event) {
    //  alert("#formEditEntryModal on show.bs.modal");
      var button = $(event.relatedTarget);
      var id = button.data('id');
      var modal = $(this);

      if(id>0) {
        $("#formAddEntryModalLabel").text("Edit Entry id:"+id);
      }else{
        $("#formAddEntryModalLabel").text("Add Entry id:0");
      }

      $('#modal-delete').off();

      $("#modal-racenum").val($("#entry-racenum-"+id).val()||"");
      $("#modal-cate").html($("#entry-cate-"+id).html()||"");
      $("#modal-wave").val($("#entry-wave-"+id).val()||"");

      $("#modal-lname").val($("#entry-lname-"+id).text()||"");
      $("#modal-myouji").val($("#entry-myouji-"+id).text()||"");
      $("#modal-fname").val($("#entry-fname-"+id).text()||"");
      $("#modal-namae").val($("#entry-namae-"+id).text()||"");
      $("#modal-birthday").val($("#entry-birthday-"+id).text()||"");
      $("#modal-sex").text($("#entry-sex-"+id).text()||"");

      var grade=$("#entry-grade-"+id).text()||"";
      var reg=/^[0-9]/ ;
      if( reg.test(grade) ) {
        $("#modal-grade").text("-");
      }else{
        $("#modal-grade").text(grade);
      }
      $("#modal-zip").val(($("#entry-zip-"+id).text()||"").replace(/〒/,""));
      $("#modal-address1").val($("#entry-address1-"+id).text()||"");
      $("#modal-address2").val($("#entry-address2-"+id).text()||"");
      $("#modal-email").val($("#entry-email-"+id).text()||"");
      $("#modal-lname2").val($("#entry-lname2-"+id).text()||"");
      $("#modal-myouji2").val($("#entry-myouji2-"+id).text()||"");
      $("#modal-fname2").val($("#entry-fname2-"+id).text()||"");
      $("#modal-namae2").val($("#entry-namae2-"+id).text()||"");
      $("#modal-birthday2").val($("#entry-birthday2-"+id).text()||"");
      $("#modal-sex2").text($("#entry-sex2-"+id).text()||"");
      // 郵便番号入力による住所自動入力
      $('#modal-zip-button').off();
      $('#modal-zip-button').on('click',function(){
        var zip = $("#modal-zip").val();
        var reg=/^〒/;
        zip=zip.replace(reg,"");

        var url = 'https://api.zipaddress.net?callback=?';
        var query = {'zipcode': zip};
        $.getJSON(url, query, function(json){

            //  json.pref        都道府県の取得
            //  json.address     市区町村の取得
            //  json.fullAddress 都道府県+市区町村の取得
            $('#modal-address1').val(json.address+" "+($('#modal-address1').val()||""));
        });
      });
      $('#modal-delete').on('click',function(){
        if(window.confirm('エントリーを削除しますか？この操作は取り消せません。')){
          $.put("/api/entry/"+id, {disabled: true},
          function(data,stat){
            alert("レースナンバー:"+($("#entry-racenum-"+id).text()||"？")+"のエントリーを削除しました。");
            $('#entry-race-num-'+id).parent().parent().addClass("hidden");
            location.reload();
          },
          function(){
            alert("レースナンバー:"+($("#entry-racenum-"+id).text()||"？")+"のエントリーの削除に失敗しました。");
          　location.reload();
          });
        }
      });


    });
});


////////////////////////////////////////////////////////////////////
//
// 編集 modal フォーム消去
//
////////////////////////////////////////////////////////////////////

$('#formEditEntryModal').on('hide.bs.modal', function (event) {
  $('#modal-zip-button').off();
  $('#modal-delete').off();
  $('#modal-submit').off();
});

function postEntryByModalForm() {
//  alert("postEntryByModalForm()");
  var row={};
  var err="";
  var id=$("#formAddEntryModalLabel").text().split(":")[1]*1;
  row.racenum = $("#modal-racenum").val()||"";
  row.cate = $("#modal-cate").text()||"";
  row.wave = $("#modal-wave").val()||"";
//  alert("lname");
  row.lname  = ($("#modal-lname").val()+"").trim();
//  alert(row.lname);
  if(!row.lname) {
//    err=err+"みょうじを入れてください。\n";
  }
  row.fname  = ($("#modal-fname").val()+"").trim();
//  alert(row.fname);
  if(!row.fname) {
//   err=err+"なまえを入れてください。\n";
  }
  row.myouji = ($("#modal-myouji").val()+"").trim();
//  alert(row.myouji);
  if(!row.myouji) {
    err=err+"苗字を入れてください。\n";
  }
  row.namae  = ($("#modal-namae").val()+"").trim();
//  alert(row.namae);
  if(!row.namae) {
    err=err+"名前を入れてください。\n";
  }
  row.birthday = ($("#modal-birthday").val()+"").trim();
//  alert(row.birthday);
  if(!aqsysCoder.checkDate(row.birthday)) {
    err=err+"誕生日は YYYY/MM/DD の形式で入れてください。\n";
  }
  row.sex = $("#modal-sex").text();
//  alert(row.sex);

  row.sex = Object.keys(aqsysCoder.config.sex).filter(function(key){return(aqsysCoder.config.sex[key] === row.sex);})[0];
//  alert(row.sex);
  if( row.sex != "M" && row.sex != "F"){
    err=err+"性別を入れてください。\n";
  }
  row.grade = $("#modal-grade").text();
//  alert(row.grade);
  if( (row.grede == "" || row.grade == "-") && aqsysCoder.calcAge(row.birthday, null)<15){
    err=err+"学年を入力してください。\n";
  }
  row.grade = aqsysCoder.config.grades.indexOf(row.grade);
//  alert(row.grade);
  row.zip1 = ($("#modal-zip").val().split("-")[0]||"").trim();
//  alert(row.zip1);
  row.zip2 = ($("#modal-zip").val().split("-")[1]||"").trim();
  if(!row.zip1 || row.zip1=="000" ||  !row.zip2 ) {
    err=err+"郵便番号は 123-4567 の形式で入れてください。\n";
  }
  row.address1 = $("#modal-address1").val().trim();
//  alert(row.address1);
  row.address2 = $("#modal-address2").val().trim();
  if(!row.address1 ) {
    err=err+"住所を入れてください。\n";
  }
  row.lname2  = $("#modal-lname2").val().trim();
  row.myouji2 = $("#modal-myouji2").val().trim();
  row.fname2  = $("#modal-fname2").val().trim();
  row.namae2  = $("#modal-namae2").val().trim();
  row.birthday2 = ($("#modal-birthday2").val()+"").trim();
  if(row.lname2 || row.myouji2 || row.fname2 || row.namae2 ) {
    row.sex2 = $("#modal-sex2").text();
    row.sex2 = Object.keys(sex).filter(function(key){return(sex[key] === row.sex2);})[0];
    if(!aqsysCoder.checkDate(row.birthday2)) {
      err=err+"子の誕生日を YYYY/MM/DD の形式で入れてください。\n";
    }
    if( row.grede == "" || row.grade == "-"){
      err=err+"学年を入力してください。\n";
    }
    if( row.sex2 != "M" && row.sex2 != "F"){
      err=err+"子の性別を入れてください。\n";
    }
  }
  row.email = $("#modal-email").val();
  if(!aqsysCoder.checkMail(row.email)) {
//    err=err+"ただし、e-mail アドレスを入れてください。\n";
  }
  if(row.sex2=="") {
    delete row.sex2;
  }
  if(row.birthday2=="") {
    delete row.birthday2;
  }
  row.disabled = false;
  if(err) {
    alert(err);
    $(this).off('submit');   //一旦submitをキャンセルして、
    $(this).submit();
    return(false);       //再度送信
  } else {
    if(id==0) {
      //
      //  データベースへ作成
      //
      $.post("/api/entry", row,
      function(data,stat){
        $('#formEditEntryModal').modal('hide');
        location.reload();
        return(true);
      },
      function(req,stat,err){
        alert("新規作成に失敗しました。\n"+err);
        location.reload();
        return(false);
      });
    }else{

      //
      //  データベースへ書き込み
      //
      $.put("/api/entry/"+id, row,
      function(data,stat){
        $('#formEditEntryModal').modal('hide');
        location.reload();
        return(true);
      },
      function(req,stat,err){
        alert("書き込みに失敗しました。\n"+err);
        location.reload();
        return(false);
      });
    }
  }
}
