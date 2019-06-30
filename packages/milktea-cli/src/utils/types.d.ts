import { Stats } from 'webpack';

export interface Milktea {
  dllConfig: Function;
  config: Function;
  serverRenderConfig: Function;
  callback: (err: Error, stats: Stats) => void;
}

export interface Argv {
  config: string;
  // server
  server: boolean;
  httpPort: number;
  httpsPort: number;
  serverRoot: string;
  serverRender: boolean;
  serverRenderFile: string;
  template: string;
  renderType: string;
  log: boolean;
  logUrl: string;
  logPm2: boolean;
  httpsKey: string;
  httpsCert: string;
  // utils
  registry: number;
  imageEntry: string;
  imageOutput: string;
  quality: number;
  __DEV__: boolean;
}