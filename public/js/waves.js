//
//
//  クライアント用wave操作 javascript
//
//

//alert("/js/wave 0");
var waves = {};
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

//
//  wave 編集可能ボタン
//
  $(document).on('click', function(){
    addRow();
    checkWavesEditable();
  });

  function checkWavesEditable () {
      var isChecked=$("#btnWavesEditable").attr("aria-pressed") == "true" ? "" : "disabled" ;
      $(".waves-stime").each( function() {
        this.disabled=isChecked;
      });
      $('.waves-stime').off('change')
      .on('change',function(req){ wavesEditStime(this); });
      $(".waves-dtime").each( function() {
        this.disabled=isChecked;
      });
      $('.waves-dtime').off('change')
      .on('change',function(req){ wavesEditDtime(this); });
      if(isChecked=="disabled"){
        location.reload();
      }
  }
  //
  //  スタート時刻編集
  //
  function wavesEditStime(that){
    $(that).addClass("unconfirmed");
    var value=$(that).val();
    var wid=$(that).parent().prev().text().trim();
    if(!value || value == "") {
      if(wid!=0) {
        //
        //  削除
        //
        $.put("/api/waves/"+wid,
        {
          disabled: true
        },
        function(){
          location.reload();
        },
        function(){
          alert("delete waves stime error:"+err);
          location.reload();
        });
      }
    }else{
      var data = {
        stime: value,
        disabled: false
      };
      //
      //  編集
      //
      $.put("/api/waves/"+wid,data,
      function(data,stat){
        location.reload();
      },
      function(req,stat,err){
        $.get("/api/waves/"+wid,data,
        function(data,stat){
          location.reload();
        },
        //
        // 追加
        //
        function(err,stat){
          $.post("/api/waves/", data,
          function(data,stat) {
            $.get("/api/waves/"+data.wid, data,
            function(data,stat) {
              location.reload();
            },
            function(req,stat,err){
              location.reload();
            });
          },
          function(req,stat,err){
            alert("post waves stime error:"+err);
            location.reload();
          });
        });
      });
    }
  }

  //
  // スタート間隔設定
  //
  function wavesEditDtime(that){
    $(that).addClass("unconfirmed");
    var value=$(that).val();
    var wid=$(that).parent().prev().prev().text().trim();
    //
    //  削除
    //
    if(!value || value == "") {
      if(wid!=0) {
        $.put("/api/waves/"+wid,
        {
          disabled: true
        },
        function(){
          location.reload();
        },
        function(){
          alert("delete waves dtime error:"+err);
          location.reload();
        });
      }
    }else{
      var stime;
      if(wid==1) {
        stime=value;
      }else{
        var lastWid=$(that).parent().prev().prev().text()-1;
        stime = addTime(value,$("#waves-stime-"+lastWid).val());
      }
      var data = {
        stime: stime,
        disabled: false
      };
      //
      //  編集
      //
      $.put("/api/waves/"+wid, data,
      function(data,stat){
        $.get("/api/waves/"+data.wid, data,
        function(data,stat) {
          location.reload();
        },
        function(req,stat,err){
          $(that).val("");
          location.reload();
        });
      },
      function(req,stat,err){
        $.get("/api/waves/"+wid,data,
        function(data,stat) {
          location.reload();
        },
        //
        // 追加
        //
        function(err,stat){
          $.post("/api/waves/", data,
          function(data,stat) {
            $.get("/api/waves/"+data.wid, data,
            function(data,stat) {
              location.reload();
            },
            function(req,stat,err){
              $(that).val("");
              location.reload();
            });
          },
          function(req,stat,err){
            alert("post waves dtime error:"+err);
            location.reload();
          });
        });
      });
    }
  }

  var calcTime = waves.calcTime = function(fromTime, toTime) {
    var fromTimeSplit = (fromTime+"").split(/[:.]/);
    var toTimeSplit = (toTime+"").split(/[:.]/);
    return(
      (toTimeSplit[0]||0)*100*60*60+
      (toTimeSplit[1]||0)*100*60+
      (toTimeSplit[2]||0)*100+
      (toTimeSplit[3]||0)*1-
      (fromTimeSplit[0]||0)*100*60*60-
      (fromTimeSplit[1]||0)*100*60-
      (fromTimeSplit[2]||0)*100-
      (fromTimeSplit[3]||0)*1
    );
  };

  var diffTime = waves.diffTime = function(fromTime, toTime) {
      var milisec=calcTime(fromTime,toTime);
      return((milisec<0?"-":"")+formTime(Math.abs(milisec)));
  };

  var addTime = waves.addTime = function(fromTime, toTime) {
    var fromTimeSplit = (fromTime+"").split(/[:.]/);
    var toTimeSplit = (toTime+"").split(/[:.]/);
    var milisec =
      (fromTimeSplit[0]||0)*100*60*60+
      (fromTimeSplit[1]||0)*100*60+
      (fromTimeSplit[2]||0)*100+
      (fromTimeSplit[3]||0)*1+
      (toTimeSplit[0]||0)*100*60*60+
      (toTimeSplit[1]||0)*100*60+
      (toTimeSplit[2]||0)*100+
      (toTimeSplit[3]||0)*1;
      return(formTime(milisec));
  };

  var formTime = waves.formTime = function(ms) {
      var milisec=new Decimal(ms);
      return(
        ("00"+parseInt(milisec.div(60*60*100),0)%24).slice(-2)+":"+
        ("00"+parseInt(milisec.div(60*100),0)%60).slice(-2)+":"+
        ("00"+parseInt(milisec.div(100),0)%60).slice(-2)+"."+
        ("00"+parseInt(milisec%100,0)).slice(-2)
      );
  };

  var reformTime = waves.reformTime = function(ft) {
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

  var encodeTime = waves.encodeTime = function(time) {
    return(
      ("0000"+(time.getFullYear()||0)).slice(-4)+"/"+
      ("00" + (time.getMonth()+1)).slice(-2)+"/"+
      ("00" + (time.getDate()||0)).slice(-2)+" "+
      ("00" + (time.getHours()||0)).slice(-2)+":"+
      ("00" + (time.getMinutes()||0)).slice(-2)+":"+
      ("00" + (time.getSeconds()||0)).slice(-2)+"."+
      ("00" + (parseInt((time.getTime()||0)+0.5,0))).slice(-2)
    );
  };


  var addRow = waves.addRow = function(){
    var wid=1+1*($("#waves-tbody").children().last().children().text().trim()||0);
    var wavesEditable=$("#btnWavesEditable").attr("aria-pressed") == "true" ? "" : "disabled" ;
    if(wavesEditable !="disabled" && (wid==1 || $("#waves-tbody").children().last().children().next().children().first().val()||
    $("#waves-tbody").children().last().children().next().next().children().first().val())){
      $("#waves-tbody").append(`
        <tr valign="middle">
          <td class="waves-wid" id="waves-wid-${wid}">${wid}</td>
          <td>
            <input class="waves-stime" type="text" id="waves-stime-${wid}" name="stime-${wid}" value="" size="11" placeholder="12:34:56.78" ${wavesEditable} />
          </td>
          <td>
            <input class="waves-dtime" type="text" id="waves-dtime-${wid}" name="dtime-${wid}" value="" size="11" placeholder="00:05:00.00" ${wavesEditable} />
          </td>
        </tr>
      `);
      checkWavesEditable();
    }
  };
  addRow();
//  alert("waves end");
});
