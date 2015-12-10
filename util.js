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
        return str; /* str.replace(/\$+/g, function(str){
            var len = str.length, numLen = (i + "").length;
            if(numLen >= len){
                return i;
            }else{
                return new Array(len - numLen + 1).join(0) + i;
            }
        });
        */
    }
};
