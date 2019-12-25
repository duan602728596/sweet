/**
 * 测试用mock
 */

export default function(sweetOptions) {
  return {
    '/mock/api/test/0': 'test0',
    'GET /mock/api/test/1': {
      name: 'get',
      value: 1
    },
    'POST /mock/api/test/2': {
      name: 'post',
      value: 2
    },
    'POST /mock/api/test/3': (ctx, next) => {
      ctx.body = {
        name: 'post',
        value: 3
      };
    }
  };
}