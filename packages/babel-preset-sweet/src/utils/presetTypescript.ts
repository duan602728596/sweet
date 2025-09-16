/* @babel/preset-typescript */
function presetTypescript(): [string, any] {
  return ['@babel/preset-typescript', {
    allowNamespaces: true,
    optimizeConstEnums: true
  }];
}

export default presetTypescript;