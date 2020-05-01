# CSS3 基础

> CSS 规则：一个元素可能被多个选择器选中，因此会有多个规则，有可能以不同的值去设置同一属性。CSS 标准会规定哪个优先级最高并生效, 称之为层叠(`cascade`)算法

## 1、选择器

### 1.1 基本选择器：ID >属性,类>元素

- 元素选择器 `elementname`
- 类选择器 `.classname`
- ID 选择器 `#idname`
- 通配选择器 `*, ns|*, *|*, |*`
  - `ns|*`：会匹配 ns 命名空间下的所有元素
  - 不推荐使用通配选择器，因为它是性能最低的一个 CSS 选择器
- 属性选择器 `[属性=值]`

### 1.2 组合选择器

- 相邻兄弟选择器 `A + B`
- 普通兄弟选择器 `A ~ B`
- 子选择器 `A > B`
- 后代选择器 `A B`

### 1.3 伪类与伪元素

- `:not(X)`：否定伪类，匹配不符合参数选择器 X 描述的元素
  - 可以利用这个伪类提高规则的优先级
  - 可以将一个或多个以逗号分隔的选择器作为其参数
  - :not(foo) 将匹配任何非 foo 元素，包括 html 和 body
  - 选择器只会应用在一个元素上，无法用它排除所有父元素
- `:placeholder-shown`：显示 placeholder text 的`<input>`或`<textarea>`元素
  - 经常和 text-overflow 使用，确定如何向用户发出未显示的溢出内容信号
  - `text-overflow: clip | ellipsis | <string>;`切断、部分省略、分割
- `:focus-within`：表示一个元素获得焦点，或该元素的后代元素获得焦点
- `:checked`：表示任何处于选中状态的 radio、checkbox 元素中的 option HTML 元素
- `:target`：代表一个唯一的页面元素(目标元素)，其 id 与当前 URL 片段匹配
- `:hover`：适用于用户使用指示设备虚指一个元素（没有激活它）的情况
- `::after`：伪元素，已选中元素的最后一个子元素。配合`content`属性为该元素添加装饰内容。默认行内元素
- `::before`：伪元素，已选中的元素的第一个子元素。配合`content`属性为该元素添加装饰内容。默认行内元素

## 2、盒子模型

### 2.1 block 块级盒子

> 特点：每个盒子都换行；width、height 可用，宽度通常与父容器相同；padding、margin、border 推开其他盒子

- Content box
- Padding box
- Border box
- Margin box

### 2.2 inline 内联盒子

> 特点：盒子不产生换行；width、height 不可用；padding、margin、border 可使用，但不推开`上下inline`盒子

- a、img、button、input、label、select、textarea 都是行内元素

### 2.3 display: inline-block

> 特点：如`<a>`是像`<span>`一样的内联元素；可用来设置其内边距，让用户更容易点击链接

- 不会跳转到新行
- 设置 width 和 height 属性会生效
- padding, margin, 以及 border 会推开上下左右其他元素

#### \* vertical-align 属性

> 用于指定行内元素（inline）或表格单元格（table-cell）元素的垂直对齐方式，默认值为 baseline

- 相对父元素的值：使元素相对其父元素垂直对齐
  - **baseline**
    - inline-block 元素的 baseline 是最后一个 inline box 的 baseline
    - inline-block 元素内部没有 line box 或它的 overflow 属性不是 visible，baseline 为其底 margin 边界
  - sub\super
  - text-top\text-bottom
  - middle：使元素的中部与父元素的基线加上父元素 x-height  的一半对齐
  - length：使元素的基线对齐到父元素的基线之上的给定长度。可为负数
  - percentage：使元素的基线对齐到父元素的基线之上的给定百分比(`line-height`属性的百分比)。可为负数
- 相对行的值：使元素相对整行垂直对齐
  - top：使元素及其后代元素的顶部与整行的顶部对齐
  - bottom：使元素及其后代元素的底部与整行的底部对齐

### 2.4 标准盒模型：`box-sizing = content-box;`

- 设置的是 content box 的宽高，实际宽高需加上 padding、border

### 2.5 替代(IE)盒模型：`box-sizing = border-box;`

- 设置的是 border box 的宽高，内容区宽高需减去 padding、border
- 不包含`margin`

## 3、定位

