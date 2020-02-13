# @sweet-milktea/eslint-plugin

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