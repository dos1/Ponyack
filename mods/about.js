define(["libs/text!templates/about.tpl", "libs/text!drawings/about.txt", "mods/canvas", "libs/jquery", "libs/underscore"], function(TAbout, DAbout, Canvas) {

  var $node;
  
  function init() {
    $node = $('#content');
    var template=_.template(TAbout);
    $node.empty().append(template());

    var canvas = Canvas.init($node.find('canvas'), true);
    //canvas.pause(true);
    canvas.draw(26, 23, JSON.parse(DAbout), 1);
  }
  
  return { init: init };
});
