/* @babel/plugin-transform-runtime */
function transformRuntime(): Array<[string, any?] | string> {
  return [
    '@babel/plugin-transform-runtime',
    ['polyfill-corejs3', { method: 'usage-global' }]
  ];
}

export default transformRuntime;