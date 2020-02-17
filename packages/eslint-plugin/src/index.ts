import interfaceSpaceBeforeBlocks from './rules/interfaceSpaceBeforeBlocks';
import typeAnnotationSpacing from './rules/typeAnnotationSpacing';
import typeSpaceInfixOps from './rules/typeSpaceInfixOps';

export default {
  rules: {
    'interface-space-before-blocks': interfaceSpaceBeforeBlocks,
    'type-annotation-spacing': typeAnnotationSpacing,
    'type-space-infix-ops': typeSpaceInfixOps
  }
};