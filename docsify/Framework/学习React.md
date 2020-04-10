# 学习 React

React 是一个声明式，高效且灵活的用于构建用户界面的 JavaScript 库。架构模式基于 MVC， UI 系统基于 JSX

## 🌄 安装

### 1、外部引入

```javascript
//部署时，将 "development.js" 替换为 "production.min.js"
<script src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
//引入 jsx(不适用于生产环境)
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
//使用 jsx(不适用于生产环境)
<script type="text/babel">
  ReactDOM.render(<h1>Hello, world!</h1>,document.getElementById('root'));
</script>
```

### 2、CLI

`npx create-react-app my-app`=>`cd my-app`=>`npm start`

## 🔰 JSX 及 React 元素

### 1、JSX

JSX 是 JavaScript 的语法扩展，描述 UI 呈现出它应有交互的本质形式。可拆分为多行，内容包裹在括号中。

- JSX 表示对象：Babel 会把 JSX 转译成`React.createElement(component, props, ...children)`函数调用，创建对象被称为 “React 元素”。
- JSX 可防止注入攻击；JSX 可嵌入表达式
- JSX 是一个表达式：if 语句、for 循环不是表达式不能在 JSX 中直接使用。可使用 conditional (三元运算) 表达式来替代

#### 1.1 JSX 类型

- 使用点语法：在一个模块中导出许多 React 组件时，使用点语法来引用

```javascript
import React from "react";
const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  },
};
function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

- 运行时选择类型：通过通用表达式来（动态）决定元素类型，需将类型赋值给一个大写字母开头的变量。根据 prop 来渲染不同组件：

```javascript
import React from "react";
import { PhotoStory, VideoStory } from "./stories";

const components = {
  photo: PhotoStory,
  video: VideoStory,
};

