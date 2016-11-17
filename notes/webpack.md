# WebPack Notes
**最近有个项目需要用到webpack，所以决定对webpack进行学习，并在这里记录一些难点与一些概念性的知识。**
>  webpack其实和grunt/gulp根本不是一种东西，
它不是一个构建工具，而是module bundler，webpack就是根据module文件间的依赖将所有module打包（bundle）起来。
其有点是使用loader的概念让配置更加容易，再也不用和一堆文件路径打交道了。

### 注意事项
* __dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
* package.json中的脚本部分已经默认在命令前添加了node_modules/.bin路径。
  所以无论是全局还是局部安装的Webpack，你都不需要写前面那指明详细的路径了。
* loader中的感叹号的作用在于使同一文件能够使用不同类型的loader。

### webpack 强大功能
1. 生成Source Maps 使调试更容易
   > devtool: 'eval-source-map',

2. 使用webpack构建本地服务器
    ```bash
        # 安装
        npm install --save-dev webpack-dev-server
        # 配置
        devServer: {
            contentBase: "./public",    //本地服务器所加载的页面所在的目录
            colors: true,               //终端中输出结果为彩色
            historyApiFallback: true,   //不跳转
            inline: true                //实时刷新
        } 
    ```
3. Loaders(最让人激动人心的功能之一)  
    ```bash
        # 在配置文件里添加JSON loader
        module: {
            loaders: [
            {
                test: /\.json$/,
                loader: "json"
            }
            ]
        }
    ```

4. 整合Babel
  ```bash
  {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
          presets: ['es2015','react']
      }
   }
  ```

5. 一切皆模块
   + css
     - css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能
     - style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。
        ```bash
        # 导入
        import './main.css';
        # 配置
            {
                test: /\.css$/,
                loader: 'style!css' //添加对样式表的处理
            }
        ```
      - css module(使得相同的类名也不会出现污染), loader: 
        ```bash
            # 导入
            import './main.css';
            # 配置
                {
                    test: /\.css$/,
                    'style!css?modules' //跟前面相比就在后面加上了?modules
                }
        ```
      - css预处理器,可以自动根据*can i use*加前缀  
        ```bash
            # 安装
            npm install --save-dev postcss-loader autoprefixer
            # 配置
                {
                    test: /\.css$/,
                    loader: 'style!css?modules!postcss'
                }
        ```


### 插件概述
```javascript
plugins: [
    // 举例:在这个数组中new一个就可以了
    new webpack.BannerPlugin("Copyright xx inc.")
  ],
```

### devDependencies & dependencies
前者用来声明一些build过程中需要用的到一些构建工具，而后者用来声明开发使用到的前端库。

### 配置
webpack的配置可以说就是module和plugins的配置，module里主要就是配置各种loaders，
没啥可说的，你要require什么类型的文件就去搜相应的loader就好，
这一节主要说后面的这个：plugins的配置。webpack支持非常多的插件，详见官方插件列表。

### 暴露jQuery
样，当webpack碰到require的第三方库中出现全局的$、jQeury和window.jQuery时，就会使用node_module下jquery包export出来的东西了。

```javascript
new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
})
```

### 定义全局标识
在命令行传参可以指定是时开发还是发布，

```javascript
// 依赖yargs
args = require('yargs').argv;
new webpack.DefinePlugin({
    __PROD__: args.prod，
    __MOCK__: args.mock
}),
```  
这样在build时传入--prod，则变量__PROD__即为true，传入--mock则__MOCK__为true。
在JS代码中就可以使用类似的判断if (__PROD__) {...}了。


### 输出单独的JS
可以使用webpack内置的*CommonsChunkPlugin*,

1. 在entry中定义app和vendor这两个模块

```javascript
entry: {
    app: [
        'source/app/index.js'
    ],
    vendor: [
        'angular',
        'angular-ui-router',
        'angular-animate'
        // ...
    ]
}
```
2. 在plugins里使用该插件

```javascript
new webpack.optimize.CommonsChunkPlugin('vendor', isProd ? 'vendor.[hash].js' : 'vendor.js')
```  
这样，所有模块中只要有require到vendor数组中定义的这些第三方模块，
那么这些第三方模块都会被统一提取出来，放入vendor.js中去。
在插件的配置中我们还进行了判断，如果是生产环境则给最终生成的文件名加hash。

### 一些有用的工具
* yargs, 便捷的命令行参数处理工具。
* shrinkwrap, 版本号管理工具
* css-loader, 负责将CSS文件变成文本返回，并处理其中的url()和@import()，
* style-loader, 将CSS以style标签的形式插入到页面中去。一般使用的时候这么写：
* copy-webpack-plugin, copy指定文件到指定路径
* html-webpack-plugin, 定义入口HTML文件,这个插件的作用是依据一个简单的模板，
  帮你生成最终的Html5文件，这个文件中自动引用了你打包后的JS文件。每次编译都在文件名中插入一个不同的哈希值。
* Hot Module Replacement 热加载
  - 在 webpack 配置文件中添加HMR插件；
  - 在 Webpack Dev Server 中添加“hot”参数；

### Demo
个人有使用webpack结合vue开发了一个项目:[my-twitter-system](https://github.com/pengkobe/my-twitter-system) ,欢迎start。

###  参考
http://pinkyjie.com/2016/03/05/webpack-tips/   
WebPack入门: https://segmentfault.com/a/1190000006178770  (segmentfault上有29次推荐)  
http://www.pro-react.com/materials/appendixA/  