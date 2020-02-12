import fetch from 'node-fetch';

export async function get(uri, json = false) {
  const options = {
    method: 'GET',
    timeout: 15000
  };

  if (json) {
    options.headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(uri, options);
  const data = json ? await res.json() : await res.text();

  return { statusCode: res.status, data };
}

export async function post(uri, body) {
  const res = await fetch(uri, {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();

  return { statusCode: res.status, data };
}