function Story(props) {
  // 正确！JSX 类型可以是大写字母开头的变量。
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

#### 1.2 JSX 特定属性

使用 camelCase（小驼峰命名）来定义 props 属性的名称，Props 默认值为 “True”

- 字符串字面量：`const element = <div tabIndex="0"></div>;`
- JS 表达式：`const element = <img src={user.avatarUrl}></img>;`
- 属性展开：易将不必要的 props 传递给不相关的组件。建议谨慎使用

```javascript
const Button = (props) => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};
```

#### 1.3 JSX 中的子元素

- 字符串字面量：`<Component>Hello world!</Component>`
- JSX 子元素：可与字符串字面量同使用。组件能返回存储在数组中的一组元素
- JS 表达式：`{todos.map(msg => (<Item key={msg} msg={msg} />))}`
- 函数：`{index => <div key={index}>This is item {index} </div>}`
- true、false、null、undefined 是合法的子元素但不会被渲染：

```javascript
//确保 && 之前的表达式总是布尔值：
<div>
  {props.messages.length > 0 && <MessageList messages={props.messages} />}
</div>
```

### 2、 React 元素

React 元素是不可变对象，代表某个特定时刻的 UI。React 只更新它需要更新的部分

- `ReactDOM.render(<Clock />, document.getElementById("root"));`

## 🍎 组件及 Props、State

### 1、基本概念

|      组件       | Vue                                                                                                       | React                                                                            |
| :-------------: | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
|      定义       | 可复用的 Vue 实例                                                                                         | Props 作为参数返回 React 元素的 JavaScript 函数                                  |
|      命名       | 推荐使用 kebab-case                                                                                       | 必须以大写字母开头                                                               |
| VirtualDOM 挂载 | 实例 render 函数创建虚拟节点 VNode，如`render: h => h(App)`，el 选项或 vm.\$mount() 再将其挂载在 DOM 节点 | 函数 render 方法返回 React 元素，再由 ReactDOM 的 render 方法将其挂载到 DOM 节点 |

### 2、组件分类

#### 2.1 class 组件

- 定义：作为 React.Component 子类，通过 props 从父组件向子组件传递数据
- 状态维护：**state** 用于组件状态维护。在 React 组件的构造函数中设置 **this.state** 来初始化 state，其被视为一个**组件的私有属性**

  - 每次定义子类的构造函数时，都需要调用 **super** 方法。即 super(props) 开头
  - **每次在组件中调用 setState 时，React 都会自动更新其子组件**

- 状态提升：需共享 state 向上移动到最近共同父组件中的 state 中用作“数据源”，即“状态提升”。任何可变数据应当只有一个相对应的唯一“数据源”。

  - 受控组件：由 React 控制并且所有的表单数据统一存放的组件。响应数据改变时，子组件调用 this.props.onChange() 而非 this.setState()。
  - 不可变性：不直接修改原数据/底层数据以便跟踪数据的改变，确定在 React 中何时重新渲染

```javascript
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = "X";
    this.setState({ squares: squares });
  }
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
    );
  }
}
```

#### 2.2 函数组件

- 定义：不需定义一个继承于 React.Component 的类，可定义一个接收 props 作为参数的函数，然后返回需要渲染的元素
- 使用场景：只包含一个 render 方法，不包含 state

```javascript
//把两个 this.props 都替换成了 props,注意两侧括号不再有
function Square(props){
  render(){
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    )
  }
}
```

#### 2.3 组合及可复用组件

- 组合组件：组件可以在其输出中引用其他组件。可以用同一组件来抽象出任意层次的细节。通常每个新的 React 应用程序的顶层组件都是 App 组件
- 可复用组件： UI 中若有一部分被多次使用（Button，Panel，Avatar），或组件本身就足够复杂（App，FeedStory，Comment），则其可提取出作为可复用组件

### 3、Props 的只读性

组件无论是使用函数声明还是通过 class 声明，都决**不能修改自身的 props**。所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。

### 4、State

State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件

- **不要直接修改 State，应该拷贝一份再使用 setState()**
- **this.props 和 this.state 可能会异步更新，不要依赖他的值来更新下一个状态。可以让 setState() 接收一个函数而不是一个对象**
- State 的更新会被合并。调用 setState() 的时候，React 会把你提供的对象合并到当前的 state
- 如果某些数据可以由 props 或 state 推导得出，那么它就不应该存在于 state 中

```jsx
this.setState((state, props) => ({
  counter: state.counter + props.increment,
}));
```

## 🌮 条件渲染

### 1、与运算符

**true && expression 总返回 expression**，而 **false && expression 总返回 false**。

### 2、三目运算符

三目运算符`condition ? true : false`可以用于较为复杂的表达式。若条件变得过于复杂，应考虑如何提取组件

### 3、阻止组件渲染

需要隐藏组件，render 方法中直接返回 null，不影响组件的生命周期

## 💥 列表组件及 Key

map 方法把数组转化为元素列表。**在 map() 方法中的元素需要设置 key 属性**，以便识别哪些元素被改变。

```javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => (
    <li key={number.toString()}>{number}</li>
  ));
  return <ul>{listItems}</ul>;
}
const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

## 🎭 表单

React 中，表单状态通常保存在组件的 state 属性中，且只能通过 setState() 来更新

### 1、受控组件

state 作为“唯一数据源”。被 React **控制取值**的表单输入元素叫做“受控组件”。

```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };
  handleSubmit = (event) => {
    alert("提交的名字: " + this.state.value);
    event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

### 2、textarea 及 select 标签

React 使用 value 属性而非 selected 属性，可传入数组以支持多选。如`<select multiple={true} value={['B', 'C']}>`

```javascript
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "coconut" };
  }
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };
  handleSubmit = (event) => {
    alert("你喜欢的风味是: " + this.state.value);
    event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          选择你喜欢的风味:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="coconut">椰子</option>
            <option value="mango">芒果</option>
          </select>
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

### 3、文件 input 标签

`<input type=“file” />` 允许用户从存储设备中选择多个文件上传到服务器。非受控组件，value 只读

### 4、处理多个输入

每个元素添加 name 属性，根据 `event.target.name` 的值选择要执行的操作。完整解决方案可使用 Formik 库

```javascript
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2,
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <form>
        <label>
          参与:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange}
          />
        </label>

        <label>
          来宾人数:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange}
          />
        </label>
      </form>
    );
  }
}
```

## 😺 组合与继承

推荐使用组合而非继承来实现组件间的代码重用

### 1、包含关系

使用一个特殊的 children prop 来将子组件传递到渲染结果中预留位置。可不使用 children，自行约定，同“槽”slot

```javascript
function FancyBorder(props) {
  return (
    <div className={"FancyBorder FancyBorder-" + props.color}>
      {props.children}
    </div>
  );
}
```

### 2、特例关系

组件看作是其他组件的特殊实例。“特殊”组件可以通过 props 定制并渲染“一般”组件：

```javascript
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">{props.title}</h1>
      <p className="Dialog-message">{props.message}</p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { login: "" };
  }
  handleChange = (e) => {
    this.setState({ login: e.target.value });
  };
  handleSignUp = () => {
    alert(`Welcome aboard, ${this.state.login}!`);
  };

  render() {
    return (
      <Dialog
        title="Mars Exploration Program"
        message="How should we refer to you?"
      >
        <input value={this.state.login} onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>Sign Me Up!</button>
      </Dialog>
    );
  }
}
```

## 💫 React 哲学

### 1、将设计好的 UI 划分为组件层级

### 2、渲染 UI

创建一些可重用其他组件的组件，props 传入所需数据。**不使用 state 构建静态版本**。

### 3、添加交互

只保留应用所需的可变 state 的最小集合，其他数据均由它们计算产生

### 4、确定 state 放置的位置

### 5、添加反向数据流

## ☂ 其他

### 1、代码分割

#### 1.1 React.lazy

用于处理动态引入的组件。Suspense 组件可包裹多个 lazy 组件并置于之上任何位置，fallback 属性接受组件加载过程中任何可展示的 React 元素

```javascript
const OtherComponent = React.lazy(() => import("./OtherComponent"));
function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

