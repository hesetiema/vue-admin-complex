# HTML5 基础

## 根元素 html

## 文档元数据`head`

### `meta charset='utf-8'`

### `title`

### `base href=''`

### `link href='' rel=''`

- 引入 css：`<link href="style.css" rel="stylesheet">`
- 提供可替换的样式表：

```html
<link href="default.css" rel="stylesheet" title="Default Style" />
<link href="fancy.css" rel="alternate stylesheet" title="Fancy" />
<link href="basic.css" rel="alternate stylesheet" title="Basic" />
```

- 预加载

```html
<link rel="preload" href="style.css" as="style" />
<link rel="preload" href="main.js" as="script" />
```

## 文档内容`body`

---

### 内容分区

#### 文档主体`main`

#### 标题`h1-h6`

#### \*头部标题`header`

#### \*独立内容`article`

#### \*侧边栏内容`aside`

#### \*内容导航`nav`

#### \*内容分区`section`

#### \*底部页脚`footer`

---

### 文本内容

#### 块级容器`div`

#### 行内容器`span`

#### 块级段落`p`

#### 有序列表`ol`

#### 无序列表`ul`

#### 列表条目`li`

#### 描述列表`dl、dt、dd`

#### 锚元素`a href='' target='_blank'`

#### 缩写元素`abbr title=''`

---

### 图片和多媒体

#### 图片`img src='' alt=''`

- 使用`srcset`、`sizes`属性

```html
<img
  src="clock-demo-thumb-200.png"
  alt="Clock"
  srcset="clock-demo-thumb-200.png 200w, clock-demo-thumb-400.png 400w"
  sizes="(min-width: 600px) 200px, 50vw"
/>
```

#### \*图片引用`figure、figcaption`

#### \*音频`audio src='' autoplay`

#### \*视频`video src='' autoplay poster='' controls`

#### \*多格式资源`source`

---

### 表格内容

#### 表格`table`

#### 表格标题`caption`

#### 头部行`thead`

#### 主体行`tbody`

#### 尾部行`tfoot`

#### 单行`tr`

#### 表格头与表格数据`th、td`

#### 列组`colgroup、col`

- 跨列样式（span 表示该`col`元素横跨列数）

```html
<colgroup>
  <col>
  <col span="2" class="batman" />
  <col span="2" class="flash" />
/colgroup>
```

---

### 表单内容

表单内容的 css 问题分类

- 难以被美化：legend、checkbox、radio、placeholder
  - placeholder：使用伪元素`::placeholder`自定义占位文本样式
- 不可样式化：color、date、range、select、option、datalist 等。定义这些小部件，必须依靠 JavaScript 来构建 DOM 树

基本样式美化

- 盒子模型：所有文本字段都完全支持与 CSS 盒模型相关的每个属性(width, height, padding, margin,border)
  - 每个小部件都有自己的边框，填充和边距的规则。若要不同的小部件提供相同的大小，必须使用`box-sizing`属性
- 定位问题
  - `legend`：从`fieldset`的顶部边框中删除，需使用`position`属性绝对定位，以可访问方式隐藏`overflow`
  - `textarea`：默认为内联块，使用`display`属性改为`block`。默认与文本底行对齐，通常会更改垂直对齐方式`vertical-align`

```css
input,
textarea,
select,
button {
  width: 150px;
  margin: 0;
  box-sizing: border-box;
}
legend {
  width: 1px;
  height: 1px;
  overflow: hidden;
  position: absolute;
}
textarea {
  vertical-align: middle;
}
```

#### 表单元素`form`

#### 按钮`button name=''`

- form 属性：表示 button 元素关联的 form 元素(id)
- type 属性
  - sumbit：将表单数据提交给服务器。默认值
  - button：没有默认行为，不向服务器提交数据
  - menu：打开一个由指定`menu`元素进行定义的弹出菜单
- value 属性：与表单数据的提交按钮相关联

#### 多行文本`textarea`

#### 表单输入`input type='' name='' value=''`

