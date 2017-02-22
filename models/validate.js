const validate = require('jsonschema').validate;
const schema = require('./Application.schema.json');

const runValidation = function (obj) {
  let result = validate(obj, schema);
  console.log('\nvalidate:', obj);
  if (result.errors.length) {
    result.errors.forEach(error => console.log('error:', error.stack));
  }
  else console.log('SUCCESS!');

};

runValidation({});
runValidation({ name: 'name'});
runValidation({ name: 'tokenString', tokenTTL: '1000'});
runValidation({ name: 'scopes string', scopes: 'scopes '});
runValidation({ name: 'scopes [number]', scopes: [100]});
runValidation({ name: 'scopes [string]', scopes: ['hello']});
runValidation({ name: 'unknown property', someProperty: 'unknown'});
runValidation({ scopes: 'string', tokenTTL: 'string'});


