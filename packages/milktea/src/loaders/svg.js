/* svg文件配置 */
import svgConfig from '../config/svg';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string } 开发模式还是生产模式
   */
  const { mode }: { mode: string } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  return {
    test: /\.svg$/,
    use: [svgConfig({ isDevelopment })]
  };
}