### 3.1 基本定位 (position)

- 静态定位`position: static;`默认行为，占据在正常的文档流
- 相对定位`position: relative;`定位元素在正常的文档流，可修改其最终位置
  - `top, bottom, left, right`来精确指定要将定位元素移动到的位置
  - 如指定`top: 30px;left: 30px;`则向下、向右移动`30px`
- 绝对定位`position: absolute;`定位元素脱离正常文档流，可修改其位置
  - 定位上下文
    - 若父元素均静态定位，则包含元素默认为`<html>`元素
    - 修改定位上下文，需设置一父元素为相对定位`position:relative;`
- 固定定位`position:fixed;`定位元素相对于浏览器视口本身定位
- `z-index`：仅在定位元素（position 属性值为非 static 值的元素）上有效果
  - 默认为 auto，正值移到上层，数字值越大层数越高

### 3.2 外边距合并 (margin collapsing)

> 两个外边距相接的元素的外边距将合并为一个外边距，即最大的单个外边距的大小。即使某一外边距为 0 仍然适用

- 相邻元素之间：外边距会折叠（除非后元素需要清除之前的浮动）
- 父元素与其第一个或最后一个子元素之间：子元素的外边距“溢出”到父元素外面
  - 不存在边框、内边距、行内内容，未创建块格式化上下文、或清除浮动将两者的 margin-top 分开
  - 不存在边框、内边距、行内内容、height、min-height、max-height 将两者 margin-bottom 分开
- 空的块级元素

## 4、值类型与大小调整

### 4.1 值类型

- 长度`length`
  - 绝对长度：像素`px`，1 英寸=2.54 厘米=96 像素
  - 相对长度
    - `em` 父元素的字体大小
    - `rem` 根元素的字体大小
    - `vw` 视窗宽度的 1%
    - `vh` 视窗高度的 1%
- 百分比`%`：
  - 使用百分比作为 width、height 值，那么它将是父值宽度高度的百分比
  - 使用百分比作为 margin、padding 值，那么它将是 inline 长度的百分比
- 数字：如`opacity`，接受 0(完全透明)和 1(完全不透明)之间的数字
- 颜色：计算机通过不同的红、绿、蓝通道的组合显示大约 1670 万种(256 x 256 x 256 = 16,777,216)不同的颜色
  - 颜色关键字
    - 色彩关键字：如 lavender（淡紫色）、rebeccapurple(利百加紫)
    - transparent：表示一个完全透明的颜色，rgba(0,0,0,0) 的简写
    - **currentColor：变量，代表原始的 color 属性的计算值，如无会继承父元素的颜色值**
  - RGB 立体坐标
    - 十六进制符号 #RRGGBB 和 #RGB(#RRGGBB)：值取 0-9，A-F
    - 函数符 rgb(R,G,B)：值取 0-255
    - 函数符 rgba(R,G,B,a)：`alpha`通道`a`设定透明度，0 透明，1 不透明
  - HSL 圆柱坐标(色相、饱和度、明度)：hsl(H,S,L)
    - 色相表示色环(代表彩虹的一个圆环)的一个角度。定义 red=0=360，green=120, blue=240
    - 100% 是满饱和度，而 0% 是一种灰度
    - 100% 明度是白色， 0% 明度是黑色
    - 函数符 hsla()：`alpha`通道`a`设定透明度，0 透明，1 不透明
- 函数：如 rgb()、hsl()、url()
  - calc()函数能够在 CSS 中进行简单的计算。由浏览器计算出无法定义的值

### 4.2 大小调整

- 固有尺寸`intrinsic size`：由其内容定义，如图片本身大小，div 据内容高度
- 具体外在尺寸`specific size`：给定的大小，内容超出范围时`overflow`
- 最小最大尺寸`min- and max- sizes`
  - `max-width:100%;`用于小中图片响应式加载
    - 小盒子设置最大宽度`max-width:100%;`防止溢出
    - 大盒子设置最大宽度`max-width:100%;`保证不被拉伸变形
- 视口单元：可视窗口的大小，可用于设置盒子或文本的宽高
  - vw：视口宽度
  - vh：视口高度。显示整页高度，可设置为 100vh 高将其余内容推到视口下方，滚动后才会显示

## 5、可替换元素

