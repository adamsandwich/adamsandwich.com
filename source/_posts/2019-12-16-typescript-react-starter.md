---
title: typescript react 起步
date: 2019-12-16 22:06:11
tags:
  - Typescript
  - React
---

# typescript react 起步

## 安装 create-react-app
用于创建新的 React 项目的脚手架
```sh
yarn global add create-react-app@3.2.0
```

## 新建项目
> 现在 create-react-app 原生支持 TypeScript
新建一个叫 `typescript-react` 的项目

```sh
create-react-app typescript-react --typescript
```

文件结构如下

```plaintext
typescript-react/
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   └── serviceWorker.ts
├── tsconfig.json
└── yarn.lock
```

`tsconfig.json` 包含 TypeScript 关于项目的专属配置
`package.json` 包含我们的依赖和测试、预览、部署应用的捷径
`public` 包含静态资源如需要部署的 HTML、图片
`src` 包含 TypeScript 和 CSS 源码
`index.tsx` 是我们文件的入口点

## 运行项目

```sh
yarn start
```

这会运行在 `package.json` 中定义的 start 脚本，会启动一个当我们保存文件的时候会重新加载页面的服务，通常服务会运行在 `http://localhost:3000`，并会自动打开这个页面

## 创建一个组件

我们将创建一个 Hello 组件。这个组件将会对 name 打招呼，同时可选择热情级别来控制感叹号的数量。

我们如下书写 `<Hello name="Adam" enthusiasmLevel={3} />`，这个组件会渲染如下示例 `<div>Hello Adam!!!</div>`。如果 enthusiasmLevel 未说明默认显示一个感叹号。如果 enthusiasmLevel 为零或负数应该抛出一个异常。

```tsx
// src/components/Hello.tsx

import * as React from 'react';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

function Hello({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(enthusiasmLevel)}
      </div>
    </div>
  );
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}
```

注意到我们定义了一个名为 `Props` 的接口，这将是我们的组件使用的属性。`name` 是必输的 `string` 类型，`enthusiasmLevel` 是一个可选的（通过名字后面的 `?` 区分） `number` 类型。
我们也写了一个无状态的函数组件 (SFC) `Hello`。具体来说，`Hello` 是一个接受 `Props` 对象的函数，它解构所有属性并传递。如果 `enthusiasmLevel` 不在给我们的 `Props` 对象里会被默认设置为 1。

使用函数是 React 允许我们制造组件的唯二方式。如果你希望可以使用类组件重写示例如下。

```tsx
class Hello extends React.Component<Props, object> {
  render() {
    const { name, enthusiasmLevel = 1 } = this.props;

    if (enthusiasmLevel <= 0) {
      throw new Error('You could be a little more enthusiastic. :D');
    }

    return (
      <div className="hello">
        <div className="greeting">
          Hello {name + getExclamationMarks(enthusiasmLevel)}
        </div>
      </div>
    );
  }
}
```

当我们的组件实例有状态或者需要处理生命周期的时候类是非常有用的。但是在这个例子中我们不需要考虑状态 - 事实上我们将它定义为 `object` 在 `React.Component<Props, object>`，所以在这里使用 SFC 更科学，但是了解如何写类组件也很重要。

注意到 `class extends React.Component<Props, object>`，这块 TypeScript 代码是我们传递给 `React.Component` 的类型参数：`Props` and `object`。`Props` 是我们类中 `this.props` 的类型，`object` 是 `this.state` 的类型，然后我们回到组件状态。

现在我们已经完成组件，让我们进入 `index.tsx` 然后用 `<Hello ... />` 替换 `<App />` 中的渲染。

```tsx
import Hello from './components/Hello';

ReactDOM.render(
  <Hello name="TypeScript" enthusiasmLevel={10} />,
  document.getElementById('root') as HTMLElement
);
```

## Type assertions

在这一节需要指出 `document.getElementById('root') as HTMLElement`，这个语法叫做类型断言 (type assertion)。这是一个非常有用的方式告诉 TypeScript 的类型检查器真正的类型是什么的表达式。

这里这样做的原因是在此例中 `getElementById` 的返回类型是 `HTMLElement | null`。简单来说 `getElementById` 返回 `null` 当它找不到给定 `id` 的元素。 我们假设 `getElementById` 会成功，所以我们需要说服 TypeScript 通过使用 `as` 语法。

