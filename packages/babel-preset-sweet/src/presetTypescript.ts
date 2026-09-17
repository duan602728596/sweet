import type { default as BabelPresetTypescript } from '@babel/preset-typescript';

type BabelPresetTypescriptOptions = Parameters<typeof BabelPresetTypescript>[1]

/* @babel/preset-typescript */
function presetTypescript(): ['@babel/preset-typescript', BabelPresetTypescriptOptions] {
  return [
    '@babel/preset-typescript',
    {
      allowNamespaces: true,
      optimizeConstEnums: true
    }
  ];
}

export default presetTypescript;