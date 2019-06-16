import request from 'request';

function reqData(uri) {
  return new Promise((resolve, reject) => {
    request({
      uri,
      method: 'GET'
    }, function(err, res, data) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  }).catch((err) => {
    console.error(err);
  });
}

export default reqData;