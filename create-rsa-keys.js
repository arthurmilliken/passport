const fs = require('fs');
const NodeRSA = require('node-rsa');

let key = new NodeRSA({b: 512});

let privateKey = key.exportKey('pkcs1-private-pem');
console.log('saving:\n' + privateKey);
let filename = __dirname + '/rsa-key-private.pem';
fs.writeFileSync(filename);
console.log('saved: ' + filename);

let publicKey = key.exportKey('pkcs1-public-pem');
console.log('saving:\n' + publicKey);
filename = __dirname + '/rsa-key-public.pem';
fs.writeFileSync(filename);
console.log('saved: ' + filename);

