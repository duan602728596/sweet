import ruleTester from '../ruleTester.mjs';
import typeSpaceInfixOps from '../../lib/rules/spaceInfixOps.js';

ruleTester.run('space-infix-ops', typeSpaceInfixOps.default, {
  valid: [
    'type Data = number | string;',
    'export type Func = (args: Array<string>) => void;',
    'const len: number | string = 15;',
    'const len: number & string = 15;',
    'let len: number & string | number = 15;',
    `var len: number
           | string = 15;`,
    `function add(a: number | undefined, b: number | undefined): number {
       return a ?? 0 + b ?? 0;
     }`,
    'const a: Array<number> | number = [5];'
  ],
  invalid: [
    {
      code: 'type Data=number | string;',
      errors: [
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '=' },
          line: 1,
          column: 10
        }
      ]
    },
    {
      code: 'type Args=Array<string>|string',
      errors: [
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '=' },
          line: 1,
          column: 10
        },
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '|' },
          line: 1,
          column: 24
        }
      ]
    },
    {
      code: 'export type Func= (args: Array<string>) => void;',
      errors: [
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '=' },
          line: 1,
          column: 17
        }
      ]
    },
    {
      code: 'export type Func =(args: Array<string>) => void;',
      errors: [
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '=' },
          line: 1,
          column: 18
        }
      ]
    },
    {
      code: 'const len: number&string = 15;',
      errors: [
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '&' },
          line: 1,
          column: 18
        }
      ]
    },
    {
      code: 'let len: number|string = 15;',
      errors: [
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '|' },
          line: 1,
          column: 16
        }
      ]
    },
    {
      code: `function isNumber(x: string|number|boolean
       | any|Object): boolean {
        return typeof x === 'number';
      }`,
      errors: [
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '|' },
          line: 1,
          column: 28
        },
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '|' },
          line: 1,
          column: 35
        },
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '|' },
          line: 2,
          column: 13
        }
      ]
    },
    {
      code: `function add(a: number|undefined, b: number|undefined): number {
        return a ?? 0 + b ?? 0;
      }`,
      errors: [
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '|' },
          line: 1,
          column: 23
        },
        {
          messageId: 'TSSpaceInFixOps',
          data: { type: '|' },
          line: 1,
          column: 44
        }
      ]
    }
  ]
});