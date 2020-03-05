import * as path from 'path';
import * as fs from 'fs';
import { isExists } from './utils';
import { SweetOptions } from './types';

export type HttpsCertificate = [boolean, Buffer | undefined, Buffer | undefined];

/* 创建https证书 */
async function createHttpsCertificate(sweetOptions: SweetOptions, httpsKey: string, httpsCert: string): Promise<HttpsCertificate> {
  const key: string = path.isAbsolute(httpsKey)
    ? httpsKey
    : path.join(sweetOptions.basicPath, httpsKey);
  const cert: string = path.isAbsolute(httpsCert)
    ? httpsCert
    : path.join(sweetOptions.basicPath, httpsCert);

  const useHttps: boolean = (await isExists(key)) && (await isExists(cert));
  const keyFile: Buffer | undefined = useHttps ? await fs.promises.readFile(key) : undefined;
  const certFile: Buffer | undefined = useHttps ? await fs.promises.readFile(cert) : undefined;

  return [useHttps, keyFile, certFile];
}

export default createHttpsCertificate;