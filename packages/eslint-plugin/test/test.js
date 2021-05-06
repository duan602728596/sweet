const register = require('@babel/register');
const babelConfig = require('../../../scripts/babelConfig.js');

register(babelConfig);

require('./rules/spaceBeforeBlocks');
require('./rules/spaceInfixOps');