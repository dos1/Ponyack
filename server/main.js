var express = require('express');
var app = express();

app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.post('/login', function(req, res) {
  console.log("Login try: ", req.param('login'));
  if (req.param('login') === "dos") {
    res.send(JSON.stringify({status:'NOK'}));
  } else {
    res.send(JSON.stringify({status:'OK'}));
  }
});

app.listen(8910);