> 可以影响其位置而非内容的外部对象。如 image、video、iframe。**img 元素也是盒子，必须指定宽度或高度才可以应用其替换内容的样式**

### 5.1 内容尺寸  `object-fit`

- fill | contain | cover | none | scale-down
  - `contain`：被替换的内容将被缩放，填充内容框时保持其宽高比，与框的宽高比不匹配将被添加“黑边”
  - `scale-down`：取`none`和`contain`中更小的一个尺寸

### 5.2 内容位置  `object-position`

- grid 或 flex 布局：可替换元素默认不会拉伸，而是与网格区域或 flex 容器的开始对齐

## 6、溢出

### 6.1 overflow：`overflow-x、overflow-y`

- `visible`(默认)
- `hidden`
- `scroll`
- `auto`：溢出时浏览器自动设置`scroll`

### 6.2 overflow-wrap

> 浏览器是否允许长字符串单词换行

- `normal`：在正常的单词结束处换行
- `break-word`：行内容纳不下时分解单词，强制换行

## 7、层叠上下文与块格式化上下文

### 7.1 Stacking Context

- 形成
  - 根元素`html`
  - `z-index`值非 auto 的`absolute | relative`定位元素
  - `fixed | sticky`定位元素
  - `z-index`值非 auto 的`flex | grid`子项
  - `opacity`值小于 1 的元素
  - `transform`值非 none 的元素
- 特点
  - 每个层叠上下文完全独立于它的兄弟元素：当处理层叠时只考虑子元素
  - 每个层叠上下文是自包含的：元素在父层叠上下文中按顺序进行层叠
  - 没有创建自己的层叠上下文的元素将被父层叠上下文包含
  - 类比：有层级的层叠上下文，子元素是其父元素版本号之下的次要版本
- 比较
  - 普通元素的层叠等级优先由其所在的层叠上下文决定
  - 层叠等级的比较只有在当前层叠上下文元素中才有意义
- 层叠顺序规则：由元素的层叠上下文、层叠等级(stacking level)共同决定
  - 层叠上下文元素的边框`border`和背景色`background`
  - 负层叠水平(`z-index为负`)的子层叠上下文
  - 普通元素(**未定位的**，不创造层叠上下文的元素)
    - 非内联、未定位的普通流后代(`block`)
    - 未定位的浮动`float`
    - 内联`inline`、未定位的普通流后代，含内联表和内联块`inline blocks`
  - `z-index:0`子层叠上下文、`z-index:auto`且有定位的被根层叠上下文包含
  - 正层叠水平(`z-index为正`)的子层叠上下文

### 7.2 Block Formatting Context，BFC

- 形成：
  - 根元素(`<html>`)
  - 浮动元素(float 不是 none)
  - 绝对定位、固定定位元素，position 为 absolute 或 fixed
  - display: inline-block | table | flex | grid 元素
  - overflow 值不为 visible 的块元素

## 8、边框 border

### 8.1 边框宽度、样式、颜色

- `border-width`
- `border-style`: 默认为 none，不显示边框
  - solid | double | dotted | dashed | none | hidden
  - groove | ridge 雕刻或浮雕效果
  - inset | outset 陷入或突出效果
- `border-color`支持类型：具体命名、HEX、RGB

### 8.2 边框圆角及其他

- `border-radius`：可为百分比、长度像素值。边框合并时圆角不能应用
  - 单值语法：四个角都应用
  - 二值语法：`top-left && bottom-right -> top-right && bottom-left`
  - 三值语法：`top-left -> top-right && bottom-left -> bottom-right`
  - 四值语法：`top-left -> top-right -> bottom-right -> bottom-left`
  - 椭圆圆角：水平`horizontal / vertical`垂直
- `border-collapse`：决定表格的边框是分开的还是合并的
  - `collapse`表格中相邻单元格共享边框，`border-style`的值 inset 表现为槽，值 outset 表现为脊
  - `separate`相邻单元格都拥有不同的边框。默认值，边框间的距离是通过  `border-spacing`来确定的

## 9、背景 background

### 9.1 背景颜色

- `background-color`支持颜色类型：具体命名、HEX、RGB

### 9.2 背景图片及定位

