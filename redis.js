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
    result = yield client.del('index:application');
    console.log(result);
  }
  catch (err) {
    console.error(err);
  }
  finally {
    client.quit();
  }

})();