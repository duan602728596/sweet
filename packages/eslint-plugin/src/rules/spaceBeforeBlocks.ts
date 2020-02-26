import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import * as util from '@typescript-eslint/eslint-plugin/dist/util';
import { Rule, SourceCode, AST } from 'eslint';
import * as ESTree from 'estree';
import SYMBOLS from '../symbols';

type Options = [];
type MessageIds = 'TSInterfaceSpaceBeforeBlocks';

export default util.createRule<Options, MessageIds>({
  name: 'interface-space-before-blocks',
  meta: {
    docs: {
      description: 'enforce consistent spacing before blocks',
      category: 'Stylistic Issues',
      recommended: 'error'
    },
    fixable: null,
    messages: {
      TSInterfaceSpaceBeforeBlocks: 'Missing space before opening brace.'
    },
    schema: []
  },
  defaultOptions: [],
  create(context: Rule.RuleContext): Rule.RuleListener {
    const sourceCode: SourceCode = context.getSourceCode();

    function checkTSInterfaceSpaceBeforeBlocks(node: ESTree.Node): void {
      const errTokens: Array<AST.Token> = [];
      const token: AST.Token | null = sourceCode.getFirstToken(
        node, (o: AST.Token) => o.value === SYMBOLS.LEFT_CURLY_BRACKET);

      if (token) {
        const beforeToken: AST.Token | null = sourceCode.getTokenBefore(token);

        if (beforeToken) {
          const hasSpace: boolean = sourceCode.isSpaceBetweenTokens(beforeToken, token);

          if (!hasSpace) {
            errTokens.push(token);
          }
        }
      }

      if (errTokens.length > 0) {
        for (const errToken of errTokens) {
          context.report({
            node,
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