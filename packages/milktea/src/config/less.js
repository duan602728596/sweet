/* less-loader 配置 */

export default function(options: Object = {}): Object{
  /**
   * modifyVars { Object }:  注入less变量
   */
  const modifyVars: Object = options?.modifyVars || {};

  return {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true,
      modifyVars
    }
  };
}