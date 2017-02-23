
module.exports = function () {
  return function *(next) {
    var start = new Date();
    yield next;
    var ms = new Date() - start;
    console.log('%s %s - %sms', this.method, this.url, ms);
    this.set('X-Response-Time', ms + 'ms');
  };
};
