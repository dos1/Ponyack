define(["libs/text!templates/explore.tpl", "libs/text!drawings/about.txt", "libs/canvas", "libs/jquery", "libs/underscore"], function(TExplore, Canvas) {

  var $node;
  
  function init() {
    $node = $('#content');
    var template=_.template(TExplore);
    $node.empty().append(template());

    $node.find('#return').on('click', function() {
      window.location.reload();
      return false;
    });

    $.get('server/players', {}, function(d) {
      _.each(d, function(u) {
        $('<a href="#"></a>').appendTo($node.find('#players')).on('click', function() { 
     $('#wrapper').fadeOut(500, function() {
        $node.html('Please wait...');
        $('#wrapper').fadeIn(500, function() {
          require(["mods/game"], function(Game) {
            $('#wrapper').fadeOut(500, function() {
              Game.init(u.id, u.login);
            });
          });
        });  
     }); return false;       
        }).text(u.login);
      });
      $('#wrapper').fadeIn(1000);
    }, 'json');
  }
  
  return { init: init };
});
