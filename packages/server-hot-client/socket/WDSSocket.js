/**
 * Initializes a socket server for HMR for webpack-dev-server.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 * @returns {void}
 */
function initWDSSocket(messageHandler) {
  const { default: SockJSClient } = require('../client/clients/SockJSClient.js');
  const { default: WebSocketClient } = require('../client/clients/WebSocketClient.js');
  const { client } = require('../client/socket.js');

  /** @type {WebSocket} */
  let connection;
  if (client instanceof SockJSClient) {
    connection = client.sock;
  } else if (client instanceof WebSocketClient) {
    connection = client.client;
  } else {
    throw new Error('Failed to determine WDS client type');
  }

  connection.addEventListener('message', function onSocketMessage(message) {
    messageHandler(JSON.parse(message.data));
  });
}

module.exports = { init: initWDSSocket };