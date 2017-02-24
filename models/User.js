const Promise = require('bluebird');
const clone = require('clone');
const md5 = require('md5');

const BaseModel = require('./BaseModel');
const createSchema = require('./User.schema.json');
const saveSchema = clone(createSchema);
saveSchema.required.push('id');

module.exports = function (client) {
  let model = new BaseModel({
    name: 'user',
    client,
    createSchema,
    saveSchema
  });

  model.id = function (obj) {
    return Promise.coroutine(function *() {
      return md5(obj.email);
    })();
  };

  model.validateCreate = function (obj) {
    let self = this;
    return Promise.coroutine(function *() {
      self.validate(obj, self.createSchema);
      if (!obj.id) obj.id = yield self.id(obj);
      let exists = yield self.exists(obj.id);
      if (exists) {
        let err = new Error(`${self.name} with email ${obj.email} already exists.`);
        err.status = 400;
        throw err;
      }
    })();
  };

  model.validateSave = function (obj) {
    let self = this;
    return Promise.coroutine(function *() {
      self.validate(obj, self.saveSchema);
      if (self.id(obj) !== obj.id) {
        let err = new Error('email cannot be changed.');
        err.status = 400;
        throw err;
      }
    })();
  };

  return model;
};