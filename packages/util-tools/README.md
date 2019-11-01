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
  './build', // 输出文件夹
  // 图片压缩选项配置
  {
    png
    jpg,
    gif
  }
);
```

### 压缩选项：

* png：[https://github.com/imagemin/imagemin-pngquant#api](https://github.com/imagemin/imagemin-pngquant#api)
* jpg：[https://github.com/imagemin/imagemin-jpegoptim#api](https://github.com/imagemin/imagemin-jpegoptim#api)
* gif：[https://github.com/imagemin/imagemin-gifsicle#api](https://github.com/imagemin/imagemin-gifsicle#api)

## 生成icns图标

使用方法：

```javascript
import image2icns from '@sweet-milktea/util-tools/image2icns';

image2icns(
  './1024x1024.png',  // 输入图片
  './1024x1024.icns', // 生成图标
  {
    size: 512, // 尺寸
    retina: 2  // 1k屏或2k屏 
  }
);
```

如果retina的值为1：则size的值为16、32、128、256、512、1024。   
如果retina的值为2：则size的值为16、32、128、256、512。