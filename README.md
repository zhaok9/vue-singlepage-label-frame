# vue-singlepage-label-frame

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### 更新

#### 2020-04-29
>
+ 优化导航逻辑, 导航组件开发
+ 增加国际化包 npm i vue-i18n -S
+ 增加国际化功能

#### 2020-04-28
>
+ 解决导航初始选中项BUG
+ 调整主题目录结构
+ 优化导航、标签逻辑、UI

#### 2020-04-27
>
+ 增加导航、标签联动和缓存
+ 增加手动添加新标签
+ 增加已打开标签记录和当前打开标签记录
+ 调整部分UI
+ 导航递归处理

#### 2020-04-25
>
+ 增加 sass、sass-loader、iscroll

#### 2020-04-23
>
+ 配置基础 vue.config.js
+ 配置 proxy 代理解决跨域问题
+ 添加别名 alias
+ 配置 externals 引入 cdn 资源
+ 去掉 console.log 插件 npm i -D terser-webpack-plugin
+ 利用 splitChunks 单独打包第三方模块
+ 开启 Zopfli 压缩 插件 npm i -D @gfx/zopfli brotli-webpack-plugin