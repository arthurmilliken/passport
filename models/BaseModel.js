const _ = require('lodash');
const Promise = require('bluebird');
const moment = require('moment');
const uuid = require('uuid/v4');
const validate = require('jsonschema').validate;

let BaseModel = module.exports = function (opts) {
  if (!opts.client || _.isEmpty(opts.client)) throw new Error('client is required.');
  if (!opts.name || _.isEmpty(opts.name)) throw new Error('name is required.');

  this.name = opts.name;
  this.client = opts.client;
  this.createSchema = opts.createSchema;
  this.saveSchema = opts.saveSchema;
};

BaseModel.prototype.validate = function (obj, schema) {
  let validation = validate(obj, schema);
  if (validation.errors.length > 0) {
    let errors = [];
    let message = '';
    _.each(validation.errors, error => {
      errors.push(error.stack);
      message += (error.stack + '. ');
    });
    let err = new Error(message.trim());
    err.status = 400;
    err.errors = errors;
    throw err;
  }
  return true;
};

/**
 * Build a redis key for a given ID
 * @param  {String} id
 * @return {String}
 */
BaseModel.prototype.key = function (id) {
  return this.name + ':' + id;
};

/**
 * Build a redis key for a given ID
 * @param  {String} id
 * @return {String}
 */
BaseModel.prototype.pkIndex = function () {
  if (!this._pkIndex) this._pkIndex = 'index:' + this.name;
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
    try {
      yield self.validateCreate(obj);
      if (!obj.id) obj.id = yield self.id(obj);
      let key = self.key(obj.id);
      let created = moment().format();
      let response = yield self.client.hmset(key, {
        'json': JSON.stringify(obj),
        created,
        'modified': created,
      });
      yield self.client.zadd('index:' + self.name, 0, obj.id);
      return obj;
    }
    catch (err) {
      throw err;
    }
    })();
};

/**
 * Override this method if needed.
 * @param  {Object} obj [description]
 * @return {Promise} 
 */
BaseModel.prototype.validateCreate = function (obj) {
  let self = this;
  return Promise.coroutine(function *() {
    self.validate(obj, self.createSchema);
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
 * Override this method if needed.
 * @param  {Object} obj [description]
 * @return {Promise} 
 */
BaseModel.prototype.validateSave = function (obj) {
  let self = this;
  return Promise.coroutine(function *() {
    self.validate(obj, self.saveSchema);
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
      return yield self.client.zrem(self.pkIndex(), id);
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
BaseModel.prototype.ids = function () {
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


