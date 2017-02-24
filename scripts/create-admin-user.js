const Promise = require('bluebird');
const redis = require('redis');
const coredis = require('co-redis');
const md5 = require('md5');

require('dotenv').config( {path: __dirname + '/../.env'} );

Promise.coroutine(function *() {
  const dbClient = coredis(redis.createClient(process.env.REDIS_URL));
  dbClient.on('error', console.error);  

  let Application = require('../models/Application.js')(dbClient);
  
  try {
    let inserted = yield Application.create({
      name: 'admin',
      scopes: [ 'superuser' ],
      ttl: 84600
    });
    console.log('\ncreated:', inserted);   
  }
  catch (err) {
    console.error(err);
  }

  try {
    let admin = yield Application.get(md5('admin'));
    console.log('\nfound:', admin);
  }
  catch (err) {
    console.error(err);
  }

  dbClient.quit();
})();
