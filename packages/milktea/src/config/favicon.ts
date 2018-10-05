/* favicon 配置 */
import { LoaderOption } from '../utils/types';

export default function(): LoaderOption{
  return {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]'
    }
  };
}