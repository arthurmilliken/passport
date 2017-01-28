const koa = require('koa');
const app = module.exports = koa();

require('./middleware/logger.js')(app);

require('./routes')(app);

app.on('error', (err) => {
	console.error(err);
});

const PORT = process.env.PORT || 5000
app.listen(PORT);
console.log('http server listening at port:', PORT);