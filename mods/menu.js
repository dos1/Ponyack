define(["libs/text!drawings/menu.txt", "libs/text!drawings/start.txt", "libs/text!drawings/about.txt", "libs/text!drawings/explore.txt", "libs/canvas", "libs/jquery"], function(Menu, Start, About, Explore, Canvas) {
  var canvas = Canvas.init($('#main-canvas'));
  $('h1').click(function() {
    var c= canvas.get();
    console.log(JSON.stringify(c));
    //canvas.clear();
    //canvas.draw(c, 1);
  });
  $('h2').click(function() { canvas.clear(); });

// OMG OMG OMG :D
  
  canvas.draw(30, 31, JSON.parse(Menu), 1, 3, function() {
    canvas.draw(350, 0, JSON.parse(Start), 1, 6, function() {
      canvas.draw(205, 111, JSON.parse(About), 1, 6, function() {
        canvas.draw(35, 147, JSON.parse(Explore), 1, 6);
      });
    });
  });
});
