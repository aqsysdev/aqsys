//
//
//  クライアント用エントリーリスト操作 javascript
//
//

$(function(){

  //alert("public/entry.js begin");

  $("#entrylist").DataTable(
    {
      lengthMenu: [ 10, 20, 50, 100, 500 ],
      displayLength: 50,
      stateSave: true,
      //scrollX: false,
      //scrollY: false,
      order: [
        [3,"asc"],[2,"asc"],[1,"asc"],[17,"asc"],[11,"desc"],[10,"asc"],[7,"asc"],[8,"asc"]
      ]
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
  // ドロップダウンメニュー
  //
  ////////////////////////////////////////////////////////////////////

  $(document).on('click', function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryCateEditable').attr("aria-pressed") == "true" ? false : "disabled";
    btns=$(".entry-cate");
    for(btn of btns) {
      btn.disabled=isChecked;
    }

    $('.dropdown-menu li').click(function(req){
      var that=this;
      $(that).removeClass("confirmed");
      var value=$(that).html();
      $(that).parent().prev().html(value);

      ///////////////////////////////////////////////////////////////////
      //
      // カテゴリー変更
      //
      ///////////////////////////////////////////////////////////////////
      if($(that).parent().prev().hasclass("entry-cate")) {
        var num=$(that).attr('name');
        alert("change .entry-cate");
    //  $(that)[0].disabled="disabled";
        for(current=$(that).parent().parent().parent();current.next().length>0;current=current.next()) {
        }
        var id=current.text();
        $.put("/api/entry/"+id, {cate: num},
        function(data,stat){
      //    $(that)[0].disabled=($('#btnEntryCateEditable').attr("aria-pressed") == "true" ? false : "disabled");
          $.get("/api/entry/"+id, data, function(data,stat) {
            if(data.id==id){
              $(that).addClass("confirmed");
      //        $(that)[0].value=data.cate;
            }else{
      //        $(that)[0].value=true;
            }
          },
          function(req,stat,err){
      //      $(that)[0].value=true;
          });
        },
        function(req,stat,err){
      //    $(that)[0].disabled=($('#btnEntryCateEditable').attr("aria-pressed") == "true" ? false : "disabled");
          $.get("/api/entry/"+id, data, function(data,stat) {
            if(data.id==id){
              $(that).addClass("confirmed");
      //        $(that)[0].value=data.cate;
            }else{
      //        $(that)[0].value="";
            }
          },
          function(req,stat,err){
      //      $(that)[0].value="";
          });
        });
      }
    });
  });


  // レースナンバー

  $(document).on('click', function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryRaceNumEditable').attr("aria-pressed") == "true" ? false : "disabled";
    btns=$(".entry-race-num");
    for(btn of btns) {
      btn.disabled=isChecked;
    }
    $('.entry-race-num').off('change');
    $('.entry-race-num').on('change',function(req){
      var that=this;
      var value=$(that).val();
      $(that).removeClass("confirmed");
    //  $(that)[0].disabled="disabled";
      for(var current=$(that).parent();current.next().length>0;current=current.next()) {
      }
      var id=current.text();
      $.put("/api/entry/"+id, {racenum: value},
      function(data,stat){
    //    $(that)[0].disabled=($('#btnEntryRaceNumEditable').attr("aria-pressed") == "true" ? false : "disabled");
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(data.id==id){
            $(that).addClass("confirmed");
            $(that).val(('000'+data.racenum).slice(-3));
          }else{
            $(that).val("");
          }
        },
        function(req,stat,err){
          $(that).val("");
        });
      },
      function(req,stat,err){
    //    $(that)[0].disabled=($('#btnEntryRaceNumEditable').attr("aria-pressed") == "true" ? false : "disabled");
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(data.id==id){
            $(that).addClass("confirmed");
            $(that).val(('000'+data.racenum).slice(-3));
          }else{
            $(that).val("");
          }
        },
        function(req,stat,err){
          $(that).val("");
        });
      });
    });
  });

  // wave

  $(document).on('click', function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryWaveEditable').attr("aria-pressed") == "true" ? false : "disabled";
    btns=$(".entry-wave");
    for(btn of btns) {
      btn.disabled=isChecked;
    }

    $('.entry-wave').off('change');
    $('.entry-wave').on('change',function(req){
      var that=this;
      var value=$(that).val();
      $(that).removeClass("confirmed");
    //  $(that)[0].disabled="disabled";
      for(var current=$(that).parent();current.next().length>0;current=current.next()) {
      }
      var id=current.text();
      $.put("/api/entry/"+id, {wave: value},
      function(data,stat){
    //    $(that)[0].disabled=($('#btnEntryWaveEditable').attr("aria-pressed") == "true" ? false : "disabled");
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(data.id==id){
            $(that).addClass("confirmed");
            $(that).val(('00'+data.wave).slice(-2));
          }else{
            $(that).val("");
          }
        },
        function(req,stat,err){
          $(that).val("");
        });
      },
      function(req,stat,err){
    //    $(that)[0].disabled=($('#btnEntryWaveEditable').attr("aria-pressed") == "true" ? false : "disabled");
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(data.id==id){
            $(that).addClass("confirmed");
            $(that).val(('00'+data.wave).slice(-2));
          }else{
            $(that).val("");
          }
        },
        function(req,stat,err){
          $(that).val("");
        });
      });
    });
  });

  // 誓約書ボタン

  $(document).on('click', function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryConfirmationEditable').attr("aria-pressed") == "true" ? false : true;
    btns=$(".entry-confirmation");
    for(btn of btns) {
      $(btn).prop("disabled",isChecked);
    }
    $('.entry-confirmation').off('click');
    $('.entry-confirmation').on('click',function(req){
      var that=this;
      var isChecked=$(that).prop("checked");
      $(that).removeClass("confirmed");
      $(that).prop("disabled","true");
      for(var current=$(that).parent().parent();current.next().length>0;current=current.next()) {
      }
      var id=current.text();
      $.put("/api/entry/"+id, {confirmation: isChecked},
      function(data,stat){
        $(that).prop("disabled",($('#btnEntryConfirmationEditable').attr("aria-pressed") == "true" ? "false" : "true"));
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
        $(that)[0].disabled=($('#btnEntryConfirmationEditable').attr("aria-pressed") == "true" ? false : "disabled");
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
  });

  // 受付ボタン

  $(document).on('click', function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryRegistEditable').attr("aria-pressed") == "true" ? false : true;
    btns=$(".entry-regist");
    for(btn of btns) {
      $(btn).prop("disabled",isChecked);
    }
    $('.entry-regist').off('click');
    $('.entry-regist').on('click',function(req){
      var that=this;
      var isChecked=$(that).prop("checked");
      $(that).removeClass("confirmed");
      $(that).prop("disabled","true");
      for(var current=$(that).parent().parent();current.next().length>0;current=current.next()) {
      }
      var id=current.text();
      $.put("/api/entry/"+id, {regist: isChecked},
      function(data,stat){
        $(that).prop("disabled",($('#btnEntryRegistEditable').attr("aria-pressed") == "true" ? "false" : "true"));
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
        $(that)[0].disabled=($('#btnEntryRegistEditable').attr("aria-pressed") == "true" ? false : "disabled");
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
  });

  // 召集ボタン

  $(document).on('click', function () {
    var isChecked;
    var btn;
    var btns;
    isChecked=$('#btnEntryStartEditable').attr("aria-pressed") == "true" ? false : "disabled";
    btns=$(".entry-start");
    for(btn of btns) {
      btn.disabled=isChecked;
    }

    $('.entry-start').off('click');
    $('.entry-start').on('click',function(req){
      var that=this;
      var isChecked=$(that)[0].checked;
      $(that).removeClass("confirmed");
      $(that)[0].disabled="disabled";
      for(var current=$(that).parent().parent();current.next().length>0;current=current.next()) {
      }
      var id=current.text();
      $.put("/api/entry/"+id, {start: isChecked},
      function(data,stat){
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(data.id==id){
            $(that).addClass("confirmed");
            $(that)[0].checked=data.start;
          }else{
            $(that)[0].checked=true;
          }
        },
        function(req,stat,err){
        });
      },
      function(req,stat,err){
        $(that)[0].disabled=($('#btnEntryStartEditable').attr("aria-pressed") == "true" ? false : "disabled");
        $.get("/api/entry/"+id, data, function(data,stat) {
          if(data.id==id){
            $(that).addClass("confirmed");
            $(that)[0].checked=data.start;
          }else{
            $(that)[0].checked=true;
          }
        },
        function(req,stat,err){
          $(that)[0].checked=true;
        });
      });
    });
  });

  // 編集 modal フォーム表示

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
          alert("レースナンバー:"+(("#entry-racenum-"+id).text()||"？")+"のエントリーを削除しました。");
          $('#entry-race-num-'+id).parent().parent().addClass("hidden");
          location.reload();
        },
        function(){
          alert("レースナンバー:"+(("#entry-racenum-"+id).text()||"？")+"のエントリーの削除に失敗しました。");
        　location.reload();
        });
      }
    });


  });


  // 編集 modal フォーム消去

  $('#formEditEntryModal').on('hide.bs.modal', function (event) {
    $('#modal-zip-button').off();
    $('#modal-delete').off();
    $('#modal-submit').off();
  });
});

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

