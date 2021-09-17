import process from 'node:process';

/* test */
import './config.mjs';
import './build.mjs';

setTimeout(() => {
  process.exit();
}, 60_000);