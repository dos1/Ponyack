// usage: node crop.js file.txt
// "crops" image, so it starts from 0x0 point

var fs = require('fs');
var data = JSON.parse(fs.readFileSync(process.argv[2]).toString());

var _ = require('underscore');

//console.log(JSON.parse(drawing));

var minx = 1/0, miny = 1/0, maxx = 0, maxy = 0; // Infinity

_.each(data, function(d) {
  _.each(d.points, function(point) {
    if (point.x < minx) { minx = point.x; }
    if (point.y < miny) { miny = point.y; }
    if (point.x > maxx) { maxx = point.x; }
    if (point.y > maxy) { maxy = point.y; }
  });
});

console.log("Min:");
console.log("x =",minx);
console.log("y =",miny);
console.log("Max:");
console.log("x =",maxx);
console.log("y =",maxy);

var newdata = [];

_.each(data, function(d) {
  var n = {points: [], type: d.type};
  var prev;
  _.each(d.points, function(point, idx) {
    point.x -= minx;
    point.y -= miny;
    if (prev) {
      if ((point.x == prev.x) && (point.y == prev.y)) {
        return;
      }
    }
    n.points.push(point);
    prev = point;
  });
  newdata.push(n);
});

fs.writeFileSync(process.argv[2], JSON.stringify(newdata));