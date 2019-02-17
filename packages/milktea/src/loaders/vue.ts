/* vue 配置 */
import { Loader } from '../utils/types';

export default function(): Loader {
  return {
    test: /^.*\.vue$/,
    use: ['vue-loader']
  };
}