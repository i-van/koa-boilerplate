
const auth = require('./auth');
const reports = require('./reports');

module.exports = app => {
  auth(app);
  reports(app);
};