#### 1.2 异常捕获边界（Error boundaries）

模块加载失败（如网络问题）可通过异常捕获边界（Error boundaries）技术来处理，以显示良好的用户体验并管理恢复事宜

```javascript
import MyErrorBoundary from "./MyErrorBoundary";
const OtherComponent = React.lazy(() => import("./OtherComponent"));
const AnotherComponent = React.lazy(() => import("./AnotherComponent"));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

#### 1.3 基于路由的代码分割

使用 React.lazy 和 React Router 这类的第三方库，来配置基于路由的代码分割

```javascript
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Suspense, lazy } from "react";

const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Suspense>
  </Router>
);
```

### 2、context

#### 2.1 何时使用 context

将数据向组件树下所有组件“广播”，共享组件树全局数据以便不同层级的组件访问。

```javascript
// 1、为当前的 theme 创建一个 context 对象（“light”为默认值）。
const ThemeContext = React.createContext("light");

class App extends React.Component {
  render() {
    // 2、使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // consumer 组件在其祖先组件退出更新的情况下也能更新
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 3、初始化 contextType 读取当前的 theme context。
  // this.context 来消费最近 Context 上的那个值
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

#### 2.2 在嵌套组件中更新 Context

- 可以通过 context 传递一个函数，使得 consumers 组件更新 context.
- provider 的父组件进行重渲染时，可能会在 consumers 组件中触发意外的渲染。因为 value 属性总是被赋值为新的对象。必须将 value 状态提升到父节点的 state

```javascript
// 确保传递给 createContext 的默认值数据结构是调用的组件所能匹配的！
const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});

function ThemeTogglerButton() {
  // Theme Toggler 不仅只获取 theme 值，也获取 toggleTheme 函数
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        <button
          onClick={toggleTheme}
          style={{ backgroundColor: theme.background }}
        >
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState((state) => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark,
      }));
    };
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    };
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
}

function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}

ReactDOM.render(<App />, document.root);
```

### 3、错误边界

错误边界作为组件，可捕获并打印发生在其子组件树任何位置的 JS 错误，且渲染出备用 UI。在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误。

- 当抛出错误后，使用 `static getDerivedStateFromError()` 渲染备用 UI ，使用 `componentDidCatch()` 打印错误信息
- **错误边界仅可以捕获其子组件的错误**，它无法捕获其自身的错误

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
//使用
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>;
```

### 4、Refs 及其转发

- Refs 提供一种方式，允许访问 DOM 节点或在 render 方法中创建的 React 元素
- Ref 转发是将 ref 自动地通过组件传递到其一子组件，常用于可重用的组件库

#### 4.1 使用 Refs

-

何时使用：管理焦点，文本选择或媒体播放；触发强制动画；集成第三方`DOM`库

-

创建 refs：**React.createRef()** 创建并通过 ref 属性附加到 React 元素

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
//构造组件时，通常将 Refs 分配给实例属性，以便在整个组件中引用它们
```

-

访问 refs：ref 被传递给 render 中的元素时，由`this.myRef.current`引用

- ref 属性用于 HTML 元素时，ref 接收底层 DOM 元素为其`current`属性
- ref 属性用于自定义 class 组件时，ref 接收组件挂载实例为其`current` 属性
- **不能在函数组件上使用 ref 属性，因为他们没有实例**
- 可以在函数组件内部使用 ref 属性，只要它指向 DOM 元素或 class 组件
-

回调 Refs：传递接受 React 组件实例或 HTML DOM 元素作为参数的函数。

```javascript
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return <CustomTextInput inputRef={(el) => (this.inputElement = el)} />;
  }
}
//Parent 中的 this.inputElement 会被设置为与 input 元素相对应的 DOM 节点
```

#### 4.2 转发 refs 到 DOM 组件

Ref 转发是可选特性，其允许某些组件接收 ref，并将其向下传递给子组件。FancyButton 使用 `React.forwardRef` 来获取传递给它的 ref，然后转发到它渲染的 DOM button

- 调用 React.createRef 创建一个 React ref 并将其赋值给 ref 变量。
- 指定 ref 为 JSX 属性，将其向下传递给 `<FancyButton ref={ref}>`。
- React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
- 向下转发该 ref 参数到 `<button ref={ref} />`，将其指定为 JSX 属性。
- ref 挂载完成，ref.current 将指向 `<button>` DOM 节点

```javascript
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

#### 4.3 在高阶组件中转发 refs

```javascript
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log("old props:", prevProps);
      console.log("new props:", this.props);
    }

