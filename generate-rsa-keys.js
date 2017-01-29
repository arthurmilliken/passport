const fs = require('fs');
const NodeRSA = require('node-rsa');

let key = new NodeRSA({b: 512});

console.log('\n----------------------------------------------------------');
console.log(  'Please save these ENVIRONMENT VARIABLES to your environmnt:')
console.log(  '----------------------------------------------------------');

let privateKey = key.exportKey('pkcs1-private-pem');
console.log('\nRSA_PRIVATE_KEY:\n\n' + privateKey);

let publicKey = key.exportKey('pkcs1-public-pem');
console.log('\nRSA_PUBLIC_KEY:\n\n' + publicKey);

