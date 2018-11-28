/* 图片配置 */
import imageConfig from '../config/image';
import { SweetConfig, Loader } from '../utils/types';

export default function(sweetConfig: SweetConfig): Loader{
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const mode: string = sweetConfig.mode;
  const serverRender: boolean = sweetConfig.serverRender;

  const emitFile: boolean = !serverRender;
  const isDevelopment: boolean = mode === 'development';

  return { // 图片
    test: /^.*\.(jpe?g|png|gif|webp)$/,
    use: [imageConfig({
      isDevelopment,
      emitFile
    })]
  };
}