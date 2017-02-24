const merge = require('merge');
const uuid = require('uuid/v4');

module.exports = function (router, model, resource) {
  
  if (!model) {
    throw new Error(`${model.name} model not initialized.`);
  }

  router.get(`/api/${resource}`, function *() {
    this.body = yield model.ids();
  });

  router.get(`/api/${resource}/:id`, function *() {
    let obj = yield model.get(this.params.id);
    if (obj) this.body = obj;
    else this.throw(404, `${model.name} ${this.params.id} not found.`);
  });

  router.post(`/api/${resource}`, function *() {
    if (this.get('content-type') !== 'application/json')
      this.throw(400, 'Content-Type must be application/json');
    let obj = this.request.body;
    try {
      let result = yield model.create(obj);
      this.body = result;   
    }
    catch (err) {
      this.throw(err.status || 500, err);
    }
  });

  router.put(`/api/${resource}/:id`, function *() {
    let obj = this.request.body;
    try {
      let result = yield model.save(this.params.id, obj);
      this.body = result;
    }
    catch (err) {
      this.throw(err.status || 500, err);
    }
  });

  router.patch(`/api/${resource}/:id`, function *() {
    let obj = this.request.body;
    try {
      let result = yield model.get(this.params.id);
      let patched = merge(result, obj);
      result = yield model.save(this.params.id, patched);
      return result;
    }
    catch (err) {
      this.throw(err.status || 500, err);
    }
  });

  router.delete(`/api/${resource}/:id`, function *() {
    let result = yield model.delete(this.params.id);
    if (!result) this.throw(404);
    this.statusCode = 204;
    this.body = null;
  });

};