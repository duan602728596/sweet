/* js 配置 */
import babelConfig from '../config/babel';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string } 开发模式还是生产模式
   * js { Object } loader里面js的配置
   * frame { ?string } 是否为react或vue模式
   */
  const { mode, js, frame }: {
    mode: string,
    js: {
      ecmascript: boolean,
      presets: ?Array,
      plugins: ?Array,
      resetPresets: ?Array,
      resetPlugins: ?Array,
      exclude: ?RegExp
    },
    frame: ?string
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const { ecmascript, presets, plugins, resetPresets, resetPlugins, exclude }: {
    ecmascript: boolean,
    presets: ?Array,
    plugins: ?Array,
    resetPresets: ?Array,
    resetPlugins: ?Array,
    exclude: ?RegExp
  } = js || {};

  return {
    test: /^.*\.js$/,
    use: [babelConfig({
      isDevelopment,
      ecmascript,
      presets,
      plugins,
      resetPresets,
      resetPlugins,
      isReact: frame === 'react'
    })],
    exclude: exclude || /(dll\.js|node_modules)/
  };
}