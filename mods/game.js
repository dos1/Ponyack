define(["libs/text!templates/game.tpl", "mods/canvas", "libs/jquery", "libs/underscore"], function(TGame, Canvas) {

  var $node;

  function init(id, cb) {

    if (!window.user.login) {
      window.location.replace('#/login');
      return;
    }
    if (!window.user.hasCharacter) {
      window.location.replace('#/game/create');
      return;
    }

    $node = $('#content');
    var template;
    template=_.template(TGame);
    $node.empty().append(template({name:$("<div></div>").text(window.user.login).html() }));

    var chcanvas = Canvas.init($('<canvas width="400" height="400"></canvas>'));

    $.get('server/character', {}, function(data) {
      chcanvas.draw(0, 0, data, 15, 10);
      $('#wrapper').fadeIn(1000);
    }, 'json');


    var canvas = Canvas.init($node.find('#main-canvas'));

    var x = 200, y = 100, flip = true;
    var context = canvas.getContext(), chcontext = chcanvas.getContext();

    var arrow = {left: 37, up: 38, right: 39, down: 40 };
    var arrows = {};

    $(document).on('keydown',function (e) {
      keyCode = e.keyCode || e.which;
      arrows[keyCode] = true;
      if (keyCode == arrow.left) {
        flip = false;
      } else if (keyCode == arrow.right) {
        flip = true;
      }
      if ((keyCode == arrow.left) || (keyCode == arrow.up) || (keyCode == arrow.right) || (keyCode == arrow.down)) {
        return false;
      }
    });
    $(document).on('keyup',function (e) {
      keyCode = e.keyCode || e.which;
      arrows[keyCode] = false;
    });


    (function anim() {
      requestAnimFrame(anim);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      if (flip) {
        context.save();
        context.scale(-1, 1);
      }
      var newx = flip ? -x-200 : x;
      context.drawImage(chcontext.canvas, newx, y, 200, 200);
      if (flip) {
        context.restore();
      }
      if (arrows[arrow.left]) {
        x-=5;
      }
      if (arrows[arrow.right]) {
        x+=5;
      }
      if (arrows[arrow.up]) {
        y-=5;
      }
      if (arrows[arrow.down]) {
        y+=5;
      } 
    })();

    if (cb) { cb(); }
  }

  return { init: init };
});
