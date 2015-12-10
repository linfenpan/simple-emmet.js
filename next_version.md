# 下版本任务

引入内容保护功能，被保护的内容，将跳过 emmet 解析。

内容保护，能更好的与模板引擎集成，如果:

``` html
`<%for(var i in obj){%>`
	#parent >
        `<%if(true){%>`
		    .child.child`<%= i %>`{内容是:`<%= obj[i] %>`}
        `<%}else{%>`
            ^.none{没有内容}
        `<%}%>`
`<%}%>`
```
经过解析后，应该为:
``` html
<%for(var i in obj){%>
	<div id="parent">
        <%if(true){%>
    		<div class="child child<%= i%>">
    			内容是:<%= obj[i]%>
    		</div>
        <%}else{%>

        <%}%>
	</div>
    <div class="none">
        没有内容
    </div>
<%}%>
```


AND，匹配部分，使用正则 + String.match 实现，会更佳更简洁
