const moment = require('moment');

const package = require('../package.json');

const started = moment();

module.exports = function (app) {
  const router = require('koa-router')();

  router.get('/', function *() {
    this.body = {
      name: package.name,
      version: package.version,
      description: package.description,
      started: started.format(),
      uptime: moment.duration(moment().diff(started)).humanize(),
    };
  });

  router.all('/error', function *() {
    this.throw(500, 'Error!');
  });

  require('./oauth2/tokens.js')(router, app);
  require('./oauth2/public-key.js')(router, app);
  require('./api/applications.js')(router, app);

	app
    .use(router.routes())
    .use(router.allowedMethods());
};

