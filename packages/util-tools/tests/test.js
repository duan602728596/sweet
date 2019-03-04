const register = require('@babel/register');
const babelRegisterConfig = require('../../../utils/babelRegisterConfig');

register(babelRegisterConfig);

/* test */
require('./update');
require('./image2webp/image2webp');