/* 格式化输出 */
function handleProgress(percentage: number, message: string, ...args: Array<any>): void {
  const schedule: number = Number(percentage.toFixed(2)) * 100;
  const pNumber: string[] = `${ schedule }`.split('.');

  console.info('\x1B[46m%s\x1B[49m', `${ pNumber[0] }%`, message, ...args);
}

export default handleProgress;