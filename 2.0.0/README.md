# 仿emmet的html代码生成工具类 2.0.0 版本

emmet 语法快速生成 html 代码。此版本对内置编译进行了优化，潜在的限制更小了，配合模板引擎，能更好的玩耍哦~。

----------

# 用法

``` javascript
    // 把 #parent > .child 编译为对象树， root 为该树的根节点
    var text = Emmet.compile('#parent > .child');
    console.log(text); // ==> <div id="parent"><div class="child"></div></div>
```

----------

# 支持语法

除了在“设置属性”外，其余情况，空格是不会带来其它影响的。即 **".item.item1" === ".item .item1"**

一、设置元素id

``` javascript
    Emmet.compile("#parent"); // ==> <div id="parent"></div>
```
默认生成 div 元素

二、指定元素 tagName

``` javascript
    Emmet.compile("span#parent"); // ==> <span id="parent"></span>
```
可在设置属性前，指定使用的标签，这里生成后，使用了 span 标签

三、设置元素 class

``` javascript
    Emmet.compile(".item.item1"); // ==> <div class="item item1"></div>
```

四、设置属性

``` javascript
    Emmet.compile(".item[name=da宗熊, age=26]"); // ==> <div class="item" name="da宗熊" age="26"></div>
```
属性内，","是间隔符

五、设置内容

``` javascript
    Emmet.compile(".item{一段文字}"); // ⇒ <div class="item">一段文字</div>
    // 或者
    Emmet.compile(".item`一段文字`"); // ⇒ <div class="item">一段文字</div>
```
内容中，如果有各种复杂的嵌套，建议如下使用：
``` javascript
	Emmet.compile(".item{'一段复杂的内容{就是这样子}'}");
	// ⇒ "<div class="item">一段复杂的内容{就是这样子}</div>"
```

六、数量

``` javascript
    Emmet.compile("(.item1 + .item2) * 3"); // ==> <div class="item1"></div><div class="item2"></div><div class="item1"></div><div class="item2"></div><div class="item1"></div><div class="item2"></div>
```

七、数量语法糖

``` javascript
    Emmet.compile(".item$*2", {number: true}); // ==> <div class="item1"></div><div class="item2"></div>
    Emmet.compile(".item$$*2", {number: true}); // ==>  <div class="item01"></div><div class="item02"></div>
```
为了配合模板引擎使用，$ 转 数字功能，默认是关闭的。


八、上一层元素

``` javascript
    Emmet.compile("#parent1 > .item1 ^+ #parent2"); // ==> <div id="parent1"><div class="item1"></div></div><div id="parent2"></div>
```
与第一版不同，为了配合模板引擎，^ 不再默认指向上一层元素的兄弟元素。

九、配合默认引擎，如artTemplate

``` html
<script type="text/html" id="emmetTxt">
`{{each list}}`>(
    p.item{`索引{{$index}}:`} > span.txt{`{{$value.name}}`}
)^`{{/each}}` + p{一段小尾巴}
</script>

<script>
var str = emmetTxt.innerHTML.trim();
var tmp = Emmet.compile(str);
template.render(tmp)({
    list: [{name: "这是一头熊"}, {name: "猫咪星人驾到"}, {name: "轰轰轰"}]
});
// ==> 
/**
<div>
	<p class="item">索引0:<span class="txt">这是一头熊</span></p>
	<p class="item">索引1:<span class="txt">猫咪星人驾到</span></p>
	<p class="item">索引2:<span class="txt">轰轰轰</span></p>
</div>
<p>一段小尾巴</p>
*/
</script>
```

----------

# 参数

该脚本，提供两个参数:

一、 tag 指定生成 html 时的默认标签
``` javascript
	Emmet.compile(".item", {tag: "span"}); // ==> "<span class="item"></span>"
```

二、number 让出现的所有 $ 转为数字

``` javascript
	// 设置前
	Emmet.compile(".item{文字$}"); // ⇒ <div class="item">文字$</div>
	
	// 设置后
	Emmet.compile(".item{文字$}", {number: true}); // ⇒ <div class="item">文字1</div>
```