- `background-image : url(img1.png), url(img2.png);`——图像 1 显示在图像 2 上层
  - 默认情况下，大图不会缩小以适应方框，小图则是平铺以填充方框
  - 若已指定了背景颜色，则图像将显示在颜色的顶层
  - 渐变可以与常规的背景图像很好地混合在一起
- `background-position`——选择背景图像显示在其应用到的盒子中的位置
  - 默认`padding box`左上角是原点，一个 X 轴水平值后面跟着一个 y 轴垂直值
    - `background-origin: content-box`可设置新原点为`content box`的左上角
  - 使用长度值/百分比/关键字(top、bottom、left、right、center)，可混合使用
- `background-size`——用于设置长度、百分比值、关键字，来调整图像的大小
  - `cover`：使图像足够大完全覆盖盒子，保持高宽比。可能出现多余
  - `contain`：使图像的大小被盒子包含，保持高宽比。可能出现间隙
- `background-repeat`——用于控制图像的平铺行为
  - `no-repeat`
  - `repeat`
  - `repeat-x`
  - `repeat-y`
- `background-clip`——设置元素的背景是否延伸到边框下面
  - `border-box`默认值，背景默认延伸到边框
  - `padding-box`设置半透明边框时应用该值
  - `content-box`

### 9.3 渐变背景

> 其结果属于`<gradient>`数据类型，是一种特别的`<image>`数据类型

- `background-image: linear-gradient(direction, color-stop1, color-stop2, ...)`
  - `direction`：角度值`deg`或关键字(to bottom || top || left || right)。默认方向`to bottom`，即`180deg`
  - `color-stops`(`aka Icing`)：颜色支持 hsl 语法；位置可以是像素或百分比，默认根据颜色种类多少平均设定位置。如`linear-gradien(to right,#afa,#336699,#fff);`
- `background-image: radial-gradient(shape size at position, start-color, ..., last-color);`
  - `shape`：默认为椭圆`ellipse`，可选为圆形`circle`(可设置半径值代替)
  - `size`：可选关键字`closest-side, farthest-side, closest-corner, and farthest-corner.`

### 9.4 背景依附

- `background-attachment` ：决定背景图像的位置是在视口内固定，还是随着包含它的区块滚动
  - `fixed`相对于视口固定
  - `local`相对于元素的内容固定。背景的绘制区域和定位区域是相对于可滚动的区域而不是包含他们的边框
  - `scroll`相对于元素本身固定， 而不是随着其内容滚动（对元素边框有效）

## 10、Grid 网格布局

### 10.1 容器`container`

> 采用网格布局的区域——容器 container；行和列的交叉区域——单元格 cell；划分网格的线——网格线 grid line

- `display`
  - `display: grid`：指定一个容器采用网格布局，默认块级元素
  - `display: inline-grid`：可设置容器元素为行内元素。盒子不会产生换行，width 和 height 属性将不起作用。
- `grid-template-columns`：定义每一列的列宽，使用绝对单位或百分比
- `grid-template-rows`：定义每一行的行高，使用绝对单位或百分比
  - `repeat`：简化重复的值。如`grid-template-columns: repeat(3, 33.33%);`
  - `auto-fill`：自动填充，容纳更多单元格。如`repeat(auto-fill, 100px);`
  - `fr`：fraction 的缩写，意为"片段"，代表比例关系。如`100px 1fr 2fr`
  - `minmax`：表示长度范围。`minmax(100px, 1fr)`即不小于 100px，不大于 1fr
  - `auto`关键字：表示由浏览器自己决定长度
  - 网格线名称：使用方括号，指定每一根网格线的名字，方便引用
    - `grid-template-columns: [c1] 100px [c2] 100px [c3]`
    - `grid-template-rows: [r1] 100px [r2] 100px [r3]`
  - 布局实例：`grid-template-columns`属性对于网页布局非常有用
    - 两栏布局：`grid-template-columns: 70% 30%;`
    - 十二网格布局：`grid-template-columns: repeat(12, 1fr);`
- `grid-template-areas`：定义区域方便引用，一个区域由单个或多个单元格组成
  - 区域定义后网格线自动命名，起始为区域名-start，终止为区域名-end
  - 如果某些区域不需要利用，则使用"点"（.）表示
    - `grid-template-areas: 'a . c' 'd . f' 'g . i';`
