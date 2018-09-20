/* js 配置 */
import babelConfig from '../config/babel';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string } 开发模式还是生产模式
   * babel { Object } loader里面js的配置
   */
  const { mode, babel }: {
    mode: string,
    babel: {
      presets: Array,
      plugins: Array,
      otherPresets: Array,
      otherPlugins: Array
    }
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const { presets, plugins, otherPresets, otherPlugins, exclude }: {
    presets: Array,
    plugins: Array,
    otherPresets: Array,
    otherPlugins: Array,
    exclude: RegExp
  } = babel || {};

  return {
    test: /^.*\.js$/,
    use: [babelConfig({
      isDevelopment,
      presets,
      plugins,
      otherPresets,
      otherPlugins
    })],
    exclude: exclude || /(dll\.js|node_modules)/
  };
}