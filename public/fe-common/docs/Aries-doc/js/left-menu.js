  var mainConH3 = $(".main-content h3");
  var leftMenu = $(".menu-left");
  var leftMenuInitTop = leftMenu.offset().top;
  var wScroll;
  var href;
  
  $(window).scroll(function(){
    wScroll = $(document).scrollTop();
     //滚动高度超过leftMenu初始高度时随页面滚动
      if(wScroll>=leftMenuInitTop){
        leftMenu.addClass("fixed");
      }
      else{
        leftMenu.removeClass("fixed");
      }
      //滚动到对应模块时 给leftMenu对应项增加active类
      mainConH3.each(function(){
         if(wScroll>=$(this).offset().top){
            href = "#"+$(this).attr("id");
            $(".menu-left .sub-menu a").removeClass("active");
            $(".menu-left a[href="+href+"]").addClass("active");
         }
     });   

  });