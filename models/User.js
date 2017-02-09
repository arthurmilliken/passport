const Promise = require('bluebird');
const moment = require('moment');
const BaseModel = require('./BaseModel');

module.exports = function (client) {
  let model = new BaseModel(client, 'user');
  return model;
};