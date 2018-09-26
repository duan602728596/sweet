/* webpack 配置 */
import TerserPlugin from 'terser-webpack-plugin';
import loaders from './loaders/loaders';
import plugins from './plugins/plugins';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * entry { any }: 文件入口
   * output { any }: 文件出口
   * externals { any }: 外部扩展
   */
  const sweetConfig2: Object = { ...sweetConfig };
  const { mode = 'development', entry, output, externals }: {
    mode: string,
    entry: any,
    output: any,
    externals: any
  } = sweetConfig2;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if('serverRender' in sweetConfig2){
    delete sweetConfig2.serverRender;
  }

  // webpack配置
  const config: Object = {
    mode,
    entry,
    output,
    externals,
    devtool: isDevelopment ? 'module-source-map' : 'none',
    module: { rules: loaders(sweetConfig2) },
    plugins: plugins(sweetConfig2)
  };

  if(!isDevelopment){
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.'
      },
      minimizer: [new TerserPlugin()]
    };
  }

  return config;
}