- `gap:<row-gap> <column-gap>;`代表行间距、列间距
- `place-items:<align-items> <justify-items>;`
  - `align-items`：单元格内容的垂直位置，`start | end | center | stretch`
  - `justify-items`：单元格内容的水平位置，`start | end | center | stretch`
- `place-content`：整个内容区域在容器里面的位置
  - `align-content: start | end | center | stretch | space-around | space-between | space-evenly;`垂直方向子项的对齐和分布方式
  - `justify-content: start | end | center | stretch | space-around | space-between | space-evenly;`水平方向子项的对齐和分布方式
    - `space-around`：每个项目两侧间隔相等，比项目与容器边框间隔大一倍
    - `space-between`：每个项目的间隔相等，项目与容器边框没有间隔
    - `space-evenly`：每个项目的间隔相等，项目与容器边框同样长度间隔
- `grid-auto-flow`：设定容器子元素的放置顺序。默认值是 row，即"先行后列"
  - `grid-auto-flow:column`：将它设成 column，变成"先列后行"
  - `dense`：尽可能紧密填满，尽量不出现空格。如`grid-auto-flow: row dense;`
- `grid-auto-columns`：设置浏览器自动创建的多余网格的列宽
- `grid-auto-rows`：设置浏览器自动创建的多余网格的行高

### 10.2 项目`item`

> 容器内部采用网格定位的子元素——项目 item

- 项目 item 只能是容器 container 的顶层子元素，不包含项目的子元素
- Grid 布局只对项目 item 生效
- Grid 布局中，`float，display:inline-block，display:table-cell，vertical-align`以及 column-\*这些属性和声明对 grid 子项是没有任何作用的。
- `grid-column`：如`grid-column: 1 / 3;`等同于`grid-column: 1 / span 2;`
  - `grid-column-start`：左边框所在垂直网格线，指定第几网格线或网格线名字
  - `grid-column-end`：右边框所在垂直网格线，指定第几网格线或网格线名字
- `grid-row`
  - `grid-row-start`：上边框所在水平网格线，指定第几网格线或网格线名字
  - `grid-row-end`：下边框所在水平网格线，指定第几网格线或网格线名字
- `span`关键字：表示"跨越"，即左右边框（上下边框）之间跨越多少个网格
  - 若产生了项目的重叠，则用`z-index`属性指定项目的重叠顺序
  - 斜杠以及后面的部分可以省略，默认跨越一个网格
- `grid-area`：指定项目放在哪一个区域。
- `place-self:<align-self> <justify-self>;`
  - `align-self`：设置单元格内容的垂直位置，只作用于单个项目
  - `justify-self`：设置单元格内容的水平位置，只作用于单个项目

## 11、Flex 布局

### 11.1 弹性容器

- `display:flex`
- `justify-content: flex-start | flex-end | center | space-around | space-between | space-evenly`
  - 指明水平方向子项的对齐和分布方式
  - 初始值是`flex-start`，元素从容器的起始线排列
- `align-items: stretch | flex-start | flex-end | center | baseline`
  - 指明垂直方向单行 flex 元素的对齐和分布方式
  - 默认值`stretch`，flex 子项拉伸。若 flex 子项设置了高度，则按照设置的高度值渲染，而非拉伸
  - `baseline`表现为所有 flex 子项都相对 flex 容器的基线对齐，距 bottom 有距离
- `align-content: stretch | flex-start | flex-end | center | space-around | space-between | space-evenly`
  - 指明垂直方向多行 flex 元素的对齐和分布方式
  - 默认值`stretch`，每一行 flex 子元素都等比例拉伸。如若两行 flex 子元素，则每一行拉伸高度是 50%
- `flex-flow: <‘flex-direction’> || <‘flex-wrap’>`
  - 指明主轴方向，是否换行
  - `flex-direction: row | row-reverse | column | column-reverse`
  - `flex-wrap: nowrap | wrap | wrap-reverse`

### 11.2 子项

> Flex 布局中，flex 子元素的设置 float，clear 以及 vertical-align 属性都没有用

- `order: <integer>;` 整数值，默认值是 0。
  - 设定某一个 flex 子项的排序位置
  - `order = 1`则后移一个位置
  - `order = -1`则提前一个位置
