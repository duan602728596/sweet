import * as path from 'path';
import * as normalizePath from 'normalize-path';
import * as cssesc from 'cssesc';
import * as loaderUtils from 'loader-utils';
import { loader } from 'webpack';

/* css-loader的getLocalIdent函数 */
function cssLoaderGetLocalIdent(
  loaderContext: loader.LoaderContext,
  localIdentName: string,
  localName: string,
  options: { [key: string]: any }
): string {
  if (!options.context) {
    options.context = loaderContext.rootContext;
  }

  const request: string = normalizePath(
    path.relative(options.context || '', loaderContext.resourcePath)
  );

  options.content = `${ options.hashPrefix }${ request }+${ unescape(localName) }`;

  const name: string = loaderUtils.interpolateName(loaderContext, localIdentName, options)
    .replace(/^((-?[0-9])|--)/, '_$1');

  const className: string = cssesc(name, { isIdentifier: true })
    .replace(/\\\[local\\\]/gi, localName)
    .replace(/\\\//g, '-');

  return className;
}

export default cssLoaderGetLocalIdent;