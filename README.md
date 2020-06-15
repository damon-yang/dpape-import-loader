# dpape-import-loader
组件库按需引入工具,支持多家UI组件库配置
## 使用方式 Install
```shell
npm i dpape-import-loader -D
```
### Webpack Config
```javascript
    ...
    {
        test: /\.(jsx|tsx|js|ts)$/,
        exclude: /node_modules/,
        loader: "dpape-import-loader",
        options:{
            /** 
             * 组件库 String | Array<String>
            **/
            libraryNames:'vue-dpape',
            /** 
             * 参数配置
            **/
            libraryParams:{
                'vue-dpape':{
                    /**
                     * 组件放置文件夹名称
                     */
                    componentDirectory:"lib",
                    /**
                     * 样式放置文件夹名称
                     */
                    styleDirectory:"lib/theme"
                    /**
                     * 是否使用style.js引入，默认false可以不写
                     */
                    styleJs:false
                }
            }
        }
    }
    ...
    import { Button } from 'vue-dpape';
    /** ===> */
    import Button from 'vue-dpape/lib/button';
    import 'vue-dpape/lib/theme/button.css';
    /** ===> styleJs:true */
    import Button from 'vue-dpape/lib/button';
    import 'vue-dpape/lib/theme/button/style.js';
```