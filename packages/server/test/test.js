const process = require('process');
const register = require('@babel/register');
const babelRegisterConfig = require('../../../utils/babelRegisterConfig');

register(babelRegisterConfig);

/* test */
require('./devServer');
require('./proServer');

setTimeout(()=>{
  process.exit();
}, 150000);