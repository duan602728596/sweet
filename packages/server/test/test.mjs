import process from 'process';

/* 测试服务 */
import './testServer.mjs';

/* test */
import './devServer.mjs';
import './devTsServer.mjs';
import './devViteServer.mjs';
import './proServer.mjs';

setTimeout(() => {
  process.exit();
}, 60_000);