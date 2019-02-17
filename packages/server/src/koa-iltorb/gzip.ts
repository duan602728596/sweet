import * as zlib from 'zlib';

/* gzip压缩 */
function gzip(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve: Function, reject: Function): void => {
    zlib.gzip(buffer, function(err: Error, data: Buffer): void {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export default gzip;