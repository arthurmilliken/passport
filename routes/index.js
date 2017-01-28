
module.exports = function (app) {
  const router = require('koa-router')();

  router.get('/', function *() {
    this.body = 'Hello World!';
  });

  router.get('/error', function *() {
    this.throw('OOPS!');
  });

  router.get('/token', function *() {
    this.body = {
      token: 'ABCXYZ'
    }
  });

	app
    .use(router.routes())
    .use(router.allowedMethods());
}

