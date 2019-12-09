import * as ProgressBar from 'progress';
import * as chalk from 'chalk';
import * as moment from 'moment';

/**
 * 计算进度百分比
 * @param { number } percentage: 进度
 */
function calculateProgress(percentage: number): number {
  const schedule: number = Number(percentage.toFixed(2)) * 100;
  const pNumber: string[] = `${ schedule }`.split('.');

  return Number(pNumber[0]);
}

export interface InfoCache {
  current: number;   // 进度
  startTime: number; // 时间
  bar: ProgressBar;  // 进度条
}

/**
 * 进度条输出信息
 * @param { boolean } ssr
 */
function createHandleProgressBar(ssr: boolean): Function {
  const buildDoneMsg: string = ssr ? 'SSR build done.' : 'Build done.';
  let progressBarCache: InfoCache | null = null;

  return function handleDefaultProgressBar(percentage: number, message: string, ...args: Array<string>): void {
    const mt: moment.Moment = moment();
    const nowTime: number = mt.valueOf();
    const timeStr: string = mt.format('YYYY-MM-DD HH:mm:ss');

    // 创建进度条
    if (progressBarCache === null) {
      progressBarCache = {
        current: 0,
        startTime: nowTime,
        bar: new ProgressBar(`${ chalk.blue('Build') } [:bar] ${ chalk.yellow(':percent') } :time`, {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: 100,
          time: '0s'
        })
      };

      return;
    }

    const endTime: number = Number(((nowTime - progressBarCache.startTime) / 1000).toFixed(3));
    const current: number = calculateProgress(percentage); // 进度条

    // 编译完毕
    if (progressBarCache.bar.complete || current >= 100) {
      progressBarCache.bar.tick(current - progressBarCache.current, {
        time: `${ endTime }s`
      });

      console.log(`\n[${ timeStr }] ${ chalk.green(buildDoneMsg) }\n`);
      progressBarCache = null;

      return;
    }

    // 编译中
    if (current > progressBarCache.current) {
      progressBarCache.bar.tick(current - progressBarCache.current, {
        time: `${ endTime }s`
      });

      progressBarCache.current = current;
    }
  };
}

export default createHandleProgressBar;