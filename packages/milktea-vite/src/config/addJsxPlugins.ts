import { requireModule, moduleExists } from '@sweet-milktea/utils';
// @ts-ignore Node16
import type { InlineConfig } from 'vite';
import type { Frame } from '../utils/types';

/**
 * 添加jsx插件
 * @param { InlineConfig } viteConfig: vite配置
 * @param { Frame } frame: 当前模式
 */
async function addJsxPlugins(viteConfig: InlineConfig, frame: Frame | undefined): Promise<void> {
  if (frame === 'react') {
    // 添加react配置
    Object.assign(viteConfig, {
      plugins: [
        (await requireModule('@vitejs/plugin-react'))({
          jsxRuntime: moduleExists('react/jsx-runtime') ? 'automatic' : 'classic'
        })
      ]
    });
  } else if (frame === 'vue') {
    // 添加vue配置
    Object.assign(viteConfig, {
      plugins: [
        (await requireModule('@vitejs/plugin-vue'))(),
        (await requireModule('@vitejs/plugin-vue-jsx'))()
      ]
    });
  }
}

export default addJsxPlugins;