/* 字体文件配置 */
import fontFileConfig from '../config/fontFile';
import { SweetConfig, Loader } from '../utils/types';

export default function(sweetConfig: SweetConfig): Loader{
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, serverRender } = sweetConfig;
  const emitFile: boolean = !serverRender;
  const isDevelopment: boolean = mode === 'development';

  return {
    test: /^.*\.(eot|ttf|woff2?)$/,
    use: [
      fontFileConfig({
        isDevelopment,
        emitFile
      })
    ]
  };
}