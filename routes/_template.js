module.exports = function (router, app) {

  router.get('/path/to/route', function *() {
    this.body = 'hello from /path/to/route!';
  });

};