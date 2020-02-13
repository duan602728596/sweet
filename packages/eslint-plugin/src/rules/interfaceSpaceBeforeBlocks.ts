import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import * as util from '@typescript-eslint/eslint-plugin/dist/util';
import { Rule, SourceCode, AST } from 'eslint';
import * as ESTree from 'estree';
import SYMBOLS from '../symbols';

type Options = [string];
type MessageIds = 'TSInterfaceSpaceBeforeBlocks';

export default util.createRule<Options, MessageIds>({
  name: 'interface-space-before-blocks',
  meta: {
    docs: {
      description: 'Force consistent spaces before interface blocks',
      category: 'Best Practices',
      recommended: 'error'
    },
    fixable: null,
    messages: {
      TSInterfaceSpaceBeforeBlocks: 'Expected space before the \'{{type}}\'.'
    },
    schema: [{
      type: 'string',
      enum: ['always', 'never']
    }]
  },
  defaultOptions: ['always'],
  create(context: Rule.RuleContext, [options]: Options): Rule.RuleListener {
    const sourceCode: SourceCode = context.getSourceCode();

    function checkTSInterfaceSpaceBeforeBlocks(node: ESTree.Node): void {
      const tokens: Array<AST.Token> = sourceCode.getTokens(node);
      const errTokens: Array<AST.Token> = [];

      for (let i: number = 0, j: number = tokens.length, k: number = j - 1; i < j; i++) {
        const token: AST.Token = tokens[i],
          range: AST.Range = token.range;

        // 判断符号类型，符号可能为"{"
        if (token.type === 'Punctuator' && token.value === SYMBOLS.LEFT_CURLY_BRACKET) {
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

          break;
        }
      }

      if (errTokens.length > 0) {
        for (const errToken of errTokens) {
          context.report({
            node,
            messageId: 'TSInterfaceSpaceBeforeBlocks',
            data: {
              type: errToken.value
            },
            loc: errToken.loc
          });
        }
      }
    }

    return {
      [AST_NODE_TYPES.TSInterfaceDeclaration](node: ESTree.Node): void {
        checkTSInterfaceSpaceBeforeBlocks(node);
      }
    };
  }
});