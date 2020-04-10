# SVG 学习

> SVG (Scalable Vector Graphics) 可伸缩矢量图形是一种基于 XML 的标记语言。

## 1、概述

- SVG 文件可直接插入网页，成为 DOM 的一部分，可用 JavaScript、CSS 操作
- SVG 可写在独立文件中，用`<img>、<object>、<embed>、<iframe>`等标签插入网页
- SVG 文件可转为 BASE64 编码，然后作为 Data URI 写入网页

## 2、位图/矢量图、视窗/坐标系

- 位图：由像素点阵组成，定义区域内每个位置的颜色值。伸缩大小会失真
  - 压缩：分有损压缩和无损压缩。通过省略规则来省略位图中毫无意义的信息
  - 文件类型：`*.gif、*.jpg、*.tif`等
  - 特点：大数据量即时渲染，保证细节，色彩丰富，适合实时数据可视化
- 矢量图：通过路径和填充颜色来描述渲染。伸缩不失真，但表现力不如位图
  - 抽象：由点线面的抽象概念经人工或计算机测量、思考运算来转换生成
  - 文件类型：`SVG、*.dwg`等
  - 特点：大曲线表面保留渲染，保证精度，色彩单一，适合高保真打印查看
- 视窗(`viewport`)：`<svg>`元素上使用 width 和 height 属性声明视窗尺寸，默认大小 300x150 px。视窗坐标系原点 (0,0) 在视窗左上角，X 轴正向右，Y 轴正向下。
- 用户坐标系(`viewBox`)：4 个参数对应原点、宽高，其与视窗坐标系统宽高比相同时，会延伸适应整个视窗区域。不同时可用`preserveAspectRatio`属性声明

```xml
<svg width="100%" height="100%" viewBox="0 0 300 150"
  xmlns="http://www.w3.org/2000/svg">
  <circle id="mycircle" cx="50" cy="50" r="50" />
</svg>
```

## 3、基本元素

- 基本元素：line, rect, circle, ellipse, polyline, polygon, text, path, image, use;
- 特点：最近定义的元素出现在较早定义的形状上方

### 1. line

```xml
<line x1="0" y1="100" x2="100" y2="0" stroke-width="2" stroke="black" />
```

以上即从点 (0,100) 到点 (100,0) 画一条轮廓为黑色，粗细(轮廓宽度)为 2 的线段。

### 2. rect

```xml
<rect x="0" y="0" width="200" height="150" fill="transparent"
stroke="blue" stroke-width="5" rx="10" ry="10" />
```

以上绘制原点为(0,0)且宽高为 200x150，填充色为透明，轮廓为蓝色宽为 5，圆角半径为 10 的矩形。

rx、ry 属性指定圆角的 x、y 方位的半径

### 3. circle

```xml
<circle cx="150" cy="50" r="25" class="fancy" />
```

class 属性指定对应 CSS 类：`.fancy {fill: none;stroke: black；stroke-width: 3pt;}`

### 4. ellipse

```xml
<ellipse cx="60" cy="60" rx="20" ry="40" stroke="black"
stroke-width="5" fill="silver"/>
```

rx 属性和 ry 属性，指定了椭圆横向轴和纵向轴的半径

### 5. polyline

```xml
<polyline points="60 110, 65 120, 70 115, 75 130"/>
```

points 点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开。每个点必须包含 2 个数字，一个是 x 坐标，一个是 y 坐标

### 6. polygon

```xml
<polygon points="50 160, 55 180, 70 180, 60 190" />
```

polygon 和折线很像，都是由连接一组点集的直线构成。不同的是，polygon 的路径在最后一个点处自动回到第一个点

### 7. text

```xml
<text x="50" y="25" font-size="40" fill="red">Hello World</text>
```

- x 属性和 y 属性，表示文本区块基线（baseline）起点的横坐标和纵坐标。
- text-anchor: start| middle| end| inherit，定义参考点和实际字符之间的定位关系
- tspan: 一个可以嵌套的 text 标签，实现斜体、加粗等效果
- textPath: 让文字按照一定路径任意摆放

