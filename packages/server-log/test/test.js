const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig.js');

register(babelConfig);

require('./serverLog');