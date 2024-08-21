import process from 'node:process';
import path from 'node:path';

const isDev: boolean = process.env.NODE_ENV === 'development';

const reactCompiler: { sources(p: string): boolean } = {
  sources(p: string): boolean {
    return /website[\\/]src[\\/].+\.tsx/.test(p);
  }
};

export default function(info: object): object {
  const jsExclude: RegExp = /node_modules|packages[\\/](server|hot-client)/;

  const config: object = {
    frame: 'react',
    dll: [
      '@ant-design/icons',
      'antd',
      'react',
      'react/compiler-runtime',
      'react/jsx-dev-runtime',
      'react-dom',
      'react-dom/client',
      'react-helmet',
      'react-router-dom',
      'react-showdown'
    ],
    entry: {
      index: [path.join(__dirname, 'src/index.tsx')]
    },
    html: [{ template: path.join(__dirname, 'src/index.pug') }],
    javascript: {
      exclude: jsExclude
    },
    typescript: {
      configFile: isDev ? 'tsconfig.json' : 'tsconfig.prod.json',
      plugins: [['@babel/plugin-syntax-import-assertions', undefined, 'import-assertions']],
      exclude: jsExclude,
      reactCompiler
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