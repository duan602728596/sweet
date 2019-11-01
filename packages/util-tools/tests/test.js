const register = require('@babel/register');
const babelRegisterConfig = require('../../../scripts/registerConfig');

register(babelRegisterConfig);

/* test */
require('./update/update');
require('./image2webp/image2webp');
require('./imageCompress/imageCompress');
require('./image2icns/image2icns');
require('./media2webp/media2webp');