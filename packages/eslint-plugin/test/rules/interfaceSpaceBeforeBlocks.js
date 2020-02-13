import ruleTester from '../ruleTester';
import interfaceSpaceBeforeBlocks from '../../lib/rules/interfaceSpaceBeforeBlocks';

ruleTester.run('interface-space-before-blocks', interfaceSpaceBeforeBlocks, {
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
      options: ['always'],
      errors: [
        {
          messageId: 'TSInterfaceSpaceBeforeBlocks',
          data: { type: '{' },
          line: 1,
          column: 20
        }
      ]
    },
    {
      code: `export interface X {
        s: string;
        n: number;
        b: boolean;
      }`,
      options: ['never'],
      errors: [
        {
          messageId: 'TSInterfaceSpaceBeforeBlocks',
          data: { type: '{' },
          line: 1,
          column: 20
        }
      ]
    }
  ]
});