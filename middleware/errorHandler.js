
module.exports = function (opts) {
  let app = opts.app;
  return function *(next) {
    try {
      yield next;
    }
    catch (err) {
      console.error(err);
      this.status = err.status || 500;
      this.body = {
        status: this.status,
        message: err.message,
        errors: err.errors || [],
      };
    }
  };
};
