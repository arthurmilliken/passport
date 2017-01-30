
module.exports = function (app) {
  const router = require('koa-router')();

  require('./error.js')(router);
  require('./hello.js')(router);
  require('./oauth2/tokens.js')(router);
  require('./oauth2/public-key')(router);

	app
    .use(router.routes())
    .use(router.allowedMethods());
}

