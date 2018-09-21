/* 图片配置 */
import imageConfig from '../config/image';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   */
  const { mode }: { mode: string } = sweetConfig;
  const emitFile: boolean = sweetConfig.file.emitFile || true;
  const isDevelopment: boolean = mode === 'development';

  return { // 图片
    test: /^.*\.(jpe?g|png|gif)$/,
    use: imageConfig({ isDevelopment, emitFile })
  };
}