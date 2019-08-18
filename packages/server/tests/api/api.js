/**
 * 测试用api
 * TODO: 用于cwd的目录定在这，所以文件只能先放在这
 */

export default function(router, sweetOptions, app) {
  router.get('/api/test', function(ctx, next) {
    ctx.body = {
      name: 'test',
      method: 'get'
    };
  });
}