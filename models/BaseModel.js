const Promise = require('bluebird');
const moment = require('moment');
const uuid = require('uuid/v4');

let BaseModel = module.exports = function (client, modelName) {
  if (!client) throw new Error('first argument must be redis client.');
  this.modelName = modelName || '_';
  this.client = client;
};

/**
 * Build a redis key for a given ID
 * @param  {String} id
 * @return {String}
 */
BaseModel.prototype.key = function (id) {
  return this.modelName + ':' + id;
};

/**
 * Build a redis key for a given ID
 * @param  {String} id
 * @return {String}
 */
BaseModel.prototype.pkIndex = function () {
  if (!this._pkIndex) this._pkIndex = 'index:' + this.modelName;
  return this._pkIndex;
};

/**
 * Generate an id, given the initial object.
 * Default implementation is to generate a random uuid.
 * Override for different behavior.
 * @param  {Object} id
 * @return {Promise}
 */
BaseModel.prototype.id = function (obj) {
  return Promise.coroutine(function *() {
    return uuid();
  })();
};

/**
 * Fetch object from DB
 * @param  {String} id
 * @return {Promise} the object
 */
BaseModel.prototype.get = function (id) {
  let self = this;
  return Promise.coroutine(function *() {
    let key = self.key(id);
    let response = yield self.client.hget(key, 'json');
    if (response) {
      return JSON.parse(response);
    }
    else return null;
  })();
};

/**
 * Create new object in DB
 * @param {String} id 
 * @param {Object} obj
 * @return {Promise} redis simple response
 */
BaseModel.prototype.create = function (obj) {
  let self = this;
  return Promise.coroutine(function *() {
    yield self.validateCreate(obj);
    if (!obj.id) obj.id = yield self.id(obj);
    let key = self.key(obj.id);
    let created = moment().format();
    let response = yield self.client.hmset(key, {
      'json': JSON.stringify(obj),
      created,
      'modified': created,
    });
    yield self.client.zadd('index:' + self.modelName, 0, obj.id);
    return obj;
  })();
};

/**
 * Override this method in your model.
 * @param  {Object} obj [description]
 * @param  {Boolean} multiple if false, reject on first error. Otherwise,
 *                            continue validating and reject at end.
 * @return {Promise} 
 */
BaseModel.prototype.validateCreate = function (obj, multiple) {
  let self = this;
  return Promise.coroutine(function *() {
    let err = new Error(self.modelName + ': validateCreate() Not Implemented.');
    err.errors = [ err.message ];
    throw(err);
  })();
};


/**
 * Save object to DB
 * @param {String} id 
 * @param {Object} obj
 * @return {Promise} redis simple response
 */
BaseModel.prototype.save = function (id, obj) {
  let self = this;
  return Promise.coroutine(function *() {
    yield self.validateSave(obj);
    let key = self.key(id);
    let response = yield self.client.hmset(key, {
      'json': JSON.stringify(obj),
      'modified': moment().format(),
    });
    return response;
  })();
};

/**
 * Override this method in your model.
 * @param  {Object} obj [description]
 * @param  {Boolean} multiple if false, reject on first error. Otherwise,
 *                            continue validating and reject at end.
 * @return {Promise} 
 */
BaseModel.prototype.validateSave = function (obj, multiple) {
  let self = this;
  return Promise.coroutine(function *() {
    let err = new Error(self.modelName + ': validateSave() Not Implemented.');
    err.errors = [ err.message ];
    throw(err);
  })();
};

/**
 * Delete object from DB
 * @param  {String} id
 * @return {Promise} # of records deleted
 */
BaseModel.prototype.delete = function (id) {
  let self = this;
  return Promise.coroutine(function *() {
    let key = self.key(id);
    let deleted = yield self.client.del(key);
    if (deleted) {
      yield self.client.zrem(self.pkIndex(), id);
    }
  })();
};

/**
 * Fetch object metadata from DB
 * @param  {String} id
 * @return {Promise} the object metadata, plus the object in a field called "json"
 */
BaseModel.prototype.meta = function (id) {
  let key = this.key(id);
  return this.client.hgetall(key);
};

/**
 * Check if object already exists
 * @param  {String} id [description]
 * @return {Promise} 1 for yes, 0 for no
 */
BaseModel.prototype.exists = function (id) {
  let key = this.key(id);
  return this.client.exists(key);
};

/**
 * List objects by ID
 * @return {Promise} [String]
 */
BaseModel.prototype.list = function () {
  let self = this;
  return Promise.coroutine(function *() {
    let result = yield self.client.zscan(self.pkIndex(), 0);
    let payload = [];
    for (let i = 0; i < result[1].length; i++) {
      if (i % 2 !== 0) continue;
      payload.push(result[1][i]);
    }
    return payload;
  })();
};


