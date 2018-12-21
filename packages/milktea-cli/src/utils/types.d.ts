export interface Milktea{
  dll: Function;
  config: Function;
  serverRenderConfig: Function;
  callback: Function;
}

export interface Argv{
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