import process from 'node:process';

/* test */
await import('./config.mjs');
await import('./build.mjs');

setTimeout(() => {
  process.exit();
}, 60_000);