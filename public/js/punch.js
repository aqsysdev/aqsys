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

  $(".page-header").addClass("hidden");
  $("#page-header-"+tnum).removeClass("hidden");
  setInterval(showCurrentTime,1000);
  showCurrentTime();

});


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
 //alert("punchTime");
  var racenum = decodeRacenum($("#message").val());
  var ftime = encodeTime(new Date());
  var seqnum=$("#recordlist > tbody").children().length-2;
  $.post("/api/record/"+tnum,
  {
    ftime: ftime,
    racenum: racenum
  });
  $("#message").val("");
  ws.send(JSON.stringify({
      type: "punch",
      seqnum: seqnum+2,
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
    if(data.seqnum>table.length()+1) {
      $(table).append(
        "<tr id='record'>"+
          "<td style='width:40px' align='center' class='seqnum'>"+data.seqnum+"</td>"+
          "<td style='width:80px' align='center' class='recenum'>"+data.racenum+"</td>"+
          "<td style='width:100px' align='center' class='ftime'>"+data.ftime+"</td>"+
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
};

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
