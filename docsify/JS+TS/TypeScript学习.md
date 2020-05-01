# TypeScript 学习

## 一、类型系统

### 1 类型注解

#### 1.1 原始类型

- string:`let name: string = "bob";`可使用反引号定义模板字符串`${expr}`
- number:`let dec: number = 6;let binary: number = 0b1010;`可表示二、八进制
- boolean:`let isDone: boolean = false;`
- null、undefined: 能被赋值给任意类型的变量，默认是所有类型的子类型

#### 1.2 特殊类型

- any: 兼容所有类型，所有类型可赋值给它，它也能赋值其他任何类型
  - 注意：变量声明时未指定其类型，则会被识别为任意值类
- void: 与 any 类型相反，表示无任何类型，只能被赋值为 null、undefined

#### 1.2 接口(对象类型)

- 作用：对类的一部分行为进行抽象或对「对象的形状（Shape）」进行描述，具体如何行动由类去实现
- 特点：赋值时变量的形状必须和接口的形状保持一致
- 属性
  - 可选属性`prop?:`
  - 任意属性`[propName:string]:any`
  - 只读属性`readonly prop:`
- 注意：一旦定义任意属性，则确定属性、可选属性的类型都必须是其类型的子集

```typescript
interface Name {
  first: string;
  second: string;
}

let name: Name;
name = {
  first: "John",
  second: "Doe",
};

name = {
  // Error: 'Second is missing'
  first: "John",
};
```

#### 1.3 数组类型

- 元素类型接后缀`[]`:`let boolArray: boolean[] = [true,false]`
- 数组泛型`Array<elemType>`可用来表示数组

#### 1.4 元组类型(Tuple)

- 使用：由`:[typeofmember1, typeofmember2]`为元组添加类型注解
- 特点：数组合并了相同类型的对象，元组合并了不同类型的对象
- 注意：
  - 直接对元组类型变量进行初始化或赋值时，需提供所有元组类型中指定的项
  - 当添加越界的元素时，类型会被限制为元组中每个类型的联合类型

#### 1.5 函数类型

- 函数声明

```typescript
function sum(x: number, y: number): number {
  return x + y;
}
```

- 函数表达式：在 TypeScript 的类型定义中，`=>`用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

