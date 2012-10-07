define(["libs/text!templates/game.tpl", "libs/canvas", "libs/jquery", "libs/underscore"], function(TGame, Canvas) {

  var $node;

  function init() {
    $node = $('#content');
    var template=_.template(TGame);
    $node.empty().append(template({name:window.user.login}));

    var canvas = Canvas.init($node.find('#main-canvas'));
    canvas.pause(true);

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
      canvas.draw(100, 0, data, 1, 0);
      $('#wrapper').fadeIn(1000);
    }, 'json');
  }

  return { init: init };
});
