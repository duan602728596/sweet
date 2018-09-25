/* 字体文件配置 */
import fontFileConfig from '../config/fontFile';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, serverRender }: {
    mode: string,
    serverRender: boolean
  } = sweetConfig;
  const emitFile: boolean = !serverRender;
  const isDevelopment: boolean = mode === 'development';

  return {
    test: /^.*\.(eot|ttf|woff2?)$/,
    use: [fontFileConfig({
      isDevelopment,
      emitFile
    })]
  };
}