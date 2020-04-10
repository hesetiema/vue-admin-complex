# 学习 Vue

**Vue** 是一套用于构建用户界面的，基于数据驱动、组件化思想的 **`渐进式框架`**，基于 **`MVVM`** 架构模式。**Vue**最独特的特性之一，是其非侵入性的 **`响应式系统`**。

_**Vue.js** 使用了基于 `HTML`的模板语法，允许开发者声明式地将底层 `Vue`实例的数据渲染进 `DOM`的系统。也可以不用模板，直接写渲染 `(render)` 函数，使用可选的 `JSX` 语法。_

---

## 🐌 安装

### 1.CDN

CDN 全称：Content Delivery Network，即内容分发网络。通过在网络各处的智能虚拟网络，实时地根据网络流量等综合信息，将用户的请求重新导向离用户最近的服务节点上。

```javascript
//通过CDN，引入外部资源vue.js
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

### 2.NPM

安装最新稳定版：`$ npm install vue`

```javascript
//引包:
<script type="text/javascript" src="./node_modules/vue/dist/vue.js"></script>
```

### 3.命令行工具 (CLI)

安装 Vue CLI 包：`$ npm install -g @vue/cli`

以图形化界面创建和管理项目：`$ vue ui`

---

## 🔚 Vue 实例

### 1.实例创建

Vue 是一个构造函数，通过 new Vue 创建的根 Vue 实例和可选的嵌套的可复用的组件树可组成  Vue 应用。

```javascript
//创建实例时，传入一个选项对象
<script>
new Vue({
  router,
  store,
  //渲染函数接收一个 createElement 方法作为第一个参数用来创建 VNode
  //h 作为 createElement 的别名：const h = this.$createElement
  render: h => h(App)
}).$mount('#app')
</script>
```

### 2.实例选项(常用)

|  属性方法  | 含义                                                                               | 说明                                                               |
| :--------: | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
|     el     | **挂载：**`提供已存在的 DOM 元素作为 Vue 实例的挂载目标`                           | `存在则立即编译，否则 vm.$mount() 手动开启编译`                    |
|    data    | **数据:**`实例的数据对象或组件的函数（返回一个初始数据对象）`                      | `vm.a 等价于访问 vm.$data.a`                                       |
|   props    | **自定义属性:** `数组语法用于接收来自父组件的数据；对象语法提供类型验证`           | `单向下行绑定：父级 prop 的更新会向下流动到子组件中`               |
|  computed  | **计算属性:**`一些数据需随其它数据变动而变动时使用`                                | `缓存结果,依赖响应式属性变化时再计算`                              |
|  methods   | **方法：** `方法中的 this 自动绑定为 Vue 实例`                                     | `不使用箭头函数来定义,其绑定了父级作用域的上下文`                  |
|   watch    | **侦听属性：** `键是需要观察的表达式，值是对应回调函数/方法名/含选项的对象`        | `不应该使用箭头函数来定义 watcher 函数`                            |
|  filters   | **过滤器：** `文本格式化：如{{ a | capitalize }}、<div :id="Id | formatId"></div>` | `接收表达式的值：之前操作链结果作为第一个参数`                     |
| directives | **自定义指令：** `对普通 DOM 元素进行底层操作`                                     | `钩子函数：bind首次绑定；inserted插入父节点；update VNode更新`     |
| components | **组件：** `组件是可复用的 Vue 实例且带有一个名字,根实例中组件作为自定义元素`      | `单个根元素、通过 Prop 向子组件传递数据、监听子组件事件、动态组件` |
|    ...     |                                                                                    |                                                                    |

### 3.添加实例属性

当组件里需求使用数据/工具且不污染全局作用域时，可根据约定的“ `$`  是在 Vue 所有实例中都可用的属性（全局作用域）”在  Vue 的原型上添加相应属性。如引入 axios 实例以便全局调用：

```javascript
import http from "./http.js";
//在构造函数 Vue 的原型上赋值 axios 实例给 $http 属性，以便全局使用实例属性(约定 $ 开头)
Vue.prototype.$http = http;
```

### 4.**生命周期**

> Vue 实例有一个完整的生命周期，即从开始创建、初始化数据、编译模版、挂载 Dom ->渲染、更新-> 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。

- 各个生命周期作用
  | 生命周期 | 描述 |
  | :--- | --- |
  | beforeCreate | 组件实例被创建之初，组件的属性生效之前 |
  | created | 组件实例已创建，属性也绑定，真实`DOM`未生成，`$el`不可用 |
  | beforeMount | 在挂载开始之前被调用：相关的`render`函数首次被调用 |
  | mounted | el 被新创建的`vm.$el`替换，并挂载到实例上去后调用该钩子 |
  | beforeUpdate | 组件数据更新之前调用，发生在虚拟`DOM`打补丁之前 |
  | update | 组件数据更新之后 |
  | activited | `keep-alive`专属，组件被激活时调用 |
  | deadctivated | `keep-alive`专属，组件被移除时调用 |
  | beforeDestory | 组件销毁前调用，可以访问 this |
  | destoryed | 组件销毁后调用 |

- 父组件和子组件生命周期钩子函数执行顺序
  - 加载渲染过程：**父 beforeCreate ->created ->beforeMount ->子 beforeCreate ->created ->beforeMount ->mounted ->父 mounted**
  - 更新过程：**父 beforeUpdate->子 beforeUpdate->updated->父 updated**
  - 销毁过程：**父 beforeDestroy->子 beforeDestroy->destroyed->父 destroyed**
- 调用异步请求：在`created`钩子函数中调用异步请求
  - 能更快获取到服务端数据，减少页面 loading 时间
  - ssr 不支持 beforeMount 、mounted 钩子函数
- 访问操作 DOM：`mounted`阶段，Vue 已经将编译好的模板挂载到页面上
- 父组件监听子组件的生命周期：引用子组件时通过 `[@hook ]()` 来监听

```javascript
//  Parent.vue
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},
//  Child.vue
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},
// 以上输出顺序为：
// 子组件触发 mounted 钩子函数 ...
// 父组件监听到 mounted 钩子函数 ...
```

- 生命周期示意图

![life](https://cn.vuejs.org/images/lifecycle.png#align=left&display=inline&height=3039&originHeight=3039&originWidth=1200&status=done&style=none&width=1200)

---

## 📝 模板语法

### 1.插值

- {{msg}}语法：
  - `{{a}}`：文本
  - `{{ok?'YES':'NO'}}`：表达式
- Mustache 标签将会被替代为对应数据对象 data 上相应属性的值

### 2.指令

指令 (Directives) 是带有 v- 前缀的特殊特性。指令特性的值预期是单个 JavaScript 表达式 (v-for 是例外)

- v-bind
  - `<a v-bind:href="url">...</a>`：绑定参数
  - `<a v-bind:[attributeName]="url"> ... </a>`：绑定动态参数
  - `<a :href="url">...</a>`：缩写
  - **对象语法**
    - 绑定 Class
      - HTML：`<div :class="classObject"></div>`
      - JS：`data: {classObject: { active: true,'text-danger': false}}`
    - 绑定内联样式
      - HTML：`<div :style="styleObject"></div>`
      - JS：`data: {styleObject: {color: 'red',fontSize: '13px'}}`
    - 对象语法常常结合返回对象的计算属性使用
  - **数组语法**
    - 绑定 Class
      - HTML：`<div :class='[classA, { classB: isB, classC: isC }]'></div>`
      - JS：`data: {classA: 'isclassA',isB: true,isC: false}`
    - 绑定内联样式
      - HTML：`<div :style="[baseStyles, overridingStyles]"></div>`
      - JS：`data: {baseStyles: {color: 'red'},overridingStyles:{fontSize: '13px'}}`
- v-on
  - `<a v-on:click="doSomething">...</a>`：监听事件，调用表达式/methods
  - `<a @click="doSomething">...</a>`：缩写
  - **事件修饰符**
    - `<a @click.stop="doThis"></a>`：阻止冒泡
    - `<form @submit.prevent="onSubmit">...</form>`：阻止默认行为
    - `<div @click.capture="doThis">...</div>`：事件捕获
    - `<div @click.self="doThat">...</div>`：仅当 event.target 是当前元素自身时触发处理函数
  - **按键修饰符**
    - `<input v-on:keyup.enter="submit">`：处理函数只会在`$event.key`等于 enter 时被调用
    - 常用按键码别名：.enter、.tab、.delete (捕获“删除”和“退格”键)、.esc、.space、.up、.down、.left、.right
  - **系统修饰键**
    - `<input @keyup.alt.67="clear"><!-- Alt + C -->`：实现仅按下相应按键才触发鼠标或键盘事件监听器：.ctrl、.alt、.shift、.meta（windos 键）
    - .exact 修饰符：`<button @click.ctrl.exact="onCtrlClick">A</button>`控制精确输入
    - 鼠标按钮修饰符：.left、.right、.middle 这些修饰符会限制处理函数仅响应特定的鼠标按钮
- v-if
  - `<template v-if="ok"> <h1>Title</h1> <p>Paragraph</p></template>`：条件渲染分组切换多个元素，此外可用 key 管理可复用的元素
  - `<div v-if="Math.random() > 0.5">Now you see me</div><div v-else>Now you don't</div>`：v-else/v-else-if 须紧跟在带 v-if 或 v-else-if 的元素之后
