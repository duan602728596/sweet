const process = require('process');
const register = require('@babel/register');
const babelRegisterConfig = require('../../../scripts/registerConfig');

register(babelRegisterConfig);

require('./serverLog');