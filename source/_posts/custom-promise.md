---
title: 自定义Promise类：实现与使用详解
date: 2024-06-26 18:20:12
tag: [javascript,promise]
---

## 自定义Promise类：实现与使用详解

在前端开发中，Promise 是处理异步操作的重要工具。本文将带您深入了解如何自定义实现一个类 `MyPromise`，并在其中实现 `Promise` 的基本功能，包括状态管理、回调处理、链式调用等。同时，本文将结合具体案例，详细讲解 `Promise` 的核心概念和使用方法。

### Promise 的基本概念

在 JavaScript 中，`Promise` 是一种用于处理异步操作的对象。它表示一个异步操作的最终完成（或失败）及其结果值。`Promise` 可以处于以下三种状态之一：

- `Pending`：初始状态，既没有被解决，也没有被拒绝。
- `Fulfilled`：操作成功完成。
- `Rejected`：操作失败。

#### Promise 的基本用法

一个简单的 `Promise` 示例：

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功!');
  }, 1000);
});

promise.then((value) => {
  console.log(value); // 输出: 成功!
}).catch((error) => {
  console.error(error);
});
```

### 自定义Promise类实现

接下来，我们将一步步实现一个自定义的 `MyPromise` 类，涵盖状态管理、回调处理、链式调用等功能。

#### 状态管理

首先，我们定义一个枚举 `EPromiseStatus`，用于表示 `Promise` 的三种状态。

```typescript
enum EPromiseStatus {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected',
}
```

#### MyPromise类的基本结构

接下来，我们定义 `MyPromise` 类的基本结构，包括状态、值、回调函数列表等。

```typescript
type TResolveFunc<T> = (value?: any) => T;
type TRejectFunc<T> = (reason?: any) => T;

class MyPromise {
  private status: EPromiseStatus = EPromiseStatus.Pending;
  private value: any;
  private reason: any;
  private onFulfilledCallbacks: Array<Function> = [];
  private onRejectedCallbacks: Array<Function> = [];

