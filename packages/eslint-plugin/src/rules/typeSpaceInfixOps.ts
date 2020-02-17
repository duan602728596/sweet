import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import * as util from '@typescript-eslint/eslint-plugin/dist/util';
import { Rule, SourceCode, AST } from 'eslint';
import * as ESTree from 'estree';
import SYMBOLS from '../symbols';

type Options = [string];
type MessageIds = 'TypeSpaceInFixOps';

export default util.createRule<Options, MessageIds>({
  name: 'type-space-infix-ops',
  meta: {
    docs: {
      description: 'This rule is aimed at ensuring there are spaces around infix operators in typescript.',
      category: 'Stylistic Issues',
      recommended: 'error'
    },
    fixable: null,
    messages: {
      TypeSpaceInFixOps: 'Operator \'{{type}}\' must be spaced.'
    },
    schema: [{
      type: 'string',
      enum: ['always', 'never']
    }]
  },
  defaultOptions: ['always'],
  create(context: Rule.RuleContext, [options]: Options): Rule.RuleListener {
    const sourceCode: SourceCode = context.getSourceCode();

    function checkTSTypeAliasDeclaration(node: ESTree.Node): void {
      const tokens: Array<AST.Token> = sourceCode.getTokens(node);
      const errTokens: Array<AST.Token> = [];

      for (let i: number = 0, j: number = tokens.length, k: number = j - 1; i < j; i++) {
        const token: AST.Token = tokens[i],
          range: AST.Range = token.range;

        // 判断符号类型，符号为"="
        if (token.type === 'Punctuator' && token.value === SYMBOLS.EQUAL) {
          // 检查符号与左侧的间距
          if (i > 0) {
            const beforeToken: AST.Token = tokens[i - 1],
              beforeRange: AST.Range = beforeToken.range,
              beforeRangeSpace: number = range[0] - beforeRange[1];

            if (
              (options === 'always' && beforeRangeSpace < 1)
              || (options === 'never' && beforeRangeSpace > 0)
            ) {
              errTokens.push(token);
            }
          }

          // 检查符号与右侧的间距
          if (i < k && errTokens.length === 0) {
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

          break;
        }
      }

      if (errTokens.length > 0) {
        for (const errToken of errTokens) {
          context.report({
            node,
            messageId: 'TypeSpaceInFixOps',
            data: {
              type: errToken.value
            },
            loc: errToken.loc
          });
        }
      }
    }

    return {
      [AST_NODE_TYPES.TSTypeAliasDeclaration](node: ESTree.Node): void {
        checkTSTypeAliasDeclaration(node);
      }
    };
  }
});