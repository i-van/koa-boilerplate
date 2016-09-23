const mongoose = require('mongoose');
const glob = require('glob');
const validate = require('mongoose-validator');

module.exports = app => {
  const validation = {
    emailValidator: [
      validate({
        validator: 'isEmail'
      })
    ]
  };

  app.db = mongoose;
  mongoose.connect(process.env.MONGO_URI);
  mongoose.validation = validation;
  glob.sync('../app/models/**.js', { cwd: __dirname }).forEach(require);

  return function* (next) {
    this.db = mongoose;
    yield next;
  };
};
