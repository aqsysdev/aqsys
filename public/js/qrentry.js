//
//
//  クライアント用 javascript
//
//


$(function(){

  //
  // パラメータの受け取り
  //
  aqsysCoder.setConfig(JSON.parse($("#variable-handler").val()));

  ///////////////////////////////////////////////////////////////////////////
  //
  //  Entry Table のパラメータ定義
  //
  ///////////////////////////////////////////////////////////////////////////

  $("#entrylist").DataTable(
    {
//       "language": {"url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Japanese.json"},
          lengthMenu: [-1],
          displayLength: -1,
          stateSave: false,
          //scrollX: false,
          //scrollY: false,
          order: [
          ],
          lengthChange: false,
          searching: false,
          ordering: false,
          info: false,
          pageing: false
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

      $("#modal-grade").html($("#entry-grade-"+id).html()||"");
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
    ////////////////////////////////////////////////////////////////////
    //
    //　modal dropdown
    //
    ////////////////////////////////////////////////////////////////////
    $('.modal-dropdown li').on('click', function(){
      $(this).parent().prev().html($(this).html());
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

    ////////////////////////////////////////////////////////////////////
    //
    //　 QR 受付
    //
    ////////////////////////////////////////////////////////////////////

    function QRentry(rnum) {
      var entryList = $('.entryrow');
      entryList.addClass("hidden");
      alert(entryList);
      entryList.each(function(){
        alert($(this).find(".entry-race-num"));
        if(rnum!="" && this.find(".entry-race-num")[0].val()==""+rnum ) {
          this.removeClass("hidden");
          var that = this.find(".entry-regist")[0];
          alert(that);
          var isChecked=$(that).prop("checked");
          that.removeClass("confirmed");
          var id=that.attr("id").split('-')[2];
          $.put("/api/entry/"+id, {regist: true},
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
        }
      });
    }
    ////////////////////////////////////////////////////////////////////
    //
    //　カメラ起動
    //
    ////////////////////////////////////////////////////////////////////

    function activateCamera() {
      beep();
  //    navigator.vibrate( 1000 );
      var medias = {
        audio : false,
        video : {
    //      width: "300px",
    //      height: "300px",
          frameRate: { ideal: 5, max: 15 },
          facingMode : {
            exact : "user" // フロントカメラにアクセス
          }
        }
      };

      var video  = document.getElementById("video");
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.height = 300;
      canvas.width = 300;
      var mediaPromise = navigator.mediaDevices.getUserMedia(medias);
      mediaPromise.then(function(stream) {
        video.srcObject = stream;
        context.drawImage(video, 0, 0, 300, 300);
      })
      .catch(function(err) {
        alert(err);
      });

      takeQRcodeInterval = setInterval(takeQRcode,250);
      var lastMessage=false;
      function takeQRcode() {
        context.drawImage(video, 0, 0, 300, 300);
        var imageData = context.getImageData(0, 0, 300, 300);
        var code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          var message = code.data;
          if(lastMessage!=message) {
            beep();
            lastMessage=message;
            QRentry(message);
          }
        }
      }
    }

    var snd2 = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    function beep() {
      snd2.play();
    }

    QRentry("");
    beep();
    activateCamera();

});



////////////////////////////////////////////////////////////////////
//
// 編集 modal フォーム登録
//
////////////////////////////////////////////////////////////////////

function postEntryByModalForm() {
//  alert("postEntryByModalForm()");
  var row={};
  var err="";
  var id=$("#formAddEntryModalLabel").text().split(":")[1]*1;
  row.racenum = aqsysCoder.encodeRacenum($("#modal-racenum").val());
  row.cate = aqsysCoder.encodeCate($("#modal-cate").text());
  row.wave = aqsysCoder.encodeWave($("#modal-wave").val());
// alert("lname");
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
  row.sex = aqsysCoder.encodeSex($("#modal-sex").text());
  //  alert(row.sex);
  if( row.sex != "M" && row.sex != "F"){
    err=err+"性別を入れてください。\n";
  }
  row.grade = aqsysCoder.encodeGrade($("#modal-grade").text() || "");
//  alert(row.grade+"-"+aqsysCoder.calcAge(row.birthday, false)+":"+aqsysCoder.config.basedate);
  if( row.grade <= 0 && aqsysCoder.calcAge(row.birthday, false)<15){
    err=err+"学年を入力してください。\n";
  }
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
    row.sex2 = aqsysCoder.encodeSex($("#modal-sex2").text());
    if(!aqsysCoder.checkDate(row.birthday2)) {
      err=err+"子の誕生日を YYYY/MM/DD の形式で入れてください。\n";
    }
    if( row.grade == "" || row.grade == "-"){
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
