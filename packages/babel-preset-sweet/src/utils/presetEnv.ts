interface PresetEnvOptionsArgs {
  ecmascript?: boolean;
  useBuiltIns?: boolean | string;
  customTargets?: object;
  nodeEnv?: boolean;
  debug?: boolean;
  envModules: string | boolean;
  polyfill?: boolean;
}

/* @babel/preset-env */
function presetEnv(options: PresetEnvOptionsArgs): [string, { [key: string]: any }] {
  const { ecmascript, useBuiltIns, customTargets, nodeEnv, debug, envModules, polyfill }: PresetEnvOptionsArgs = options;
  const useBuiltInsValue: string | boolean = useBuiltIns ?? 'usage';

  // 编译目标
  let targets: object;

  if (customTargets) {
    targets = customTargets;
  } else {
    if (ecmascript) {
      targets = {
        browsers: nodeEnv ? ['node 14'] : ['last 3 Chrome versions']
      };
    } else {
      targets = {
        browsers: nodeEnv ? ['node 10'] : [
          'last 10 versions',
          'last 10 Chrome versions',
          'last 1 year',
          'IE 11'
        ]
      };
    }
  }

  const presetEnvOptions: { [key: string]: any } = {
    targets,
    debug,
    modules: envModules,
    useBuiltIns: useBuiltInsValue,
    bugfixes: true
  };

  if (useBuiltInsValue) {
    presetEnvOptions.corejs = 3;
  }

  return ['@babel/preset-env', presetEnvOptions];
}

export default presetEnv;