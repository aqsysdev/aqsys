//
//
//  クライアント用numbercard javascript
//
//

//alert("/js/numbercards 0");

$(function(){
  /*
  $.each($(".bcTarget"),function(index,value) {
    var code=$(value).attr("name");
    $(value).barcode(code+getDigit(code),"codabar",{output:"svg"});
  });

  function getDigit(code){
    var table = "0123456789-$:/.+ABCD";
    var i, index;
    var wholecode = "A"+code+"A";
    var sum=0;
    for(i=0; i<wholecode.length; i++){
      index = table.indexOf( wholecode.charAt(i) );
      if (index < 0) return("");
      sum += index;
    }
    return(table.charAt((16 - (sum % 16)) % 16));
  }
  */
  $.each($(".qrcode"),function(index,value) {

    var code=$(value).attr("name");
    $(value).qrcode({width: 80, height: 80, text: code});
  });

});
