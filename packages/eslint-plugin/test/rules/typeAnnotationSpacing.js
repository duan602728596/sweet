import ruleTester from '../ruleTester';
import typeAnnotationSpacing from '../../lib/rules/typeAnnotationSpacing';

ruleTester.run('type-annotation-spacing', typeAnnotationSpacing, {
  valid: [
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
      code: 'const len: number&string = 15;',
      options: ['always'],
      errors: [
        {
          messageId: 'TypeAnnotationSpacing',
          data: { type: '&' },
          line: 1,
          column: 18
        }
      ]
    },
    {
      code: 'let len: number | string = 15;',
      options: ['never'],
      errors: [
        {
          messageId: 'TypeAnnotationSpacing',
          data: { type: '|' },
          line: 1,
          column: 17
        }
      ]
    },
    {
      code: `function isNumber(x: string|number|boolean
       | any|Object): boolean {
        return typeof x === 'number';
      }`,
      options: ['always'],
      errors: [
        {
          messageId: 'TypeAnnotationSpacing',
          data: { type: '|' },
          line: 1,
          column: 28
        },
        {
          messageId: 'TypeAnnotationSpacing',
          data: { type: '|' },
          line: 1,
          column: 35
        },
        {
          messageId: 'TypeAnnotationSpacing',
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
          messageId: 'TypeAnnotationSpacing',
          data: { type: '|' },
          line: 1,
          column: 23
        },
        {
          messageId: 'TypeAnnotationSpacing',
          data: { type: '|' },
          line: 1,
          column: 44
        }
      ]
    }
  ]
});