const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig');

register(babelConfig);

/* test */
require('./dll');
require('./config');
require('./server');
require('./function');