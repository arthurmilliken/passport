
module.exports = function () {
  return function *(next) {
    var start = new Date();
    yield next;
    var ms = new Date() - start;
    console.log('%s %s - %s - %sms', this.method, this.url, this.status, ms);
    this.set('X-Response-Time', ms + 'ms');
  };
};
