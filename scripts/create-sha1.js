const sha1 = require('sha1');

const DEFAULT = 'zppr';
let arg = process.argv[2] || DEFAULT;
console.log('%s: %s', arg, sha1(arg));
