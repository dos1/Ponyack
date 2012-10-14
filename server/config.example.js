var config = {
  db: {
    host: 'localhost',
    port: 3306,
    user: 'ponyack',
    password: 'ponyack',
    database: 'ponyack'
  },
  cookies: {
    secret: 'my very secret passphrase'
  },
  server: {
    port: 1234,
    prefix: ''
  }
};

module.exports = config;
