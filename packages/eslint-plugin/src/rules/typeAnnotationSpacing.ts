import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import * as util from '@typescript-eslint/eslint-plugin/dist/util';
import { Rule, SourceCode, AST } from 'eslint';
import * as ESTree from 'estree';
import SYMBOLS from '../symbols';

type Options = [string];
type MessageIds = 'TypeAnnotationSpacing';

export default util.createRule<Options, MessageIds>({
  name: 'type-annotation-spacing',
  meta: {
    docs: {
      description: 'Whether there are spaces on both sides of symbols in typescript',
      category: 'Best Practices',
      recommended: 'error'
    },
    fixable: null,
    messages: {
      TypeAnnotationSpacing: 'Expected space between the \'{{type}}\'.'
    },
    schema: [{
      type: 'string',
      enum: ['always', 'never']
    }]
  },
  defaultOptions: ['always'],
  create(context: Rule.RuleContext, [options]: Options): Rule.RuleListener {
    const sourceCode: SourceCode = context.getSourceCode();

    function checkTypeAnnotationSpacing(node: ESTree.Node): void {
      const tokens: Array<AST.Token> = sourceCode.getTokens(node);
      const errTokens: Array<AST.Token> = [];

      for (let i: number = 0, j: number = tokens.length, k: number = j - 1; i < j; i++) {
        const token: AST.Token = tokens[i],
          range: AST.Range = token.range;

        // 判断符号类型，符号可能为"|"、"&"
        if (token.type !== 'Punctuator') continue;

        if (![SYMBOLS.OR, SYMBOLS.AND].includes(token.value)) continue;

        // 检查符号与左侧的间距
        if (i > 0) {
          const beforeToken: AST.Token = tokens[i - 1],
            beforeRange: AST.Range = beforeToken.range;
          const beforeRangeSpace: number = range[0] - beforeRange[1];

          if (
            (options === 'always' && beforeRangeSpace < 1)
            || (options === 'never' && beforeRangeSpace > 0)
          ) {
            errTokens.push(token);
            continue;
          }
        }

        // 检查符号与右侧的间距
        if (i < k) {
          const afterToken: AST.Token = tokens[i + 1],
            afterRange: AST.Range = afterToken.range;
          const afterRangeSpace: number = afterRange[0] - range[1];

          if (
            (options === 'always' && afterRangeSpace < 1)
            || (options === 'never' && afterRangeSpace > 0)
          ) {
            errTokens.push(token);
          }
        }
      }

      if (errTokens.length > 0) {
        for (const errToken of errTokens) {
          context.report({
            node,
            messageId: 'TypeAnnotationSpacing',
            data: {
              type: errToken.value
            },
            loc: errToken.loc
          });
        }
      }
    }

    function checkNode(node: ESTree.Node): void {
      checkTypeAnnotationSpacing(node);
    }

    return {
      [AST_NODE_TYPES.TSUnionType]: checkNode,
      [AST_NODE_TYPES.TSIntersectionType]: checkNode
    };
  }
});