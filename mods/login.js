define(["libs/text!templates/login.tpl", "libs/text!drawings/login.txt", "libs/canvas", "libs/jquery", "libs/underscore"], function(TLogin, DLogin, Canvas) {

  var $node;
  
  function init() {
    $node = $('#content');
    var template=_.template(TLogin);
    $node.empty().append(template());

    var canvas = Canvas.init($node.find('canvas'));
    //canvas.pause(true);
    canvas.draw(26, 23, JSON.parse(DLogin), 1);
    
    $node.find('#return').on('click', function() {
      //console.log(JSON.stringify(canvas.get()));
      window.location.reload();
    });

    $('#wrapper').fadeIn(1000);
  }
  
  return { init: init };
});