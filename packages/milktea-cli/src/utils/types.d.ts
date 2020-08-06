import type { Stats } from 'webpack';

export interface CallbackFunction<T> {
  (err?: Error, result?: T): any;
}

export interface Milktea {
  dllConfig: Function;
  config: Function;
  serverRenderConfig: Function;
  callback: CallbackFunction<Stats>;
  callbackOnlyError: CallbackFunction<Stats>;
}

export interface Argv {
  config: string;
  webpackLog: string;
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
  redirectToHttps: boolean;
  useBabelRegister: boolean;
  // ssr
  serverRender: boolean;
  serverRenderRoot: string;
  serverRenderFile: string;
  serverRenderMemFs: boolean;
  template: string;
  renderType: string;
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