### 8. path

```xml
<path d="M 20 230 Q 40 205, 50 230 T 90230"/>
```

- `<path>`使用一系列直线，样条曲线（三次方或二次方）和椭圆弧来定义任意复杂的曲线，结合平滑或锯齿状的过渡。
- d 属性表示绘制顺序，值是一个“命令+参数”的序列，命令用大小写字母(绝对、相对定位)来表示绘制动作，后跟坐标参数
  - M：移动画笔到（moveto）
  - L：画线段到（lineto）
  - H\V：画水平线到 x\画垂直线到 y
  - Z：闭合路径，不区分大小写
  - A：圆弧 rx ry x-deg large-arc sweep-flag x y
    - rx，ry 半径，x-deg x 轴旋转角度，large-arc 大或小于 180 度(0 小，1 大)
    - sweep-flag 表示弧线方向(0 逆时针，1 顺时针)，x y 为最终坐标

### \*贝塞尔曲线

#### 二次贝塞尔曲线

> 控制点：描述的是曲线上各个点的斜率，从起点斜率到终点斜率是一个渐变过程

二次贝塞尔曲线需定义一个控制点。Q 命令设置两组参数：Q x1 y1, x y

```xml
<path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent"/>
```

- (x1,y1) 是控制点，(x,y) 是曲线终点
- T x y：推断出新的控制点 (通常点某一侧的控制点是另一侧的控制点的对称)

```xml
<path d="M10 80 Q 52.5 10, 95 80 T 180 80" stroke="black" fill="transparent"/>
```

#### 三次贝塞尔曲线

三次贝塞尔曲线需定义两个控制点，C 命令设置三组坐标参数：C x1 y1, x2 y2, x y

```xml
<path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
```

- (x1,y1) 是起点控制点，(x2,y2) 是终点控制点，(x,y) 是曲线的终点
- S x2 y2, x y：推断出新控制点 (通常点某一侧的控制点是另一侧的控制点的对称)

```xml
<path d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
stroke="black" fill="transparent"/>
```

### 9. image

```xml
<image xlink:href="path/to/image.jpg" width="50%" height="50%"/>
```

在一个 SVG 对象内部呈现光栅图像。未设置的 x 属性或 y 属性默认为 0。

### 10. use

```xml
<circle id="myCircle" cx="5" cy="5" r="4"/>
<use href="#myCircle" x="10" y="0" fill="blue" />
```

use 用于复制一个形状，可取得目标节点并在别的地方复制它们

## 4、其他元素

### 1. g

组合容器，添加到 g 元素上的属性、变换会应用到其所有的子元素上

```xml
<g fill="red" transform="scale(2)">
  <rect x="0" y="0" width="10" height="10" />
  <rect x="20" y="0" width="10" height="10" />
</g>
```

### 2. defs

定义容器，需要重复使用的图形元素(不会直接呈现)，仅供引用

```xml
<defs>
  <g id="myCircle">
    <text x="25" y="20">圆形</text>
    <circle cx="50" cy="50" r="20"/>
  </g>
</defs>

<use href="#myCircle" x="0" y="0" />
```

### 3. pattern

图案容器，defs 内部。被引用来平铺一个区域，对一个对象进行填充或描边。

允许在一个 pattern 中的元素内，嵌入另一个 pattern。

- `patternUnits`：pattern 图案容器的几何属性 (x,y,width,height) 的坐标系
  - objectBoundingBox：默认值，相对于目标边界框的分值或百分比
    - x、y 的值乘以待填充区域相应宽高，即为实际起点坐标偏移量
    - 1 除于 width、height 分值或百分比值，间接规定图案平铺的数量
  - userSpaceOnUse：相对于用户空间坐标系
    - x、y 表示的是相对于整个 svg 画布坐标系中的位置
    - pattern 宽高固定，指定区域内平铺多少铺多少，超出部分裁掉
