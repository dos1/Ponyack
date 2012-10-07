var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser('tajemne haslo ponyacka'));
app.use(express.session());

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.post('/login', function(req, res) {
  console.log("Login try:", req.param('login'));
  if (req.param('login') === "Pirat") {
    res.send(JSON.stringify({status:'NOK'}));
  } else {
    req.session.login = req.param('login');
    res.send(JSON.stringify({status:'OK', login:req.session.login, hasCharacter: req.session.hasCharacter }));
  }
});

app.get('/login', function(req, res) {
  var login = '';
  if (req.session) { login=req.session.login; }
  res.send(JSON.stringify({login:login}));
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.send('');
});

app.listen(8910);
