var express = require('express');
var hash = require('pwd').hash;
var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser('tajemne haslo ponyacka'));
app.use(express.session());

var qrMan = require("queriesManager")( {
               "user": "ponyack",
               "password": "ponyack",
               "database": "ponyack",
               "poolSize": 32,
               "initQueries": false,
               //"queriesModule": require("dosQueriesModule")
               "log": false,
               "cluster": false
});

function quoteStr(str, opts){
                str = str + "";
		opts = opts || {};
		opts.pre = opts.pre || "";
		opts.post = opts.post || "";
		
		opts.pre = "'" + opts.pre;
		opts.post += "'";
		
		str =  str.replace(/\\/g, "\\\\")
			.replace(/\x00/g, "\\\\0")
			.replace(/\n/g, "\\n")
			.replace(/\r/g, "\\r")
			.replace(/\t/g, "\\t")
			//.replace(/\b/g, "\\b")
			.replace(/'/g, "\\'")
			.replace(/"/g, "\\\"")
			.replace(/\x1a/g, "\\\\Z");
			
		if(opts.escapeAll){
			str = str.replace(/_/g, "\\_").replace(/%/g, "\\%");
		}
		return opts.pre + str + opts.post;
	}

qrMan(function(err, db){ 

app.get('/', function(req, res) {
  console.log('GET /', req.session.user ? req.session.user.login : -1);
  res.send('Hello World');
});

// Authenticate using database
function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s', name);

  db("SELECT * FROM users WHERE login="+quoteStr(name), function(err, answ) {
    if (err) return fn(err);
    if (!answ[0][0]) return fn('user');
    hash(pass, answ[0][0].salt, function(err, hash){
      if (err) return fn(err);
      if (answ[0][0].pass===(new Buffer(hash).toString('base64'))) {
        return fn(null, answ[0][0]);
      } else {
        return fn('pass');
      }
    });
  });
  return;

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

/*app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area');
});*/

app.get('/logout', function(req, res){
  console.log('GET /logout', req.session.user ? req.session.user.login : -1);
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy();
  res.send('');
});

app.post('/login', function(req, res){
  console.log('POST /login', req.body.login);
  authenticate(req.body.login, req.body.pass, function(err, user){

    function doauth() {
      // Regenerate session when signing in
      // to prevent fixation
      hasCharacter(user, function(err, hasCharacter) {
        if (err) throw(err);
        req.session.regenerate(function(){
          // Store the user's primary key
          // in the session store to be retrieved,
          // or in this case the entire user object
          console.log('success');
          req.session.user = user;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify({status:'OK', login: user.login, hasCharacter: hasCharacter }));
          res.end();
        });
      });
    }

    if (err && err!=="user") {
      console.log('error');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({status:'NOK'}));
      res.end();
      return;
    }
    if (err==="user") {
      console.log('registering');
      hash(req.body.pass, function(err, salt, hash){
        if (err) throw err;
        // store the salt & hash in the "db"
        db("INSERT INTO users SET login="+quoteStr(req.body.login)+", pass="+quoteStr(new Buffer(hash).toString('base64'))+", salt="+quoteStr(salt), function(err, result) {
          if (err) throw err;
          authenticate(req.body.login, req.body.pass, function(err, usr){
            if (err) throw err;
            user = usr;
            doauth();
          });
        });
      });
    } else {
      doauth();
    }
  });
});

var hasCharacter = function(user, callback) {
  if (!user) return callback(false);
  db("SELECT * FROM characters WHERE uid = "+quoteStr(user.id), function(err, r) {
    if (err) callback(err);
    if (r[0][0]) {
      console.log('hasCharacter=true', user.login);
      callback(null, true);
    } else {
      console.log('hasCharacter=false', user.login);
      callback(null, false);
    }
  });
};

app.get('/login', function(req, res) {
  console.log('GET /login', req.session.user ? req.session.user.login : -1);
  var login = '';
  hasCharacter(req.session.user, function(err, hasCharacter) {
    if (req.session.user) { login=req.session.user.login; }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({login:login, hasCharacter: hasCharacter}));
    res.end();
  });
});

app.post('/character', restrict, function(req, res) {
  console.log('POST /character', req.session.user ? req.session.user.login : -1);
  db("INSERT INTO characters SET uid = "+quoteStr(req.session.user.id)+", data = "+quoteStr(req.body.data), function(err, r) {
    if (err) throw(err);
    res.send('');
  });
});

app.get('/character', function(req, res) {
  var user = 0;
  if (req.session.user) user = req.session.user.id;
  if (req.query.id) user = req.query.id;
  console.log('GET /character', user, req.session.user ? req.session.user.id : -1, req.session.user ? req.session.user.login : -1);
  db("SELECT * FROM characters WHERE uid = "+quoteStr(user), function(err, r) {
    if (err) throw(err);
    if (r[0][0]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(r[0][0].data);
      res.end();
    } else {
      res.writeHead(404);
      res.write('');
      res.end();
    }
  });
});

app.get('/players', function(req, res) {
  console.log('GET /players', req.session.user ? req.session.user.login : -1);
  db("SELECT users.login, users.id FROM users, characters WHERE characters.uid = users.id", function(err, r) {
    if (err) throw(err);
    res.json(r[0]);
  });
});

app.listen(8910);

});
