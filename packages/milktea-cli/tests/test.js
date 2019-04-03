const register = require('@babel/register');
const babelRegisterConfig = require('../../../scripts/babelRegisterConfig');

register(babelRegisterConfig);

/* test */
require('./dll');
require('./build');
require('./start');