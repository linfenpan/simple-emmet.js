/**
仿emmet语法的小脚本 by da宗熊
version 1.0.0
例子:
	Emmet.compile("#parent > .child").toHtml() ==> <div id="parent"> <div class="child"></div> </div>
*/

// string --> 属性对象，有BUG
// 需要可配置默认的 tagName

;(function(window){

	// 全局默认标签
	var DEFAULT_TAGNAME = "div";
	// repeat 的参数，默认 $ 为占位符
	// 修正属性、className、和 文本
	// 通过 三元表达式判定，是否可用，极度浪费时间的样子..
	var DEFAULT_FIX_REPEAT = {
		tag: /\$+/g,
		attr: true,
		cls: true,
		text: true,
		id: true
	};

	// 节点定义
	function Node(ptNode, tagName){
		this.tagName = typeof tagName === "undefined" ? DEFAULT_TAGNAME : "";
	    this.text = "";
	    this.id = "";
	    this.classList = [];
	    this.attr = {};
	    // 元素个数
	    this.children = [];
		this.parent = ptNode;
	    this.count = 1;
	};
	Node.prototype = {
	    // 延迟操作，应该作为父类，被继承
	    // hcounter == 2 时，执行 hoperation
	    hcounter: 0,
	    setHelper: function(opertion){
	        // 尝试结算上一次的操作
	        this.end(2);

	        this.resetHelper(opertion);
	    },
	    hasHelper: function(){
	        return !!this.hoperation;
	    },
	    resetHelper: function(opertion){
	        this.hparams = [];
	        this.hcounter = 0;
	        this.hoperation = opertion;
	    },
	    addHelperParamsChar: function(chr){
	        this.hparams.push(chr);
	    },
	    end: function(index){
	        this.hcounter += index || 1;
	        if(this.hcounter >= 2 && this.hoperation){
	            this[this.hoperation](this.hparams.join(""));

	            this.resetHelper("");
	        }
	    },
	    restart: function(index){
	        if(typeof index !== "undefined"){
	            this.hcounter = index;
	        }else{
	            this.hcounter = 0;
	        }
	    },
	    // 复制节点
	    clone: function(node){
	        for(var i in node){
	            if(node.hasOwnProperty(i)){
	                this[i] = node[i];
	            }
	        }
	    },


	    // 常用操作
		addChild: function(child){
	        this.children.push(child);
		},
	    addAttrKey: function(key){
	        this._lastAttrKey = key;
	        this.attr[key] = "";
	    },
	    addAttrValue: function(val){
	        this.attr[this._lastAttrKey] = valu;
	    },
	    addAttr: function(key, val){
	        this.attr[key] = val;
	    },
	    addClass: function(name){
	        this.classList.push(name);
	    },
	    setId: function(id){
	        this.id = id;
	    },
	    setText: function(text){
	        this.text = text;
	    },
	    setTag: function(name){
	        this.tagName = name;
	    },
	    setCount: function(c){
	        this.count = +c;
	    },
	    toParent: function(){
	        return this.parent;
	    },
	    // 新的子元素
	    getNewChild: function(){
	        var child = new Node(this);
	        this.children.push(child);
	        return child;
	    },
	    // 新的兄弟元素
	    getNewNextSibilng: function(){
	        var pt = this.parent;
	        var sib = new Node(pt);
	        pt.addChild(sib);
	        return sib;
	    },
	    // 生成代码
		// 如果父亲有指定 $ 的索引，使用父亲
		// 否则，使用自己的
	    toHtml: function(parentIndex){
			var html = "";
			if(this.count > 1){
				for(var i = 1; i <= this.count; i++){
					html += this._toHtml(i);
				}
			}else{
				html += this._toHtml(parentIndex || 1);
			}
			return html;
	    },
		_toHtml: function(index){
			var html = "", cMap = util.changeMap;
			// 有 tagName 才有属性、样式
	        if(this.tagName){
	            html += "<" + this.tagName;

	            this.id && (html += " id=\"" + cMap.id(this.id, index) + "\"");

	            if(this.classList.length > 0){
					var className = this.classList.join(" ");
	                html += " class=\"" + cMap.cls(className, index) + "\""
	            }

	            for(var i in this.attr){
	                if(this.attr.hasOwnProperty(i)){
	                    html += " " + i + "=\"" + cMap.attr(this.attr[i], index) + "\"";
	                }
	            }

	            html += ">";

	            this.text && (html += cMap.text(this.text, index));
	        }

	        for(var i = 0, max = this.children.length, list = this.children; i < max; i++){
	            html += list[i].toHtml(index);
	        }

	        this.tagName && (html += "</" + this.tagName + ">");

	    	return html;
		}
	};




	// 编译工具
	var util = {
		// findUntil("}", ["a", "b", "}", "k"])
	    // => return "ab"，列表 => ["k"]
		findUntil: function(str, strList){
	        var list = str.split(""), res = [];
	        var max = list.length;
	        var chr  = "", prevChr;
	        var forRes = true;
	        while(true){
	            prevChr = chr;
	            chr = strList.shift();
	            for(var i = 0; i < max; i++){
	                if(list[i] === chr && prevChr !== "\\"){
	                    forRes = false;
	                }
	            }
	            if(forRes){
	                res.push(chr);
	            }else{
	                break;
	            }
				if(!chr){
					break;
				}
	        };
	        return res.join("");
	    },
		// data-name="da 宗熊" data-age=23 ---> {"data-name": "da宗熊", "data-age": 23}
		str2Obj: function(str, split, eqSplit){
			var list = str.split(""), obj = {};

	        while(list.length > 0){
				var key = this.findUntil(eqSplit, list);
				var first = list[0], value;
				if(/"|'/.test(first)){
					list.shift();
					value = this.findUntil(first, list);
				}else{
					value = this.findUntil(split, list);
				}
				obj[key] = value;
			};
	        return obj;
		},
		// 找到对称的 结束括号 ")"
	    // ["da", "zongxion", ")", "xxx"] => "dazongxion", ["xxx"]
	    toNextBracket: function(list){
	        var counter = 1, res = [], str, lstr;
	        while(true){
	            lstr = str;
	            str = list.shift();
	            switch(str){
	                case ")":
	                    if(lstr != "\\"){
	                        counter--;
	                    }
	                    break;
	                case "(":
	                    counter++;
	                    break;
	            }
	            if(counter <= 0 || !str){
	                break;
	            }else{
	                res.push(str);
	            }
	        };
	        return res.join("");
	    },
		// 把 $ 替换为 数字
		change$2Number: function(str, i){
			return str.replace(DEFAULT_FIX_REPEAT.tag, function(str){
				var len = str.length, numLen = (i + "").length;
				if(numLen >= len){
					return i;
				}else{
					return new Array(len - numLen + 1).join(0) + i;
				}
			});
		},
		// 供 Node 使用
		// 在 Emmet.setDefault 中初始化
		changeMap: {id: null, attr: null, cls: null, text: null}
	};

	// 遵循 emmet 语法
	// 编译 String -> html
	function compile(str, parent, tagName){
        var strList = str.split("");
        var root = new Node(parent, tagName || "");

        // 当前节点、栈
        var curNode = root.getNewChild(), stack = [];
        var chr = strList.shift();
        // 是否修正 ^ 这个符号
        var fixUpperBeforeOperation;

        do{
            switch(chr) {
                case ">":
                    curNode.end();
                    curNode = curNode.getNewChild();
                    fixUpperBeforeOperation = false;
                    break;
                case "+":
                    curNode.end();
                    curNode = curNode.getNewNextSibilng();
                    fixUpperBeforeOperation = false;
                    break;
                case "^":
                    curNode.end();
                    curNode = curNode.toParent();
                    fixUpperBeforeOperation = true;
                    break;
                case " ":
                case "\n":
                case "\r":
                    break;
                default:
                    if(fixUpperBeforeOperation){
                        fixUpperBeforeOperation = false;
                        curNode = curNode.getNewNextSibilng();
                    }
                    switch(chr){
                        case ".":
                            curNode.setHelper("addClass");
                            break;
                        case "#":
                            curNode.setHelper("setId");
                            break;
                        case "*":
                            curNode.setHelper("setCount");
                            break;
                        case "[":
                            curNode.end();
                            var attrs = util.findUntil("]", strList);
                            if(attrs){
                                var attrObj = util.str2Obj(attrs, " ", "=");
                                for(var i in attrObj){
                                    if(attrObj.hasOwnProperty(i)){
                                        curNode.addAttr(i, attrObj[i].replace(/^"|"$/g, ""));
                                    }
                                }
                            }
                            break;
                        case "{":
                            curNode.end();
                            var text = util.findUntil("}", strList);
                            curNode.setText(text);
                            break;
                        case "(":
                            // #pt > (.a + .b)
                            // 编译内容 ===> .a + .b
                            curNode.end();
                            curNode.clone( compile(util.toNextBracket(strList), curNode.parent, curNode.tagName) );
                            break;
                        default:
                            // div#pt --> 编译 setTag("div")
                            if(!curNode.hasHelper()){
                                curNode.setHelper("setTag");
                            }
                            curNode.restart(1);
                            curNode.addHelperParamsChar(chr);
                    }
            }

            chr = strList.shift();
            if(!chr){
                curNode.end(2);
            }
        }while(chr);

        return root;
    };

	window.Emmet = ({
		compile: compile,
		// 参数: {tagName: "div", repeat: {tag: /\$+/g, attr: !0, cls: !0, text: !0}}
		setDefault: function(options){
			options = options || {};
			// 默认标签
			DEFAULT_TAGNAME = typeof options.tagName !== "undefined" ? options.tagName : DEFAULT_TAGNAME;

			// 循环生成元素的参数
			if(options.repeat){
				var repeat = options.repeat;
				var obj = DEFAULT_FIX_REPEAT;
				for(var i in repeat){
					if(repeat.hasOwnProperty(i)){
						obj[i] = repeat[i];
					}
				};
				var rFn = function(str){
					return str;
				};
				var cFn = util.change$2Number;
				var map = util.changeMap;
				for(var i in map){
					if(map.hasOwnProperty(i)){
						map[i] = obj[i] ? cFn : rFn;
					}
				}
			}
		},
		init: function(){
			this.setDefault({
				// 触发重新生成 util.changeMap
				repeat: {}
			});
			return this;
		}
	}).init();
})(window);
