interface PresetEnvOptionsArgs {
  babelBuildTargets: object;
  useBuiltIns?: boolean | string;
  debug?: boolean;
  envModules: string | boolean;
  polyfill?: boolean;
}

/* @babel/preset-env */
function presetEnv(options: PresetEnvOptionsArgs): [string, { [key: string]: any }] {
  const { babelBuildTargets, useBuiltIns, debug, envModules, polyfill }: PresetEnvOptionsArgs = options;
  const useBuiltInsValue: string | boolean = useBuiltIns ?? 'usage';

  // @babel/preset-env的配置
  const presetEnvOptions: { [key: string]: any } = {
    targets: babelBuildTargets,
    debug,
    modules: envModules,
    bugfixes: true
  };

  if (!polyfill) {
    Object.assign(presetEnvOptions, {
      useBuiltIns: useBuiltInsValue
    });

    if (useBuiltInsValue) {
      presetEnvOptions.corejs = 3;
    }
  }

  return ['@babel/preset-env', presetEnvOptions];
}

export default presetEnv;