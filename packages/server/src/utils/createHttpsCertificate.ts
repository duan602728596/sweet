import * as path from 'node:path';
import * as fs from 'node:fs';
import { isFileExists } from '@sweet-milktea/utils';
import type { SweetOptions } from './types';

export type HttpsCertificate = [boolean, Buffer | undefined, Buffer | undefined];

/* 创建https证书 */
async function createHttpsCertificate(sweetOptions: SweetOptions, httpsKey: string, httpsCert: string): Promise<HttpsCertificate> {
  const [key, cert]: [string, string] = [
    path.isAbsolute(httpsKey) ? httpsKey : path.join(sweetOptions.basicPath, httpsKey),
    path.isAbsolute(httpsCert) ? httpsCert : path.join(sweetOptions.basicPath, httpsCert)
  ];
  const useHttps: boolean = (await isFileExists(key)) && (await isFileExists(cert));
  const [keyFile, certFile]: [Buffer | undefined, Buffer | undefined] = useHttps
    ? await Promise.all([fs.promises.readFile(key), fs.promises.readFile(cert)])
    : [undefined, undefined];

  return [useHttps, keyFile, certFile];
}

export default createHttpsCertificate;