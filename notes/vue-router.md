# vue-router

### Html模板组成
```Html
<!-- 页面链接 -->
<router-link to="/foo">Go to Foo</router-link>
<!-- 渲染位置 -->
<router-view></router-view>
```

JS中使用:  

```javascript 
const routes = [
  { path: '/url', component: COMP },
]

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

const app = new Vue({
  router
}).$mount('#app')

```

## 参考
中文文档:http://router.vuejs.org/zh-cn/installation.html