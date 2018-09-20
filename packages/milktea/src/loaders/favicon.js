/* favicon 配置 */
import faviconConfig from '../config/favicon';

export default function(): Object{
  return {
    test: /^.*\.ico$/,
    use: [faviconConfig()]
  };
}