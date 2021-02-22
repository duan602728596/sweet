export default {
  url: '/(.*)',
  handler(ctx, sweetOptions) {
    return {
      title: 'Webpack App',
      initialState: {}
    };
  }
};