- `flex`
  - `flex-grow: <number>; /* 数值，可以是小数，默认值是 0 */`
    - flex 子项扩展所占据的宽度，占据除去元素外的剩余的空白间隙
  - `flex-shrink:<number>; /* 数值，默认值是 1 */`
    - 处理当 flex 容器空间不足时候，单个元素的收缩比例
  - `flex-basis`：默认值是 auto，定义在分配剩余空间之前元素的默认大小
- `align-self: auto | flex-start | flex-end | center | baseline | stretch`
  - 控制单独某一个 flex 子项的垂直对齐方式
  - auto（默认值），表示继承自 flex 容器的 align-items 属性值

## 12、样式化

### 12.1 样式化表格

- `table`
  - `table-layout: fixed`根据列标题的宽度来规定列的宽度
  - `border-collapse: collapse;`折叠边框再加`border`如`3px solid purple;`
- `thead th:nth-child(x)`设置列标题宽度如`width: 30%;`
- `th,td`元素上设置一些`padding`
- `tbody td`设置主内容居中对齐`text-align: center;`
- `tfoot th`设置底部标题右对齐`text-align: right;`
- `thead th, tfoot th, tfoot td`设置头部、底部渐变色如`background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));`再加`border`如`3px solid purple;`
- `tbody tr:nth-child(odd)`及`tbody tr:nth-child(even)`设置斑马条纹(`zebra stripes`)
- `caption`样式化标题`caption-side:top | bottom;`

### 12.2 样式化列表

- 默认
  - `<ul>、<ol>`元素默认设置`margin:16px 0;`、`padding-left: 40px;`
  - `<li>`默认是没有设置间距的
  - `<dl>`元素默认设置`margin:16px 0;`无内边距设定
  - `<dd>`元素默认设置为`margin-left: 40px (2.5em)`
  - `p`元素默认设置`margin:16px 0;`
- 重新设置外边距：
  - `ul,ol,dl,p`的字体大小`font-size: 1.5rem;`
- 设置相同行间距
  - `li, p, dd, dt`的行高`line-height: 1.5;`
  - `dd`的底部外边距`margin-bottom: 1.5rem;`
- 特定样式：在`<ul>`或`<ol>`元素上设置`list-style`
  - `list-style-type`：符号样式,默认 disc。如`circle、square、upper-latin`
  - `list-style-position`：项目符号位置(列表项内外),默认为`outside`
  - `list-style-image`：使用自定义项目符号图片,默认 none
- 管理`ol`列表计数
  - start 属性允许你从 1 以外的数字开始计数，如`<ol start="4">`
  - reversed 属性将启动列表倒计数，如`<ol start="4" reversed>`
  - value 属性允许设置列表项指定数值，如`<li value="2">`

### 12.3 样式化链接

- `a`样式修改
  - 取消默认被选中轮廓`outline: none;`
  - 取消默认文本下划线`text-decoration:none;`
  - 添加少量内边距`padding: 2px 1px 0;`
  - 在链接中包含图标，属性选择器`a[href*="http"]`
    - `background: url() no-repeat 100% 0;`
    - `background-size: 16px 16px;`
    - `padding-right: 19px;`
  - 样式化链接为按钮
    - `ul`内边距置零宽度拉满`padding: 0;max-width: 100%;`
    - `li`默认块级元素，改为行内元素水平展开`display:inline;`
    - `a`默认内联元素，改为可调整上下高度的`display:inline-block;`
      - 设置宽度及间隙`width: 19%;margin-right: 0.625%;`
      - 设置行高`line-height: 3;`
      - 设置边框`border:1px solid;border-right:1px transparent solid;`
    - 最后 a 元素`li:last-child a`消除间隙溢出`margin-right: 0;border-right:1px solid;`
    - 设置 a 伪类背景`background`及颜色`color`
- `:link`未访问伪类，链接的默认状态。可设置字体颜色
- `:visited`访问过伪类。可设置字体颜色
- `:focus`选中伪类。设`border-bottom:1px solid;`下划线,加`background`背景
- `:hover`悬停伪类。设`border-bottom:1px solid;`下划线,加`background`背景
- `:active`激活伪类。设新背景`background`，字体新颜色

### 12.4 阴影

- 文本阴影`text-shadow: offset-x offset-y blur-radius color;`
- 盒子阴影`box-shadow: offset-x offset-y blur-radius color;`另`inset`关键字设置内嵌阴影

## 13、过渡与动画
