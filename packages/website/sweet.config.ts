import process from 'node:process';
import path from 'node:path';
import type { PluginItem } from '@babel/core';

const isDev: boolean = process.env.NODE_ENV === 'development';

export default function(info: object): object {
  const plugins: Array<PluginItem> = [
    ['@babel/plugin-syntax-import-assertions', undefined, 'import-assertions'],
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]
  ];

  if (!isDev) {
    plugins.unshift(['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }]);
  }

  const jsExclude: RegExp = /node_modules|packages[\/]server/;

  const config: object = {
    frame: 'react',
    dll: [
      'react',
      'react-dom',
      'prop-types',
      'react-helmet',
      'react-router',
      'react-router-dom',
      'history'
    ],
    entry: {
      index: [path.join(__dirname, 'src/index.tsx')]
    },
    html: [{ template: path.join(__dirname, 'src/index.pug') }],
    javascript: {
      plugins,
      exclude: jsExclude
    },
    typescript: {
      configFile: isDev ? 'tsconfig.json' : 'tsconfig.prod.json',
      plugins,
      exclude: jsExclude
    },
    sass: {
      include: /src/
    },
    css: {
      include: /node_modules/
    },
    rules: [{
      test: /^.*\.md$/i,
      type: 'asset/source'
    }]
  };

  return config;
}