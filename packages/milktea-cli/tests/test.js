/* eslint-disable */
const register = require('@babel/register');
const babelRegisterConfig = require('../../../utils/babelRegisterConfig');

register(babelRegisterConfig);

/* test */
require('./dll');
require('./build');
require('./start');