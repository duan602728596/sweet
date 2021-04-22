import type { AST } from 'eslint';
import * as ESTree from 'estree';

export const SYMBOLS: { [key: string]: string } = {
  OR: '|',
  AND: '&',
  LEFT_CURLY_BRACKET: '{',
  EQUAL: '='
};

/* 判断是否为AST.Token */
export function isASTToken(token: AST.Token | ESTree.Comment | null): token is AST.Token {
  return !token;
}