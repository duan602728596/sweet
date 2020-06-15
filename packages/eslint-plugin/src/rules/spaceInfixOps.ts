import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree/dist/ts-estree/ast-node-types';
import { createRule } from '@typescript-eslint/eslint-plugin/dist/util/createRule';
import type { Rule, SourceCode, AST } from 'eslint';
import * as ESTree from 'estree';
import SYMBOLS from '../symbols';

type Options = [string];
type MessageIds = 'TypeSpaceInFixOps';

export default createRule<Options, MessageIds>({
  name: 'type-space-infix-ops',
  meta: {
    docs: {
      description: 'This rule is aimed at ensuring there are spaces around infix operators in typescript.',
      category: 'Stylistic Issues',
      recommended: 'error'
    },
    fixable: null,
    messages: {
      TSSpaceInFixOps: 'Operator \'{{type}}\' must be spaced.'
    },
    schema: []
  },
  defaultOptions: [],
  create(context: Rule.RuleContext, [options]: Options): Rule.RuleListener {
    const sourceCode: SourceCode = context.getSourceCode();

    function report(node: ESTree.Node, errTokens: Array<AST.Token> = []): void {
      if (errTokens.length > 0) {
        for (const errToken of errTokens) {
          context.report({
            messageId: 'TSSpaceInFixOps',
            data: {
              type: errToken.value
            },
            loc: errToken.loc
          });
        }
      }
    }

    function checkTSTypeAliasDeclaration(node: ESTree.Node): void {
      const errTokens: Array<AST.Token> = [];
      const token: AST.Token | null = sourceCode.getFirstToken(
        node, (o: AST.Token) => o.value === SYMBOLS.EQUAL);

      if (token) {
        const beforeToken: AST.Token | null = sourceCode.getTokenBefore(token),
          afterToken: AST.Token | null = sourceCode.getTokenAfter(token);
        let hasBeforeSpace: boolean = true,
          hasAfterSpace: boolean = true;

        if (beforeToken) {
          hasBeforeSpace = sourceCode.isSpaceBetweenTokens(beforeToken, token);
        }

        if (afterToken) {
          hasAfterSpace = sourceCode.isSpaceBetweenTokens(token, afterToken);
        }

        if (!(hasBeforeSpace && hasAfterSpace)) {
          errTokens.push(token);
        }
      }

      report(node, errTokens);
    }

    function checkTSUnionTypeAndTSIntersectionType(node: ESTree.Node): void {
      const errTokens: Array<AST.Token> = [];
      const types: Array<AST.Token> = node['types'];

      if (types && types.length >= 2) {
        for (let i: number = 0; i < types.length - 1; i++) {
          const beforeToken: AST.Token = types[i],
            afterToken: AST.Token = types[i + 1],
            betweenToken: Array<AST.Token> = sourceCode.getTokensBetween(beforeToken, afterToken),
            token: AST.Token = betweenToken[0],
            hasBeforeSpace: boolean = sourceCode.isSpaceBetweenTokens(beforeToken, token),
            hasAfterSpace: boolean = sourceCode.isSpaceBetweenTokens(token, afterToken);

          if (!(hasBeforeSpace && hasAfterSpace)) {
            errTokens.push(token);
          }
        }
      }

      report(node, errTokens);
    }

    return {
      [AST_NODE_TYPES.TSTypeAliasDeclaration](node: ESTree.Node): void {
        checkTSTypeAliasDeclaration(node);
      },

      [AST_NODE_TYPES.TSUnionType](node: ESTree.Node): void {
        checkTSUnionTypeAndTSIntersectionType(node);
      },

      [AST_NODE_TYPES.TSIntersectionType](node: ESTree.Node): void {
        checkTSUnionTypeAndTSIntersectionType(node);
      }
    };
  }
});