const process = require('process');
const register = require('@babel/register');
const babelRegisterConfig = require('../../../scripts/registerConfig');

register(babelRegisterConfig);

/* 测试服务 */
require('./testServer');

/* test */
require('./devServer');
require('./devTsServer');
require('./proServer');

setTimeout(() => {
  process.exit();
}, 60000);