- `patternContentUnits`：pattern 内部图案内容对应的坐标系，控制其缩放和排布
  - userSpaceOnUse：默认值，内部元素的大小不因 pattern 的缩放而改变
  - objectBoundingBox：内部元素所有属性值作为比例，都依赖 pattern 的宽高
    - 内部元素所有属性值若后不带百分号%，则都乘上 100 作为百分比数
    - stroke-width 默认值是 1，若不指定数值，则按 100%来计算撑满 pattern
  - 如果有 viewBox 属性，patternContentUnits 属性将被忽略

```xml
<defs>
  <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
    <circle fill="#bee9e8" cx="50" cy="50" r="35" />
  </pattern>
</defs>
<rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
```

### 4. linearGradient\radialGradient

- linearGradient：线性渐变容器，defs 内部
  - gradientUnits：objectBoundingBox(默认值)、userSpaceOnUse 两参数
  - x1,y1 设置渐变线的起始坐标，x2,y2 设置终点坐标
- radialGradient：径向渐变容器，defs 内部。附加属性默认 cx,cy,fx,fy,r 都是 50%
  - 中心点：cx,cy 设置渐变终点 offset="100%"时圆心位置，r 设置终点渐变半径
  - 焦点：fx,fy 设置渐变起点 offset="0"时圆心位置
- `<stop>`元素来定义渐变的关键点。可以设置多个 stop 元素
  - offset：属性值范围为 0%1.0。0 渐变线起始位置，1 终点位置
  - stop-color：设置关键点处的颜色
  - stop-opacity：设置关键点处的透明度
- spreadMethod：控制当渐变到达终点，对象尚未被填充颜色的填色方式
  - pad：默认属性值。以相应`<stop>`的 stop-color 填充
  - repeat：以重复的方式填充超出部分。
  - reflect：以镜像的方式填充超出部分
- gradientTransform：渐变形变属性，同 SVG 的 transform

```xml
<defs>
  <linearGradient id="linear" x1="1" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="black"></stop>
    <stop offset="1" stop-color="black" stop-opacity="0"></stop>
  </linearGradient>
  <linearGradient id="linear2" x1="210" y1="0" x2="110" y2="100" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="black"></stop>
    <stop offset="1" stop-color="white"></stop>
  </linearGradient>
</defs>
<path d="M0 0v100h100v-100z" fill="url(#linear)" stroke="black"></path>
<path d="M110 0v100h100v-100z" fill="url(#linear2)" stroke="black"></path>
```

### 5. clipPath

剪切容器：移除在别处定义的元素的部分内容。显示或不显示，不存在半透明效果

```xml
<defs>
  <clipPath id="cut-off-bottom">
    <rect x="0" y="0" width="200" height="100" />
  </clipPath>
</defs>

<circle cx="100" cy="100" r="100" clip-path="url(#cut-off-bottom)" />
```

### 6. mask

遮罩容器：指一个透明的遮罩层和当前对象合成，形成背景

```xml
<defs>
  <linearGradient id="Gradient">
    <stop offset="0" stop-color="white" stop-opacity="0" />
    <stop offset="1" stop-color="white" stop-opacity="1" />
  </linearGradient>
  <mask id="Mask">
    <rect x="0" y="0" width="200" height="200" fill="url(#Gradient)"  />
  </mask>
</defs>

<rect x="0" y="0" width="200" height="200" fill="green" />
<rect x="0" y="0" width="200" height="200" fill="red" mask="url(#Mask)" />
```

### 7. symbol

图形模板容器，可用`<use>`元素实例化。在同一文档中多次使用，添加结构和语义

- symbol 元素本身是不呈现的。只有 symbol 元素的实例才能呈现。

```xml
<symbol id="sym01" viewBox="0 0 150 110">
  <circle cx="50" cy="50" r="40" stroke-width="8" stroke="red" fill="red"/>
  <circle cx="90" cy="60" r="40" stroke-width="8" stroke="green" fill="white"/>
</symbol>

<use xlink:href="#sym01" x="0" y="0" width="100" height="50"/>
<use xlink:href="#sym01" x="0" y="100" width="50" height="25"/>
```

### 8. animate/animateMotion

