import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { createRule } from '@typescript-eslint/eslint-plugin/dist/util/createRule';
import type { Rule, SourceCode, AST } from 'eslint';
import type ESTree from 'estree';
import { SYMBOLS, isASTToken } from '../utils';

type Options = [];
type MessageIds = 'TSInterfaceSpaceBeforeBlocks';

export default createRule<Options, MessageIds>({
  name: 'interface-space-before-blocks',
  meta: {
    docs: {
      description: 'enforce consistent spacing before blocks',
      category: 'Stylistic Issues', // eslint@<8
      recommended: 'error'
    },
    fixable: null,
    messages: {
      TSInterfaceSpaceBeforeBlocks: 'Missing space before opening brace.'
    },
    schema: [],
    hasSuggestions: true // eslint@8
  },
  defaultOptions: [],
  create(context: Rule.RuleContext): Rule.RuleListener {
    const sourceCode: SourceCode = context.getSourceCode();

    function checkTSInterfaceSpaceBeforeBlocks(node: ESTree.Node): void {
      const errTokens: Array<AST.Token> = [];
      const token: AST.Token | ESTree.Comment | null = sourceCode.getFirstToken(
        node, (o: AST.Token) => o.value === SYMBOLS.LEFT_CURLY_BRACKET);

      if (isASTToken(token)) {
        const beforeToken: AST.Token | ESTree.Comment | null = sourceCode.getTokenBefore(token);

        if (isASTToken(beforeToken)) {
          const hasSpace: boolean = sourceCode.isSpaceBetweenTokens(beforeToken, token);

          if (!hasSpace) {
            errTokens.push(token);
          }
        }
      }

      if (errTokens.length > 0) {
        for (const errToken of errTokens) {
          context.report({
            messageId: 'TSInterfaceSpaceBeforeBlocks',
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