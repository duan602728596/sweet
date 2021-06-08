import process from 'process';

/* test */
import './config.mjs';
import './build.mjs';

setTimeout(() => {
  process.exit();
}, 60_000);