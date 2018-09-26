//
//
//
//
//

//alert("websocket begin");
var HOST;
var ws=false;

$(function() {

  function openWebSocket() {
    if(ws==false) {
      var HOST = location.origin.replace(/^http/, 'ws');
      //alert(HOST);
      ws = new WebSocket(HOST);
      //サーバから受け取るイベント
      ws.onopen = function () {
        punchConnect(tnum);
      };  // 接続時
      ws.onclose =  function (client) {
      };  // 切断時
      ws.onmessage = function (event) {
        addPunch(event);
      };
      ws.onerror = function (event) {
        location.reload();
      };

    }
  }
  openWebSocket();
//  setInterval(() => {
//    punchBreath(tnum);
//  }, 30000);
  $("#message").each(function(){
      $(this).bind('keyup', zen2han(this));
  });
  $("#msg_list").scrollTop($("#msg_list")[0].scrollHeight);
  $("#submit").on("click", function(){
    punchTime(tnum);
  });
  $("#cameraStart").on("click", function(){
    cameraStart(tnum);
  });
  $("#readImage").on("click", function(){
    readImage(tnum);
  });

  $(".page-header").addClass("hidden");
  $("#page-header-"+tnum).removeClass("hidden");
  setInterval(showCurrentTime,1000);
  showCurrentTime();


  function zen2han(e) {
    var v, old = e.value;
    return function(){
        if( old != ( v = e.value ) ){
            old = v;
            var str = $(this).val();
            str = str.replace( /[Ａ-Ｚａ-ｚ０-９－！”＃＄％＆’（）＝＜＞，．？＿［］｛｝＠＾～￥]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            });
            $(this).val(str);
        }
    };
  }

  function initRecordList(event) {
  }
  //alert("websocket end");


    //クライアントからイベント送信（イベント名は自由に設定できます）

  function punchConnect(tnum) {
  //  alert("punchConnect");
    var msg = $("#message").val(); //取得
    $("#message").val("");
    var data = {
      type: "punchConnect",
      tnum: tnum
    };
    ws.send(JSON.stringify(data)); // サーバへ送信
  //  alert("end");
  }

  function punchTime(tnum) {
    var racenum = decodeRacenum($("#message").val());
    var ftime = encodeTime(new Date());
    var seqnum = $("#recordlist > tbody").children().length;
    $.post("/api/record/"+tnum,
    {
      ftime: ftime,
      racenum: racenum
    });
    $("#message").val("");
    ws.send(JSON.stringify({
        type: "punch",
        seqnum: seqnum,
        tnum: tnum,
        racenum: racenum,
        ftime: ftime
    })); // サーバへ送信

  }


  function punchBreath(tnum) {
  //  alert("punchBreath");
    var msg = $("#message").val(); //取得
    var data = {
      type: "punchBreath",
      tnum: tnum
    };
    ws.send(JSON.stringify(data)); // サーバへ送信
  //  alert("end");
  }

  //jqueryでメッセージを追加
  function addPunch(event) {
    var data=JSON.parse(event.data);
    var table=$("#recordlist");
    var tr;
    var td;
    if(data.type=="punch") {
      if($("#seqnum-"+data.seqnum).length==0) {
        $(table).append(
          "<tr id='record'>"+
            "<td style='width:40px' align='center' class='seqnum' id='seqnum-"+data.seqnum+"'>"+data.seqnum+"</td>"+
            "<td style='width:80px' align='center' class='recenum' id='racenum-"+data.seqnum+"'>"+data.racenum+"</td>"+
            "<td style='width:100px' align='center' class='ftime' id='ftime-"+data.seqnum+"'>"+data.ftime+"</td>"+
          "</tr>");
        $("#msg_list").scrollTop($("#msg_list")[0].scrollHeight);
      }
    }else if(data.type=="punchBreath") {
    }
  }
  //alert("websocket end");

  function encodeTime(time) {
    return(
      ("00" + (time.getHours()||0)).slice(-2)+":"+
      ("00" + (time.getMinutes()||0)).slice(-2)+":"+
      ("00" + (time.getSeconds()||0)).slice(-2)+"."+
      ("00" + (time.getTime()||0)).slice(-2)
    );
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
      return(ft);
    }
  }

  function decodeRacenum(racenum) {
    return((!racenum || isNaN(racenum) || racenum*1 == 0 )? "" : ('000'+racenum*1).slice(-3));
  }

  function showCurrentTime() {
    $("#currentTime").html(encodeTime(new Date()));
  }

  var localStream = null;
  var takeQRcodeInterval = null;
  $("#action").on("click" , function() {
    if($(this).hasClass("active")){
      $(this).removeClass="active";
      lacalStream.stop();
      clearInterval(takeQRcodeInterval);
    } else {
      $(this).addClass="active";
      activateCamera();
    }
  });

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
          exact : "environment" // リアカメラにアクセス
        }
      }
    };
    var video  = document.getElementById("video");


    navigator.getUserMedia(medias, successCallback, errorCallback);

    function successCallback(stream) {
        localStream = video.srcObject = stream;
    }

    function errorCallback(err) {
      alert(err);
    }

    var canv = document.createElement("canvas");
    canv.height = 300;
    canv.width = 300;
    var context = canv.getContext("2d");
    takeQRcodeInterval = setInterval(takeQRcode,500);
    var lastMessage=false;
    function takeQRcode() {
      context.drawImage(video, 0, 0, 300, 300);
      var imageData = context.getImageData(0, 0, 300, 300);
      var code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        var message = JSON.stringify( code.data);
        if(lastMessage!=message) {
          $("#message").val(message);
          lastMessage=message;
          punchTime(tnum);
          beep();
  //        navigator.vibrate( 1000 );
        }
      }
    }
  }
  var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

  function beep() {
    snd.play();
  }


});
