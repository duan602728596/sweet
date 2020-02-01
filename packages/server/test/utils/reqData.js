import request from 'request';

export function get(uri, json = false) {
  return new Promise((resolve, reject) => {
    request({
      uri,
      method: 'GET',
      timeout: 15000,
      json
    }, function(err, res, data) {
      if (err) {
        reject(err);
      } else {
        resolve({
          statusCode: res.statusCode,
          data
        });
      }
    });
  }).catch((err) => {
    console.error(err);
  });
}

export function post(uri, body) {
  return new Promise((resolve, reject) => {
    request({
      uri,
      method: 'POST',
      timeout: 15000,
      json: true,
      body
    }, function(err, res, data) {
      if (err) {
        reject(err);
      } else {
        resolve({
          statusCode: res.statusCode,
          data
        });
      }
    });
  }).catch((err) => {
    console.error(err);
  });
}