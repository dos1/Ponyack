define(["libs/text!templates/create.tpl", "libs/text!drawings/derpy.txt", "mods/canvas", "libs/jquery", "libs/underscore"], function(TCreate, DDerpy, Canvas) {
  
  var $node;
  
  function init(cb) {

    if (window.user.hasCharacter) {
      window.location.replace('#/game');
      return;
    }
    if (!window.user.login) {
      window.location.replace('#/login');
      return;
    }

    $node = $('#content');
    var template=_.template(TCreate);
    $node.empty().append(template({name:$("<div></div>").text(window.user.login).html()}));
    
    var canvas = Canvas.init($node.find('#main-canvas'), true);
    var canvasderp = Canvas.init($node.find('#secondary-canvas'));
    canvasderp.draw(21, 30, JSON.parse(DDerpy), 1, 3);
    
    $node.find('#undo').on('click', function() {
      //console.log(JSON.stringify(canvasderp.get()));
      canvas.undo();
      return false;
    });

    $node.find('#clear').on('click', function() {
      canvas.clear();
      //canvasderp.clear();
      return false;
    });
    
    $node.find('#done').on('click', function() {
      var character = canvas.get();
      if (character.length===0) {
        alert('You can\'t set empty drawing as your character!');
        return false;
      }
      $('#wrapper').fadeOut(500, function() {
        $node.html('Please wait...');
        $('#wrapper').fadeIn(500, function() {
          $.post('server/character', {data:JSON.stringify(character)}, function(data) {
            window.user.hasCharacter = true;
            window.location = '#/game/intro';
          }, 'json').error(function() { alert('Error!'); window.location.reload(); });
        });
      });
      return false;
    });

    cb();
  }
  
  return { init: init };
});
