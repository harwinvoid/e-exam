
window.onscroll = function(){

  var wScroll = $(window).scrollTop();
  if(wScroll>0){
    $(".go-top").show();
  }
  else{
    $(".go-top").hide();
  }
 } 