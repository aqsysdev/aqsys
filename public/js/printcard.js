//
//
//  クライアント用レースナンバー印刷 javascript
//
//

//alert("/js/printcard 0");

$(function(){
  $("#printCard").click(function(){
    // alert($.map($('.entry-race-num'), function(elm,index){return($(elm).val());}));
    $.redirect("/numbercards", {json: JSON.stringify({
      numbercards: $.map($('.entry-race-num'),function(elm,index){return({racenum:$(elm).val()});})
    })});
  });
});
