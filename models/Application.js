const Promise = require('bluebird');
const clone = require('clone');
const md5 = require('md5');
const uuid = require('uuid/v4');

const BaseModel = require('./BaseModel');
const createSchema = require('./Application.schema.json');
const saveSchema = clone(createSchema);
saveSchema.required = ['id', 'secret', 'name', 'tokenTTL', 'scopes'];

module.exports = function (client) {
  
  let model = new BaseModel({
    name: 'application',
    client,
    createSchema,
    saveSchema,
  });

  model.id = function (obj) {
    return Promise.coroutine(function *() {
      return md5(obj.name);
    })();
  };

  model.validateCreate = function (obj) {
    let self = this;
    return Promise.coroutine(function *() {
      self.validate(obj, self.createSchema);
      if (!obj.tokenTTL) obj.tokenTTL = 600;
      if (!obj.secret) obj.secret = uuid();
      if (!obj.scopes) obj.scopes = [];
      if (!obj.id) obj.id = yield self.id(obj);
      let exists = yield self.exists(obj.id);
      if (exists) {
        let err = new Error(`{self.name} with name ${obj.name} already exists.`);
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
        let err = new Error('name cannot be changed.');
        err.status = 400;
        throw err;
      }
    })();
  };

  return model;
};