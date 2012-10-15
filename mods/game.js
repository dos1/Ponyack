define(["libs/text!templates/game.tpl", "libs/text!templates/anongame.tpl", "libs/canvas", "libs/jquery", "libs/underscore"], function(TGame, TAnonGame, Canvas) {

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
    if (id) {
      template=_.template(TAnonGame);
    } else {
      template=_.template(TGame);
    }
    $node.empty().append(template({name:$("<div></div>").text(window.user.login).html() }));

    var chcanvas = Canvas.init($node.find('#character-canvas'));

    var data = {};
    if (id) data.id = id;
    $.get('server/character', data, function(data) {
      chcanvas.draw(0, 0, data, 1, 15);
      $('#wrapper').fadeIn(1000);
    }, 'json');


    var canvas = Canvas.init($node.find('#main-canvas'));

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
      if (id) flip = false;
      if (flip) {
        context.save();
        context.scale(-1, 1);
      }
      var newx = flip ? -x-200 : x;
      if (!id) {
        context.drawImage(chcontext.canvas, newx, y, 200, 200);
      }
      else {
        context.drawImage(chcontext.canvas, 100, 0);
      }
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

    if (id) {
      $.get('server/player', {id:id}, function(user) {
        $node.find('.playerName').text(user.login);
        if (user.next>0) {
          $node.find('#next').attr('href', '#/explore/'+user.next);
        } else {
          $node.find('#next').remove();
        }
        if (user.prev>0) {
          $node.find('#prev').attr('href', '#/explore/'+user.prev);
        } else {
          $node.find('#prev').remove();
        }
        if (cb) { cb(); }
      }, 'json');
    } else {
      if (cb) { cb(); }
    }
  }

  return { init: init };
});