  constructor(executor: (resolve: TResolveFunc<void>, reject: TRejectFunc<void>) => void) {
    const resolve = (value: any) => {
      if (this.status === EPromiseStatus.Pending) {
        this.status = EPromiseStatus.Fulfilled;
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason: any) => {
      if (this.status === EPromiseStatus.Pending) {
        this.status = EPromiseStatus.Rejected;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
}
```

#### then方法

`then` 方法用于注册成功和失败的回调函数。我们将在 `MyPromise` 中实现它：

```typescript
public then(onFulfilled?: TResolveFunc<any>, onRejected?: TRejectFunc<any>): MyPromise {
  return new MyPromise((resolve, reject) => {
    const handle = (
      action: typeof resolve | typeof reject,
      onHandler?: typeof onFulfilled | typeof onRejected,
    ) => {
      try {
        if (!onHandler) {
          action(this.status === EPromiseStatus.Fulfilled ? this.value : this.reason);
          return;
        }
        const result = onHandler(
          this.status === EPromiseStatus.Fulfilled ? this.value : this.reason,
        );
        if (result instanceof MyPromise) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    };

    if (this.status === EPromiseStatus.Fulfilled) {
      setTimeout(() => handle(resolve, onFulfilled), 0);
    } else if (this.status === EPromiseStatus.Rejected) {
      setTimeout(() => handle(reject, onRejected), 0);
    } else {
      this.onFulfilledCallbacks.push(() => handle(resolve, onFulfilled));
      this.onRejectedCallbacks.push(() => handle(reject, onRejected));
    }
  });
}
```

#### catch方法

`catch` 方法用于注册失败的回调函数：

```typescript
public catch(onRejected?: TRejectFunc<any>): MyPromise {
  return onRejected ? this.then(undefined, onRejected) : this;
}
```

#### finally方法

`finally` 方法用于注册一个最终执行的回调函数：

```typescript
public finally(onFinally?: () => void): MyPromise {
  return onFinally
    ? this.then(
        (value) => {
          onFinally();
          return value;
        },
        (reason) => {
          onFinally();
          throw reason;
        },
      )
    : this;
}
```

#### 静态方法

我们将实现几个常用的静态方法，包括 `resolve`、`reject`、`all`、`race` 和 `allSettled`。

##### resolve方法

`resolve` 方法用于创建一个已成功状态的 `MyPromise` 实例：

```typescript
static resolve(value?: any): MyPromise {
  return new MyPromise((resolve) => {
    resolve(value);
  });
}
```

##### reject方法

`reject` 方法用于创建一个已失败状态的 `MyPromise` 实例：

```typescript
static reject(reason?: any): MyPromise {
  return new MyPromise((_, reject) => {
    reject(reason);
  });
}
```

##### all方法

`all` 方法接收一个 `Promise` 数组，当所有 `Promise` 都成功时，返回一个包含所有成功值的数组：

```typescript
static all(promises: MyPromise[]): MyPromise {
  return new MyPromise((resolve, reject) => {
    const results: any[] = [];
    let count = 0;
    for (let i = 0, len = promises.length; i < len; i++) {
      const promise = promises[i];
      promise.then((value) => {
        results[i] = value;
        count++;
        if (count === promises.length) {
          resolve(results);
        }
      }, reject);
    }
  });
}
```

##### race方法

`race` 方法接收一个 `Promise` 数组，当任一 `Promise` 成功或失败时，返回结果或原因：

```typescript
static race(promises: MyPromise[]): MyPromise {
  return new MyPromise((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(resolve, reject);
    });
  });
}
```

##### allSettled方法

`allSettled` 方法接收一个 `Promise` 数组，并返回一个新的 `MyPromise`，该 `MyPromise` 在所有传入的 `Promise` 都解决（无论是成功还是失败）后解决：

```typescript
static allSettled(promises: MyPromise[]): MyPromise {
  return new MyPromise((resolve) => {
    const results: { status: EPromiseStatus; value: any }[] = [];
    let count = 0;

    for (let i = 0, len = promises.length; i < len; i++) {
      const promise = promises[i];

      promise
        .then(
          (value) => {
            results[i] = {
              status: EPromiseStatus.Fulfilled,
              value,
            };
          },
          (reason) => {
            results[i] = {
              status: EPromiseStatus.Rejected,
              value: reason,
            };
          },
        )
        .finally(() => {
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        });
    }
  });
}
```

#### 使用示例

接下来，通过一些具体的使用示例，展示 `MyPromise` 的功能和用法。

##### 基本使用

```typescript
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功!');
  }, 1000);
});

promise.then((value) => {
  console.log(value); // 输出: 成功!
}).catch((error) => {
  console.error(error);
});
```

##### 链式调用

```typescript
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('步骤 1 完成');
  }, 1000);
});

promise
  .then((value) => {
    console.log(value); // 输出: 步骤 1 完成
    return '步骤 2 完成';
  })
  .then((value) => {
    console.log(value); // 输出: 步骤 2 完成
  })
  .catch((error) => {
    console.error(error);
  });
```

##### 静态方法示例

```typescript
const promise1 = MyPromise.resolve('成功!');
const promise2 = MyPromise.reject('失败!');
const promise3 = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve('延迟成功!');
  }, 2000);
});

// all 方法
MyPromise.all([promise1, promise3])
  .then((values) => {
    console.log(values); // 输出: ['成功!', '延迟成功!']
  })
  .catch((error) => {
    console.error(error);
  });

// race 方法
MyPromise.race([promise1, promise3])
  .then((value) => {
    console.log(value); // 输出: '成功!'
  })
  .catch((error) => {
    console.error(error);
  });

// allSettled 方法
MyPromise.allSettled([promise1, promise2, promise3])
  .then((results) => {
    console.log(results);
    // 输出:
    // [
    //   { status: 'fulfilled', value: '成功!' },
    //   { status: 'rejected', value: '失败!' },
    //   { status: 'fulfilled', value: '延迟成功!' }
    // ]
  });
```

#### 总结

本文详细介绍了自定义 `Promise` 类 `MyPromise` 的实现，包括状态管理、回调处理、链式调用以及常用的静态方法。通过这些实现和使用示例，希望您对 `Promise` 的原理和用法有更深入的理解。自定义 `Promise` 是一个很好的练习，不仅可以加深对异步编程的理解，还能提升您的 JavaScript 编程能力。