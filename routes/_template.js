module.exports = function (router) {

	router.get('/path/to/route', function *() {
		this.body = 'hello from /path/to/route!';
	});

};