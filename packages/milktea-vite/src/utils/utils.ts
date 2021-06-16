import type { SweetConfig } from './types';

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