- animate 动画元素，定义元素某属性如何随时间改变，同 CSS 的 transition
  - keyTimes: 同 CSS 的 @keyframes，与 values 列表值对应
  - calcMode: discrete| linear`[default]`| paced| spline。定义动画具体插值模型
    - spline：表示每个动画间使用自定的贝塞尔变换曲线
  - keySplines：定义动画执行时的贝塞尔曲线。通过 ; 来分隔每一个值
  - fill：指定动画结束后停留的装填
    - freeze：停留在动画结束的位置
    - remove：回到动画开始的位置
- animateTransform: 相当于 CSS 中的 transform

```xml
<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
  <rect width="10" height="10">
    <animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="indefinite" />
  </rect>
</svg>
```

- animateMotion：指定元素绕指定路径进行运动。calcMode 默认属性 paced
  - 特有属性：keyPoints、rotate、path( 同 path 标签 d 属性)
  - rotate：auto | auto-reverse | Number，垂直路径切线/反转、固定角度
  - 路径：使用 mpath 标签，引用外部 path。mpath > path > values> from/to

```xml
<rect x="0" y="0" width="30" height="30" style="fill: #ccc;">
  <animateMotion path="M50,125 C 100,25 150,225, 200, 125" dur="6s" fill="freeze"/>
</rect>
```

### 9. foreignObject

允许包含不同的 XML 命名空间即 xmlns。常用将 HTML 文本嵌入 SVG。

```xml
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <foreignObject x="20" y="20" width="160" height="160">
    <div xmlns="http://www.w3.org/1999/xhtml">hello world</div>
  </foreignObject>
</svg>
```

## 5、属性

### 1. fill、stoke

- 上色：fill 属性设置对象内部的颜色，stroke 属性设置对象描边线条的颜色
  - fill-rule：确定一个形状的内部
    - nonzero：非 0 或 0(内外部)，点发出的射线与顺逆时针的路径交叉数差
    - evenodd：奇或偶(内外部)，点发出的射线与路径交叉数量
  - fill-opacity：控制填充色的不透明度
  - stroke-opacity：控制描边的不透明度
- 描边：以路径为中心线绘制的边框。stroke-width 描边宽度，默认跟随尺寸缩放
  - stroke-linecap：控制描边线帽的形状
    - butt：默认值，直边，垂直于描边的方向、贯穿终点
    - square：直边，垂直于描边的方向、终点处加上 stroke-width
    - round：圆角，半径为 stroke-width
  - stroke-linejoin：控制描边连接的形状
    - miter：默认值，方形连接，形成尖角
    - round：圆角连接，实现平滑效果
    - bevel：斜角连接，形成斜接
  - stroke-miterlimit：值为角长度比上线宽，超过该值则切割掉，配合 linejoin
  - **stroke-dasharray：虚线类型**。参数为一组用逗号分割的数字组成的数列
    - 第一个用来表示填色区域的长度，如 5
    - 第二个用来表示非填色区域的长度，如 10
    - 第三个表示偶数模式的循环长度，如 5，则 5 色-10 空-5 色-5 空-10 色-5 空
  - **stroke-dashoffset：定义虚线开始的位置**，即距路径开始的距离

### 2. transform

- 变形：可以连缀，只要把它们连接起来就行，用空格隔开

```xml
<rect x="0" y="0" width="10" height="10" transform=
"translate(30,40) rotate(45) scale(2) skewX(45)" />
```

### 3. preserveAspectRatio

- `preserveAspectRatio="<align> [<meetOrSlice>]"`表示是否强制保留宽高比
- 除 `<image>` 元素外，只适用于提供属性 viewBox 的元素，否则忽略
  - align：是否强制保留宽高比，viewBox、viewport 宽高比不一致时使用
    - none 表示，不强制保留宽高比，viewBox 内容拉伸铺满 viewport
    - xMinYMin|xMidYMin|...：强制保留长宽比，viewBox 如何与 viewport 对齐
  - meetOrSlice：meet(默认)|slice，可选参数，类似背景属性 contain，cover
    - meet：保留长宽比，缩放 viewBox 在视图范围内可见，比 viewport 小
    - slice：保留长宽比，放大 viewbox 到覆盖可视区域，比 viewport 大

