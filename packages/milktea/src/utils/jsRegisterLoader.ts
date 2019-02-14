import { registerConfig, requireModule } from './utils';

function jsRegisterLoader(filepath: string, content?: string): any{
  const register: Function = requireModule('@babel/register');

  register(registerConfig);

  return requireModule(filepath);
}

export default jsRegisterLoader;