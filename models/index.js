const Promise = require('bluebird');
const moment = require('moment');
const redis = require('redis');
const coredis = require('co-redis');

let createModel = function (client, modelName) {

  return {

    /**
     * Build a redis key for a given ID
     * @param  {String} id
     * @return {String}
     */
    key: function (id) {
      return modelName + ':' + id;
    },

    /**
     * Fetch object from DB
     * @param  {String} id
     * @return {Promise} the object
     */
    get: function (id) {
      let self = this;
      return Promise.coroutine(function *() {
        let key = self.key(id);
        let response = yield client.hget(key, 'json');
        if (response) {
          return JSON.parse(response);
        }
        else return null;
      })();
    },

    /**
     * Save object to DB
     * @param {String} id 
     * @param {Object} obj
     * @return {Promise} redis simple response
     */
    set: function (id, obj) {
      let self = this;
      return Promise.coroutine(function *() {
        let key = self.key(id);
        let response = yield client.hmset(key, {
          'json': JSON.stringify(obj),
          'modified': moment().format(),
        });
        yield client.hsetnx(key, 'created', moment().format());
        yield client.zadd('index:' + modelName, 0, key);
        return response;
      })();
    },

    /**
     * Delete object from DB
     * @param  {String} id
     * @return {Promise} # of records deleted
     */
    del: function (id) {
      let key = this.key(id);
      return client.del(key);
    },

    /**
     * Fetch object metadata from DB
     * @param  {String} id
     * @return {Promise} the object metadata, plus the object
     */
    meta: function (id) {
      let key = this.key(id);
      return client.hgetall(key);
    },

    /**
     * Check if object already exists
     * @param  {String} id [description]
     * @return {Promise} 1 for yes, 0 for no
     */
    exists: function (id) {
      let key = this.key(id);
      return client.exists(key);
    },

    /**
     * List objects by ID
     * @return {Promise} [String]
     */
    list: function () {
      return Promise.coroutine(function *() {
        let index = 'index:' + modelName;
        let result = yield client.zscan(index, 0);
        let payload = [];
        for (let i = 0; i < result[1].length; i++) {
          if (i % 2 !== 0) continue;
          let key = result[1][i];
          let id = key.substr((modelName + ':').length);
          payload.push(id);
        }
        return payload;
      })();
    },


  };
};

module.exports = function (app) {
  const client = coredis(redis.createClient(process.env.REDIS_URL));
  client.on('error', console.log);
  app.context.db = client;
  app.context.models = {
    Application: createModel(client, 'application'), // key: name
    User: createModel(client, 'user'), // key: email
  };
};

module.exports.createModel = createModel;