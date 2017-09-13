title: Javascript语法糖
date: 2015-12-24 19:18:13
tags: [javascript]
author: hank.liu
---

## 1.Array.prototype.slice
数组的slice()方法通常用来从一个数组中抽取片断。但很多开发者不了解的是，这个方法还可以用来将“类数组”元素（比如 arguments、参数列表、节点列表和属性列表）转换成真正的数组：（译注：DOM 元素的属性列表通过 attributes属性获取), Array.prototype.slice.call(arguments)能将具有length属性的对象转成数组.

``` js
var a={length:2,0:'first',1:'second'};
Array.prototype.slice.call(a);//  ["first", "second"]

var a={length:2};
Array.prototype.slice.call(a);//  [undefined, undefined]

var argsArr = Array.prototype.slice.call(arguments);
```

## 2.使用push来合并数组
我们知道当我们想要合并两个数组时一般使用Array的concat()方法来试试，concat方法能够将两个及两个以上的数组合并成一个数组，同时我们也可以使用Array prototype 的push方法来实现两个数组的合并.

``` js
var a = ['hank', 'mark']

var b = ['hulk']

Array.prototype.push.apply(a, b)

console.log(a) // ['hank', 'mark', 'hulk']
```

## 3.Js数据去掉小数点后边的0
在一起，我一般是使用正则表达式来替换，先判断小数点后面有无0和0的位置，然后在使用正则来替换这些0。今天突然发现一个很神奇的方法: parseFloat()

``` js
var a = 1.0;
a = parseFloat(a) // 1
```

是不是特别简单?

## 4.JS浮点数运算精度
在Javascript中两个浮点数进行运算是得到的结果可能不是我们想要的结果，比如:

``` js
var a, b;
a = 0.2;
b = 0.1;

c = a + b // 0.30000000000000004, 不是我们想要的0.3
```

主要是因为计算机是二进制浮点运算，而我们输入的是十进制浮点数，十进制数转化为二进制运算过后再转化回来，在转化过程中可能会有损失.

解决办法，先装换成整数，运算过后，再装换回来:

``` js
const T_NUMBER = 'number';
// 两数相减，其他运算同理
customSubtract = function(minuend, subtrahend) {
    var maxDecimalDigits, minuendDecimalDigits, minuendStr, result, subtrahendDecimalDigits, subtrahendStr;
    minuendStr = typeof minuend === T_NUMBER ? minuend + '' : minuend;
    subtrahendStr = typeof subtrahend === T_NUMBER ? subtrahend + '' : subtrahend;
    minuendDecimalDigits = minuendStr.indexOf('.') === -1 ? 0 : minuendStr.length - minuendStr.indexOf('.') - 1;
    subtrahendDecimalDigits = subtrahendStr.indexOf('.') === -1 ? 0 : subtrahendStr.length - subtrahendStr.indexOf('.') - 1;
    maxDecimalDigits = Math.pow(10, Math.max(minuendDecimalDigits, subtrahendDecimalDigits));
    result = (minuend * maxDecimalDigits - subtrahend * maxDecimalDigits) / maxDecimalDigits;
    return result;
};
```

## 5. Is object empty?

Check an object is empty or not?

Jquery has a function to check the object: ** jQuery.isEmptyObject **
``` jquery
if ($.isEmptyObject(obj)) {
  // do something
}
```
It's easy and cross-browser function.

``` js
var isEmptyObject = function(obj) {
  for(var key in obj){
    return false; // not empty
  }

  return true; // empty
}
```

