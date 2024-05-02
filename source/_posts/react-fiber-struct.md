---
title: 浅入解析 React Fiber 结构
date: 2024-04-24 10:52:26
tag: [react]
---

### 浅入解析 React Fiber 结构

React Fiber 是 React 中用于表示组件树的一种数据结构，它的设计和实现是 React 中的一项重要内容。本文将深入探讨 React Fiber 的结构，包括其所有属性及其含义，并对属性中的对象类型进行详细说明和解释。通过阅读本文，读者将更好地理解 React Fiber 的内部机制。

### React@18+ Fiber 结构概述

在 React 中，每个组件都对应一个 Fiber 对象，用于表示组件树中的一个节点。以下是 Fiber 对象的结构定义：

```typescript
type Fiber = {
  tag: WorkTag,
  key: null | string,
  elementType: string | FunctionComponent | ClassComponent | HostComponent | SuspenseComponent | ...,
  type: string | FunctionComponent | ClassComponent | HostComponent | SuspenseComponent | ...,
  stateNode: HTMLElement | Component | null,
  return: Fiber | null,
  child: Fiber | null,
  sibling: Fiber | null,
  index: number,
  ref: RefObject | null,
  pendingProps: any,
  memoizedProps: any,
  updateQueue: UpdateQueue<any> | null,
  memoizedState: Hook | StateObject | null,
  dependencies: Dependencies | null,
  mode: TypeOfMode,
  effectTag: SideEffectTag,
  nextEffect: Fiber | null,
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,
  lanes: Lanes,
  childLanes: Lanes,
  alternate: Fiber | null,
  // ...
};
```

根据提供的 Fiber 类型定义，下面是完整的 Fiber 节点的属性列表：

1. **tag**：
   - 标识 Fiber 节点的类型，如 `HostComponent`、`ClassComponent`、`FunctionComponent` 等。

2. **key**：
   - 用于在DOM更新期间识别节点。可以是字符串类型或 null。

3. **elementType**：
   - 元素类型，通常是 `React.createElement()` 中传递的类型，用于保持节点的身份。

4. **type**：
   - 节点的具体类型，与 elementType 相似，但对于 ClassComponent 等需要再次处理。

5. **stateNode**：
   - 与此 Fiber 节点关联的实际 DOM 节点、组件实例或其他实体。

6. **return**：
   - 指向此节点的父节点。

7. **child**：
   - 指向此节点的第一个子节点。

8. **sibling**：
   - 指向此节点的下一个兄弟节点。

9. **index**：
   - 表示节点在兄弟节点中的位置索引。

10. **ref**：
    - 表示与此节点关联的 ref，可以是函数、字符串或 RefObject 对象。

11. **refCleanup**：
    - 用于清理 ref 的函数。

12. **pendingProps**：
    - 待处理的属性，即将应用于此节点的属性。

13. **memoizedProps**：
    - 表示此节点最近一次渲染时应用的属性。

14. **updateQueue**：
    - 包含了所有待处理的更新操作。

15. **memoizedState**：
    - 上一次渲染时的状态。如果组件使用了 Hooks，那么 memoizedState 就应该是一个链表结构，每个节点表示一个 Hook 的状态值。如果组件是类组件，则 memoizedState 应该是该组件在上一次渲染时的状态对象。

16. **dependencies**：
    - 表示此节点更新所依赖的上下文、Props、State等信息。

17. **mode**：
    - 表示当前渲染模式，如并发模式。

18. **flags**：
    - 描述 Fiber 节点和其子树的一些属性的位标志，用于标记节点需要执行的操作。

19. **subtreeFlags**：
    - 描述 Fiber 子树的属性的位标志，用于标记节点需要执行的操作。

20. **deletions**：
    - 用于存储要删除的 Fiber 节点。

21. **lanes**：
    - 表示此节点的调度优先级。

22. **childLanes**：
    - 表示此节点子树中的调度优先级。

23. **alternate**：
    - 指向上一次渲染时与当前 Fiber 节点对应的 Fiber 节点。

24. **actualDuration**：
    - 当前渲染阶段的实际持续时间，用于性能分析。

25. **actualStartTime**：
    - 当前渲染阶段的开始时间，用于性能分析。

26. **selfBaseDuration**：
    - 最近一次渲染阶段的持续时间，不包括子节点。

27. **treeBaseDuration**：
    - 所有子节点渲染阶段持续时间的总和。

28. **_debugInfo**：
    - 用于调试的附加信息。

29. **_debugOwner**：
    - 指向此节点的拥有者。

30. **_debugIsCurrentlyTiming**：
    - 标志位，指示当前是否正在记录渲染时间。

31. **_debugNeedsRemount**：
    - 标志位，指示是否需要重新挂载组件。

32. **_debugHookTypes**：
    - 用于调试的 hook 类型信息。

这些属性组成了 Fiber 节点的完整表示，用于 React 内部的渲染和更新过程。

### 属性详解

#### tag

tag 属性表示 Fiber 节点的类型，其值可以是以下几种之一：

- **HostRoot:** 表示根节点。
- **FunctionComponent:** 表示函数组件。
- **ClassComponent:** 表示类组件。
- **HostComponent:** 表示 DOM 元素。
- **ContextProvider:** 表示 Context 提供者。
- **ContextConsumer:** 表示 Context 消费者。
- **SuspenseComponent:** 表示 Suspense 组件。
- **DehydratedFragment:** 表示脱水片段。

#### memoizedState

memoizedState 属性表示组件在上一次渲染时的状态，其类型根据组件的具体情况而定。如果组件使用了 Hooks，那么 memoizedState 就应该是一个链表结构，每个节点表示一个 Hook 的状态值。如果组件是类组件，则 memoizedState 应该是该组件在上一次渲染时的状态对象。memoizedState 具体的属性如下所示

- **memoizedState:** 组件的记忆状态，即上次渲染时的状态。
- **next:** 指向下一个 hook 节点的指针。

#### flags

flags 属性用于标记节点需要执行的操作，其值是一个位掩码，描述 Fiber 节点的不同状态和行为，并在调度和渲染过程中起着重要作用，包含以下几种标记：

这里有一些重要的标志位和常量的含义：

- **NoFlags:** 用于表示没有任何状态或行为。
- **Update:** 表示组件需要更新。
- **Placement:** 表示组件需要被放置到 DOM 树中。
- **ChildDeletion:** 表示组件的子节点被删除。
- **Callback:** 表示需要执行回调函数。
- **Visibility:** 表示组件的可见性发生变化。
- **Ref:** 表示组件的引用发生变化。
- **Snapshot:** 表示需要获取组件的快照。
- **Passive:** 表示组件处于被动模式。
- **StoreConsistency:** 表示需要保持状态的一致性。

> 以前使用 `effectTag` 属性来表示副作用。

### 源码解析

React Fiber 的源码位于 React 源码库中的 `react-reconciler` 模块。读者可以在该模块中找到 Fiber 结构的定义以及相关的操作和算法实现。

### 总结

本文浅入解析了 React Fiber 结构，介绍了其所有属性及其含义，并对对象类型的属性进行了进一步说明和解释。通过深入理解 Fiber 结构，可以更好地理解 React 内部的工作原理，并能够更加高效地使用 React 进行开发。
