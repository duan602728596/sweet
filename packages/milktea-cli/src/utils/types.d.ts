import { Compiler } from 'webpack';

export interface Milktea {
  dllConfig: Function;
  config: Function;
  serverRenderConfig: Function;
  callback: Compiler.Handler;
  callbackOnlyError: Compiler.Handler
}

export interface Argv {
  config: string;
  webpackLog: string;
  // server
  server: boolean;
  httpPort: number;
  httpsPort: number;
  serverRoot: string;
  serverRender: boolean;
  serverRenderRoot: string;
  serverRenderFile: string;
  template: string;
  renderType: string;
  log: boolean;
  logUrl: string;
  logPm2: boolean;
  httpsKey: string;
  httpsCert: string;
  useBabelRegister: boolean;
  // utils
  registry: number;
  imageEntry: string;
  imageOutput: string;
  quality: number;
  size: number;
  retina: number;
  __DEV__: boolean;
}