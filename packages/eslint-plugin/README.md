# @sweet-milktea/eslint-plugin

## type-annotation-spacing

判断类型之间的分隔符之间的空格。

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