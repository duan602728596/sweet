import type { Configuration, RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createCssOptions, createLessOptions } from '../config/cssConfig.js';
import { configRulePush } from '../utils/utils.js';
import type { SweetConfig, LessOptions } from '../utils/types.js';

/* less & css 配置 */
export default function(sweetConfig: SweetConfig, config: Configuration): void {
  const { mode, less = {}, frame, serverRender }: SweetConfig = sweetConfig;
  const {
    modules = true,
    exclude,
    include,
    modifyVars,
    additionalData
  }: LessOptions = less;
  const isDevelopment: boolean = mode === 'development';
  const ssr: boolean = !!serverRender; // css-loader ssr
  const lessLoaderOptions: Record<string, any> = createLessOptions(modifyVars, additionalData); // less-loader

  // oneOf
  let vueLessRule: RuleSetRule | undefined = undefined;

  if (frame === 'vue') {
    vueLessRule = {
      resourceQuery: /scoped/,
      use: [
        !serverRender ? { loader: MiniCssExtractPlugin.loader } : undefined,
        { loader: 'css-loader', options: createCssOptions(false, isDevelopment, ssr) },
        { loader: 'less-loader', options: lessLoaderOptions }
      ].filter(Boolean)
    };
  }

  configRulePush(config, {
    test: /^.*\.(le|c)ss$/i,
    exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : undefined,
    include: include ? (Array.isArray(include) ? include : [include]) : undefined,
    oneOf: [
      vueLessRule,
      {
        use: [
          !serverRender ? { loader: MiniCssExtractPlugin.loader } : undefined,
          { loader: 'css-loader', options: createCssOptions(modules, isDevelopment, ssr) },
          { loader: 'less-loader', options: lessLoaderOptions }
        ].filter(Boolean)
      }
    ].filter(Boolean)
  });
}