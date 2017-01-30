 module.exports = function (router) {
  router.get('/error', function *() {
    this.throw(400, 'Bad Request!');
  });
 };