    render() {
      const { forwardedRef, ...rest } = this.props;

      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // 注意 React.forwardRef 回调的第二个参数 “ref”。
  // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
  // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```

#### 4.4 DevTools 中显示自定义名称

React.forwardRef 接受一个渲染函数。React DevTools 使用该函数来决定为 ref 转发组件显示的内容

```javascript
const WrappedComponent = React.forwardRef((props, ref) => {
  return <LogProps {...props} forwardedRef={ref} />;
});
```

### 5、Fragments

React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。类似 Vue 中的 slot

- 短语法 `<> </>`也可声明 Fragments，但不支持 key 或属性
- 带 key 的 Fragments：key 是唯一可以传递给 Fragment 的属性

```javascript
function Glossary(props) {
  return (
    <dl>
      {props.items.map((item) => (
        // 没有`key`，React 会发出一个关键警告
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

### 6、高阶组件

高阶组件（HOC）是参数为组件，返回值为新组件的函数。编写一个创建组件函数。该函数将接受一个子组件作为它的其中一个参数，该子组件将订阅数据作为 prop。

- 被包装组件接收来自容器组件的所有 prop，同时也接收一个新的用于 render 的 data prop。HOC 不需要关心数据的使用方式或原因，而被包装组件也不需要关心数据是怎么来的
- 不要改变原始组件，使用组合。可以将 HOC 视为参数化容器组件
- HOC 应该透传与自身无关的 props
- 常见的 HOC 签名如下：`const ConnectedComment = connect(commentSelector, commentActions)(CommentList);`
- 不要在 render 方法中使用 HOC，务必复制静态方法，Refs 不会被传递

```javascript
function withSubscription(WrappedComponent, selectData) {
  // ...并返回另一个组件...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props),
      };
    }

