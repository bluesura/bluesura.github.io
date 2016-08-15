(function($) {
  $(function() {
      var startPos = 0;
      var menuHeight = $("#blog-title").height();
      var $header = $('.header');
      // Nav Fixed
      // $(window).on("touchstart scroll touchmove touchend", function() {
          // var currentPos = $(this).scrollTop();

          // if (currentPos < startPos) {
            // if ($(window).scrollTop() > 20) {
              // $header.removeClass('fixed');
            // }
          // }  else {
              // $header.addClass('fixed');
          // }
        // startPos = currentPos;
      // });

      if (isMobile.any) {
        $('#content').swipe({
          swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
            $('#box2').removeClass('slidein-sidebar');
            $('#box2').addClass('slideout-sidebar');
            $('html').removeClass('scrollrock');
          },swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
            $('#box2').removeClass('slideout-sidebar');
            $('#box2').addClass('slidein-sidebar');
            $('html').addClass('scrollrock');
          },
          //Default is 75px, set to 0 for demo so any distance triggers swipe
           threshold:75
        });
      }
      // Nav Toggle Button
      $('#js-ctrl').on('click', function(){
        if ($('#box2').hasClass('slideout-sidebar')) {
          // $('#main').removeClass('slidein-main');
          // $('#main').addClass('slideout-main');
          $('#box2').removeClass('slideout-sidebar');
          $('#box2').addClass('slidein-sidebar');
          $('html').addClass('scrollrock');
        } else if ($('#box2').hasClass('slidein-sidebar')) {
          // $('#main').removeClass('slideout-main');
          // $('#main').addClass('slidein-main');
          $('#box2').removeClass('slidein-sidebar');
          $('#box2').addClass('slideout-sidebar');
          $('html').removeClass('scrollrock');
        }
      });
    function onClick(_id, _fun) {
      var a = document.getElementById(_id);
      a.addEventListener('click', _fun);
    }
    function yes() {
      ga('send','event','SURVEY','この記事は役に立ちましたか？',document.location.pathname,5);
      document.getElementById('survey').innerHTML = '<div class="as"><div class="title">貴重なご意見をお寄せいただきありがとうございます。</div></div>';
    }
    function no() {
      ga('send','event','SURVEY','この記事は役に立ちましたか？',document.location.pathname,1);
      document.getElementById('survey').innerHTML = '<iframe src="https://docs.google.com/forms/d/1UmHOKn96QQogYHWl_WrxdYyUaeYV8gBwvec52bxjDPk/viewform?embedded=true" width="100%" height="1000" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます...</iframe>';
    }
    onClick('yes', yes);
    onClick('no', no);
  });
})(jQuery);