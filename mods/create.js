define(["libs/text!templates/create.tpl", "libs/text!drawings/derpy.txt", "libs/canvas", "libs/jquery", "libs/underscore"], function(TCreate, DDerpy, Canvas) {
  
  var $node;
  
  function init() {
    $node = $('#content');
    var template=_.template(TCreate);
    $node.empty().append(template());
    
    var canvas = Canvas.init($node.find('#main-canvas'));
    var canvasderp = Canvas.init($node.find('#secondary-canvas'));
    canvasderp.draw(21, 30, JSON.parse(DDerpy), 1, 3);
    canvasderp.pause(true);
    
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
      //console.log(JSON.stringify(canvas.get()));
      window.location.reload();
      return false;
    });
    
    $('#wrapper').fadeIn(1000);
  }
  
  return { init: init };
});