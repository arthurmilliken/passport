const Promise = require('bluebird');
const moment = require('moment');
const redis = require('redis');
const coredis = require('co-redis');

module.exports = function (app) {
  const client = coredis(redis.createClient(process.env.REDIS_URL));
  client.on('error', console.log);
  app.context.db = client;
  app.context.models = {
    Application: require('./Application.js')(client),
    User: require('./User.js')(client),
  };
};
