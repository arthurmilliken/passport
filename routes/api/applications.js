const uuid = require('uuid/v4');

module.exports = function (router, app) {
  let Application = app.context.models.Application;
  
  if (!Application) {
    throw new Error('Application model not initialized.');
  }

  router.get('/api/applications', function *() {
    this.body = yield Application.ids();
  });

  router.get('/api/applications/:id', function *() {
    let obj = yield Application.get(this.params.id);
    this.body = obj;
  });

  router.post('/api/applications', function *() {
    if (this.get('content-type') !== 'application/json')
      this.throw(400, 'Content-Type must be application/json');
    let obj = this.request.body;
    try {
      let result = yield Application.create(obj);
      this.body = result;   
    }
    catch (err) {
      this.throw(err.status || 500, err);
    }
  });

  router.put('/api/applications/:id', function *() {
    try {
      let obj = this.request.body;
      let result = yield Application.create(obj);
      this.body = result;
    }
    catch (err) {
      this.throw(err.status || 500, err);
    }
  });

  router.patch('/api/applications/:id', function *() {
    this.throw(new Error('Not Implemented.'));
  });

  router.delete('/api/applications/:id', function *() {
    let result = yield Application.delete(this.params.id);
    if (!result) this.throw(404);
    this.statusCode = 204;
    this.body = null;
  });

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