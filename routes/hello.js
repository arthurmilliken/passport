module.exports = function (router) {

	router.get('/hello', function *() {
		this.body = 'Hello World!';
	});

};