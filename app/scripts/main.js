$(document).ready(function() {
  if (window.orientation === undefined) { // use video on desktop
    var $player = $('#player');
    var player = $player.get(0);
    var $parent = $player.parent();
    var $win = $(window);
    var resizeTimeout = null;
    var shouldResize = false;
    var shouldPosition = false;
    var videoRatio = 854 / 460;

    player.volume = 0.5; // half of system volume
    player.load(); // explicitly load to always trigger metadata listener

    var resize = function() {
      if (!shouldResize) { return; }

      var height = $parent.height();
      var width = $parent.width();
      var viewportRatio = width / height;
      var scale = 1;

      if (videoRatio < viewportRatio) {
        // viewport more widescreen than video aspect ratio
        scale = viewportRatio / videoRatio;
      } else if (viewportRatio < videoRatio) {
        // viewport more square than video aspect ratio
        scale = videoRatio / viewportRatio;
      }

      var offset = positionVideo(scale, width, height);
      setVideoTransform(scale, offset);
    };

    var setVideoTransform = function(scale, offset) {
      offset = $.extend({ x: 0, y: 0 }, offset);
      var transform = 'translate(' + Math.round(offset.x) + 'px,' + Math.round(offset.y) +
        'px) scale(' + scale  + ')';
      $player.css({
        '-webkit-transform': transform,
        'transform': transform
      });
    };

    // accounts for transform origins on scaled video
    var positionVideo = function(scale, width, height) {
      if (!shouldPosition) { return false; }

      var x = parseInt($player.data('origin-x'), 10);
      var y = parseInt($player.data('origin-y'), 10);
      setVideoOrigin(x, y);

      var viewportRatio = width / height;
      var scaledHeight = scale * height;
      var scaledWidth = scale * width;
      var percentFromX = (x - 50) / 100;
      var percentFromY = (y - 50) / 100;
      var offset = {};

      if (videoRatio < viewportRatio) {
        offset.x = (scaledWidth - width) * percentFromX;
      } else if (viewportRatio < videoRatio) {
        offset.y = (scaledHeight - height) * percentFromY;
      }

      return offset;
    };

    var setVideoOrigin = function(x, y) {
      var origin = x + '% ' + y + '%';
      $player.css({
        '-webkit-transform-origin': origin,
        'transform-origin': origin
      });
    };

    $win.on('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    });

    shouldResize = true;
    shouldPosition = true;
    resize();

    var animateText = function() {
      $('#spinner').remove();
      $player.css('visibility', 'visible');
      player.play();

      setTimeout(function() {
        $('.name').fadeIn(2300)
        $('ul li:nth-child(1)').textillate({ in: {effect: 'fadeInLeft'}, initialDelay: 200 });
        $('ul li:nth-child(2)').textillate({ in: {effect: 'fadeInLeft'}, initialDelay: 400 });
        $('ul li:nth-child(3)').textillate({ in: {effect: 'fadeInLeft'}, initialDelay: 500 });

        setTimeout(function() {
          $('.contact').fadeIn(1400, function() {
            $(this)
              .mouseover(function() {
                $('.bottom').css('opacity', 1);
                $('.top').css('opacity', 0);
              })
              .mouseout(function() {
                $('.bottom').css('opacity', 0);
                $('.top').css('opacity', 1);
              })
              .click(function(){
                window.location = 'mailto:caripearl10@gmail.com';
              });
          });
          $('.contact-label').textillate({ in: {effect: 'fadeInUp'}, initialDelay: 200 });
        }, 3100);
      }, 4700);
    };

    var checkIfLoaded = function() {
      if (player.duration - player.buffered.end(0) < 1) { // Firefox never completely fills buffer!
        clearInterval(loadingInterval);
        animateText();
      }
    };

    var loadingInterval;
    player.addEventListener('loadedmetadata', function() {
      loadingInterval = setInterval(checkIfLoaded, 30);
    });
  } else { // revert to background image on mobile (pending image)
    $('#spinner').remove();
    $('#player').remove();
    $('body').addClass('mobile');

    $('.name').fadeIn(3000);
    $('ul li:nth-child(1)').textillate({ in: {effect: 'fadeInLeft'}, initialDelay: 700 });
    $('ul li:nth-child(2)').textillate({ in: {effect: 'fadeInLeft'}, initialDelay: 900 });
    $('ul li:nth-child(3)').textillate({ in: {effect: 'fadeInLeft'}, initialDelay: 1000 });

    setTimeout(function() {
      $('.contact').fadeIn(2000, function() {
        $(this)
          .mouseover(function() {
            $('.bottom').css('opacity', 1);
            $('.top').css('opacity', 0);
          })
          .mouseout(function() {
            $('.bottom').css('opacity', 0);
            $('.top').css('opacity', 1);
          })
          .click(function(){
            window.location = 'mailto:caripearl10@gmail.com';
          });
      });
      $('.contact-label').textillate({ in: {effect: 'fadeInUp'}, initialDelay: 400 });
    }, 3900);
  }
});
