module.exports = function (dbClient) {
  return {
    Application: require('./Application.js')(dbClient),
    User: require('./User.js')(dbClient),
  };
};