TypeScript 也有一个尾语法 `!`，会移除前面表达式的 `null` 和 `undefined`。 所以我们可以使用 `document.getElementById('root')!`，但是在这个例子中我们希望显示表达。

## Stateful components

之前我们提到过这里的组件不需要状态。如果我们想要基于用户的交互更新我们的组件那么状态会是重要的。

深入理解和实践 React 组件状态超出了这篇起步的范围，但是我们可以简单看下有状态组件的示例。我们将渲染两个 `<button>` 来更新 `Hello` 组件显示的感叹号。
为此我们将需要：
1. 为状态定义一个类型 (this.state)
2. 初始化 `this.state` 基于我们在构造函数的赋值
3. 为我们的按钮创建两个事件处理器 (`onIncrement` 和 `onDecrement`)。

```tsx
// src/components/StatefulHello.tsx

import * as React from "react";

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

interface State {
  currentEnthusiasm: number;
}

class Hello extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { currentEnthusiasm: props.enthusiasmLevel || 1 };
  }

  onIncrement = () => this.updateEnthusiasm(this.state.currentEnthusiasm + 1);
  onDecrement = () => this.updateEnthusiasm(this.state.currentEnthusiasm - 1);

  render() {
    const { name } = this.props;

    if (this.state.currentEnthusiasm <= 0) {
      throw new Error('You could be a little more enthusiastic. :D');
    }

    return (
      <div className="hello">
        <div className="greeting">
          Hello {name + getExclamationMarks(this.state.currentEnthusiasm)}
        </div>
        <button onClick={this.onDecrement}>-</button>
        <button onClick={this.onIncrement}>+</button>
      </div>
    );
  }

  updateEnthusiasm(currentEnthusiasm: number) {
    this.setState({ currentEnthusiasm });
  }
}

export default Hello;

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}
```

注意：
1. 和 `Props`一样我们需要为我们的的状态定义一种新的类型：`State`
2. 为了在 React 中更新状态，我们使用 `this.setState` - 我们不会在构造函数中直接设置它。`setState` 只会在你对更新组件有想法时在适当的时机重新渲染
3. 我们使用箭头函数作为类属性的初始化 (e.g. `onIncrement = () => ...`)
- 使用箭头函数定义能避免一些 `this` 的不当使用
- 设置它们作为实例属性只需要创建一次 - 一个常见的错误是在渲染方法中初始化它们这样会在每次渲染的时候制造闭包从而引发内存泄漏

之后的章节我们不会再使用有状态的组件。有状态的组件对于创建那些专注于表现内容的组件很好（而不是处理核心应用状态）。在有些情况下会被用来处理整个应用的状态，通过一个中心组件传递可以在合适时机调用 `setState`，对于一个大型应用，一个独立的状态管理是更为合适的。

## Adding style 😎

在我们的配置中给组件使用样式很容易。为了在 `Hello` 组件中使用样式，我们在 `src/components/Hello.css` 创建一个 CSS 文件。

```css
.hello {
  text-align: center;
  margin: 20px;
  font-size: 48px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hello button {
  margin-left: 25px;
  margin-right: 25px;
  font-size: 40px;
  min-width: 50px;
}
```

create-react-app 使用的工具 (Webpack 和各种 loader) 允许我们导入我们需要的样式表。当构建的时候，任何导入的 .css 文件都会被串联到输出文件。所以我们在 `src/components/Hello.tsx` 添加如下导入。

```tsx
import './Hello.css';
```

## Writing tests with Jest

我们关于 Hello 组件有一组确定的假设，下面重申一遍：
> - 当我们如下使用 `<Hello name="Daniel" enthusiasmLevel={3} />`, 组件应该渲染如下 `<div>Hello Daniel!!!</div>`
> - 如果 enthusiasmLevel 没有指定，组件应该默认显示一个感叹号
> - 如果 enthusiasmLevel 是零或者负数，应该抛出异常

我们可以针对这些需求为我们的组件写些测试

