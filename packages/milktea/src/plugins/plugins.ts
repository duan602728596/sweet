/* 插件配置 */
import * as path from 'node:path';
import type { ParsedPath } from 'node:path';
import webpack, { type Configuration, type WebpackPluginInstance } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Options as HtmlWebpackPluginOptions } from 'html-webpack-plugin';
import FilesMapWebpackPlugin from '@bbkkbkk/files-map-webpack-plugin';
import WebpackBar from 'webpackbar';
import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { TypeScriptWorkerOptions } from 'fork-ts-checker-webpack-plugin/lib/typescript/type-script-worker-options';
import devPlugins from './devPlugins.js';
import proPlugins from './proPlugins.js';
import { configPluginPush } from '../utils/utils.js';
import type { SweetConfig, SweetOptions } from '../utils/types.js';

/**
 * 添加插件
 * @param { SweetConfig } sweetConfig - 获取到的外部配置
 * @param { SweetOptions } sweetOptions - 内部挂载的一些配置
 * @param { Configuration } config - webpack config
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Configuration): Promise<void> {
  const {
    mode,
    html,
    frame,
    serverRender,
    webpackLog = 'progress',
    filesMap,
    typescript,
    javascript,
    socket
  }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // mini-css-extract-plugin
  if (!serverRender) {
    configPluginPush(config, new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name]_[chunkhash:15].css',
      chunkFilename: isDevelopment ? '[name].css' : '[name]_[chunkhash:15].css',
      ignoreOrder: true
    }));
  }

  // moment
  configPluginPush(config, new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/
  }));

  // 注入环境变量
  configPluginPush(config, new webpack.DefinePlugin({
    'process.env.SWEET_SERVER_RENDER': !!serverRender, // 判断是否为ssr渲染
    'process.env.SWEET_SOCKET': `"${ socket === 'ws' ? 'ws' : 'sockjs' }"` // 连接的socket的类型
  }));

  // env plugin - 根据模式加载插件
  if (isDevelopment) {
    await devPlugins(sweetConfig, sweetOptions, config);
  } else {
    await proPlugins(sweetConfig, sweetOptions, config);
  }

  // fork-ts-checker-webpack-plugin
  if (sweetOptions.forkTsCheckerWebpackPlugin) {
    const typescriptOptions: TypeScriptWorkerOptions = {
      mode: javascript?.typescript ? 'write-references' : 'write-tsbuildinfo'
    };

    if (typescript?.configFile) {
      typescriptOptions.configFile = typescript.configFile;
    }

    configPluginPush(config, new (await requireModule('fork-ts-checker-webpack-plugin'))({
      async: false,
      typescript: typescriptOptions
    }));
  }

  // html模板
  if (html && typeof Array.isArray(html) && !serverRender) {
    for (const item of html) {
      const { template }: HtmlWebpackPluginOptions = item ?? {};
      const options: HtmlWebpackPluginOptions = {
        inject: true,
        scriptLoading: 'blocking',
        hash: !isDevelopment,
        mode
      };

      if (template) {
        const info: ParsedPath = path.parse(template);

        options.filename = `${ info.name }.html`;
        options.chunks = [info.name];
      }

      configPluginPush(config, new HtmlWebpackPlugin(Object.assign(options, item)));
    }
  }

  // vue-loader plugin插件的加载
  if (frame === 'vue') {
    const vueLoaderPlugin: WebpackPluginInstance = await requireModule('vue-loader/dist/plugin.js');

    configPluginPush(config, new (('default' in vueLoaderPlugin) ? vueLoaderPlugin['default'] : vueLoaderPlugin)());
  }

  // 当环境为测试时，不使用输出插件
  if (sweetConfig.frame !== 'test' && (!webpackLog || webpackLog === 'progress')) {
    configPluginPush(config, new WebpackBar({
      name: serverRender ? 'server' : 'client',
      color: serverRender ? 'blue' : 'green'
    }));
  }

  // files-map-webpack-plugin
  if (_.isPlainObject(filesMap) || (filesMap === true)) {
    configPluginPush(config, new FilesMapWebpackPlugin(_.isPlainObject(filesMap) ? [filesMap] : undefined));
  }
}