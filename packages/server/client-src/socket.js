// TODO: 编译时需要修改源文件
const Client = process.env.SWEET_SOCKET === 'ws'
  ? require('./clients/WebsocketClient')
  : require('./clients/SockJSClient');