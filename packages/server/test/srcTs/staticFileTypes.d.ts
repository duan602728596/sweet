/**
 * typescript类型，用于ts文件中静态文件的引入
 * 包括css、less、sass、scss、styl、stylus、jpg、jpeg、png、gif、webp、svg文件
 */

declare module '*.css' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.less' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.sass' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.scss' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.styl' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.stylus' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.jpe' {
  const url: string;

  export default url;
}

declare module '*.jpeg' {
  const url: string;

  export default url;
}

declare module '*.png' {
  const url: string;

  export default url;
}

declare module '*.gif' {
  const url: string;

  export default url;
}

declare module '*.webp' {
  const url: string;

  export default url;
}

declare module '*.svg' {
  import { FunctionComponent } from 'react';

  const url: string;
  export const ReactComponent: FunctionComponent;

  export default url;
}