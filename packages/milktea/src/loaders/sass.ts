import type { Configuration, RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createCssOptions, createSassOptions } from '../config/cssConfig.js';
import { configRulePush } from '../utils/utils.js';
import type { SweetConfig, SassOptions } from '../utils/types.js';

/* sass 配置 */
export default function(sweetConfig: SweetConfig, config: Configuration): void {
  const { mode, sass = {}, frame, serverRender }: SweetConfig = sweetConfig;
  const {
    modules = true,
    exclude,
    include,
    additionalData
  }: SassOptions = sass;
  const isDevelopment: boolean = mode === 'development';
  const ssr: boolean = !!serverRender; // css-loader ssr
  const sassLoaderOptions: Record<string, any> = createSassOptions(additionalData); // sass-loader

  // oneOf
  let vueSassRule: RuleSetRule | undefined = undefined;

  if (frame === 'vue') {
    vueSassRule = {
      resourceQuery: /scoped/,
      use: [
        !serverRender ? { loader: MiniCssExtractPlugin.loader } : undefined,
        { loader: 'css-loader', options: createCssOptions(false, isDevelopment, ssr) },
        { loader: 'sass-loader', options: sassLoaderOptions }
      ].filter(Boolean)
    };
  }

  configRulePush(config, {
    test: /^.*\.s(a|c)ss$/i,
    exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [],
    include: include ? (Array.isArray(include) ? include : [include]) : [],
    oneOf: [
      vueSassRule,
      {
        use: [
          !serverRender ? { loader: MiniCssExtractPlugin.loader } : undefined,
          { loader: 'css-loader', options: createCssOptions(modules, isDevelopment, ssr) },
          { loader: 'sass-loader', options: sassLoaderOptions }
        ].filter(Boolean)
      }
    ].filter(Boolean)
  });
}