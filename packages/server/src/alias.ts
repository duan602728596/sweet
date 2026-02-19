/* 配置使用模块的别名 */
import moduleAlias from 'module-alias';

// http-proxy模块不支持http2
// @ts-expect-error
moduleAlias.addAlias('http-proxy', '@bbkkbkk/http-proxy');