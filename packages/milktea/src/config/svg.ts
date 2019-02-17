/* svg文件配置 */
import { LoaderOption } from '../utils/types';

interface SvgOption {
  isDevelopment?: boolean;
  emitFile?: boolean;
}

export default function(options: SvgOption = {}): LoaderOption {
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * emitFile { boolean }: 是否生成文件
   */
  const { isDevelopment, emitFile }: SvgOption = options;
  const fileName: string = isDevelopment ? '[name].[ext]' : '[hash:5].[ext]';

  return {
    loader: 'file-loader',
    options: {
      name: fileName,
      outputPath: 'image/',
      emitFile
    }
  };
}