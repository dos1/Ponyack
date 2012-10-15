define(["libs/text!templates/intro.tpl", "libs/text!drawings/intro.txt", "libs/canvas", "libs/jquery", "libs/underscore"], function(TIntro, DIntro, Canvas) {

  var $node;
  
  function init(cb) {

    if (!window.user.login) {
      window.location.replace('#/login');
      return;
    }
    if (!window.user.hasCharacter) {
      window.location.replace('#/game/create');
      return;
    }

    $node = $('#content');
    var template=_.template(TIntro);
    $node.empty().append(template());

    //var canvas = Canvas.init($("<canvas width="400" height="400"></canvas>"));
    //canvas.draw(26, 23, JSON.parse(DIntro), 1);
    //setTimeout(function() { window.location.replace('#/game'); }, 5000);
    cb();
    function doAnim() {
      var first = $($node.find('.screen')[0]).show().addClass('active');
      if (!first[0]) { $('#wrapper').hide(); window.location.replace('#/game'); }
      setTimeout(function() {
        first.find('h1').addClass('active');
        setTimeout(function() {
          first.find('h2').addClass('active');
          setTimeout(function() {
            first.fadeOut(500, function() { $(this).remove(); doAnim(); });
          }, 3500);
        }, 1500);
      }, 500);
    }
    doAnim();
  }
  
  return { init: init };
});
