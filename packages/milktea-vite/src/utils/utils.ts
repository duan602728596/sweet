import type { SweetConfig } from './types.js';

/* 重新赋值 */
export function changeSweetConfig(sweetConfig: SweetConfig): void {
  const rename: Array<[string, string]> = [
    ['typescript', 'ts']
  ];

  for (const [newName, oldName] of rename) {
    if (!sweetConfig?.[newName]) {
      sweetConfig[newName] = sweetConfig[oldName];
    }
  }
}

/* lodash.mergeWith合并函数 */
export function customizer(objValue: unknown, srcValue: unknown): Array<unknown> | undefined {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}