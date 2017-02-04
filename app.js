const koa = require('koa');
const koaBody = require('koa-body')();
const app = module.exports = koa();

app.on('error', (err) => {
	console.error(err);
});

app.use(koaBody);
require('./models')(app);
require('./middleware/logger.js')(app);
require('./routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('http server listening at port:', PORT);