import ruleTester from '../ruleTester';
import typeSpaceInfixOps from '../../lib/rules/typeSpaceInfixOps';

ruleTester.run('type-space-infix-ops', typeSpaceInfixOps, {
  valid: [
    'type Data = number | string;',
    'export type Func = (args: Array<string>) => void;'
  ],
  invalid: [
    {
      code: 'type Data=number | string;',
      options: ['always'],
      errors: [
        {
          messageId: 'TypeSpaceInFixOps',
          data: { type: '=' },
          line: 1,
          column: 10
        }
      ]
    },
    {
      code: 'type Args = Array<string> | string',
      options: ['never'],
      errors: [
        {
          messageId: 'TypeSpaceInFixOps',
          data: { type: '=' },
          line: 1,
          column: 11
        }
      ]
    },
    {
      code: 'export type Func = (args: Array<string>) => void;',
      options: ['never'],
      errors: [
        {
          messageId: 'TypeSpaceInFixOps',
          data: { type: '=' },
          line: 1,
          column: 18
        }
      ]
    },
    {
      code: 'export type Func =(args: Array<string>) => void;',
      options: ['always'],
      errors: [
        {
          messageId: 'TypeSpaceInFixOps',
          data: { type: '=' },
          line: 1,
          column: 18
        }
      ]
    }
  ]
});