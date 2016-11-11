# WebPack Notes
**最近有个项目需要用到webpack，所以决定对webpack进行学习，并在这里记录一些难点与一些概念性的知识。**
>  webpack其实和grunt/gulp根本不是一种东西，
它不是一个构建工具，而是module bundler，webpack就是根据module文件间的依赖将所有module打包（bundle）起来。
其有点是使用loader的概念让配置更加容易，再也不用和一堆文件路径打交道了。

<!-- more -->

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
* html-webpack-plugin, 定义入口HTML文件

### Demo
个人有使用webpack结合vue开发了一个项目:[my-twitter-system](https://github.com/pengkobe/my-twitter-system) ,欢迎start。

###  参考
http://pinkyjie.com/2016/03/05/webpack-tips/  