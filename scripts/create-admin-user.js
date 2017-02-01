const Promise = require('bluebird');
const mongoose = require('mongoose');
const uuid = require('uuid/v4');

mongoose.Promise = Promise;

require('dotenv').config( {path: __dirname + '/../.env'} );


Promise.coroutine(function *() {

  mongoose.connect(process.env['MONGODB_URI']);

  let Application = require('../models/Application.js')(mongoose);
  
  let inserted = yield Application.findOneAndUpdate(
    { name: 'admin' },
    {
      name: 'admin',
      secret: uuid(),
      scopes: [ 'superuser' ],
      ttl: 84600
    },
    { upsert: true, new: true }
  );

  console.log('\nsaved:', inserted);

  yield mongoose.disconnect();

})();
