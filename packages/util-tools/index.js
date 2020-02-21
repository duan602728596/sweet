const image2icns = require('./lib/image2icns').default;
const image2webp = require('./lib/image2webp').default;
const imageCompress = require('./lib/imageCompress').default;
const media2webp = require('./lib/media2webp').default;
const update = require('./lib/update').default;

const utilTools = {
  image2icns,
  image2webp,
  imageCompress,
  media2webp,
  update
};

module.exports = utilTools;
module.exports.default = utilTools;