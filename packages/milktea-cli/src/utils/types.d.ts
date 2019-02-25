import { Stats } from 'webpack';

export interface Milktea {
  dll: Function;
  config: Function;
  serverRenderConfig: Function;
  callback: (err: Error, stats: Stats) => void;
}

export interface Argv {
  config: string;
  server: boolean;
  httpPort: number;
  httpsPort: number;
  serverRoot: string;
  serverRender: boolean;
  serverRenderFile: string;
  registry: number;
  imageEntry: string;
  imageOutput: string;
  quality: number,
  __DEV__: boolean;
}