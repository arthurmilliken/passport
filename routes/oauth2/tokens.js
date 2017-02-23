const format = require('util').format;
const jwt = require('jsonwebtoken');

const utilities = require('../../lib/utilities.js');

module.exports = function (router, app) {

	const privateKey = app.context.RSA_PRIVATE_KEY;
  const publicKey = app.context.RSA_PUBLIC_KEY;

	const tokens = function *() {
    let Application = app.context.models.Application;

		if (!privateKey) this.throw(500, 'CONFIGURATION ERROR: please check server log for details.');
    if (!publicKey) this.throw(500, 'CONFIGURATION ERROR: please check server log for details.');

		// Validate query.
		let grantType = this.query['grant_type'];
		if (!grantType) this.throw(400, 'grant_type required.');
		if (grantType !== 'client_credentials') this.throw(400, 'grant_type must be client_credentials');

		let clientId = this.query['client_id'];
		if (!clientId) this.throw(400, 'client_id reqiured.');

		let clientSecret = this.query['client_secret'];
		if (!clientSecret) this.throw(400, 'client_secret required.');

		let application = yield Application.get(clientId);

		if (!application) this.throw(404, format('client_id %s not found.', clientId));

		if (application.secret !== clientSecret) this.throw(401, 'client_secret is not valid');

		this.body = jwt.sign({
  			exp: utilities.numericDate(Date.now() + (application.ttl * 1000)),
  			iss: 'pick.media',
  			aud: clientId,
  			scopes: application.scopes
  		}, 
  		privateKey,
  		{ algorithm: 'RS256' }
    );
	};

	router.get('/oauth2/tokens', tokens);
	router.post('/oauth2/tokens', tokens);

	router.get('/oauth2/tokens/:token/verify', function *() {
    let context = this;
    let token = context.params.token;
    try {
	    context.body = jwt.verify(
	      token,
	      publicKey, {
	        algorithms: ['RS256']
	      }
	    );
    }
    catch (err) {
    	if (err.name === 'JsonWebTokenError')
    		context.throw(401, err.message);
      else throw err;
    }

	});

};
