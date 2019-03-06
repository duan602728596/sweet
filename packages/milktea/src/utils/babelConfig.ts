/* babel plugins */
export const babelPlugins: Array<any> = [
  [
    '@babel/plugin-proposal-decorators',
    {
      legacy: true
    }
  ],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-do-expressions',
  '@babel/plugin-proposal-optional-catch-binding',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-optional-chaining'
];

/* @babel/register配置 */
interface RegisterConfig {
  presets: Array<any>;
  plugins: Array<any>;
  cache: boolean;
  configFile: boolean;
  babelrc: boolean;
  only: Array<string>;
}

export const registerConfig: RegisterConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['node 9']
        },
        debug: false,
        modules: 'commonjs',
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: babelPlugins,
  configFile: false,
  cache: false,
  babelrc: false,
  only: [
    '.sweetrc.js',
    'sweet.config.js'
  ]
};