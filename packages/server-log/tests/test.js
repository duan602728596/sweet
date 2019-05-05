const process = require('process');
const register = require('@babel/register');
const babelRegisterConfig = require('../../../scripts/babelRegisterConfig');

register(babelRegisterConfig);

require('./serverLog');