function postEntryByModalForm() {
  var row={};
  var err="";
  var id=$("#formAddEntryModalLabel").text().split(":")[1]*1;
  row.lname  = ($("#modal-lname").val()+"").trim();
  if(!row.lname) {
    err=err+"みょうじを入れてください。\n";
  }
  row.fname  = ($("#modal-fname").val()+"").trim();
  if(!row.fname) {
    err=err+"なまえを入れてください。\n";
  }
  row.myouji = ($("#modal-myouji").val()+"").trim();
  if(!row.myouji) {
    err=err+"苗字を入れてください。\n";
  }
  row.namae  = ($("#modal-namae").val()+"").trim();
  if(!row.namae) {
    err=err+"名前を入れてください。\n";
  }
  row.birthday = ($("#modal-birthday").val()+"").trim();
  if(!checkDate(row.birthday)) {
    err=err+"誕生日は YYYY/MM/DD の形式で入れてください。\n";
  }
  row.sex = $("#modal-sex").text();
  row.sex = Object.keys(sex).filter(function(key){return(sex[key] === row.sex);})[0];
  if( row.sex != "M" && row.sex != "F"){
    err=err+"性別を入れてください。\n";
  }
  row.grade = $("#modal-grade").text();
  if( (row.grede == "" || row.grade == "-") && calcAge(row.birthday, null)<15){
    err=err+"学年を入力してください。\n";
  }
  row.grade = grades.indexOf(row.grade);
  row.zip1 = ($("#modal-zip").val().split("-")[0]||"").trim();
  row.zip2 = ($("#modal-zip").val().split("-")[1]||"").trim();
  if(!row.zip1 || row.zip1=="000" ||  !row.zip2 ) {
    err=err+"郵便番号は 123-4567 の形式で入れてください。\n";
  }
  row.address1 = $("#modal-address1").val().trim();
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
    if(!checkDate(row.birthday2)) {
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
  if(!checkMail(row.email)) {
    err=err+"ただし、e-mail アドレスを入れてください。\n";
  }
  if(row.sex2=="") {delete row.sex2}
  if(row.birthday2=="") {delete row.birthday2}
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
