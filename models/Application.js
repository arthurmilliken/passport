module.exports = function (mongoose) {
  return mongoose.model('Application', mongoose.Schema({
    name: { type: String, unique: true },
    secret: String,
    scopes: Array,
    ttl: Number,
  }));
};