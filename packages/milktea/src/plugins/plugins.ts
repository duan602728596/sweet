/* 插件配置 */
import * as path from 'path';
import type { ParsedPath } from 'path';
import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import type {
  TypeScriptReporterOptions
} from 'fork-ts-checker-webpack-plugin/lib/typescript-reporter/TypeScriptReporterOptions';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Options as HtmlWebpackPluginOptions } from 'html-webpack-plugin';
import * as FilesMapWebpackPlugin from '@bbkkbkk/files-map-webpack-plugin';
import * as WebpackBar from 'webpackbar';
import * as _ from 'lodash';
import { requireModule, versionReturn, moduleExists, isTsconfigJsonExists } from '../utils/utils';
import type { SweetConfig, SweetOptions } from '../utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const {
    mode,
    html,
    frame,
    serverRender,
    webpackLog = 'progress',
    filesMap,
    ts,
    js
  }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

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
      'process.env.SWEET_SERVER_RENDER': !!serverRender // 判断是否为ssr渲染
    }]);

  // env plugin - 根据模式加载插件
  const envPlugins: Function = isDevelopment
    ? requireModule(path.join(__dirname, 'devPlugins'))
    : requireModule(path.join(__dirname, 'proPlugins'));

  envPlugins(sweetConfig, sweetOptions, config);

  // fork-ts-checker-webpack-plugin
  if (
    moduleExists('typescript')
    && ts?.forkTsCheckerWebpackPlugin !== false
    && isTsconfigJsonExists(sweetOptions, ts)
  ) {
    const typescriptOptions: TypeScriptReporterOptions = {
      mode: js?.typescript ? 'write-references' : 'write-tsbuildinfo',
      extensions: { vue: frame === 'vue' },
      typescriptPath: require.resolve('typescript')
    };

    if (ts?.configFile) {
      typescriptOptions.configFile = ts.configFile;
    }

    config
      .plugin('fork-ts-checker-webpack-plugin')
      .use(requireModule('fork-ts-checker-webpack-plugin'), [{
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
      }

      config
        .plugin(`html-webpack-plugin: ${ index }`)
        .use(HtmlWebpackPlugin, [Object.assign(options, item)]);

      index += 1;
    }
  }

  // vue-loader plugin插件的加载
  config.when(frame === 'vue',
    (config: Config): void => {
      const VueLoaderPlugin: string | undefined = versionReturn<string>(
        'vue-loader',
        (n: number): boolean => n >= 16,
        'vue-loader/dist/plugin',
        'vue-loader/lib/plugin'
      );

      if (VueLoaderPlugin) {
        config
          .plugin('vue-loader-plugin')
          .use(requireModule(VueLoaderPlugin));
      }
    }
  );

  // 当环境为测试时，不使用输出插件
  config
    .when(sweetConfig.frame !== 'test' && (!webpackLog || webpackLog === 'progress'),
      (config: Config): void => {
        config
          .plugin('webpackbar')
          .use(WebpackBar, [{
            name: serverRender ? 'server' : 'client',
            color: serverRender ? 'blue' : 'green'
          }]);
      }
    );

  // files-map-webpack-plugin
  config
    .when(
      _.isPlainObject(filesMap) || (filesMap === true),
      (config: Config): void => {
        config
          .plugin('files-map-webpack-plugin')
          .use(FilesMapWebpackPlugin, _.isPlainObject(filesMap) ? [filesMap] : undefined);
      }
    );
}