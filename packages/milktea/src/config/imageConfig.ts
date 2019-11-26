import { LoaderOptions } from 'webpack-chain';
import { createImageName } from './fileNameConfig';
import { SweetConfig } from '../utils/types';

/**
 * url-loader配置
 * @param { SweetConfig } sweetConfig
 * @param { boolean } esModule: 是否配置为esModule
 */
export function createImageConfig(sweetConfig: SweetConfig, esModule: boolean = true): LoaderOptions {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const filename: string = createImageName(isDevelopment);

  return {
    name: filename,
    limit: 8192,
    emitFile: !serverRender,
    esModule
  };
}