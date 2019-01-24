/* html 配置 */
import pugConfig from '../config/pug';
import { SweetConfig, Loader } from '../utils/types';

export default function(sweetConfig: SweetConfig): Loader{
  /**
   * mode { string }: 开发模式还是生产模式
   */
  const mode: string = sweetConfig.mode;
  const isDevelopment: boolean = mode === 'development';

  return {
    test: /^.*\.pug$/,
    use: [
      pugConfig({
        isDevelopment
      })
    ]
  };
}