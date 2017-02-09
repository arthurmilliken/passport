const uuid = require('uuid/v4');

module.exports = function (router, app) {
  let Application = app.context.models.Application;
  
  if (!Application) {
    throw new Error('Application model not initialized.');
  }

  router.get('/api/applications', function *() {
    this.body = yield Application.list();
  });

  router.get('/api/applications/:id', function *() {
    let obj = yield Application.get(this.params.id);
    this.body = obj;
  });

  router.post('/api/applications', function *() {
    if (this.get('content-type') !== 'application/json')
      this.throw(400, 'Content-Type must be application/json');
    let obj = this.request.body;
    // if (!obj.id) this.throw(400, 'obj.id is required');
    // if (!obj.scopes) obj.scopes = [];
    // if (!obj.secret) obj.secret = uuid();
    // if (!obj.ttl) obj.ttl = 600; // ten minutes.
    try {
      let result = yield Application.create(obj);
      this.body = result;   
    }
    catch (err) {
      this.throw(400, err);
    }
  });

  router.put('/api/applications/:id', function *() {
    try {
      let obj = this.request.body;
      let result = yield Application.create(obj);
      this.body = result;
    }
    catch (err) {
      this.throw(400, err);
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

    try {
      let obj = {
        name: 'admin',
        scopes: [ 'superuser' ],
        ttl: 84600
      };     
      let created = yield Application.create(obj);
      result.push(created);
    }
    catch (err) {
      result.push({ error: err.errors });
    }

    try {
      let obj = {
        name: 'api.zppr.com',
        scopes: [ 'superuser' ],
        ttl: 84600
      };     
      let created = yield Application.create(obj);
      result.push(created);
    }
    catch (err) {
      result.push({ error: err.errors });
    }

    this.body = result;
  }); 

};