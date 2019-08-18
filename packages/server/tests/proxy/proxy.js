/**
 * 测试用代理
 * TODO: 用于cwd的目录定在这，所以文件只能先放在这
 */

export default function(sweetOptions, app) {
  return {
    '/proxy/test': {
      target: 'http://127.0.0.1:5054',
      pathRewrite: {
        '^/proxy/test': ''
      }
    }
  };
}