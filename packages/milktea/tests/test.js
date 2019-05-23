const register = require('@babel/register');
const babelRegisterConfig = require('../../../scripts/registerConfig');

register(babelRegisterConfig);

/* test */
require('./dll');
require('./config');
require('./server');
require('./function');