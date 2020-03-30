import http from 'http';

function request(uri, options, body = '') {
  return new Promise((resolve, reject) => {
    const req = http.request(uri, options, function(res) {
      const chunks = [];

      res.on('data', function(chunk) {
        chunks.push(chunk);
      });

      res.on('end', function() {
        const buffer = Buffer.concat(chunks),
          str = buffer.toString('utf8');

        resolve({
          data: str,
          response: res
        });
      });
    });

    req.write(body);
    req.end();
  });
}

export async function get(uri, json = false) {
  const options = {
    method: 'GET',
    timeout: 15000
  };

  if (json) {
    options.headers = { 'Content-Type': 'application/json' };
  }

  const res = await request(uri, options);
  const data = json ? JSON.parse(res.data) : res.data;

  return { statusCode: res.response.statusCode, data };
}

export async function post(uri, body) {
  const res = await request(uri, {
    method: 'POST',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify(body));
  const data = JSON.parse(res.data);

  return { statusCode: res.response.statusCode, data };
}