const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig.js');

register(babelConfig);

/* test */
require('./update/update');
require('./image2webp/image2webp');
require('./imageCompress/imageCompress');
require('./image2avif/image2avif');
require('./image2icns/image2icns');
require('./media2webp/media2webp');