# @sweet-milktea/eslint-plugin

扩展typescript-eslint的规则，
解决的issues参考https://github.com/typescript-eslint/typescript-eslint/issues/1606。

## space-before-blocks

判断interface代码块中"{"之前的空格。

```typescript
// error
interface Interface{
  a: string;
}

// correct
interface Interface {
  a: string;
}
```

## type-annotation-spacing

判断类型"="、分隔符（"|"、"&"）之间的空格。

```typescript
// error
const len: string|number = 15;   
type Data=number|string;

// correct
const len: string | number = 15;
type Data = number | string;
```