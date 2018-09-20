/* favicon 配置 */

export default function(): Object{
  return {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]'
    }
  };
}