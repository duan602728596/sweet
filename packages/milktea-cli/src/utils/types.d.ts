import type { Stats } from 'webpack';
import type { CallbackFunction } from './webpackTypes';

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
  template: string;
  renderType: string;
  // utils
  registry: number;
  imageEntry: string;
  imageOutput: string;
  ext: string;
  size: number;
  retina: number;
  __DEV__: boolean;
}