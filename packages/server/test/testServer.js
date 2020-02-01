/* 测试服务 */
const http = require('http');
const Koa = require('koa');
const Router = require('@koa/router');
const body = require('koa-body');

const app = new Koa();
const router = new Router();

/* body */
app.use(body());

/* router */
app.use(router.routes())
  .use(router.allowedMethods());

router.get('/get', function(ctx, next) {
  const { query } = ctx.request;

  ctx.body = {
    method: 'get',
    query: query.text
  };
});

router.post('/post', function(ctx, next) {
  const { body } = ctx.request;

  ctx.body = {
    method: 'post',
    body: body.text
  };
});


http.createServer(app.callback())
  .listen(5054);