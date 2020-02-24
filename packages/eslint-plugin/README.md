# @sweet-milktea/eslint-plugin

扩展typescript-eslint配置，解决的issues参考[https://github.com/typescript-eslint/typescript-eslint/issues/1606](https://github.com/typescript-eslint/typescript-eslint/issues/1606)。

## interface-space-before-blocks

判断interface代码块中"{"之前的空格。

* always

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

* never

```typescript
// error
interface Interface {
  a: string;
}

// correct
interface Interface{
  a: string;
}
```

## type-annotation-spacing

判断类型的分隔符之间的空格。

* always

```typescript
const len: string|number = 15;   // error
const len: string | number = 15; // correct
```

* never

```typescript
const len: string | number = 15; // error
const len: string|number = 15;   // correct
```

## type-space-infix-ops

判断类型的"="之间的空格。

* always

```typescript
// error
type Data=number | string;
type Args=Array<string> | string;
// correct
type Data = number | string;
type Args = Array<string> | string;
```

* never

```typescript
// error
type Data = number | string;
type Args = Array<string> | string;
// correct
type Data=number | string;
type Args=Array<string> | string;
```