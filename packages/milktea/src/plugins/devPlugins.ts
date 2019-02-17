/* 开发环境插件 */
import * as path from 'path';
import * as webpack from 'webpack';
import { isArray } from '../utils/utils';
import { SweetConfig, SweetOptions } from '../utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Array<any> {
  /**
   * dll { Array }: dll配置
   * serverRender { boolean }: 开启服务器端渲染
   */
  const dll: Array<string> | undefined = sweetConfig.dll;
  const serverRender: boolean | undefined = sweetConfig.serverRender;

  const plugins: Array<any> = [];

  if (dll && isArray(dll) && dll.length > 0 && !serverRender) {
    plugins.push(new webpack.DllReferencePlugin({
      context: sweetOptions.basicPath,
      manifest: require(path.join(sweetOptions.basicPath, '.dll/manifest.json'))
    }));
  }

  return plugins;
}