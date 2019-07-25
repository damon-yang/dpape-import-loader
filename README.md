# dyang-import-loader
组件库按需引入工具支持（TS | JS | JSX | TSX）
## 使用方式 Install
```shell
npm i dyang-import-loader -D
```
### Loader options
```javascript
    ...
    {
        test: /\.(jsx|tsx|js|ts)$/,
        exclude: /node_modules/,
        loader: "dyang-import-loader",
        options:{
            /* 是否全局引入默认为true,需要按需引入设置为false*/
            global:true,
            /** 按需引入目录名称 默认lib*/
            libraryDirectory:'lib',
            /* 组件库名称 默认vue-dyangui*/
            libraryName:'vue-dyangui'
        }
    }
    ...
```

### 组件库目录结构
```
├──lib
│   ├──Example component1       //按需引入组件文件名
│   │   ├──index.js             //组件代码
│   │   ├──style                //组件样式文件夹
│   │   │   |──index.css        //组件样式
│   │   │   |──index.js         //组件样式引入js文件
│   ├──index.js                 //全局引入js文件
│   ├──index.css                 //全局引入css文件
├──package.json
```