```typescript
let mySum: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

- 接口定义函数的形状

```typescript
interface SearchFunc {
  (source: string, substring: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function (source: string, substring: string) {
  return source.search(substring) !== -1;
};
```

- 可选参数：`?`表示可选的参数，一般可选参数后不允许出现必需参数
- 参数默认值：添加默认值的参数会被识别为可选参数，后可接必需参数
- 重载：允许一个函数接受不同数量或类型的参数时，作出不同的处理

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
//重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现
```

#### 1.6 泛型(generic)

- 特点：定义函数、接口或类的时候，不预先指定具体的类型，使用时再指定类型
- 类型参数：`<T>`捕获用户传入的类型，以便使用
  - 可一次定义多个类型参数，如`<T,U>`
  - 默认类型：可指定为`<T = string>`，没有在代码中直接指定类型参数，从实际值参数中也无法推测出时起作用
- 泛型函数

```typescript
function identity<T>(arg: T): T {
  return arg;
}
function createArray<T>(length: number, value: T): Array<T> {
  //泛型变量，如T[]
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

createArray(3, "x"); // ['x', 'x', 'x']
```

- 泛型约束：约束泛型的形状等，多个类型参数之间也可以互相约束

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

- 泛型接口：使用含有泛型的接口来定义函数的形状

```typescript
interface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function <T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
};

createArray(3, "x"); // ['x', 'x', 'x']
```

- 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

#### 1.7 联合类型(union types)

- 使用`|`作为标记，表示取值可以为多种类型之一，如`string | number`
- 当不确定联合类型的变量具体类型时，只能访问其所有类型共有的属性或方法

#### 1.8 交叉类型(intersection types)

- 使用`&`作为标记，将多个类型合并为一个类型，包含所需的所有类型的特性
- extend 模式可从两个对象中创建一个新对象，新对象拥有两个对象所有的功能

```typescript
function extend<T, U>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }

  return result;
}
const x = extend({ a: "hello" }, { b: 42 });
// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
```

#### 1.9 类型别名

- 使用`type SomeName = someValidTypeAnnotation`的语法来创建别名
- 与接口区别：
  - 需要使用类型注解的层次结构，请使用接口（能使用 implements、extends）
  - 需要给联合类型和交叉类型提供一个语义化的名称时，请使用类型别名

```typescript
type Text = string | { text: string };
type Coordinates = [number, number];
type Callback = (data: string) => void;
```

### 2 从 JS 迁移

#### 2.1 使用 any 类型减少错误

#### 2.2 引用第三方库的声明文件

##### 2.2.1 声明语句

- 声明语句中只能定义类型，切勿在声明语句中定义具体的实现
- 声明全局变量：`declare var`、`declare let`、`declare const`(常用)
- 声明全局方法：`declare function`
- 声明全局类：`declare class`
- 声明全局枚举类型：`declare enum`
- 声明含有子属性的全局对象：`declare namespace`
  - ES6 使用了 module 关键字，ts 为了兼容 ES6，使用 namespace 替代了自己的 module，更名为命名空间
- 声明全局接口或类型：`interface、type`

##### 2.2.2 声明文件

- 定义：由`.d.ts`为后缀的文件
- 管理：使用`@types`统一管理第三方库的声明文件，存在于`DefinitelyTyped`仓库
  - 如`npm install @types/jquery --save-dev`
- 全局变量：通过`<script>`标签引入第三方库，注入全局变量
  - 以`npm install @types/xxx --save-dev`安装的，则不需要任何配置
  - 否则书写声明文件并存放于当前项目`src`目录下（或对应的源码目录下）

```typescript
// src/jQuery.d.ts
//声明合并
declare function jQuery(selector: string): any;
declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
  const version: number;
  class Event {
    blur(eventType: EventType): void;
  }
  enum EventType {
    CustomClick,
  }
  namespace fn {
    function extend(object: any): void;
  }
  interface AjaxSettings {
    method?: "GET" | "POST";
    data?: any;
  }
}

// src/index.ts
jQuery("#foo");
jQuery.ajax("/api/get_something");
```

- `npm`包：通过`import foo from 'foo'`导入，符合 ES6 模块规范
  - 检查是否有声明文件
    - package.json 中有 types 字段，或者有一个 index.d.ts 声明文件
    - 尝试安装一下对应的`@types`包`npm install @types/foo --save-dev`
  - 否则书写声明文件，存放于`types/foo/index.d.ts`中，同时配置`tsconfig.json`中的`paths、baseUrl`字段
  - 注意：`export default`ES6 默认导出，可用`import foo from 'foo'`而非`import { foo } from 'foo'`来导入这个默认值。只有 function、class 和 interface 可以直接默认导出，其他的变量需要先定义出来，再默认导出

```typescript
// types/foo/index.d.ts
export namespace foo {
  const name: string;
  namespace bar {
    function baz(): string;
  }
}

// src/index.ts
import { foo } from "foo";
console.log(foo.name);
foo.bar.baz();
```

- 扩展原有模块的类型

```typescript
// types/moment-plugin/index.d.ts
import * as moment from "moment";
declare module "moment" {
  export function foo(): moment.CalendarKey;
}

// src/index.ts
import * as moment from "moment";
import "moment-plugin";
moment.foo();
```

### 3 内置对象

#### 3.1 ECMAScript 内置对象

- Boolean：`let b: Boolean = new Boolean(1);`
- Error：`let e: Error = new Error('Error occurred');`
- Date：`let d: Date = new Date();`
- RegExp：`let r: RegExp = /[a-z]/;`

#### 3.2 DOM 和 BOM 的内置对象

- HTMLElement：`let body: HTMLElement = document.body;`
- NodeList：`let allDiv: NodeList = document.querySelectorAll('div');`
- Event：`document.addEventListener('click', function(e: MouseEvent) {// Do something});`
- Document

#### 3.3 TypeScript 核心库的定义文件

- 定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的
- TypeScript 核心库的定义中不包含 Node.js 部分

#### 3.4 用 TypeScript 写 Node.js

- 需要引入第三方声明文件：`npm install @types/node --save-dev`

### 4 字符串字面量类型

- 使用 type 定义一个字符串字面量类型 EventNames，只能取三种字符串中的一种

```typescript
type EventNames = "click" | "scroll" | "mousemove";
function handleEvent(ele: Element, event: EventNames) {
  // do something
}
handleEvent(document.getElementById("hello"), "scroll");
```

### 5 枚举(enum)

- 用于取值在一定范围内的场景，如一周只有七天，颜色只能为红绿蓝等
- 枚举成员会被赋值为从 0 开始递增的数字，同时对枚举值到枚举名进行反向映射

```typescript
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
console.log(Days["Sun"] === 0); // true
console.log(Days[0] === "Sun"); // true
```

- 手动赋值：手动赋值的枚举项可为小数或负数，未手动赋值的枚举项会接着上一个枚举项递增，递增步长为 1

```typescript
enum Days {
  Sun = 7,
  Mon = 1.5,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1.5); // true
console.log(Days["Tue"] === 2.5); // true
console.log(Days["Sat"] === 6.5); // true
```

- 枚举项：常数项、计算所得项
  - 常数项：不具有初始化函数并且之前的枚举成员是常数；枚举成员使用常数枚举表达式初始化
  - 计算所得项：`enum Color {Red, Green, Blue = "blue".length};`
  - 注意：紧接在计算所得项后的未手动赋值的项，会因无法获得初始值而报错
- 常数枚举：使用`const enum`定义的枚举类型
  - 特点：与普通枚举区别为，它会在编译阶段被删除，且不能包含计算成员
- 外部枚举：常用于声明文件中，可同时使用`declare、const`

```typescript
declare const enum Directions {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right,
];
```

### 6 类(class)

#### 6.1 类的概念

- 类(Class)：定义了一件事物的抽象特点，包括它的属性和方法
- 对象(Object)：类的实例，通过`new`生成
- 面向对象(OOP: Object Oriented Programming)三大特性：封装、继承、多态
  - 封装(Encapsulation)：对数据的操作隐藏起来，对外只暴露接口
  - 继承(Inheritance)：子类(派生类)继承父类(超类)，拥有更具体的特性
  - 多态(Polymorphism)：由继承产生的不同类，对同一方法可有不同的响应
- 存取器(getter & setter)：用以改变**属性的读取和赋值**行为
- 修饰符(Modifiers)：一些关键字，用于限定成员或类型的性质，如`public`
- 抽象类(Abstract Class)：供其他类继承的基类，不允许被实例化。抽象方法必须在子类中被实现
- 接口(Interfaces)：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但可以实现多个接口

#### 6.2 ES6 中类的用法

- 类的方法：类的所有方法都定义在类的 prototype 属性上面
  - 类的新方法可以添加在 prototype 对象上面。如`Object.assign`方法
  - 类的内部所有定义的方法，都是不可枚举的（non-enumerable）
  - `Generator`方法：返回迭代器的函数，`*`为标识，使用`yield(产出)`语句定义不同的内部状态，实例调用`next()`方法返回拥有`done、value`属性的对象
  - `static`静态方法：只能由类名直接访问，不能被实例继承
    - 包含的 this 指向类而非实例
    - 父类的静态方法，可以被子类继承，也可从 super 对象上调用

```javascript
class Animal {
  //ES5中的构造函数即ES6中类的构造方法constructor
  //constructor方法默认返回实例对象（即this）,也可指定返回对象
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    return `My name is ${this.name}`;
  }
  static isAnimal(a) {
    return a instanceof Animal;
  }
}
Object.assign(Animal.prototype, {
  toMakeNoise() {},
  toMove() {},
});
let a = new Animal("Jack");
Animal.isAnimal(a); // true
```

- 类的继承：`extends`关键字实现继承，`super`关键字调用父类的构造函数和方法；静态方法/属性继承只能通过派生类访问，不能通过派生类的实例访问

```javascript
class Cat extends Animal {
  //派生类构造函数里一定要调用super(),且必须在this.xx之前调用
  constructor(name) {
    super(name); // 调用父类的 constructor(name)
    console.log(this.name);
  }
  sayHi() {
    return "Meow, " + super.sayHi(); // 调用父类的 sayHi()
  }
}

let c = new Cat("Tom"); // Tom
console.log(c.sayHi()); // Meow, My name is Tom
```

#### 6.3 ES7 中类的用法

- 实例属性：除了在 construtor 中的 this.xx 定义外，可直接在类里面定义
- 静态属性：使用`static`关键字实现静态属性，只能由类名直接访问，不能被实例继承

```javascript
class Animal {
  name = "Jack";
  static num = 42;
  constructor() {
    // ...
  }
}

let a = new Animal();
console.log(a.name); // Jack
console.log(Animal.num); // 42
```

#### 6.4 TypeScript 中类的用法

- 修饰符：`public、private、protected`
  - 默认所有属性和方法都是公有的(`public`)，即可以在任何地方被访问
  - `private`修饰的属性或方法是私有的，不能在声明它的类的外部访问
  - `protected`修饰的属性或方法是受保护的，不能在类外部访问，子类中允许
  - 参数属性：修饰符还可以使用在构造函数参数中，等同于类中定义该属性
    - 如`constructor(public name: string) {}`

```typescript
class Animal {
  private name: string;
  public constructor(theName: string) {
    this.name = theName;
  }
  //构造函数修饰为`private`时，该类不允许被继承或实例化
  //构造函数修饰为`protected`时，该类只允许被子类继承，不允许被实例化
}
let a = new Animal("Jack");
console.log(a.name); // Jack
a.name = "Tom"; //Error:Property 'name' is private ...
```

- 只读属性：`readonly`关键字，只允许出现在属性声明或索引签名中
  - readonly 和其他访问修饰符同时存在的话，需要写在其后面

```typescript
class Animal {
  // public readonly name: string;
  constructor(public readonly name: string) {}
}
```

- 抽象类：`abstract`关键字
  - 抽象类是不允许被实例化的
  - 抽象类中的抽象方法不包含具体实现，且必须在派生类中实现

```typescript
abstract class Animal {
  constructor(public name: string) {}
  abstract sayHi(): void;
}

class Cat extends Animal {
  sayHi() {
    console.log(`Meow, My name is ${this.name}`);
  }
}

let cat = new Cat("Tom");
```

- 类的类型：类似接口，直接`:`接类名，如`let a: Animal = new Animal('Jack');`

#### 6.5 类与接口

##### 6.5.1 类实现接口

- 实现(`implements`)：不同类之间可以有一些共有的特性，把这些共有特性提取成接口(`interfaces`)，用`implements`关键字来实现
- 一个类可以实现多个接口

```typescript
interface Alarm {
  alert();
}
interface Light {
  lightOn();
  lightOff();
}

class Door {}
class SecurityDoor extends Door implements Alarm {
  alert() {
    console.log("SecurityDoor alert");
  }
}

class Car implements Alarm, Light {
  alert() {
    console.log("Car alert");
  }
  lightOn() {
    console.log("Car light on");
  }
  lightOff() {
    console.log("Car light off");
  }
}
```

##### 6.5.2 接口继承

```typescript
//接口继承接口
interface Alarm {
  alert();
}

interface LightableAlarm extends Alarm {
  lightOn();
  lightOff();
}
//接口继承类
class Point {
  x: number;
  y: number;
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```

##### 6.5.3 混合类型

```typescript
//一个对象可以同时作为函数和对象使用，并带有额外的属性方法
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = <Counter>function (start: number) {};
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 7 声明合并

- 函数的合并：使用重载定义多个函数类型
- 接口的合并
  - 接口属性的合并：类型必须是唯一的，同名属性类型不一致会报错
  - 接口方法：与函数的合并一样
- 类的合并：与接口的合并规则一样
