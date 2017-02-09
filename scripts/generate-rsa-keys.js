const fs = require('fs');
const NodeRSA = require('node-rsa');

let key = new NodeRSA({b: 512});

let privateKey = key.exportKey('pkcs1-private-pem');
console.log('\n' + privateKey);

let publicKey = key.exportKey('pkcs1-public-pem');
console.log('\n' + publicKey);

// console.log('\n---------------------------------------------');
// console.log(  'Please save these values to your environment:');
// console.log(  '---------------------------------------------\n');
// console.log('RSA_PRIVATE_KEY="%s"', privateKey.replace(/\n/g, '\\n'));
// console.log('RSA_PUBLIC_KEY="%s"', publicKey.replace(/\n/g, '\\n'));
