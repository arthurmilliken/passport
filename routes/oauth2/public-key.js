module.exports = function (router) {

  const publicKey = process.env.RSA_PUBLIC_KEY;
  if (!publicKey) throw(new Error('ERROR: please run node scripts/generate-rsa-keys.js before proceeding.'));

  router.get('/oauth2/public-key', function *() {
    if (!publicKey) this.throw(500, 'CONFIGURATION ERROR: please check server log for details.');
    this.body = publicKey;
  });

};