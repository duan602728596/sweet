const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig');

register(babelConfig);

require('./typeAnnotationSpacing');