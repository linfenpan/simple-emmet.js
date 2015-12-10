
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


    setTag: function(tag){
        this.tag = tag || "";
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
    newSiblings: function(){
        var parent = this.parent,
            slb = new Node(parent, "div");
        parent.addChild(slb);
        return slb;
    },
    // 新的儿子
    newChild: function(){
        var chi = new Node(this, "div");
        this.addChild(chi);
        return chi;
    },
    // 转换为 html 代码
    toHtml: function(parentIndex){
        var html = "";
        if(this.repeat > 1){
            for(var i = 1; i <= this.repeat; i++){
                html += this._toHtml(i);
            }
        }else{
            html += this._toHtml(parentIndex || 1);
        }
        return html;
    },
    _toHtml: function(index){
        var html = "", change2Num = util.change$2Number;
        // 有 tagName 才有属性、样式
        if(this.tag){
            html += "<" + this.tag;

            this.id && (html += " id=\"" + change2Num(this.id, index) + "\"");

            if(this.cls.length > 0){
                var className = this.cls.join(" ");
                html += " class=\"" + change2Num(className, index) + "\""
            }

            for(var i in this.atr){
                if(this.atr.hasOwnProperty(i)){
                    html += " " + i + "=\"" + change2Num(this.atr[i], index) + "\"";
                }
            }

            html += ">";
        }

        for(var i = 0, max = this.children.length, list = this.children, item; i < max; i++){
            item = list[i];
            html += typeof item == "string" ? change2Num(item, index) : item.toHtml(index);
        }

        this.tag && (html += "</" + this.tag + ">");

        return html;
    }
};
