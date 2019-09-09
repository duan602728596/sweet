/**
 * 测试用api
 */

export default function(router, sweetOptions, app) {
  router.get('/api/test', function(ctx, next) {
    ctx.body = {
      name: 'test',
      method: 'get'
    };
  });
}