import type { LoaderOptions } from 'webpack-chain';
import createFileName from './fileNameConfig';
import type { SweetConfig } from '../utils/types';

/**
 * url-loader配置
 * @param { SweetConfig } sweetConfig
 */
export function createImageConfig(sweetConfig: SweetConfig): LoaderOptions {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const filename: string = createFileName(isDevelopment);

  return {
    name: filename,
    limit: 8192,
    emitFile: !serverRender,
    esModule: true
  };
}