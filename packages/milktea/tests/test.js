/* eslint-disable */
const register = require('@babel/register');
const babelRegisterConfig = require('../../../utils/babelRegisterConfig');

register(babelRegisterConfig);

/* test */
require('./loaders');
require('./dll');
require('./config');
require('./server');