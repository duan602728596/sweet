const process = require('node:process');

module.exports = {
  name: 'change-version-berry-plugin',
  factory: (require) => {
    const isWindow = process.platform === 'win32';

    return {
      hooks: {
        reduceDependency(dependency) {
          if (isWindow && dependency.name === 'rc-pagination' && dependency.range.includes('3.3.0')) {
            dependency.range = '3.2.0';
          }

          return dependency;
        }
      }
    };
  }
};