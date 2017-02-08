const md5 = require('md5');

const DEFAULT = 'zppr';
let arg = process.argv[2] || DEFAULT;
console.log('%s: %s', arg, md5(arg));