### 4. CSS 设置属性

> SVG 规范将属性分 properties、attributes，前者可用 CSS 设置，后者不能

```xml
  <defs>
    <style type="text/css"><![CDATA[
       #MyRect {
         stroke: black;
         fill: red;
       }
    ]]></style>
  </defs>
  <rect x="10" height="180" y="10" width="180" id="MyRect"/>
```

- 可定义一个外部的样式表 style.css
- transition 是最常用的。比如，想做一下颜色的渐变等

## 6、动画

### 1. 线条动画

- 常用过渡屏启动画面。线条采用 path 描绘路径，核心属性 stroke 相关
  - stroke：定义笔触的颜色
  - stroke-dasharray：定义 dash 和 gap 的长度
  - stroke-dashoffset: 定义其实 dash 线条开始的位置
- 原理：dasharray 将 dash 隐藏再增至全长。dashoffset 移动原点
  - 创建 3 个 text 重叠，stroke-width 设置宽度，offset 设置为 0，gap 设置足够大
  - 通过 nth-child 选择器，设置各文本不同的 stroke 颜色值，animation
  - @keframes 中的 100%处，设置 dashoffset\dasharray 错开 dash 长度

### 2. 边框动画

```xml
<svg width="200" height="200">
  <line class="top" x1="0" y1="0" x2="600" y2="0"/>
  <line class="left" x1="0" y1="200" x2="0" y2="-400"/>
  <line class="bottom" x1="200" y1="200" x2="-400" y2="200"/>
  <line class="right" x1="200" y1="0" x2="200" y2="600"/>
</svg>
```

```css
svg line {
  stroke-width: 10;
  stroke: #000;
  fill: none;
  stroke-dasharray: 200;
  transition: transform 0.6s ease-out;
}
svg:hover line.top {
  transform: translateX(-400px);
}
svg:hover line.bottom {
  transform: translateX(400px);
}
svg:hover line.left {
  transform: translateY(400px);
}
svg:hover line.right {
  transform: translateY(-400px);
}
```

### 3. 沿 SVG 路径的动画对象

- offset-path：CSS 属性，它表示元素的运动路径；
- offset-distance：CSS 属性，定义元素在路径上运动距离，单位是数值或百分比
- 借助 JavaScript 的`path.getTotalLength()`函数可以获取 DOM 上路径的长度

```xml
<svg width="300px" height="175px" version="1.1">
  <path fill="transparent" stroke="#888888" stroke-width="1"
 d="M10 80 Q 77.5 10, 145 80 T 280 80" class="path">
  </path>
</svg>
<div class="ball"></div>
```

```css
svg {
  width: 300px;
  display: block;
  position: absolute;
}
.ball {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  offset-path: path("M10 80 Q 77.5 10, 145 80 T 280 80");
  offset-distance: 0%;
  animation: red-ball 2s linear alternate infinite;
}

@keyframes red-ball {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}
```

## 7、作为图标的特点

### 1.  使用 aria-hidden 属性

aria-hidden 属性可以用来控制一系列可访问 API 中的非交互内容的显示或隐藏。可以把该元素和它的所有子元素从可访问性树上移除：`<i class="icon" aria-hidden="true" />`

### 2. 封装组件

- 导入或下载 .svg 文件，默认 vue-cli 对 svg 使用 `url-loader`  进行处理
- 使用  webpack loader **svg-sprite-loader** ，将多个 svg 打包成  `svg-sprite`，其使用 symbol 元件作为图标容器，use 元素 xlink:href 属性调用对应其 id
- 使用 webpack 的 **exclude、include**，让`svg-sprite-loader`只处理指定文件夹下面的 svg，`url-loaer`只处理除此文件夹之外的所有 svg
- 使用到 webpack 的 **require.context**  自动导入相应文件模块
- 使用** SVGO **优化处理 SVG 文件中大量的无用信息
