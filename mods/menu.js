define(["libs/text!drawings/menu.txt", "libs/text!drawings/start.txt", "libs/canvas", "libs/jquery"], function(Menu, Start, Canvas) {
  var canvas = Canvas.init($('#main-canvas'));
  $('h1').click(function() {
    var c= canvas.get();
    console.log(JSON.stringify(c));
    //canvas.clear();
    //canvas.draw(c, 1);
  });
  $('h2').click(function() { canvas.clear(); });

// OMG OMG OMG :D
  
  canvas.draw(JSON.parse(Menu), 1, 2, function() {

  canvas.draw(JSON.parse(Start), 1, 5);
  });
});
