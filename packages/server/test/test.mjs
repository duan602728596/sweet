import process from 'node:process';

/* 测试服务 */
await import('./testServer.mjs');

/* test */
await import('./devServer.mjs');
await import('./devTsServer.mjs');
await import('./devViteServer.mjs');
await import('./proServer.mjs');

setTimeout(() => {
  process.exit();
}, 60_000);