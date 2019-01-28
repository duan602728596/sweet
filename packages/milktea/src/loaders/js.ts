/* js 配置 */
import babelConfig from '../config/babel';
import { SweetConfig, SweetOptions, Loader } from '../utils/types';

interface Js{
  ecmascript?: boolean;
  presets?: Array<any>;
  plugins?: Array<any>;
  resetPresets?: Array<any>;
  resetPlugins?: Array<any>;
  exclude?: RegExp;
  include?: RegExp;
}

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Loader{
  /**
   * mode { string } 开发模式还是生产模式
   * js { Object } loader里面js的配置
   * frame { ?string } 是否为react或vue模式
   */
  const { mode, js } = sweetConfig;
  const frame: string | undefined = sweetConfig.frame;

  const isDevelopment: boolean = mode === 'development';

  // 获取配置
  const _js: Js = js || {};
  const { ecmascript, presets, plugins, resetPresets, resetPlugins, exclude, include } = _js;

  return {
    test: /^.*\.jsx?$/,
    use: [
      babelConfig({
        isDevelopment,
        ecmascript,
        presets,
        plugins,
        resetPresets,
        resetPlugins,
        frame
      }, sweetOptions)
    ],
    exclude,
    include
  };
}