//
//
// QR code reader
//
//

//alert("websocket begin");
var HOST;
var ws;

$(function() {
  HOST = location.origin.replace(/^http/, 'ws');
  //alert(HOST);
  ws = new WebSocket(HOST);

  //サーバから受け取るイベント
  ws.onopen = function () {
    QRreadConnect(tnum);
  };  // 接続時
  ws.onclose =  function (client) {};  // 切断時
  ws.onmessage = function (event) {
    addQRread(event);
  };

  setInterval(() => {
    QRreadBreath(tnum);
  }, 10000);
  $("#message").each(function(){
      $(this).bind('keyup', zen2han(this));
  });
});

var zen2han = function(e) {
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
};



  //クライアントからイベント送信（イベント名は自由に設定できます）

function QRreadConnect(tnum) {
//  alert("qrreadConnect");
  var msg = $("#message").val(); //取得
  $("#message").val("");
  var data = {
    type: "punchConnect",
    tnum: tnum
  };
  ws.send(JSON.stringify(data)); // サーバへ送信
//  alert("end");
}

function QRreadTime(tnum) {
//  alert("QRreadTime");
  var racenum = decodeRacenum($("#message").val());
  var ftime = encodeTime(new Date());
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

function QRreadBreath(tnum) {
//  alert("QRreadBreath");
  var msg = $("#message").val(); //取得
  $("#message").val("");
  var data = {
    type: "punchBreath",
    tnum: tnum
  };
  ws.send(JSON.stringify(data)); // サーバへ送信
//  alert("end");
}

//jqueryでメッセージを追加
function addQRread(event) {
  var data=JSON.parse(event.data);
  var d=$("#msg_list");
  if(data.type=="punch") {
    $(d).append("<div class='msg'>" +
    data.seqnum + "," +
    decodeRacenum(data.racenum) + "," +
    data.ftime + "</div>");
    seqnum = data.seqnum+1;
    $(d).scrollTop($(d)[0].scrollHeight);
  }else if(data.type=="punchBreath") {
  }
}
//alert("websocket end");

var encodeTime = function(time) {
  return(
    ("00" + (time.getHours()||0)).slice(-2)+":"+
    ("00" + (time.getMinutes()||0)).slice(-2)+":"+
    ("00" + (time.getSeconds()||0)).slice(-2)+"."+
    ("00" + (time.getTime()||0)).slice(-2)
  );
};

var formTime = function(ms) {
    var milisec=new Decimal(ms);
    return(
      ("00"+parseInt(milisec.div(60*60*100),0)%24).slice(-2)+":"+
      ("00"+parseInt(milisec.div(60*100),0)%60).slice(-2)+":"+
      ("00"+parseInt(milisec.div(100),0)%60).slice(-2)+"."+
      ("00"+parseInt(milisec%100,0)).slice(-2)
    );
};

var reformTime = function(ft) {
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
};


var decodeRacenum = function(racenum) {
 if( racenum == null ) {
   return(null);
 }else if( racenum!="" && racenum>=0){
   return(("000"+racenum).slice(-3));
 }else{
   return("");
 }
};