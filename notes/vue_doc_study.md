# 学习VUE文档
http://cn.vuejs.org/v2/guide   
http://cn.vuejs.org/v2/api  
 
## start
我们要做的不仅仅是是一个hello world。  

### 几个重点
1. 子元素通过 props 接口实现了与父亲元素很好的解耦
2. 单向数据流，父组件改变会通知子组件，但是子组件改变不会影响父组件
   > 注意在 JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组，在子组件内部改变它会影响父组件的状态。


### 事件
Vue的事件系统分离自浏览器的EventTarget API。尽管它们的运行类似，
但是$on 和 $emit 不是addEventListener 和 dispatchEvent 的别名


### 生命周期
![生命周期](./img/lifecycle.png)  

### 生命周期钩子
![生命周期钩子](./img/life_cycle_hook.png)  

### 重要资料集锦
https://github.com/vuejs/awesome-vue  
https://github.com/Ma63d/kov-blog