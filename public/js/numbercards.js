//
//
//  クライアント用numbercard javascript
//
//

//alert("/js/numbercards 0");

$(function(){
  $.each($(".qrcode"),function(index,value) {

    var code=$(value).attr("name");
    $(value).qrcode({width: 80, height: 80, text: code});
  });

});
