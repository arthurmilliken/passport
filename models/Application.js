const Promise = require('bluebird');
const moment = require('moment');

module.exports = function (client) {
  return {
    key: function (id) {
      return 'application:' + id;
    },
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
    meta: function (id) {
      let key = this.key(id);
      return client.hgetall(key);
    },
    set: function (id, obj) {
      let key = this.key(id);
      return client.hmset(key, {
        'json': JSON.stringify(obj),
        'modified': moment().format(),
      });
    },
    del: function (id) {
      let key = this.key(id);
      return client.del(key);
    },
  };
};