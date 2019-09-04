export default function(sweetOptions, app) {
  return {
    '/proxy/raw/githubusercontent': {
      target: 'https://raw.githubusercontent.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/raw/githubusercontent': ''
      }
    }
  };
}