const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig.mjs');

register(babelConfig);

/* test */
require('./dll');
require('./build');
require('./start');