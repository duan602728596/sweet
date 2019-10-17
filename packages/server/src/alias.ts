/* 配置使用模块的别名 */
import * as moduleAlias from 'module-alias';

// http-proxy模块不支持http2
moduleAlias.addAlias('http-proxy', '@bbkkbkk/http-proxy');

// webpack5 && webpack-hot-client/lib/compiler.js
moduleAlias.addAlias('webpack/lib/ParserHelpers', 'webpack/lib/JavascriptParserHelpers');