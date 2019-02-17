/* image 配置 */
import { LoaderOption } from '../utils/types';

interface FontFileOption {
  isDevelopment?: boolean;
  emitFile?: boolean;
}

export default function(options: FontFileOption = {}): LoaderOption {
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * emitFile { boolean }: 是否生成文件
   */
  const { isDevelopment, emitFile }: FontFileOption = options;
  const fileName: string = isDevelopment ? '[name].[ext]' : '[hash:5].[ext]';

  return {
    loader: 'url-loader',
    options: {
      limit: 8192,
      fallback: {
        loader: 'file-loader',
        options: {
          name: fileName,
          outputPath: 'image/',
          emitFile
        }
      }
    }
  };
}