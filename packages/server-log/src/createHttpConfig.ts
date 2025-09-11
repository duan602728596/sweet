/**
 * 创建http的文件日志的配置
 * @param { string } url - 接口地址
 * @param { boolean } pm2 - 是否启动pm2
 */
function createHttpConfig(url: string, pm2: boolean): object {
  return {
    appenders: {
      logfaces: {
        type: '@log4js-node/logfaces-http',
        url
      }
    },
    categories: {
      default: {
        appenders: ['logfaces'],
        level: 'info'
      },
      application: {
        appenders: ['logfaces'],
        level: 'warn'
      },
      access: {
        appenders: ['logfaces'],
        level: 'info'
      }
    },
    pm2
  };
}

export default createHttpConfig;