- v-show
  - `<h1 v-show="ok">Hello!</h1>`：条件展示元素的选项
  - **与 v-if 区别**：带有 v-show 的元素始终会被渲染并保留在 DOM 中，v-show 只是简单地切换元素的 CSS 属性 display，一般用于非常频繁地切换
- v-for
  - `<li v-for="(item, i) in items">{{ i }} - {{ item.msg }}</li>`：渲染一数组元素
  - `<div v-for="(val, name, i) in obj">{{ i }}. {{ name }}: {{ val }}</div>`：遍历一个对象的属性，可把属性值、属性名、索引依次作为参数
  - `<div v-for="item in items" :key="item.id"><!-- 内容 --></div>`：尽量在使用 v-for 时提供 key attribute
  - `<my-component v-for="(item, index) in items" :item="item" :index="index" :key="item.id"></my-component>`：把迭代数据传递到组件里，使用 prop
- v-model
  - 基础用法
    - 文本：`<input v-model="msg" placeholder="e"><p>M is: {{ msg }}</p>`
    - 多行文本：`<p style="white-space: pre-line;">{{ msg }}</p><br><textarea v-model="msg" placeholder="add"></textarea>`
    - 复选框：
      - HTML：`<div id='e1'><input type="checkbox" id="jack" value="Jack" v-model="checkedNames"><label for="jack">Jack</label><input type="checkbox" id="john" value="John" v-model="checkedNames"><label for="john">John</label><span>Checked names: {{ checkedNames }}</span></div>`
      - JS：`new Vue({el: '#e1',data: {checkedNames: []}})`
    - 单选按钮：
      - HTML：`<div id="e2"><input type="radio" id="one" value="One" v-model="picked"><label for="one">One</label><br><input type="radio" id="two" value="Two" v-model="picked"><label for="two">Two</label><br><span>Picked: {{ picked }}</span></div>`
      - JS：`new Vue({el: '#e2',data: {picked: ''}})`
    - 选择框：
      - HTML：`<select v-model="selected"><option v-for="option in options" v-bind:value="option.value">{{ option.text }}</option></select><span>Selected: {{ selected }}</span>`
      - JS：`new Vue({el: '.',data: {selected: 'A',options: [{ text: 'One',value: 'A' },{ text: 'Two', value: 'B' },{ text: 'Three', value: 'C' }]}})`
  - 值绑定：v-bind 实现值绑定到 Vue 实例的一个动态属性上，值可不是字符串
  - 修饰符
    - .lazy—`<input v-model.lazy="msg" >`转变为使用 change 事件进行同步
    - .number—`<input v-model.number="age" type="number">`输入值转为数值类型
    - .trim—`<input v-model.trim="msg">`过滤用户输入的首尾空白字符
  - 输入组件：一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件

