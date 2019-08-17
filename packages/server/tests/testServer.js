/* 测试服务 */
import http from 'http';
import Koa from 'koa';
import Router from '@koa/router';
import body from 'koa-body';

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
    query: body.text
  };
});


http.createServer(app.callback())
  .listen(6060);