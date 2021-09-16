import { requireModule } from '@sweet-milktea/utils';
import type { Plugin } from 'vite';

/* esbuild的react配置 */
export const esbuildReact: object = {
  jsxFactory: '__react$jsx__',
  jsxFragment: '__react$Fragment__',
  jsxInject: "import { createElement as __react$jsx__, Fragment as __react$Fragment__ } from 'react';"
};

/* vite的vue配置 */
export async function vueVitePlugin(): Promise<Plugin[]> {
  return [
    (await requireModule('@vitejs/plugin-vue'))(),
    (await requireModule('@vitejs/plugin-vue-jsx'))()
  ];
}