module.exports = {
  numericDate: function (ms) {
    if (!ms) ms = Date.now();
    return Math.floor(ms / 1000);
  },
};