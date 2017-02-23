const fs = require('fs');
const https = require('https');
const koa = require('koa');
const koaBody = require('koa-body')();
const redis = require('redis');
const coredis = require('co-redis');

const app = module.exports = koa();

require('dotenv').config();

app.on('error', (err) => {
	console.error(err);
});

// Initialization.
const dbClient = coredis(redis.createClient(process.env.REDIS_URL));
dbClient.on('error', console.error);
app.context.db = dbClient;
app.context.models = require('./models')(dbClient);
app.context.RSA_PUBLIC_KEY = fs.readFileSync(process.env.RSA_PUBLIC_KEY_PATH);
app.context.RSA_PRIVATE_KEY = fs.readFileSync(process.env.RSA_PRIVATE_KEY_PATH);

// Mount middleware.
app.use(koaBody);
app.use(require('./middleware/logger.js')());
require('./routes')(app);

// Start server.
const PORT = process.env.PORT || 3000;
// https.createServer({
//   key: fs.readFileSync(__dirname + '/secrets/key.pem'),
//   cert: fs.readFileSync(__dirname + '/secrets/cert.pem'),
// }, app.callback()).listen(PORT);

app.listen(PORT);

console.log('http server listening at port:', PORT);