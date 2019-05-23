const process = require('process');
const register = require('@babel/register');
const babelRegisterConfig = require('../../../scripts/registerConfig');

register(babelRegisterConfig);

/* test */
require('./devServer');
require('./proServer');

setTimeout(() => {
  process.exit();
}, 60000);