- type 属性
  - type="checkbox"：多选框。`value`属性必须，可选`checked`属性
  - type="date"；日期。可选`value`属性，设置默认值`yyyy-mm-dd`
  - type="number"：浮点数。可选`value`属性，设置默认值
    - 占位符：`placeholder="Multiple of 10"`
    - 步进大小：`step="10"`默认为 1，允许小数值
    - 指定最小和最大值：`min="0" max="100"`
    - 控制输入框：css 控制大小、验证
    - 提供建议值：`list`属性指向`datalist元素`(id)
  - type="password"：密码
    - 设置长度：`minlength="4" maxlength="8"`
    - 设置控件大小：`size='10'`。以像素为单位，初始控件默认 20
    - 指定输入模式：`inputmode="numeric"`
    - 设置值必须输入：`required`
  - type="radio"：单选框
  - type="text"：单行文本
    - 文本框为空时显示的一个示例值：`placeholder=''`
    - 指示文本框有多少个字符宽度的数字：`size="10"`
- 全局属性
  - form：此元素属于一个`form`表单，表单的 id 就是属性的值
  - list：指向 id 为 list 属性值的`datalist`元素，提供建议值

#### 下拉选项`select name=''`

- form 属性：select 所关联的 form 表单 ，表单的 id 就是属性的值
- required 属性：规定 select 的值不能为空

#### \*表单可选值列表`datalist、option`

```html
<label for="ice-cream-choice"Choose a flavor:/label>
<input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" />

<datalist id="ice-cream-flavors">
  <option value="Chocolate"> </option>
  <option value="Coconut" >/option>
  <option value="Mint" >/option>
  <option value="Strawberry"> /option>
</datalist>
```

---

### 交互元素及 web 组件

#### \*内含信息挂件`details`、`summary`

- 默认详细信息需`click`或`focus`来切换，可使用 open 全局属性设置为默认打开
- 可通过设置 css 自定义控件图标及相应样式

```html
<details open>
  <summary>Details</summary>
  <p>Something small enough to escape casual notice.</p>
</details>
```

#### 内容模板`template`

- 特点：元素内容不会被渲染，运行时使用 JavaScript 实例化

#### 占位符`slot`

- 特点：Web 组件内的一个占位符，可以使用自己的标记填充
- 具名插槽：拥有 name 属性的插槽叫具名插槽

---

## canvas  

canvas 标签定义画布即图形容器，必须使用脚本( javascript )来绘制图形，默认`canvas` 元素没有边框和内容。

```html
<canvas
  id="myCanvas"
  width="200"
  height="100"
  style="border:1px solid #000000;"
  >
</canvas>
```

---

## 全局属性

- id：定义了一个全文档唯一的标识符。它用于在链接、脚本和样式中辨识元素
- class：一个以空格分隔的元素的类名（classes ）列表，它允许 CSS 和 Javascript 通过类选择器或 DOM 方法来选择和访问特定的元素

### contenteditable

一个枚举属性，表示元素是否可被用户编辑。若可以，浏览器会修改元素的部件以允许编辑

### data-\*

自定义数据属性的属性，可在所有 HTML 元素上嵌入自定义数据属性，通过脚本与 HTML 之间进行专有数据的交换

```html
<div id="user" data-id="1234" data-user="ndoe" data-date-of-birth></div>

<script>
  var el = document.querySelector("#user");
  // el.id == 'user'
  // el.dataset.id === '1234'
  // el.dataset.user === 'ndoe'
  // el.dataset.dateOfBirth === ''
</script>
```

### \*draggable

一个枚举类型的属性，用于标识元素是否允许使用拖放操作 API 拖动。文本选择、图像和链接默认可拖拽，其他的 HTML 元素可拖动必须满足：

- draggable 属性设置成 true
- 为拖动事件添加一个监听器`dragstart`
- 在定义的监听器中设置拖动数据`event.dataTransfer.setData(format, data)`

```html
<div
  draggable="true"
  ondragstart="event.dataTransfer.setData('text/plain', 'dragged')"
  >
  This text strongmay/strong be dragged.
</div>
```

### is

允许指定标准 HTML 元素像已注册的自定义内置元素一样工作
