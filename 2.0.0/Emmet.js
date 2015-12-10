/**
 * @description 简单的 emmet 语法生成 html
 * @author da宗熊
 * @update 2015/12/10
 * @version 2.0.0
 */

;(function(window, Name){

    /**
    * @param parent {object | null} 父亲 Node
    * @param tag    {String} 当前 Node 的标签，默认是 div
    */
    function Node(parent, tag){
        this.tag = tag || "";
        this.parent = parent;
        // 儿子包含 文字 和 Node对象
        this.children = [];
        // 类名
        this.cls = [];
        // 属性
        this.atr = {};
        // id
        this.id = null;
        // 重复生成数目
        this.repeat = 1;
    };

    Node.prototype = {
        // 设置帮助器，setHelper 预定操作，当遇到 end 时，才执行
        _helper: "setTag",
        setHelper: function(helper){
            this._helper = helper;
        },
        end: function(){
            var hp = this._helper;
            if(hp){
                // 让它报错吧
                this[hp].apply(this, arguments);
                this._helper = null;
            }
        },


        setTag: function(tag, force){
            if(tag || force){
                this.tag = tag || "";
            }
        },
        setId: function(id){
            this.id = id;
        },
        setRepeat: function(r){
            this.repeat = +r;
        },
        addChild: function(ch){
            this.children.push(ch);
        },
        addClass: function(cls){
            this.cls.push(cls);
        },
        /**
        * @param key   {String|Object} 字符串或对象，如果是对象，只允许1个参数
        * @param value {String?} 字符串
        */
        setAttribute: function(key, value){
            var atr = this.atr;
            if(arguments.length >= 2){
                atr[key] = value;
            }else if(typeof key === "object"){
                var obj = key;
                // 不是字符串，就得是对象
                for(var i in obj){
                    if(obj.hasOwnProperty(i)){
                        atr[i] = obj[i];
                    }
                }
            }
        },
        toParent: function(){
            return this.parent;
        },
        // 新的兄弟
        newSiblings: function(tag){
            var parent = this.parent,
                slb = new Node(parent, tag || "");
            parent.addChild(slb);
            return slb;
        },
        // 新的儿子
        newChild: function(tag){
            var chi = new Node(this, tag || "");
            this.addChild(chi);
            return chi;
        },
        // 转换为 html 代码
        toHtml: function(parentIndex, options){
            var html = "";
            options = options || {};
            if(this.repeat > 1){
                for(var i = 1; i <= this.repeat; i++){
                    html += this._toHtml(i, options);
                }
            }else{
                html += this._toHtml(parentIndex || 1, options);
            }
            return html;
        },
        _toHtml: function(index, options){
            var html = "", fn = options.number ? util.change$2Number : function(str){return str;};
            // 有 tagName 才有属性、样式
            if(this.tag){
                html += "<" + fn(this.tag, index);

                this.id && (html += " id=\"" + fn(this.id, index) + "\"");

                if(this.cls.length > 0){
                    var className = this.cls.join(" ");
                    html += " class=\"" + fn(className, index) + "\""
                }

                for(var i in this.atr){
                    if(this.atr.hasOwnProperty(i)){
                        html += " " + i + "=\"" + fn(this.atr[i], index) + "\"";
                    }
                }

                html += ">";
            }

            for(var i = 0, max = this.children.length, list = this.children, item; i < max; i++){
                item = list[i];
                html += typeof item == "string" ? fn(item, index) : item.toHtml(index, options);
            }

            this.tag && (html += "</" + fn(this.tag, index) + ">");

            return html;
        }
    };

    // 工具类
    var util = {
        /**
        * 直到找到某个 key 为止，或符合某个正则为止
        * @param list {Array} 数据列表
        * @param key  {String} 单个字母或正则
        */
        toKey: function(list, key){
            var pre, cur = null;
            var res = [];

            // 如果下一个字符，是 '|"|`，则尽量多匹配内容
            //  {'这是一个{{name}}'} ===> '这是一个{{name}}' 而不是 '这是一个{{name
            var first = list[0], matchFirst = /^('|"|`)/.test(first);
            matchFirst && list.shift();

            while(pre = cur, cur = list.shift()){
                if(cur === key && pre != '\\'){
                    if(matchFirst){
                        if(pre === first){
                            // 去掉最后一个 '|"|`
                            res.pop();
                            break;
                        }
                    }else{
                        break;
                    }
                }
                res.push(cur);
            }
            return res.join('');
        },
        // #parent --> #
        until: function(list, reg){
            if(list.length <= 0){
                return null;
            }

            var  cur = null;
            var res = [];

            while(cur = list.shift()){
                res.push(cur);
                if(reg.test(cur)){
                    break;
                }
            }
            return res.length > 0 ? {last: list.length <= 0 ? "" : res.pop(), text: res.join('')} : null;
        },
        // data-name="da 宗熊" data-age=23 ---> {"data-name": "da宗熊", "data-age": 23}
        str2Obj: function(str, split, eqSplit){
            var list = str.split(""), obj = {};

            while(list.length > 0){
                var key = this.toKey(list, eqSplit).trim();
                var first = list[0], value;
                if(/"|'/.test(first)){
                    list.shift();
                    value = this.toKey(list, first);
                }else{
                    value = this.toKey(list, split);
                }
                this.toKey(list, split);
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
			return str.replace(/\$+/g, function(str){
				var len = str.length, numLen = (i + "").length;
				if(numLen >= len){
					return i;
				}else{
					return new Array(len - numLen + 1).join(0) + i;
				}
			});
		}
    };

    // 编译为字符串
    var idClsReg = /[#>`.*{(+^\[]/;
    function compile(str, parent, options){
        options = options || {};
        var strList = str.split("");
        var root = parent || new Node(null, "");

        // 选择 id，tag，cls
        var code = util.until(strList, idClsReg);
        var node = parent ? root : root.newChild(options.tag);

        // 因为递归可能把 setTag 干掉
        node.setHelper("setTag");
        while(code){
            node.end(code.text.trim());
            switch(code.last) {
                case "#":
                    node.setHelper("setId");
                    break;
                case ".":
                    node.setHelper("addClass");
                    break;
                case "*":
                    node.setHelper("setRepeat");
                    break;
                case "{":
                    node.addChild(util.toKey(strList, "}"));
                    break;
                case "[":
                    var atr = util.toKey(strList, "]");
                    node.setAttribute(util.str2Obj(atr, ",", "="));
                    break;
                case ">":
                    node = node.newChild(options.tag || "div");
                    break;
                case "+":
                    node = node.newSiblings(options.tag || "div");
                    break;
                case "^":
                    node = node.toParent();
                    break;
                case "(":
                    compile(util.toNextBracket(strList), node, options)
                    break;
                case "`":
                    node.addChild(util.toKey(strList, "`"));
                    break;
                case "":
                    break;
                default:
            }
            code = util.until(strList, idClsReg);
        }
        return root;
    };

    // 外部接口
    window[Name] = {
        /**
         * @param {String} str 需要编译的 字符串
         * @param {Object} options 参数, {tag: "默认标签,div", number: 是否把 $ 修正为数字 false}
         */
        compile: function(str, options){
            options = options || {};
            options.tag = options.tag || "div";
            options.number = options.number || false;
            return compile(str, null, options).toHtml(null, {number: options.number});
        }
    };

    window.util = util;
})(window, window.EMMET_NAME || "Emmet");
