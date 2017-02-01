const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const saltRounds = 10;
const myPassword = 'THIS_IS_MY_PASSWORD';
const otherPassword = 'not_bacon';

Promise.coroutine(function *() {
  let hash  = yield bcrypt.hash(myPassword, saltRounds);
  console.log('\nhash:', hash);

  let attempt = yield bcrypt.compare(otherPassword, hash);
  console.log('\nattempt:', attempt);

  attempt = yield bcrypt.compare(myPassword, hash);
  console.log('\nattempt:', attempt);

})();

