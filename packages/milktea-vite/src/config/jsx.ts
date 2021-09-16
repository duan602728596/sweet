import { requireModule } from '@sweet-milktea/utils';
import type { Plugin } from 'vite';

/* esbuild的react配置 */
enum jsx {
  factory = '__react$jsx_0__',
  fragment = '__react$Fragment_0__'
}

export const esbuildReact: object = {
  jsxFactory: jsx.factory,
  jsxFragment: jsx.fragment,
  jsxInject: `import { createElement as ${ jsx.factory }, Fragment as ${ jsx.fragment } } from 'react';`
};

/* vite的vue配置 */
export async function vueVitePlugin(): Promise<Plugin[]> {
  return [
    (await requireModule('@vitejs/plugin-vue'))(),
    (await requireModule('@vitejs/plugin-vue-jsx'))()
  ];
}