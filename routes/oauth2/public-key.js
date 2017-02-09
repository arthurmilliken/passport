module.exports = function (router, app) {

  router.get('/oauth2/public-key', function *() {
    this.body = app.context.RSA_PUBLIC_KEY;
  });

};