export default function(sweetOptions) {
  return {
    'GET /mock/api/test': (ctx, next) => {
      ctx.body = {
        text: 'mock'
      };
    }
  };
}