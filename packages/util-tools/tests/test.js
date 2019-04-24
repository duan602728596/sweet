const register = require('@babel/register');
const babelRegisterConfig = require('../../../scripts/babelRegisterConfig');

register(babelRegisterConfig);

/* test */
require('./update');
require('./image2webp/image2webp');
require('./imageCompress/imageCompress');