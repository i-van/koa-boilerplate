
process.env.MONGODB_URI || (process.env.MONGODB_URI = 'mongodb://localhost:27017/reports_test');

require('co-mocha');
require('../bootstrap');
