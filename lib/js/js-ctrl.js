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

    /**  **/
    onClick('survey-yes', function () {
      ga('send','event','この記事は役に立ちましたか？','クリック','役に立ちました。');
      document.getElementById('survey').innerHTML = '<div class="as"><div class="title">貴重なご意見をお寄せいただきありがとうございます。</div></div>';
    });
    onClick('survey-no', function () {
      ga('send','event','この記事は役に立ちましたか？','クリック','役に立ちませんでした。');
      document.getElementById('survey').innerHTML = '<iframe src="https://docs.google.com/forms/d/1UmHOKn96QQogYHWl_WrxdYyUaeYV8gBwvec52bxjDPk/viewform?embedded=true" width="100%" height="1000" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます...</iframe>';
    });

    /**  **/
    onClick('feedback-yes', function () {
      ga('send','event','ご意見・ご要望はございますか？','クリック','あります。');
      document.getElementById('feedback').innerHTML = '<iframe id="feedback" src="https://docs.google.com/forms/d/1dafgc1TPGiLt4h9Mx_nlikml4QxKWL8a4PkMBCOMqi8/viewform?embedded=true" width="100%" height="900" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます...</iframe>';
    });
    onClick('feedback-no', function () {
      ga('send','event','ご意見・ご要望はございますか？','クリック','ありません。');
      document.getElementById('feedback').innerHTML = '<div class="as"><div class="title">(*´ω｀*)</div></div>';
    });

  });
})(jQuery);