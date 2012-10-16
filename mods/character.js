define(["libs/text!templates/character.tpl", "libs/canvas", "libs/jquery", "libs/underscore"], function(TCharacter, Canvas) {

  var $node;

  function init(id, cb) {

    $node = $('#content');
    var template;
    template=_.template(TCharacter);
    $node.empty().append(template({name:$("<div></div>").text(window.user.login).html() }));

    var chcanvas = Canvas.init($('<canvas width="400" height="400"></canvas>'));

    $.get('server/character', {id:id}, function(data) {
      chcanvas.draw(0, 0, data, 10, 15);

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

        var arrow = {left: 37, up: 38, right: 39, down: 40 };

        $(document).on('keydown', function (e) {
          keyCode = e.keyCode || e.which;
          if (keyCode == arrow.left) {
            if (user.prev>0) {
               window.location = '#/explore/'+user.prev;
            }
          } else if (keyCode == arrow.right) {
            if (user.next>0) {
              window.location = '#/explore/'+user.next;
            }
          }
        });

        if (cb) { cb(); }
      }, 'json');
    }, 'json');


    var canvas = Canvas.init($node.find('#main-canvas'));

    var x = 200, y = 100, flip = true;
    var context = canvas.getContext(), chcontext = chcanvas.getContext();

    (function anim() {
      requestAnimFrame(anim);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(chcontext.canvas, 100, 0);
    })();

  }

  return { init: init };
});
