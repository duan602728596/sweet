const register = require('@babel/register');
const babelRegisterConfig = require('../../../utils/babelRegisterConfig');

register(babelRegisterConfig);

/* test */
require('./update');