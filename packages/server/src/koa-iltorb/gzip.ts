// zlib.gzip(buffer[, options], callback)
import * as zlib from 'zlib';

function gzip(buffer: Buffer): Promise<Buffer>{
  return new Promise((resolve: Function, reject: Function): void=>{
    zlib.gzip(buffer, function(err: Error, data: Buffer){
      if(reject){
        reject(err);
      }else{
        resolve(data);
      }
    });
  });
}

export default gzip;