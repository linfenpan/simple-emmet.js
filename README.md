# 仿emmet语法的脚本生成工具类

简单模仿了 emmet 的一些语法，编写的一个简单工具脚本。

并没有完全实现所有 emmet 的功能，只实现了关于 dom 生成的部分。

把 字符串，转为有意义的 html 代码

----------

# 用法

``` javascript
    // 把 #parent > .child 编译为对象树， root 为该树的根节点
    var root = str2Html.compile('#parent > .child');
    console.log(root.toHtml()); // ==> <div id="parent"><div class="child"></div></div>
```

----------

# 支持语法

除了在“设置属性”外，其余情况，空格是不会带来其它影响的。即 **".item.item1" === ".item .item1"**

一、设置元素id

``` javascript
    str2Html.compile("#parent").toHtml(); // ==> <div id="parent"></div>
```
默认生成 div 元素

二、指定元素 tagName

``` javascript
    str2Html.compile("span#parent").toHtml(); // ==> <span id="parent"></span>
```
可在设置属性前，指定使用的标签，这里生成后，使用了 span 标签

三、设置元素 class

``` javascript
    str2Html.compile(".item.item1").toHtml(); // ==> <div class="item item1"></div>
```

四、设置属性

``` javascript
    str2Html.compile(".item[name=da宗熊 age=26]").toHtml(); // ==> <div class="item" name="da宗熊" age="26"></div>
```
属性内，空格是间隔符，如果属性中，有空格，可把属性，用单、双引号括起来，如这样: [name='我叫 xxx yyy']

五、设置内容

``` javascript
    str2Html.compile(".item{一段文字}").toHtml(); // ==> <div class="item">一段文字</div>
```
内容中，"}"是结束符

六、数量

``` javascript
    str2Html.compile("(.item1 + .item2) * 3").toHtml(); // ==> <div class="item1"></div><div class="item2"></div><div class="item1"></div><div class="item2"></div><div class="item1"></div><div class="item2"></div>
```

七、数量语法糖

``` javascript
    str2Html.compile(".item$*2").toHtml(); // ==> <div class="item1"></div><div class="item2"></div>
    str2Html.compile(".item$$*2").toHtml(); // ==>  <div class="item01"></div><div class="item02"></div>
```


八、上一层元素

``` javascript
    str2Html.compile("#parent1 > .item1 ^ #parent2").toHtml(); // ==> <div id="parent1"><div class="item1"></div></div><div id="parent2"></div>
```

----------

# 全局配置

一、设置默认生成标签

``` javascript
    str2Html.setDefault({tagName: "span"}); // 默认标签为 span
```

二、循环生成配置

``` javascript
    str2Html.setDefault({repeat: {attr: true, cls: true, id: true, text: true, tag: /\$+/g}});
    // 循环生成是，默认修正 $ 符号
    // attr: 是否修正属性的 $ 符号
    // cls:  是否修正 class 的 $ 符号
    // id:   是否修正 id 的 $ 符号
    // text: 是否修正 内容 的 $ 符号
    // tag:  修正符号的正则表达式，如 /%+/g，则修正符号，从 $ --> %，使用变为如下:
    //          #root$ --> <div id="root$"></div>
    //          #root% --> <div id="root1"></div>
```
