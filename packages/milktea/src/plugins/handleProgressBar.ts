import * as ProgressBar from 'progress';
import * as colors from 'colors/safe';
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

let defaultProgressBarCache: InfoCache | null = null,
  serverRenderProgressCache: InfoCache | null = null;

export function handleDefaultProgressBar(percentage: number, message: string, ...args: Array<string>): void {
  const mt: moment.Moment = moment();
  const nowTime: number = mt.valueOf();
  const timeStr: string = mt.format('YYYY-MM-DD HH:mm:ss');

  // 创建进度条
  if (defaultProgressBarCache === null) {
    defaultProgressBarCache = {
      current: 0,
      startTime: nowTime,
      bar: new ProgressBar(`Build [${ colors.cyan(':bar') }] ${ colors.yellow(':percent') } :time`, {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: 100,
        time: '0s'
      })
    };

    return;
  }

  const endTime: number = Number(((nowTime - defaultProgressBarCache.startTime) / 1000).toFixed(3));
  const current: number = calculateProgress(percentage); // 进度条

  if (defaultProgressBarCache.bar.complete || current >= 100) {
    defaultProgressBarCache.bar.tick(current - defaultProgressBarCache.current, {
      time: `${ endTime }s`
    });

    console.log(`\n[${ timeStr }] ${ colors.green(`Build done. ${ colors.blue(`(${ endTime }s)`) }`) }\n`);
    defaultProgressBarCache = null;

    return;
  }

  if (current > defaultProgressBarCache.current) {
    defaultProgressBarCache.bar.tick(current - defaultProgressBarCache.current, {
      time: `${ endTime }s`
    });

    defaultProgressBarCache.current = current;
  }
}

export function handleServerRenderProgressBar(percentage: number, message: string, ...args: Array<string>): void {
  const mt: moment.Moment = moment();
  const nowTime: number = mt.valueOf();
  const timeStr: string = mt.format('YYYY-MM-DD HH:mm:ss');

  // 创建进度条
  if (serverRenderProgressCache === null) {
    serverRenderProgressCache = {
      current: 0,
      startTime: nowTime,
      bar: new ProgressBar(`Build [${ colors.cyan(':bar') }] ${ colors.yellow(':percent') } :time`, {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: 100,
        time: '0s'
      })
    };

    return;
  }

  const endTime: number = Number(((nowTime - serverRenderProgressCache.startTime) / 1000).toFixed(3));
  const current: number = calculateProgress(percentage); // 进度条

  if (serverRenderProgressCache.bar.complete || current >= 100) {
    serverRenderProgressCache.bar.tick(current - serverRenderProgressCache.current, {
      time: `${ endTime }s`
    });

    console.log(`\n[${ timeStr }] ${ colors.green(`SSR build done. ${ colors.blue(`(${ endTime }s)`) }`) }\n`);
    serverRenderProgressCache = null;

    return;
  }

  if (current > serverRenderProgressCache.current) {
    serverRenderProgressCache.bar.tick(current - serverRenderProgressCache.current, {
      time: `${ endTime }s`
    });

    serverRenderProgressCache.current = current;
  }
}