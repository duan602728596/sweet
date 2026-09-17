import type { Options as BabelPresetEnvOptions } from '@babel/preset-env';

interface IPresetEnvOptionsArgs {
  babelBuildTargets: BabelPresetEnvOptions['targets'];
  debug?: boolean;
  envModules: BabelPresetEnvOptions['modules'];
}

/* @babel/preset-env */
function presetEnv(options: IPresetEnvOptionsArgs): ['@babel/preset-env', BabelPresetEnvOptions] {
  const { babelBuildTargets, debug, envModules }: IPresetEnvOptionsArgs = options;

  // @babel/preset-env的配置
  const babelPresetEnvOptions: BabelPresetEnvOptions = {
    targets: babelBuildTargets,
    debug,
    modules: envModules
  };

  return ['@babel/preset-env', babelPresetEnvOptions];
}

export default presetEnv;