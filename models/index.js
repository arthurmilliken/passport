const mongoose = require('mongoose');

module.exports = function (app) {
  mongoose.connect(process.env['MONGODB_URI'], function (err, connection) {
    if (err) throw err;
    console.log('mongoose: connected.');
    app.context.connection = connection;
    app.context.mongoose = mongoose;
    app.context.models = {
      Application: require('./Application.js')(mongoose),
      // User: require('./User.js')(app),
    };

  });
};