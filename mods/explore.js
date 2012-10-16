define(["libs/text!templates/explore.tpl", "libs/text!drawings/about.txt", "mods/canvas", "libs/jquery", "libs/underscore"], function(TExplore, Canvas) {

  var $node;
  
  function init(cb) {
    $node = $('#content');
    var template=_.template(TExplore);
    $node.empty().append(template());

    $.get('server/players', {}, function(d) {
      _.each(d, function(u) {
        $('<a href="#/explore/'+u.id+'"></a>').appendTo($node.find('#players')).text(u.login);
     /*.on('click', function() { 
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
        }).text(u.login);*/
      });
      cb();
    }, 'json');
  }
  
  return { init: init };
});
