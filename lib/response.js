const _ = require('lodash');

module.exports = function* (next) {
  try {
    yield next;
    if (!this.status || this.status === 404) {
      this.throw(404);
    }
  } catch (err) {
    this.status = err.status || 500;
    this.body = {
      name: err.name,
      message: err.message || 'Internal Error'
    };
    if (this.app.env === 'development') {
      this.body.stack = err.stack;
    }
    if (err.errors) {
      this.body.errors = _.map(err.errors, ({ message, path }) => ({ message, path }));
    }
    if (this.errors) {
      this.body.errors = this.errors.map(error => {
        const path = Object.keys(error)[0];
        return {
          path,
          message: error[path]
        };
      });
    }
  }
};
