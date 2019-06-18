# @sweet/util-tools

一些通用的工具。

## 查看当前工程下是否有依赖需要升级

使用方法：

```javascript
import update from '@sweet-milktea/util-tools/update';

update(
  ['path/to/project'], // 项目工程目录的数组
  0                    // Npm包信息地址。0：Npm，1：Yarn，2：CNpm。
);
```

## webp图片批量转换工具

使用方法：

```javascript
import image2webp from '@sweet-milktea/util-tools/image2webp';

image2webp(
  './src',   // 入口文件夹
  './build', // 输出文件夹
  70         // 图片质量
);
```

## 图片压缩工具

使用方法：

```javascript
import imageCompress from '@sweet-milktea/util-tools/imageCompress';

imageCompress(
  './src',   // 入口文件夹
  './build'  // 输出文件夹
);
```