import ruleTester from '../ruleTester.mjs';
import interfaceSpaceBeforeBlocks from '../../lib/rules/spaceBeforeBlocks.js';

ruleTester.run('space-before-blocks', interfaceSpaceBeforeBlocks.default, {
  valid: [
    `interface Interface {
       name: string;
       age: number;
    }`,
    `export interface People extends Interface {
       name: string;
       address: string;
    }`
  ],
  invalid: [
    {
      code: `interface Interface{
        name: string;
        age: number;
      }`,
      errors: [
        {
          messageId: 'TSInterfaceSpaceBeforeBlocks',
          line: 1,
          column: 20
        }
      ]
    },
    {
      code: `export interface X{
        s: string;
        n: number;
        b: boolean;
      }`,
      errors: [
        {
          messageId: 'TSInterfaceSpaceBeforeBlocks',
          line: 1,
          column: 19
        }
      ]
    },
    {
      code: `export interface People extends Interface{
        s: string;
        n: number;
        b: boolean;
      }`,
      errors: [
        {
          messageId: 'TSInterfaceSpaceBeforeBlocks',
          line: 1,
          column: 42
        }
      ]
    }
  ]
});