    componentDidMount() {
      // ...负责订阅相关的操作...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props),
      });
    }

    render() {
      // ... 并使用新数据渲染被包装的组件!
      // 请注意，我们可能还会传递其他属性
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

### 7、Portals

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

`ReactDOM.createPortal(child, container)`

- 一个 portal 的典型用例是当父组件有 overflow: hidden 或 z-index 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框
- 当在使用 portal 时, 管理键盘焦点尤为重要

```javascript
render() {
  // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
  // `domNode` 是一个可以在任何位置的有效 DOM 节点。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

- 通过 Portal 进行事件冒泡：一个从 portal 内部触发的事件会一直冒泡至包含 React 树的祖先

### 8、Profiler

Profiler 测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”。 目的是识别出应用中渲染较慢的部分，或是可使用类似 memoization 优化的部分，从优化中获益。

- Profiler 能添加在 React 树中的任何地方来测量树中这部分渲染所带来的开销

```jsx
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

- onRender 回调：Profiler 需要一个 onRender 函数作为参数。 React 会在 profile 包含的组件树中任何组件 “提交” 一个更新的时候调用这个函数。

```jsx
function onRenderCallback(
  id,
  phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 合计或记录渲染时间
}
```

### 9、Render Props

具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑。

#### 9.1 使用 Render Props 来解决横切关注点（Cross-Cutting Concerns）

- 作用：分享一个组件封装到其他需要相同 state 组件的状态或行为
- 特点：render prop 是一个用于告知组件需要渲染什么内容的函数 prop。带有函数 prop 的 `<Mouse>` 组件，能动态决定什么需要渲染，而不是将 `<Cat>` 硬编码到 `<Mouse>` 组件里，并有效地改变它的渲染结果

```javascript
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img
        src="/cat.jpg"
        style={{ position: "absolute", left: mouse.x, top: mouse.y }}
      />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  }

  render() {
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>移动鼠标!</h1>
        <Mouse render={(mouse) => <Cat mouse={mouse} />} />
      </div>
    );
  }
}
```

- 可使用带有 render prop 的常规组件来实现大多数高阶组件 (HOC)

```javascript
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse
          render={(mouse) => <Component {...this.props} mouse={mouse} />}
        />
      );
    }
  };
}
```

#### 9.2 使用 Props 而非 render

- 任何被用于告知组件需要渲染什么内容的函数 prop 在技术上都可以被称为 “render prop”.

```jsx
<Mouse children={mouse => (
 <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
)}/>

<Mouse>
 {mouse => (
   <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
 )}
</Mouse>
```

- render prop 会抵消使用 React.PureComponent 带来的优势：可以定义一个 prop 作为实例方法

```javascript
class MouseTracker extends React.Component {
  // 定义为实例方法，`this.renderTheCat`始终
  // 当我们在渲染中使用它时，它指的是相同的函数
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

### 10、非受控组件

在一个受控组件中，表单数据是由 React 组件来管理的。使用非受控组件时表单数据将交由 DOM 节点来处理。

- 要编写一个非受控组件，而不是为每个状态更新都编写数据处理函数，你可以 使用 ref 来从 DOM 节点中获取表单数据
- 非受控组件将真实数据储存在 DOM 节点中，所以在使用非受控组件时，有时候反而更容易同时集成 React 和非 React 代码
- 默认值：非受控组件中赋予组件一个初始值，但是不去控制后续的更新。 可指定一个 defaultValue 属性，而不是 value。
- 文件输入：在 React 中，`<input type="file" />` 始终是一个非受控组件，因为它的值只能由用户设置，而不能通过代码控制

## 🎒 Hooks

### 1、Hooks 简介

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在 class 组件中使用。

- 特点：不编写 class 的情况下使用 state 以及其他的 React 特性
- 解决的问题

  - 优化组件间复用状态逻辑：无需修改组件结构的情况下复用状态逻辑
  - 更好理解复杂组件：将组件中相互关联的部分拆分成更小的函数，非强制按照生命周期划分。使用 reducer 来管理组件的内部状态，使其更加可预测
  - class 问题：非 class 的情况下可以使用更多的 React 特性，可渐进式地使用

### 2、Hooks 概览

#### 2.1 State Hook

- useState 就是一个 Hook。通过在函数组件里调用它来给组件添加一些内部 state。React 会在重复渲染时保留这个 state。
- useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。

```javascript
import React, { useState } from "react";

function Example() {
  // 1、声明 State 变量：
  //初始 state 作为 useState Hook参数，返回当前 state 及更新 state 的函数
  const [count, setCount] = useState(0);

  return (
    //2、读取 State：直接用 state 变量
    //3、更新 State：调用 setState(newState)，不需要 this
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

#### 2.2 Effect Hook

> React 组件中**执行数据获取、订阅或者手动修改 DOM，称为“副作用”**。useEffect 就是一个 Effect Hook，使函数组件操作副作用。与 class 组件中的 componentDidMount、componentDidUpdate、componentWillUnmount 相同

- React 在完成对 DOM 的更改后运行你的“副作用”函数。其可访问组件的 props 和 state。默认**React 会在每次渲染后调用副作用函数** —— 包括第一次渲染的时候
- 无需清除的 effect：如发送网络请求，手动变更 DOM，记录日志等

```javascript
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

- 需要清除的 effect：如订阅外部数据源，以防止引起内存泄露。

  - **effect 有可选的清除机制**。每个 effect 都可返回一个清除函数。将添加和移除订阅的逻辑放在一起。React 会在组件卸载时执行清除操作

```javascript
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  // 指定该作用后如何清除
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
});
```

#### 2.3 Hook 使用规则

- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 React 的函数组件、自定义的 Hook 中调用 Hook。不要在其他 JavaScript 函数中调用

#### 2.4 自定义 Hook

> 自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。用于共享组件之间的状态逻辑（另有高阶组件、render props）

- 自定义 Hook 是一种重用状态逻辑的机制(例如设置为订阅并存储当前值)，所以每次使用自定义 Hook 时，其中的所有 state 和副作用都是完全隔离的。
- Hook 的每次调用都有一个完全独立的 state

```javascript
import React, { useState, useEffect } from "react";
//1、提取自定义Hook
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
//2、使用自定义 Hook
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return "Loading...";
  }
  return isOnline ? "Online" : "Offline";
}

function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? "green" : "black" }}>{props.friend.name}</li>
  );
}
//3、多个 Hook 间传递信息
const friendList = [
  { id: 1, name: "Phoebe" },
  { id: 2, name: "Rachel" },
  { id: 3, name: "Ross" },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? "green" : "red"} />
      <select
        value={recipientID}
        onChange={(e) => setRecipientID(Number(e.target.value))}
      >
        {friendList.map((friend) => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```
