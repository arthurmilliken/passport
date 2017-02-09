const _ = require('lodash');
const Promise = require('bluebird');
const format = require('util').format;
const md5 = require('md5');
const uuid = require('uuid/v4');

const BaseModel = require('./BaseModel');

module.exports = function (client) {
  let model = new BaseModel(client, 'application');

  model.id = function (obj) {
    return Promise.coroutine(function *() {
      return md5(obj.name);
    })();
  };

  model.validateCreate = function (obj, multiple) {
    console.log('model.validateCreate:', obj);
    let self = this;

    return Promise.coroutine(function *() {
      let errors = [];
      
      let logError = function (message) {
        message = format.apply(self, arguments);
        errors.push(message);
        if (!multiple) {
          let err = new Error(message);
          err.errors = [ message ];
          throw err;
        } 
      };

      console.log('obj.name:', obj.name);

      if (!obj.name) logError('name is required.');
      if (!obj.tokenTTL) obj.tokenTTL = 600;
      if (!_.isInteger(obj.tokenTTL)) logError('tokenTTL must be an integer.');
      if (!obj.secret) obj.secret = uuid();
      if (!obj.scopes) obj.scopes = [];
      if (!_.isArray(obj.scopes)) logError('scopes must be an array.');
      let typeError = false;
      for (let i = 0; i < obj.scopes.length; i++) {
        if (!_.isString(obj.scopes[i])) typeError = true;
      }
      if (typeError) logError('every element of scopes must be a string.');

      if (!obj.id) obj.id = yield self.id(obj);
      let exists = yield self.exists(obj.id);
      if (exists) logError('%s with id "%s" already exists.', self.modelName, obj.id);

      if (errors.length > 0) {
        let err = new Error(errors[0]);
        err.errors = errors;
        throw err;
      }
      console.log('Application.validateCreate: DONE!');
      return;

    })();
  };

  return model;
};