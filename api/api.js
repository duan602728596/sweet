module.exports = function(router, sweetOptions) {
  router.get('/api/test', (ctx, next) => {
    ctx.status = 200;
    ctx.body = {
      text: 'test'
    };
  });
};