const Promise = require('bluebird');
const moment = require('moment');
const redis = require('redis');
const coredis = require('co-redis');
const uuid = require('uuid');

require('dotenv').config();

Promise.coroutine(function *() {
  const client = coredis(redis.createClient(process.env.REDIS_URL));
  client.on('error', console.log);
  try {
    let result;
    let start = Date.now();
    result = yield client.ping();
    console.log('%s: %dms', result, Date.now() - start);
    start = Date.now();
    result = yield client.setex('hello', 2, 'world');
    console.log('%s: %dms', result, Date.now() - start);
    start = Date.now();
    result = yield client.get('hello');
    console.log('%s: %dms', result, Date.now() - start);
  }
  catch (err) {
    console.error(err);
  }
  finally {
    client.quit();
  }

})();