define(["libs/text!drawings/menu.txt", "libs/text!drawings/start.txt", "libs/text!drawings/about.txt", "libs/text!drawings/explore.txt", "libs/canvas", "libs/jquery"], function(Menu, Start, About, Explore, Canvas) {
  var canvas = Canvas.init($('#main-canvas'));
  /*$('h1').click(function() {
    var c = canvas.get();
    console.log(JSON.stringify(c));
  });
  $('h2').click(function() { canvas.clear(); });*/

  var delay = 1;
  var skip = function() { delay = 0; };
  canvas.draw(30, 31, JSON.parse(Menu), 1, 3, function() {
    canvas.draw(350, 0, JSON.parse(Start), delay, 6, function() {
      canvas.draw(205, 111, JSON.parse(About), delay, 6, function() {
        canvas.draw(35, 147, JSON.parse(Explore), delay, 6);
      }, skip);
    }, skip);
  }, skip);

  function refresh() {
    canvas.clear();
    canvas.draw(30, 31, JSON.parse(Menu));
    canvas.draw(350, 0, JSON.parse(Start));
    canvas.draw(205, 111, JSON.parse(About));
    canvas.draw(35, 147, JSON.parse(Explore));
  }

  function handleDraw(line) {
    refresh();
  }

  canvas.addCallback(handleDraw);

});
