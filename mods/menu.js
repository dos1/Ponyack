define(["mods/login", "libs/text!drawings/menu.txt", "libs/text!drawings/start.txt", "libs/text!drawings/about.txt", "libs/text!drawings/explore.txt", "libs/canvas", "libs/jquery", "libs/underscore"], function(Login, DMenu, DStart, DAbout, DExplore, Canvas) {
  function init() {
    var canvas = Canvas.init($('#main-canvas'));

    var delay = 1;
    var skip = function() { delay = 0; };
    canvas.draw(30, 31, JSON.parse(DMenu), 1, 2, function() {
      canvas.draw(350, 0, JSON.parse(DStart), delay, 4, function() {
        canvas.draw(205, 111, JSON.parse(DAbout), delay, 4, function() {
          canvas.draw(35, 147, JSON.parse(DExplore), delay, 4);
        }, skip);
      }, skip);
    }, skip);

    function refresh() {
      canvas.clear();
      canvas.draw(30, 31, JSON.parse(DMenu));
      canvas.draw(350, 0, JSON.parse(DStart));
      canvas.draw(205, 111, JSON.parse(DAbout));
      canvas.draw(35, 147, JSON.parse(DExplore));
    }

    function contains(smaller, bigger) {
      if ((bigger.x <= smaller.x) && (bigger.y <= smaller.y) && (bigger.x+bigger.w >= smaller.x+smaller.w) && (bigger.y+bigger.h >= smaller.y+smaller.h)) {
        return true;
      }
      return false;
    }

    function handleDraw(line) {
      var minx = 1/0, miny = 1/0, maxx = 0, maxy = 0;
      _.each(line, function(point) {
        if (point.x < minx) { minx = point.x; }
        if (point.y < miny) { miny = point.y; }
        if (point.x > maxx) { maxx = point.x; }
        if (point.y > maxy) { maxy = point.y; }
      });
      var rect = {x:minx, y:miny, w:maxx-minx, h:maxy-miny};
      if (contains(rect, {x:350,y:0,w:237,h:299})) {
        canvas.pause(true);
        $('#wrapper').fadeOut(500, function() {
          Login.init();
        });
      } else if (contains(rect, {x:205,y:111,w:150,h:134})) {
        canvas.pause(true);
        $('#wrapper').fadeOut(500, function() {
          alert("About");
          window.location.reload();
        });
      } else if (contains(rect, {x:35,y:147,w:151,h:139})) {
        canvas.pause(true);
        $('#wrapper').fadeOut(500, function() {
          alert("Explore");
          window.location.reload();
        });
      } else {
        refresh();
      }
    }

    canvas.addCallback(handleDraw);
  }
  return { init: init };
});
