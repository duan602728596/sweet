/* 配置optimization属性 */
import * as path from 'path';
import * as TerserPlugin from 'terser-webpack-plugin';
import { SweetConfig, SweetOptions } from '../utils/types';

interface Optimization{
  splitChunks?: {
    chunks: string;
    automaticNameDelimiter: string;
  };
  minimizer?: [TerserPlugin];
}

interface TerserOptions{
  ecma?: number;
}

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Optimization {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 是否为服务器端渲染
   * js { ?Object }: js配置
   */
  const { mode = 'development', serverRender, js }: SweetConfig = sweetConfig;

  const isDevelopment: boolean = mode === 'development';
  const optimization: Optimization = {};

  // 设置splitChunks配置
  if (!isDevelopment && !serverRender) {
    optimization.splitChunks = {
      chunks: 'all',
      automaticNameDelimiter: '.'
    };
  }

  // 设置minimizer的压缩插件
  if (!isDevelopment) {
    const terserOptions: TerserOptions = {};

    if (js && js.ecmascript) {
      terserOptions.ecma = 8;
    } else {
      terserOptions.ecma = 5;
    }

    optimization.minimizer = [
      new TerserPlugin({
        cache: path.join(sweetOptions.basicPath, '.terserCache'),
        terserOptions
      })
    ];
  }

  return optimization;
}