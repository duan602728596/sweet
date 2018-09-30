# @sweet/util-tools

一些通用的工具。

## 查看当前工程下是否有依赖需要升级

使用方法：

```javascript
import update from '@sweet/util-tools/lib/update';

update(
  ['path/to/project'], // 项目工程目录的数组 
  0                    // Npm包信息地址。0：Npm，1：Yarn，2：CNpm。
);
```