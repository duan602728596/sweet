/* @babel/preset-typescript */
function presetTypescript(): [string, any] {
  return ['@babel/preset-typescript', {
    isTSX: true,
    allExtensions: true,
    allowNamespaces: true,
    optimizeConstEnums: true
  }];
}

export default presetTypescript;