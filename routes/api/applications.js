const uuid = require('uuid/v4');

module.exports = function (router, app) {

  router.get('/api/applications', function *() {
    let Application = app.context.models.Application;
    this.body = yield Application.list();
  });

  router.get('/api/applications/:id', function *() {
    let Application = app.context.models.Application;
    let obj = yield Application.get(this.params.id);
    this.body = obj;
  });

  router.post('/api/applications', function *() {
    let posted = this.request.body;
    if (!posted.id) this.throw(400, 'obj.id is required');
    if (!posted.scopes) posted.scopes = [];
    if (!posted.secret) posted.secret = uuid();
    if (!posted.ttl) posted.ttl = 600; // ten minutes.
    let Application = app.context.models.Application;
    let result = yield Application.set(posted.id, posted);
    this.body = posted;
  });

  router.put('/api/applications/:id', function *() {

  });

  router.patch('/api/applications/:id', function *() {

  });

  router.get('/api/applications/populate', function *() {
    let Application = app.context.models.Application;

    let obj = {
      name: 'zppr',
      secret: uuid(),
      scopes: [ 'superuser' ],
      ttl: 84600
    };
    yield Application.set(obj.id, obj);
    console.log('/applications/populate:', obj);
    this.body = obj;
  }); 

};