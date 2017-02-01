const uuid = require('uuid/v4');

module.exports = function (router, app) {

  router.get('/api/applications/populate', function *() {
    let Application = app.context.models.Application;

    let result = [];

    let inserted = yield Application.findOneAndUpdate(
      { name: 'zppr' },
      {
        name: 'zppr',
        secret: uuid(),
        scopes: [ 'superuser' ],
        ttl: 84600           
      },
      { upsert: true, new: true }
    );
    result.push(inserted);
    console.log('/applications/populate: ', 'zppr');

    this.body = result;
  });

};