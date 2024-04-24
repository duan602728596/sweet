import webpackLog from 'webpack-log';

/**
 * 创建日志
 * @param { object } [options = {}]
 */
function createLogger(options: { [key: string]: any } = {}): { [key: string]: Function } {
  let level: string = options.logLevel ?? 'info';

  if (options.noInfo === true) {
    level = 'warn';
  }

  if (options.quiet === true) {
    level = 'silent';
  }

  return webpackLog({
    name: 'wds',
    level,
    timestamp: options.logTime
  });
}

export default createLogger;