---

## 💻 组件基础

### 1.基本概念

组件是可复用的 Vue 实例，其与 new Vue 接收相同的选项，如 data、computed、watch、methods 以及生命周期钩子等。例外：el 根实例特有的选项

定义组件名的方式：更推荐使用 kebab-case

### 2.组件的复用

组件的 data 选项必须是一个函数，每个实例可以维护一份被返回对象的独立的拷贝。

组件是用来复用的，若组件中`data`是一个对象，作用域没有隔离，子组件中的`data`属性值会相互影响。

### 3.组件的组织

全局注册组件在各自内部都可相互使用，局部注册组件在其子组件中不可用。

- 全局注册：

`Vue.component('my-component-name', {//..});new Vue({ el: '#app'})`

- 局部注册：

`var ComponentA = {/* template:..*/};new Vue({ el: '#app',components: {'component-a': ComponentA, 'component-b': ComponentB}})`

- 模块系统注册：
  - 在 ComponentB.vue 文件中局部注册：`import ComponentA from './ComponentA'; import ComponentC from './ComponentC';export default {components:{ComponentA,ComponentC},// ...}`
  - 基础组件的自动化全局注册：在应用入口文件 (比如 src/main.js) 中使用 require.context 全局导入基础组件

```javascript
import Vue from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  ".",
  // Do not look in subdirectories
  false,
  // Only include "_base-" prefixed .vue files
  /_base-[\w-]+\.vue$/
);
// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  // Get the PascalCase version of the component name
  const componentName = upperFirst(
    camelCase(
      fileName
        // Remove the "./_" from the beginning
        .replace(/^\.\/_/, "")
        // Remove the file extension from the end
        .replace(/\.\w+$/, "")
    )
  );
  // Globally register the component
  Vue.component(componentName, componentConfig.default || componentConfig);
});
```

### 4.通过 Prop 向子组件传递数据

> Prop 是你可以在组件上注册的一些自定义特性

- **父组件向子组件传 data 值**：子组件通过 props 中自定义属性，获取其绑定的值

- 传递静态：`<blog-post title="My journey with Vue"></blog-post>`

- 传递动态：`<blog-post v-bind:title="post.title"></blog-post>`

- 单向数据流：父级 prop 的更新会向下流动到子组件中，反过来则不行。防止从子组件意外改变父级组件的状态。

### 5.单个根元素——每个组件必须只有一个根元素

### 6.监听子组件事件

- 父组件通过 v-on 监听子组件实例的任意事件：
  `<blog-post v-on:enlarge-text="postFontSize += $event"></blog-post>`

- **父组件向子组件传方法**：子组件通过调用内建的 \$emit 方法，触发自定义事件，获取其绑定的方法（传参时可向父组件传递 data 值）
  `<button @click="$emit('enlarge-text', 0.1)">Enlarge text</button>`

- 组件上使用 v-model：`<custom-input v-model="searchText"></custom-input>`

```javascript
// 将其 value 特性绑定到一个名叫 value 的 prop 上
// 在其 input 事件被触发时，将新的值通过自定义的 input 事件抛出
Vue.component("custom-input", {
  props: ["value"],
  template: `<input :value="value" @input="$emit('input', $event.target.value)">`,
});
```

### 7.通过插槽分发内容

> 父级组件提供内容时将会被渲染，从而取代在`<slot>`标签内的后备内容

- 具名插槽：`<slot name="header"></slot>`；`<template v-slot="header">`  元素中的内容会被传入相应的插槽，**v-slot 可替换为字符 #**

```html
<!-- 模板 -->
<div class="container">
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>
  <!--不带 name 的 <slot> 带有隐含名“default”-->
  <footer><slot name="footer"></slot></footer>
</div>
<!-- 向具名插槽提供内容（缩写） -->
<base-layout>
  <template #header><h1>Here might be a page title</h1></template>
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>
  <template #footer><p>Here's some contact info</p></template>
</base-layout>
```

- 作用域插槽：绑定在`<slot>`元素上的特性被称为插槽 prop。父级作用域中，可给 v-slot 带一个值来定义我们提供的插槽 prop 的名字

```html
<!-- 模板 -->
<span><slot v-bind:user="user"> {{ user.lastName }}</slot></span>
<!-- 包含所有插槽 prop 的对象slotProps来定义我们提供的插槽 prop 的名字 -->
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
<!-- 独占默认插槽的缩写 -->
<current-user v-slot="slotProps">{{ slotProps.user.firstName }}</current-user>
<!-- 解构传入具体的插槽 prop -->
<current-user v-slot="{ user }">{{ user.firstName }}</current-user>
```

### 8.动态组件&异步组件

