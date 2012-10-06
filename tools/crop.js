// usage: node crop.js file.txt
// "crops" image, so it starts from 0x0 point

var fs = require('fs');
var data = JSON.parse(fs.readFileSync(process.argv[2]).toString());

var _ = require('underscore');

//console.log(JSON.parse(drawing));

var x = 1/0, y=1/0; // Infinity

_.each(data, function(d) {
  _.each(d.points, function(point) {
    if (point.x < x) { x = point.x; }
    if (point.y < y) { y = point.y; }
  });
});

console.log("x =",x);
console.log("y =",y);

_.each(data, function(d) {
  _.each(d.points, function(point) {
    point.x -= x;
    point.y -= y;
  });
});

fs.writeFileSync(process.argv[2], JSON.stringify(data));