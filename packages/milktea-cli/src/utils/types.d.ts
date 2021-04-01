import type { WebpackLog } from '@sweet-milktea/milktea/src/utils/types';

export interface Argv {
  config: string;
  webpackLog: WebpackLog;
  // server
  server: boolean;
  httpPort: number;
  httpsPort: number;
  serverRoot: string;
  log: boolean;
  logUrl: string;
  logPm2: boolean;
  httpsKey: string;
  httpsCert: string;
  socket: 'sockjs' | 'ws';
  redirectToHttps: boolean;
  useBabelRegister: boolean;
  // ssr
  serverRender: boolean;
  serverRenderRoot: string;
  serverRenderFile: string;
  template: string;
  renderType: 'ejs' | 'nunjucks';
  // utils
  registry: number;
  imageEntry: string;
  imageOutput: string;
  ext: string;
  size: number;
  retina: number;
  peerDependencies: boolean;
  __DEV__: boolean;
  __PACKAGES__: string;
}