- keep-alive：
  - 一般结合路由和动态组件一起使用，用于缓存组件
  - 提供 include、exclude 属性，支持字符串或正则表达式，exclude 优先级更高
  - 对应两个钩子函数 activated (被激活时触发)、deactivated (被移除时触发)

```html
<keep-alive>
  <component v-bind:is="flag"></component>
</keep-alive>
<!-- keep-alive包裹时会缓存不活动的组件实例，来保留组件状态或避免重新渲染 -->
<!-- flag 可以包括已注册组件的名字，或一个组件的选项对象 -->
```

- 异步组件：Vue 允许以一个工厂函数的方式异步解析组件定义。只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染

```javascript
Vue.component(
  "async-webpack-example",
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import("./my-async-component")
);
// 局部注册
new Vue({
  // ...
  components: {
    "my-component": () => import("./my-async-component"),
  },
});
//处理加载状态：异步组件工厂函数也可以返回一个如下格式的对象
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import("./MyComponent.vue"),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000,
});
```

### 9.**Vue 组件间通信**

Vue 组件间通信主要指以下 3 类通信：父子组件通信、隔代组件通信、兄弟组件通信

- **props / \$emit** 适用 父子组件通信
- **ref、$parent / $children、.sync** 适用 父子组件通信
  - ref：用于`DOM`元素时引用指向`DOM`元素；用于子组件时引用指向组件实例
  - $parent / $children：访问父 / 子实例，适用父子、兄弟组件通信
  - .sync：语法糖，会扩展成一个更新父组件绑定值的 v-on 侦听器
- **$attrs / $listeners** 适用于 隔代组件通信
  - \$attrs：包含父作用域中不被`prop`所识别获取的特性绑定 (`class`和`style`除外)。可由`v-bind="$attrs"`传入内部组件。常配合`inheritAttrs:false`使用
  - \$listeners：包含父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可通过`v-on="$listeners"`传入内部组件
- **provide / inject** 适用于 隔代组件通信：祖先组件中通过 provide 来提供变量，子孙组件通过 inject 注入。主要用于子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系
- **EventBus （$emit / $on）** 适用于 父子、隔代、兄弟组件通信：通过一个空的 Vue 实例作为中央事件总线（事件中心）来触发事件和监听事件
- **Vuex** 适用于 父子、隔代、兄弟组件通信：每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )

### 10. 函数式组件

```javascript
Vue.component("my-component", {
  functional: true,
  // Props 是可选的
  props: {
    // ...
  },
  // h 即 createElement 函数
  // 为了弥补缺少的实例，提供第二个参数作为上下文
  render: function (h, context) {
    // return vnode
  },
});
```

组件需要的一切都是通过 `context` 参数传递，它是一个包括如下字段的对象：

