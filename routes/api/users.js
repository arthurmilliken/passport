const merge = require('merge');
const uuid = require('uuid/v4');
const baseResource = require('./base-resource.js');

module.exports = function (router, app) {
  let User = app.context.models.User;
  baseResource(router, User, 'users'); // /api/users
};