首先我们安装 [Enzyme](http://airbnb.io/enzyme/)，它是一个在 React 生态中常用的工具用来让我们编写测试更加容易。

我们的应用默认会包含一个库叫 jsdom 允许我们模拟 DOM 并且不用浏览器就测试它的运行时表现。
Enzyme 很相似，它基于 jsdom 但是让它更容易为组件做某些查询。

让我们安装它的开发环境依赖。

```sh
yarn add -D enzyme @types/enzyme enzyme-adapter-react-16 @types/enzyme-adapter-react-16 react-test-renderer
```

注意到我们安装了 `enzyme` 也安装了 `@types/enzyme`。
`enzyme` 包含有实际运行的 Javascript 代码， 而 `@types/enzyme` 是一个包含定义文件 (`.d.ts`) 让 TypeScript 能理解你如何使用 Enzyme
我们可以[在这](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)学习更多有关 `@types` 的知识。

我们还需要安装 `enzyme-adapter-react-16 and react-test-renderer`。这是 `enzyme` 指名需要安装的。

在编写测试之前我们还需要配置 Enzyme 来适配 React 16。我们创建一个叫 `src/setupTests.ts` 的文件，在运行测试的时候它将被自动加载。

```tsx
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });
```

现在我们将 Enzyme 设置完毕，让我们开始编写测试！
让我们创建一个叫 `src/components/Hello.test.tsx` 的文件，毗邻之前创建的 `Hello.tsx` 。

```tsx
// src/components/Hello.test.tsx

import * as React from 'react';
import * as enzyme from 'enzyme';
import Hello from './Hello';

it('renders the correct text when no enthusiasm level is given', () => {
  const hello = enzyme.shallow(<Hello name='Adam' />);
  expect(hello.find(".greeting").text()).toEqual('Hello Adam!')
});

it('renders the correct text with an explicit enthusiasm of 1', () => {
  const hello = enzyme.shallow(<Hello name='Adam' enthusiasmLevel={1}/>);
  expect(hello.find(".greeting").text()).toEqual('Hello Adam!')
});

it('renders the correct text with an explicit enthusiasm level of 5', () => {
  const hello = enzyme.shallow(<Hello name='Adam' enthusiasmLevel={5} />);
  expect(hello.find(".greeting").text()).toEqual('Hello Adam!!!!!');
});

it('throws when the enthusiasm level is 0', () => {
  expect(() => {
    enzyme.shallow(<Hello name='Adam' enthusiasmLevel={0} />);
  }).toThrow();
});

it('throws when the enthusiasm level is negative', () => {
  expect(() => {
    enzyme.shallow(<Hello name='Adam' enthusiasmLevel={-1} />);
  }).toThrow();
});
```

上述测试非常基础但你应该能理解要点了。

## 添加状态管理

如果此时你只用 React 获取数据并展示，你可以独立完成你的需求。但是如果你希望开发的应用有更多互动，你可能需要添加一个状态管理。

### 状态管理简述

就 React 自己而言是一个有帮助创建组件化视图的库。然而 React 未规定任何具体的方式来在你的应用同步数据。就 React 组件而言，数据通过你在每个元素上指定的 props 在 后代中流动。其中一些 props 可能是更新状态的函数，也可以是其他情况，这是一个开放的问题。
因为 React 只关注自己而不是应用状态管理， React 社区使用像 Redux 和 MobX 这样的库。

[Redux](http://redux.js.org) 通过中心化和不可变数据存储来同步数据， 而数据的更新会触发应用的重新渲染。状态以不可变的方式更新，发送显式的操作消息，这些消息必须由称为 reducers 的函数处理。因为它是显性的，这样更容易解释 action 是怎么影响应用的状态的。

[MobX](https://mobx.js.org/) 依赖于函数性响应式，其中状态通过可观察对象包装并作为 props 传递。通过简单地将状态标记为可观察状态，就可以为任何观察者保持状态完全同步。作为一个很好的加分项，这个库已经用 TypeScript 重写了。

两者都有许多优点和缺点。通常情况下，Redux 会得到更广泛的应用，因此，出于本教程的目的，我们将着重于 Redux，然而你应该去探索两者。

下面的两部分可能含有陡峭的学习曲线。我们强烈推荐你通过 [Redux 官方文档](http://redux.js.org/)来熟悉它。

### 为 action 创造条件

除非我们应用的状态改变否则添加 Redux 是没有意义的。我们需要一个能触发 actions 变化的来源。这可以是一个计时器或者 UI 中的某些东西如按钮。
对于我们的目的而言，我们将添加两个按钮用来控制 `Hello` 组件中的 enthusiasm 级别。

### 安装 Redux

为了添加 Redux 我们首先安装 `redux` 和 `react-redux` 同时还有他们的 types 作为依赖。

```sh
yarn add redux react-redux @types/react-redux
```

在这个案例中我们没有安装 `@types/redux` 因为 Redux 已经包含了它的定义文件 (`.d.ts` files)

### 定义我们 app 的状态

我们需要定义 Redux 存储状态的模型。为此我们创建一个叫 `src/types/index.tsx` 的文件，它将包含我们在应用中用到的类型定义。

```tsx
// src/types/index.tsx

export interface StoreState {
    languageName: string;
    enthusiasmLevel: number;
}
```

我们的意图是 `languageName` 将会是我们编写程序的语言 (i.e. TypeScript or JavaScript)，`enthusiasmLevel` 将会改变。
当我们编写第一个 container 时，我们将理解为什么我们故意使我们的 state 与我们的 props 略有不同。

### 添加 action

让我们开始创建一组消息类型，让应用程序可以响应 `src/constants/index.tsx` 。

```tsx
// src/constants/index.tsx

export const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
export type INCREMENT_ENTHUSIASM = typeof INCREMENT_ENTHUSIASM;


export const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';
export type DECREMENT_ENTHUSIASM = typeof DECREMENT_ENTHUSIASM;
```

`const`/`type` 模式允许我们使用 TypeScript 的 string 字面类型使其更易访问和可重构。
接下来我们将创建一组 action 和 function 可以在 `src/actions/index.tsx` 中创建 action。

```tsx
import * as constants from '../constants';

export interface IncrementEnthusiasm {
    type: constants.INCREMENT_ENTHUSIASM;
}

export interface DecrementEnthusiasm {
    type: constants.DECREMENT_ENTHUSIASM;
}

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;

export function incrementEnthusiasm(): IncrementEnthusiasm {
    return {
        type: constants.INCREMENT_ENTHUSIASM
    }
}

export function decrementEnthusiasm(): DecrementEnthusiasm {
    return {
        type: constants.DECREMENT_ENTHUSIASM
    }
}
```

我们已经创建两种 type 用来描述增加和减少的 action。我们也创建了一个 (`EnthusiasmAction`) type 用来描述 action 可能是增加或减少。最后我们创建了两个 实际上制造 action 的函数而不是写出庞大对象字面意。

很明显这里有一些示例文件，所以一旦掌握了其中的窍门，您可以随意查看 [redux-actions](https://www.npmjs.com/package/redux-actions) 之类的库。

### 添加一个 reducer

Reducer 只是通过创建应用状态变化的副本的函数，但是没有*副作用*。
换句话说，它们就是*[纯函数](https://en.wikipedia.org/wiki/Pure_function)*

我们的 reducer 将放在 `src/reducers/index.tsx` 目录下。它的作用是确保增加使 enthusiasm 等级提高 1 ，减少使 enthusiasm 等级降低 1， 但该等级永远不低于 1 。

```tsx
// src/reducers/index.tsx

import { EnthusiasmAction } from '../actions';
import { StoreState } from '../types/index';
import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../constants/index';

export function enthusiasm(state: StoreState, action: EnthusiasmAction): StoreState {
  switch (action.type) {
    case INCREMENT_ENTHUSIASM:
      return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
    case DECREMENT_ENTHUSIASM:
      return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
  }
  return state;
}
```

注意到我们使用了*扩展运算符* (`...state`) 它允许我们创建一个状态的浅拷贝，同时替代 `enthusiasmLevel` 。把 `enthusiasmLevel` 放在最后是很重要的，否则它将会被旧 state 中的属性覆盖。

你可能想要为 reducer 添加一些测试。由于 reducers 是纯函数，所以可以传递任意数据。对于每个输入，可以通过检查它们新产生的 state 来测试它们。
考虑看下 Jest 的 [toEqual](https://facebook.github.io/jest/docs/expect.html#toequalvalue) 方法来完成。

## 创建一个 container

在使用 Redux 的时候，我们通常会编写组件和 container 。
组件通常是数据无关的，以直觉层级工作。
*container*包装组件为它们提供需要展示和变更的状态。

首先我们更新 `src/components/Hello.tsx` 让它可以改变状态。
我们将添加两个可选的回调属性给 `Props` 分别叫 `onIncrement` 和 `onDecrement`

```tsx
export interface Props {
  name: string;
  enthusiasmLevel?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}
```

接下来我们在组件中为这些回调绑定两个按钮。

```tsx
function Hello({ name, enthusiasmLevel = 1, onIncrement, onDecrement }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(enthusiasmLevel)}
      </div>
      <div>
        <button onClick={onDecrement}>-</button>
        <button onClick={onIncrement}>+</button>
      </div>
    </div>
  );
}
```

通常来说，为 `onIncrement` 和 `onDecrement` 编写一些测试是一个好主意，当它们各自的按钮被点击时触发。尝试一下为组件编写测试。

现在我们的组件已经更新了，我们准备用 container 包装它。我们创建一个叫 `src/containers/Hello.tsx` 的文件伴随一些导入。

```tsx
import Hello from '../components/Hello';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';
```

这里真正的两个关键部分是原始的 `Hello` 组件和来自 Redux 的 `connect` 函数。
`connect` 将能够实际使用我们原来的 `Hello` 组件，并将其转换成一个使用两个函数的 container:
* `mapStateToProps` 将当前存储的数据转换为组件所需的部分模型。
* `mapDispatchToProps` 它创建回调 props ，使用给定的 `dispatch` 函数将动作注入我们的 store 。

如果我们回想一下，我们的应用程序状态包含两个属性: `languageName` 和 `enthusiasmLevel`
我们的 `Hello` 组件, 另一方面期待一个 `name` 和一个 `enthusiasmLevel`
`mapStateToProps` 将从 store 中获取相关数据，并在必要时对组件的 props 进行调整。

```tsx
export function mapStateToProps({ enthusiasmLevel, languageName }: StoreState) {
  return {
    enthusiasmLevel,
    name: languageName,
  }
}
```

注意 `mapStateToProps` 只创建 `Hello` 组件所期望的 4 个属性中的 2 个。也就是说我们任然期待传递 `onIncrement` 和 `onDecrement` 两个回调。
`mapDispatchToProps` 是一个接受 dispatcher 函数的函数。这个 dispatcher 函能传递 action 到我们的 store 中来制造更新，所以我们可以创建一对回调根据需要调用。

```tsx
export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
  return {
    onIncrement: () => dispatch(actions.incrementEnthusiasm()),
    onDecrement: () => dispatch(actions.decrementEnthusiasm()),
  }
}
```

最后我们准备调用 `connect` 。`connect` 首先接受 `mapStateToProps` 和 `mapDispatchToProps` ，然后然会返回另一个可以包装组件函数。最终我们的 container 定义如下：

```tsx
export default connect(mapStateToProps, mapDispatchToProps)(Hello);
```

当我们完成时，文件看起来如下：

```tsx
// src/containers/Hello.tsx

import Hello from '../components/Hello';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ enthusiasmLevel, languageName }: StoreState) {
  return {
    enthusiasmLevel,
    name: languageName,
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
  return {
    onIncrement: () => dispatch(actions.incrementEnthusiasm()),
    onDecrement: () => dispatch(actions.decrementEnthusiasm()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hello);
```

## 创建一个 store

回到 `src/index.tsx`，为了把它们放在一起我们需要创建一个 store 包含初始的 state，还要设置好所有的 reducer。

```tsx
import { createStore } from 'redux';
import { enthusiasm } from './reducers/index';
import { StoreState } from './types/index';

const store = createStore<StoreState>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
});
```

您可能已经猜到，`store`是应用程序全局状态的中心存储。
接下来我们将用 `./src/containers/Hello` 替换 `./src/components/Hello` ，同时使用 react-redux 的 `Provider` 来将 container 中的 props 串起来。

```tsx
import Hello from './containers/Hello';
import { Provider } from 'react-redux';
```

然后通过 `Provider` 的属性传递 `store`

```tsx
ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
```

注意到 `Hello` 不再需要 props ， 自从我们使用了 `connect` 函数为包装的 `Hello` 的 component 的 props 适配我们应用状态。

## Ejecting

如果在任何时候，你觉得 create-react-app 设置使某些定制变得困难，那么总是可以选择 eject 并获得所需的各种配置选项。
例如，如果您想添加 Webpack 插件，可能需要利用 create-react-app 提供的 eject 功能。

```sh
yarn run eject
```

eject 命令是无法撤回的，所以在 eject 之前 commit 一下是个好主意。

## 下一步

如果你像了解更多关于 Redux ，可以访问 [Redux 官方文档](http://redux.js.org/)，同样 MobX 是 [MobX 官方文档](https://mobx.js.org/)
在某些情况下，可能需要路由。有几种解决方案，但  [react-router](https://github.com/ReactTraining/react-router) 可能对于 Redux 项目是最受欢迎的，同时还需要 [react-router-redux](https://github.com/reactjs/react-router-redux) 来连接它们。