- `props`：提供所有 prop 的对象
- `children`: VNode 子节点的数组
- `slots`: 一个函数，返回了包含所有插槽的对象
- `scopedSlots`: (2.6.0+) 一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽。
- `data`：传递给组件的整个数据对象，作为 `createElement` 的第二个参数传入组件
- `parent`：对父组件的引用
- `listeners`: (2.3.0+) 一个包含所有父组件为当前组件注册的事件监听器的对象。 `data.on` 的一个别名。
- `injections`: (2.3.0+) 如果使用了 [`inject`](https://cn.vuejs.org/v2/api/#provide-inject) 选项，则该对象包含了应当被注入的属性。

在添加 `functional: true` 之后，需要更新我们的锚点标题组件的渲染函数，为其增加 `context` 参数，并将 `this.$slots.default` 更新为 `context.children`，然后将 `this.level` 更新为 `context.props.level`。

---

## 🍂 过渡动画

### 1.单元素/组件的过渡

Vue 提供了 transition 的封装组件，下列情形可以给任何元素和组件添加进入/离开过渡：

条件渲染 (使用 v-if)、条件展示 (使用 v-show)、动态组件、组件根节点

```html
<!-- html -->
<div id="demo">
  <button @click="show = !show">Toggle</button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

```css
/* css */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
```

```javascript
// javascript
new Vue({ el: "#demo", data: { show: true } });
```

- 过渡的类名
  - v-enter：进入过渡的开始状态。元素被插入前生效，被插入后下一帧移除
  - v-enter-active：进入过渡生效时的状态。在整个进入过渡的阶段中应用
  - v-enter-to：进入过渡的结束状态。元素被插入之后下一帧生效
  - v-leave: 离开过渡的开始状态。离开过渡被触发时生效，下一帧被移除
  - v-leave-active：离开过渡生效时的状态。在整个离开过渡的阶段中应用
  - v-leave-to: 离开过渡的结束状态。离开过渡被触发之后下一帧生效
- CSS 动画
  - 可以设置不同的进入和离开动画
  - 设置持续时间和动画函数

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

- 自定义过渡类名：优先级高于普通类名，可与其他第三方 CSS 动画库结合使用

```html
<link
  href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1"
  rel="stylesheet"
  type="text/css"
/>

<div id="example-3">
  <button @click="show = !show">Toggle render</button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

- 显性的过渡持续时间：

`<transition :duration="{ enter: 500, leave: 800 }">...</transition>`

- javascript 钩子

```html
<!-- 钩子函数可以结合 CSS transitions/animations 使用，也可以单独使用。
当只用 JavaScript 过渡的时候，在 enter 和 leave 中必须使用 done 进行回调，同时
推荐元素添加 v-bind:css="false"，可以避免过渡过程中 CSS 的影响。 -->
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  v-bind:css="false"
>
</transition>
```

```javascript
// ...
methods: {
    beforeEnter(el) {
        el.style.transform = 'translate(0,0)'
    },
    enter(el, done) {
        el.offsetWidth;
        el.style.transform = 'translate(300px,450px)';
        el.style.transition = 'all .5s ease';
        done();
    },
    afterEnter(el) {
        this.flag = false;
    }
}
```

### 2.初始渲染的过渡：`<transition appear><!-- .. --></transition>`

### 3.多个元素的过渡（过渡模式）

- in-out：新元素先进行过渡，完成之后当前元素过渡离开
- **out-in：当前元素先进行过渡，完成之后新元素过渡进入**

```html
<transition name="fade" mode="out-in">
  <button v-bind:key="docState">{{ buttonMessage }}</button>
</transition>
```

```javascript
// ...
computed: {
  buttonMessage: function () {
    switch (this.docState) {
      case 'saved': return 'Edit'
      case 'edited': return 'Save'
      case 'editing': return 'Cancel'
    }
  }
}
```

### 4.多个组件的过渡

> 使用动态组件：

`<transition name="component-fade" mode="out-in"><keep-alive><component :is='flag'></component></keep-alive></transition>`

### 5.列表过渡

- 使用`<transition-group>`组件特点
  - 以一个真实元素呈现：默认为一个`<span>`。可通过`tag`特性更换
  - 过渡模式不可用，因为我们不再相互切换特有的元素
  - 内部元素总是需要提供唯一的 key 属性值
  - CSS 过渡的类将会应用在内部的元素中，而不是这个组/容器本身
- 列表的进入/离开过渡

```html
<transition-group appear tag="ul">
  <li v-for="(item,i) in dataList" :key="item.id" @click="del(i)">
    {{item.id}}---{{item.task}}
  </li>
</transition-group>
<!-- 但当添加和移除元素的时候，周围的元素会瞬间移动到他们的新布局的位置，
而不是平滑过渡。使用v-move与v-leave-active可以解决：
.v-move{transition:all .7s ease;},.v-leave-active{position:absolute;} -->
```

- 列表的排序过渡
  - v-move 特性，在元素改变定位时应用，设置过渡的切换时机和过渡曲线
    - 结合 FLIP 简单的动画队列，将元素从之前的位置平滑过渡新的位置

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<style>
  .flip-list-move {
    transition: transform 1s;
  }
</style>

<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </transition-group>
</div>
```

```javascript
new Vue({
  el: "#flip-list-demo",
  data: { items: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items);
    },
  },
});
```

- 列表的交错过渡

### 6.可复用的过渡：`<transition>/<transition-group>`作为根组件

### 7.动态过渡

> 动态过渡最基本的例子是通过 name 特性来绑定动态值。

最终方案是组件通过接受 props 来动态修改之前的过渡。

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

### 8.状态过渡

- 状态动画与侦听器：通过侦听器我们能监听到任何数值属性的数值更新
  - 数字值：可用 GreenSock 动画平台中的补间动画工具 TweenMax 实现
  - color 值：Tween.js 和 Color.js 实现
- 动态状态过渡
  - SVG 节点的位置
- 把过渡放到组件里

---

## 🖖 Vue Router

### 1.起步

- 路由导航 router-link ；路由匹配组件渲染 router-view

```html
<!-- 导航：通过传入 `to` 属性指定链接. <router-link> 默认渲染成`<a>` -->
<!-- 对应的路由匹配成功，将自动设置 class 属性值 .router-link-active -->
<router-link to="/foo">Go to Foo</router-link>
<router-link to="/bar">Go to Bar</router-link>
<!-- 路由出口——路由匹配到的组件将渲染在这里  -->
<router-view></router-view>
```

- 将组件 (components) 映射到路由 (routes)，告诉 Vue Router 在哪里渲染它们

```javascript
// 1.定义组件,可以从其他文件 import 进来
const Foo = { template: "<div>foo</div>" };
const Bar = { template: "<div>bar</div>" };
// 2.定义路由（每个路由应该映射一个组件）
const routes = [
  { path: "/foo", component: Foo },
  { path: "/bar", component: Bar },
];
// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes, // (缩写) 相当于 routes: routes
});
// 4. 创建和挂载根实例
const app = new Vue({
  router,
}).$mount("#app");
```

- 注入路由器后在任何**组件内通过  `this.$router`  访问路由器，通过  `this.$route`  访问当前路由**：

```javascript
export default {
  computed: {
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username;
    },
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
};
```

### 2.动态路由匹配

```javascript
//使用场景：把某种模式匹配到的所有路由，全都映射到同个组件
//当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用
const User = {
  template: "<div>User {{ $route.params.id }}</div>",
};
const router = new VueRouter({
  routes: [
    // 动态路径参数以冒号 : 开头
    //现在像 /user/foo 和 /user/bar 都将映射到相同的路由
    { path: "/user/:id", component: User },
  ],
});
```

### 3.嵌套路由

```javascript
// 一个被渲染组件同样可以包含自己的嵌套 <router-view>
const User = {
  template: `
    <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view></router-view>
    </div>
  `,
};
//嵌套出口渲染组件，需在 VueRouter 的参数中使用 children 配置（path不用加/）：
const router = new VueRouter({
  routes: [
    {
      path: "/user/:id",
      component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: "profile",
          component: UserProfile,
        },
        { path: "posts", component: UserPosts },
        { path: "", component: UserHome },
      ],
    },
  ],
});
```

### 4.编程式导航

| 声明式                            | 编程式                                                                   |
| :-------------------------------- | ------------------------------------------------------------------------ |
| `<router-link :to="...">`         | `router.push(...)`如果提供了 path,params 会被忽略,query 并不属于这种情况 |
| `<router-link :to="..." replace>` | `router.replace(...)`替换掉当前的 history 记录                           |

| `

