//
//
//  クライアント用賞状印刷 javascript
//
//

//alert("/js/printcard 0");

$(function(){
  $("#printCertificate").click(function(){
    var jsondata = JSON.stringify({
      certificates: $.map($('.prize-race-num'),function(elm,index){
        var ttime=$(elm).parent().parent().find(".prize-ttime").val().split(/[:.]/);
        return({
          myouji:$(elm).parent().parent().find(".prize-myouji").text(),
          namae:$(elm).parent().parent().find(".prize-namae").text(),
          tminute: ttime[1],
          tsec: ttime[2],
          tmilisec: ttime[3]
        });
      })
    });
    $.redirect("/certificate", {json: jsondata});

  });
});
