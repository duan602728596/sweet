/* html 配置 */
import pugConfig from '../config/pug';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   */
  const { mode }: { mode: string } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  return {
    test: /^.*\.pug$/,
    use: [pugConfig({ isDevelopment })]
  };
}