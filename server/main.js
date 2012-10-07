var express = require('express');
var hash = require('./pass').hash;
var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser('tajemne haslo ponyacka'));
app.use(express.session());

app.get('/', function(req, res) {
  res.send('Hello World');
});

/*app.post('/login', function(req, res) {
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
});*/


// dummy database

var users = {
  dos: { name: 'dos', hasCharacter: false }
};

// when you create a user, generate a salt
// and hash the password ('qwerty' is the pass here)

hash('qwerty', function(err, salt, hash){
  if (err) throw err;
  // store the salt & hash in the "db"
  users.dos.salt = salt;
  users.dos.hash = hash;
});


// Authenticate using our plain-object database of doom!
function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn('user');
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash(pass, user.salt, function(err, hash){
    if (err) return fn(err);
    if (hash == user.hash) return fn(null, user);
    fn('pass');
  })
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({status:'Not logged in.'}));
    res.end();
  }
}

app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy();
  res.send('');
});

app.post('/login', function(req, res){
  authenticate(req.body.login, req.body.pass, function(err, user){

    function doauth() {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = users[req.body.login];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({status:'OK', login: users[req.body.login].name, hasCharacter: users[req.body.login].hasCharacter }));
        res.end();
      });
    }

    if (err && err!=="user") {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({status:'NOK'}));
      res.end();
      return;
    }
    if (err==="user") {
      hash(req.body.pass, function(err, salt, hash){
        if (err) throw err;
        // store the salt & hash in the "db"
        users[req.body.login] = { name: req.body.login, hasCharacter: false };
        users[req.body.login].salt = salt;
        users[req.body.login].hash = hash;
        doauth();
      });
    } else {
      doauth();
    }
  });
});

app.get('/login', function(req, res) {
  var login = '';
  var hasCharacter = false;
  if (req.session.user) { login=req.session.user.name; hasCharacter=req.session.user.hasCharacter; }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({login:login, hasCharacter: hasCharacter}));
  res.end();
});

app.post('/character', function(req, res) {
  users[req.session.user.name].character = JSON.parse(req.body.data);
  users[req.session.user.name].hasCharacter = true;
  req.session.user = users[req.session.user.name];
  res.send('');
});

app.get('/character', function(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(req.session.user.character));
  res.end();
});

app.listen(8910);
