// TODO: 编译时需要修改源文件
import WebSocketClient from './clients/WebSocketClient.js';
import SockJSClient from './clients/SockJSClient.js';

const Client = process.env.SWEET_SOCKET === 'ws'
  ? WebSocketClient
  : SockJSClient;