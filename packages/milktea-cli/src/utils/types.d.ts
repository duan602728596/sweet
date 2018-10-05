export interface Milktea{
  dll: Function;
  config: Function;
  serverRenderConfig: Function;
  callback: Function;
}

export interface Argv{
  server: boolean;
  httpPort: number;
  httpsPort: number;
  serverRoot: string;
  serverRender: boolean;
  serverRenderFile: string;
  registry: number;
  config: string;
  __DEV__: boolean;
}