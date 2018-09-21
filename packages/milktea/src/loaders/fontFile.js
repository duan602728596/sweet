/* 字体文件配置 */
import fontFileConfig from '../config/fontFile';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   */
  const { mode }: { mode: string } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  return {
    test: /^.*\.(eot|ttf|woff2?)$/,
    use: [fontFileConfig({ isDevelopment })]
  };
}