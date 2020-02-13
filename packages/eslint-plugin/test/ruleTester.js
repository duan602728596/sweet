import eslint from 'eslint';
import options from './options';

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  env: {
    es6: true,
    es2017: true,
    es2020: true
  },
  parser: options.parser,
  parserOptions: {
    project: options.tsconfig,
    createDefaultProgram: true
  }
});

export default ruleTester;