$(document).ready(function() {
  var animateText = function(
    nameDuration, baseListDelay, contactDuration, contactLabelDelay, animationTimeout
  ) {
    $('.name').fadeIn(nameDuration);

    $('li').each(function(index) {
      var delay = baseListDelay;

      if (index === 1) {
        delay = baseListDelay + 200;
      } else if (index === 2) {
        delay = baseListDelay + 300;
      }

      $(this).textillate({ in: { effect: 'fadeInLeft' }, initialDelay: delay });
    });

    setTimeout(function() {
      $('.contact').fadeIn(contactDuration, function() {
        var bottomClass = '.bottom';
        var topClass = '.top';
        var opacity = 'opacity';

        $(this)
          .mouseover(function() {
            $(bottomClass).css(opacity, 1);
            $(topClass).css(opacity, 0);
          })
          .mouseout(function() {
            $(bottomClass).css(opacity, 0);
            $(topClass).css(opacity, 1);
          })
          .click(function(){
            window.location = 'mailto:caripearl10@gmail.com';
          });
      });

      $('.contact-label').textillate({
        in: { effect: 'fadeInUp' },
        initialDelay: contactLabelDelay
      });
    }, animationTimeout);
  };

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

    var playVideoAndAnimateText = function() {
      $('#spinner').remove();
      $player.css('visibility', 'visible');
      player.play();

      setTimeout(function() {
        animateText(2300, 200, 1400, 200, 3100);
      }, 4700);
    };

    var checkIfLoaded = function() {
      if (player.duration - player.buffered.end(0) < 1) { // Firefox never completely fills buffer!
        clearInterval(loadingInterval);
        playVideoAndAnimateText();
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

    animateText(3000, 700, 2000, 400, 3900);
  }
});
