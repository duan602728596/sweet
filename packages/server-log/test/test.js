const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig.mjs');

register(babelConfig);

require('./serverLog');