import * as path from 'path';

/**
 * 创建本地文件日志的配置
 * @param { string } basicPath: 基础路径
 * @param { boolean } pm2: 是否启动pm2
 */
function createFileConfig(basicPath: string, pm2: boolean): object {
  const filename: string = path.join(basicPath, '.logs');

  return {
    appenders: {
      access: {
        type: 'dateFile',
        filename,
        pattern: '/yyyy-MM-dd/acces.log',
        alwaysIncludePattern: true
      },
      application: {
        type: 'dateFile',
        filename,
        pattern: '/yyyy-MM-dd/application.log',
        alwaysIncludePattern: true
      },
      out: {
        type: 'dateFile',
        filename,
        pattern: '/yyyy-MM-dd/out.log',
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: {
        appenders: ['out'],
        level: 'info'
      },
      application: {
        appenders: ['application'],
        level: 'warn'
      },
      access: {
        appenders: ['access'],
        level: 'info'
      }
    },
    pm2
  };
}

export default createFileConfig;