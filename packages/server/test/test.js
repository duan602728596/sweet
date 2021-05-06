const process = require('process');
const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig.js');

register(babelConfig);

/* 测试服务 */
require('./testServer');

/* test */
require('./devServer');
require('./devTsServer');
require('./devViteServer');
require('./proServer');

setTimeout(() => {
  process.exit();
}, 60000);