const merge = require('merge');
const uuid = require('uuid/v4');
const baseResource = require('./base-resource.js');

module.exports = function (router, app) {
  let Application = app.context.models.Application;

  baseResource(router, Application, 'applications');

  router.post('/api/applications/populate', function *() {

    let result = [];

    let created = yield Application.create({
      name: 'admin',
      scopes: [ 'superuser' ],
      ttl: 84600
    });
    result.push(created);

    created = yield Application.create({
      name: 'api.zppr.com',
      scopes: [ 'superuser' ],
      ttl: 84600
    });
    result.push(created);

    this.body = result;
  }); 

};