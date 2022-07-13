/* 插件配置 */
import * as path from 'path';
import type { ParsedPath } from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Options as HtmlWebpackPluginOptions } from 'html-webpack-plugin';
import FilesMapWebpackPlugin from '@bbkkbkk/files-map-webpack-plugin';
import WebpackBar from 'webpackbar';
import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import Config, { type PluginClass } from 'webpack-chain';
import type { TypeScriptWorkerOptions } from 'fork-ts-checker-webpack-plugin/lib/typescript/type-script-worker-options';
import devPlugins from './devPlugins';
import proPlugins from './proPlugins';
import type { SweetConfig, SweetOptions } from '../utils/types';

/**
 * 添加插件
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 * @param { Config } config: webpack-chain config
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): Promise<void> {
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

  config
    // mini-css-extract-plugin
    .plugin('mini-css-extract-plugin')
    .use(MiniCssExtractPlugin, [{
      filename: isDevelopment ? '[name].css' : '[name]_[chunkhash:15].css',
      chunkFilename: isDevelopment ? '[name].css' : '[name]_[chunkhash:15].css',
      ignoreOrder: true
    }]);

  config
    // moment
    .plugin('webpack.IgnorePlugin')
    .use(webpack.IgnorePlugin, [{
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }])
    .end()
    // 注入环境变量
    .plugin('webpack.DefinePlugin-sweet-env')
    .use(webpack.DefinePlugin, [{
      'process.env.SWEET_SERVER_RENDER': !!serverRender, // 判断是否为ssr渲染
      'process.env.SWEET_SOCKET': `"${ socket === 'ws' ? 'ws' : 'sockjs' }"` // 连接的socket的类型
    }]);

  // env plugin - 根据模式加载插件
  if (isDevelopment) {
    await devPlugins(sweetConfig, sweetOptions, config);
  } else {
    await proPlugins(sweetConfig, sweetOptions, config);
  }

  // fork-ts-checker-webpack-plugin
  if (sweetOptions.forkTsCheckerWebpackPlugin) {
    const typescriptOptions: TypeScriptWorkerOptions = {
      mode: javascript?.typescript ? 'write-references' : 'write-tsbuildinfo',
      extensions: {
        vue: {
          enabled: frame === 'vue',
          compiler: '@vue/compiler-sfc'
        }
      }
    };

    if (typescript?.configFile) {
      typescriptOptions.configFile = typescript.configFile;
    }

    config
      .plugin('fork-ts-checker-webpack-plugin')
      .use(await requireModule('fork-ts-checker-webpack-plugin'), [{
        async: false,
        typescript: typescriptOptions
      }]);
  }

  // html模板
  if (html && typeof Array.isArray(html) && !serverRender) {
    let index: number = 0;

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

      config
        .plugin(`html-webpack-plugin: ${ index }`)
        .use(HtmlWebpackPlugin, [Object.assign(options, item)]);

      index += 1;
    }
  }

  // vue-loader plugin插件的加载
  if (frame === 'vue') {
    const vueLoaderPlugin: PluginClass = await requireModule('vue-loader/dist/plugin.js');

    config
      .plugin('vue-loader-plugin')
      .use('default' in vueLoaderPlugin ? vueLoaderPlugin['default'] : vueLoaderPlugin);
  }

  // 当环境为测试时，不使用输出插件
  config.when(
    sweetConfig.frame !== 'test' && (!webpackLog || webpackLog === 'progress'),
    (chainConfig: Config): void => {
      chainConfig
        .plugin('webpackbar')
        .use(WebpackBar, [{
          name: serverRender ? 'server' : 'client',
          color: serverRender ? 'blue' : 'green'
        }]);
    });

  // files-map-webpack-plugin
  config
    .when(
      _.isPlainObject(filesMap) || (filesMap === true),
      (chainConfig: Config): void => {
        chainConfig
          .plugin('files-map-webpack-plugin')
          .use(FilesMapWebpackPlugin, _.isPlainObject(filesMap) ? [filesMap] : undefined);
      }
    );
}