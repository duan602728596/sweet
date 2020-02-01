const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig');

register(babelConfig);

/* test */
require('./dll');
require('./build');
require('./start');