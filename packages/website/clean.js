const path = require('path');
const { promises: fsP } = require('fs');

async function main() {
  const dist = path.join(__dirname, 'dist');
  const files = await fsP.readdir(dist);
  const queue = files.filter((o) => !['.git'].includes(o))
    .map((o) => fsP.rm(path.join(dist, o)));

  await Promise.all(queue);
}

main();