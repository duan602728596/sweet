import type { PluginItem } from '@babel/core';

interface PresetEnvOptionsArgs {
  babelBuildTargets: object;
  debug?: boolean;
  envModules: string | boolean;
}

/* @babel/preset-env */
function presetEnv(options: PresetEnvOptionsArgs): PluginItem {
  const { babelBuildTargets, debug, envModules }: PresetEnvOptionsArgs = options;

  // @babel/preset-env的配置
  const presetEnvOptions: Record<string, any> = {
    targets: babelBuildTargets,
    debug,
    bugfixes: true,
    modules: envModules,
    useBuiltIns: 'usage',
    corejs: 3
  };

  return ['@babel/preset-env', presetEnvOptions];
}

export default presetEnv;