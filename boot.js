var services = module.exports = {};

services.config = require('./config');

services.db = require('./lib/mongo');
