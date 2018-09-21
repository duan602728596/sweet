/* vue 配置 */

export default function(): Object{
  return  {
    test: /^.*\.vue$/,
    use: ['vue-loader']
  };
}