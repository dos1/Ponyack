define(["libs/text!templates/game.tpl", "libs/canvas", "libs/jquery", "libs/underscore"], function(TGame, Canvas) {

  var $node;

  function init() {
    $node = $('#content');
    var template=_.template(TGame);
    $node.empty().append(template({name:window.user.login}));

    var chcanvas = Canvas.init($node.find('#character-canvas'));
    chcanvas.pause(true);

    $node.find('#logout').on('click', function() {
      //console.log(JSON.stringify(canvas.get()));
      $('#wrapper').fadeOut(500, function() {
        $.get('server/logout', {}, function() {
          window.location.reload();
        });
      });
      return false;
    });

    $.get('server/character', {}, function(data) {
      chcanvas.draw(0, 0, data, 1, 15);
      $('#wrapper').fadeIn(1000);
    }, 'json');


    var canvas = Canvas.init($node.find('#main-canvas'));
    canvas.pause(true);

    var x = 200, y = 100, flip = true;
    var context = canvas.getContext(), chcontext = chcanvas.getContext();

    var arrow = {left: 37, up: 38, right: 39, down: 40 };
    var arrows = {};

    $(document).keydown(function (e) {
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
    $(document).keyup(function (e) {
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
  }

  return { init: init };
});
