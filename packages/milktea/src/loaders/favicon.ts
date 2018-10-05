/* favicon 配置 */
import faviconConfig from '../config/favicon';
import { Loader } from '../utils/types';

export default function(): Loader{
  return {
    test: /^.*\.ico$/,
    use: [faviconConfig()]
  };
}