router.go(-1)`

| `router.go(n)`在 history 记录中向前或者后退多少步 |

### 5.命名路由

```javascript
//通过一个名称来标识一个路由显得更方便
const router = new VueRouter({
  routes: [
    {
      path: "/user/:userId",
      name: "user",
      component: User,
    },
  ],
});
```

```html
<!-- 要链接到一个命名路由，可以给 router-link 的 to 属性传一个对象 -->
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

### 6.命名视图

```html
<!-- 界面中拥有多个单独命名的视图。若 router-view 未设置名字，默认为 default -->
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

```javascript
//同个路由，多个视图就需要多个组件
const router = new VueRouter({
  routes: [
    {
      path: "/",
      components: {
        default: Foo,
        a: Bar,
        b: Baz,
      },
    },
  ],
});
```

### 7.重定向和别名

- 重定向：/a 重定向到 /b，访问 /a 时，URL 将会被替换成 /b，匹配路由为 /b。

`routes: [{ path: '/a', redirect: '/b' }]`

- 别名：/a 的别名是 /b，访问 /b 时，URL 会保持为 /b，但路由匹配则为 /a。

`routes: [{ path: '/a', component: A, alias: '/b' }]`

### 8.路由组件传参

**组件中的 \$route 会使其与对应路由形成高度耦合**，使用 props 将组件和路由解耦：

- 布尔模式：如果 props 被设置为 true，route.params 将会被设置为组件属性

```javascript
const User = {
  props: ["id"],
  template: "<div>User {{ id }}</div>",
};
const router = new VueRouter({
  routes: [
    { path: "/user/:id", component: User, props: true },

    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: "/user/:id",
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false },
    },
  ],
});
```

- 对象模式：props 是一个对象时被按原样设置为组件属性。props 静态时有用

```javascript
const router = new VueRouter({
  routes: [
    {
      path: "/promotion/from-newsletter",
      component: Promotion,
      props: { newsletterPopup: false },
    },
  ],
});
```

- 函数模式：创建一个函数返回 props。将参数转换成另一种类型，静态值与基于路由的值结合等

```javascript
//URL /search?q=vue 会将 {query: 'vue'} 作为属性传递给 SearchUser 组件
const router = new VueRouter({
  routes: [
    {
      path: "/search",
      component: SearchUser,
      props: (route) => ({ query: route.query.q }),
    },
  ],
});
//请尽可能保持 props 函数为无状态的，因为它只会在路由发生变化时起作用。
//如果你需要状态来定义 props，请使用包装组件，这样 Vue 才可以对状态变化做出反应。
```

### 9.路由模式 (mode)

> vue-router 默认 hash 模式。不想要很丑的 hash，可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。

- hash：使用 URL hash 值来作路由。支持所有浏览器，含不支持 history 的浏览器
  - 作为客户端的一种状态，当向服务器端发出请求时，hash 部分不会被发送；
  - hash 值的改变会在浏览器的访问历史中增加一个记录，可控制 hash 的切换；
- history：依赖 HTML5 History API 和服务器配置
  - `window.history.pushState(null, null, path)`新增一个历史记录
  - `window.history.replaceState(null, null, path)`替换当前的历史记录
- abstract：支持所有 JavaScript 运行环境，如 Node.js 服务器端。若发现无浏览器的 API，路由会自动强制进入该模式

```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
//需要后台配置支持,要在服务端增加一个覆盖所有情况的候选资源：
//如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面
```

### 10.**导航守卫**

> **导航**：表示路由正在发生改变。可通过路由来进行一些操作如登录权限验证，当用户满足条件时进入导航，否则就取消跳转，到登录页面让其登录
> **导航守卫**：在路由发生变化时作出相应的判断，判断用户可否去到其想去往的页面的路由

vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。参数或查询的改变并不会触发进入/离开的导航守卫。

- 全局守卫：用来监测所有的路由，代码写在路由页面(router.js)

```javascript
//to和from分别是将要进入和离开,通过this.$route获取到的路由对象
//next: Function 该参数是函数，且必须调用，否则不能进入路由(页面空白)
//next() 进入该路由; next(false) 取消进入路由;
//next('/') 或 next({ path: '/' }): 跳转到一个不同的地址
const router = new VueRouter({ ... })
router.beforeEach((to, from, next) => {next();});
router.beforeResolve((to, from, next) => {next();});
router.afterEach((to, from) => {console.log('afterEach 全局后置钩子');});
```

- 全局前置守卫：`router.beforeEach`注册，进入路由之前被调用
- 全局解析守卫：`router.beforeResolve`注册，beforeRouteEnter 调用后调用
- 全局后置钩子：`router.afterEach`注册，进入路由之后被调用
- 路由独享守卫：路由配置上直接定义`beforeEnter`守卫

```javascript
const router = new VueRouter({
  routes: [
    {
      path: "/foo",
      component: Foo,
      beforeEnter: (to, from, next) => {
        // 参数用法一样,调用顺序在全局前置守卫后面，所以不会被全局守卫覆盖
      },
    },
  ],
});
```

- 组件内的守卫
  - beforeRouteEnter
  - beforeRouteUpdate
  - beforeRouteLeave

```javascript
const Foo = {
  template: `...`,
  beforeRouteEnter(to, from, next) {
    // 不！能！获取组件实例 `this`，因为守卫执行前，组件实例还没被创建
    // 在渲染该组件的对应路由被 confirm 前调用
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用，可以访问组件实例 `this`
    // 举例来说，带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 间跳转时
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。钩子此时被调用。
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用，可以访问组件实例 `this`
    // 常用来禁止用户在还未保存修改前突然离开
    const answer = window.confirm("Do you really want to leave?");
    if (answer) {
      next();
    } else {
      next(false);
    }
  },
};
```

- **完整的导航解析流程**：
  - 触发进入其他路由
  - `beforeRouteLeave`：在失活的组件里调用离开守卫，可用来做保存拦截
  - `beforeEach`：调用全局前置守卫，可用于登录验证、全局路由 loading 等
  - `beforeRouteUpdate`：在重用的组件里调用 beforeRouteUpdate 守卫
  - `beforeEnter`：在路由配置里调用路由独享守卫
  - 解析异步路由组件
  - `beforeRouteEnter`：在被激活的组件里调用 beforeRouteEnter
  - `beforeResolve`：调用全局解析守卫
  - 导航被确认
  - `afterEach`：调用全局后置钩子 afterEach
  - 触发 DOM 更新(`mounted`)
  - 执行 beforeRouteEnter 守卫中传给 next 的回调函数

### 11.路由元信息（meta）

路由记录，即 routes 配置中的每个路由对象。

| 路由对象属性        | 描述                                                 |
| :------------------ | :--------------------------------------------------- |
| \$route.path        | string，对应当前路由的路径，总是解析为绝对路径       |
| \$route.params      | Object，包含了动态片段和全匹配片段，无路由参数时为空 |
| \$route.query       | Object，表示 URL 查询参数，无查询参数时是个空对象    |
| \$route.hash        | string，当前路由的 hash 值 (带 #) ，无 hash 值则为空 |
| \$route.fullPath    | string，完成解析后的 URL，含查询参数和 hash 完整路径 |
| **\$route.matched** | **Array，包含当前路由的所有嵌套路径片段的路由记录**  |
| ...                 | ...                                                  |

```javascript
//配置 meta 字段
const router = new VueRouter({
  routes: [
    // 下面的对象就是路由记录
    {
      path: "/foo",
      component: Foo,
      children: [
        // 这也是个路由记录
        {
          path: "bar",
          component: Bar,
          // a meta field
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});
//全局导航守卫中检查元字段：
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});
```

---

## 💞 相关进阶

### 一、MVVM 是一种软件架构模式，具体指什么

> - Model 是指数据模型，泛指后端的各种业务逻辑处理和数据操控，对于前端而言主要是后端提供的 api 接口
> - View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建
> - ViewModel 是视图数据层，完全解耦了 View 层和 Model 层
>   - ViewModel 负责与 Model 层交互，所封装出来的数据模型包括视图的状态和行为两部分。Model 层的数据模型只包含视图的状态
>   - MVVM 采用 **`双向数据绑定`**，ViewModel 的内容会实时展现在 View 层
>
> ![mvvm](https://user-gold-cdn.xitu.io/2019/8/19/16ca75871ec53fba?imageView2/0/w/1280/h/960/format/webp/ignore-error/1#align=left&display=inline&height=311&originHeight=311&originWidth=966&status=done&style=none&width=966)

### 二、Vue 如何实现双向数据绑定

> - View => Data：视图变化更新数据，通过事件监听的方式实现
> - Data => View：数据变化更新视图，数据劫持+发布订阅模式
>   - 监听器`Observer`：劫持和监听所有属性，属性发生变化，就通知订阅者
>     - 遍历数据对象所有的属性，并使用`Object.defineProperty`把这些属性全部转为 `getter/setter`，在属性被访问和修改时通知变更
>   - 订阅器`Dep`：收集订阅者、数据变化时通知订阅者
>   - 订阅者`Watcher`：收到属性的变化通知，执行相应的方法来更新视图
>     - 在组件渲染的过程中触发`getter`进行依赖`dep`(数据属性记录)收集,把 Watcher 实例存放到对应的 Dep 对象中去
>     - 依赖项`dep`的`setter`触发时，通知`watcher`使关联组件重新渲染
>   - 解析器`Compiler`：解析模板指令，初始化视图；将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器
>
> ![bind2](https://cn.vuejs.org/images/data.png#align=left&display=inline&height=750&originHeight=750&originWidth=1200&status=done&style=none&width=1200)

### 三、Proxy 与 Object.defineProperty 优劣对比

> - Object.defineProperty
>   - 缺点
>     - 对于对象：只能对属性进行数据劫持，所以需要深度遍历整个对象
>     - 对于数组：不能监听到数据的变化，需要遍历数组
>   - 优点：兼容性好，支持 IE9
> - Proxy
>   - 优点
>     - 对于对象：可以直接监听对象而非属性
>     - 对于数组：可以直接监听数组的变化
>     - 多达 13 种拦截方法，不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的
>   - 缺点：存在浏览器兼容性问题,而且无法用 polyfill 磨平

### 四、真实`DOM`的解析过程? 虚拟`DOM`实现原理

> 1、浏览器渲染引擎工作流程：创建 DOM 树 —> 创建 Style Rules -> 构建 Render 树 —> 布局 Layout -—> 绘制 Painting
>
> - 构建 DOM 树：用 HTML 解析器，解析 HTML 元素，构建一棵 DOM 树；
> - 生成样式表：用 CSS 解析器，解析 CSS 文件和元素上的 inline 样式，生成页面的样式表
> - 构建 Render 树：将 DOM 树和样式表关联起来（Attachment），每个 DOM 节点都有 attach 方法，接受样式信息，返回一个 render 对象（aka renderer），这些 render 对象最终会被构建成一棵 Render 树
> - 布局（确定节点坐标）：根据 Render 树结构，为每个 Render 树上的节点确定一个在显示屏上出现的精确坐标
> - 绘制页面：根据 Render 树和节点显示坐标，调用每个节点的 paint 方法，调用 GPU 绘制，合成图层

![DOM](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-043710.png#align=left&display=inline&height=352&originHeight=352&originWidth=900&status=done&style=none&width=900)

> 2、Virtual DOM 优缺点及算法主要实现
>
> - 优点：保证性能下限；无需手动操作 DOM；跨平台
> - 缺点：无法进行极致优化
> - 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象
> - diff 算法 — 比较两棵虚拟 DOM 树的差异
> - pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树渲染

### 五、Event Loop 原理分析

> 1、背景知识：浏览器渲染进程（浏览器内核）
>
> - `GUI渲染线程`：负责渲染浏览器界面，解析 HTML、CSS、构建 DOM 树和 RenderObject 树，布局和绘制等。可用于重绘（Repaint）、重排（Reflow）
> - `JS引擎线程`：js 内核，负责处理 javascript 脚本程序（V8 引擎）
> - `事件触发线程`：用来控制事件循环，当对应的事件符合触发条件被触发时，事件线程会把事件添加到待处理事件队列的队尾，等待 js 引擎的处理
> - `定时触发器线程`：负责执行异步定时器一类的函数的线程，如： setTimeout，setInterval
>   - 主线程依次执行代码时，遇到定时器，会将定时器交给该线程处理，当计数完毕后，事件触发线程会将计数完毕后的事件加入到任务队列的尾部，等待 JS 引擎线程执行
> - `异步http请求线程`：负责执行异步请求一类的函数的线程，如： Promise，axios，ajax 等
>   - 主线程依次执行代码时，遇到异步请求，会将函数交给该线程处理，当监听到状态码变更，如果有回调函数，事件触发线程会将回调函数加入到任务队列的尾部，等待 JS 引擎线程执行。
>
> 注意：GUI 渲染线程和 JS 引擎线程是互斥的，后者执行时前者会被挂起；JS 执行时间过长，会造成页面渲染不连贯，导致页面渲染加载阻塞
> 2、`Event Loop`机制
> JS 是单线程的，事件环可以理解为实现异步的一种方式。
> ![ma](https://user-gold-cdn.xitu.io/2019/1/10/1683863633586974?imageView2/0/w/1280/h/960/format/webp/ignore-error/1#align=left&display=inline&height=449&originHeight=449&originWidth=394&status=done&style=none&width=394)
>
> - 主线程(`main thread`)：JS 引擎线程，主线程的执行过程是一个 tick
> - 执行栈(`execution stack`)：同步任务在主线程上运行，会形成一个执行栈
> - 任务队列(`task queue`)：由`事件触发线程`管理，含宏任务/微任务队列
>   - 异步任务触发时，将异步线程(如`定时触发器线程`、`异步http请求线程`)提供的回调事件，缓存到任务队列中
>   - 异步任务执行时（即主线程空闲时，同步任务执行完毕），将任务队列中的异步任务回调事件，提供给主线程读取，执行栈执行
> - 宏任务：macrotask，也叫 tasks。
>   - script（主代码块）
>   - setTimeout、setInterval、setImmediate、MessageChannel
>   - requestAnimationFrame(rAF)、UI Rendering、I/O
> - 微任务：microtask，也叫 jobs。当前宏任务执行后立即执行(渲染前)的任务
>   - Promise(Async/await)、MutationObserver(监听 DOM 修改事件)
>   - Process.nextTick（Node 独有）
> - 区别：事件环迭代开始后，若宏任务队列中安排了新任务，则直到下一次迭代才会运行。每次宏任务退出且执行上下文堆栈为空时，微任务队列中的每个微任务都会按顺序执行，若微任务队列中安排了新任务，微任务会继续执行直到队列为空。
>
> 注意：
>
> - 等待`delay`时间后，setTimeout、setInterval 的回调事件才放入任务队列中
> - new Promise() 构造函数是宏任务的同步代码，而非微任务
> - HTML5 中规定 setTimeout 的最小时间延迟是 4ms
> - 动画回调（rAF 回调队列）：渲染前使用 rAF
>
> ![an](https://camo.githubusercontent.com/a12555cbe873831500e20955075d50558735a5f8/68747470733a2f2f706963312e7a68696d672e636f6d2f76322d61643161323531636239316433373632353138356134666238373434393466635f622e706e67#align=left&display=inline&height=529&originHeight=529&originWidth=436&status=done&style=none&width=436)

### 六、NextTick 原理分析

> - Vue.js 默认使用异步执行 DOM 更新
> - Vue.nextTick（`vm.$nextTick`）：在下次 DOM 更新循环结束之后执行延迟回调，用于获取更新后的 DOM。实现方式(`优雅降级`)：
>   - `macrotask`的实现
>     - setImmediate
>     - `MessageChannel:`创建一个消息通道，通过其两个 MessagePort 属性发送数据
>     - setTimeout(fn,0)
>   - `microtask`的实现：promise，不支持的话直接指向 macro task 的实现

### 七、Vue 中的 key 有什么作用

> key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速。更新组件时判断两个节点是否相同。相同就复用，不相同就删除旧的创建新的
>
> - 准确: 如果不加 key,那么 vue 会选择复用节点(Vue 的就地更新策略),导致之前节点的状态被保留下来,会产生一系列的 bug
> - 快速: key 的唯一性可以被 Map 数据结构充分利用,相比于遍历查找的时间复杂度 O(n),Map 的时间复杂度仅仅为 O(1)
