/**
 * 测试用代理
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