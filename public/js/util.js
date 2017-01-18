/**
 * artteplate config
 */
/** 
 * 对日期进行格式化， 
 * @param date 要格式化的日期 
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有： 
 *     y:年, 
 *     M:年中的月份(1-12), 
 *     d:月份中的天(1-31), 
 *     h:小时(0-23), 
 *     m:分(0-59), 
 *     s:秒(0-59), 
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang
 * @see http://yaniswang.com/frontend/2013/02/16/dateformat-performance/
 */
template.helper('dateFormat', function (date, format) {
    date = parseInt(date);
    if(!arguments[0]){
        return '暂无'
    }
    date = new Date(date);
    console.log(date)
    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});

//文字省略
template.helper('textEllipsis', function (str,len) {
    if(!arguments[0]){
        return '暂无'
    }
    if(len <1) return;
    var afterSlice = '';
    if(str.length > len ){
        var afterSlice = str.substring(0,len) + '...';
    }else{
        afterSlice = str;
    }
    return afterSlice;
});

/**
 * 将str中的html符号转义,将转义“'，&，<，"，>”五个字符
 * @method unhtml
 * @param { String } str 需要转义的字符串
 * @return { String } 转义后的字符串
 * @example
 * ```javascript
 * var html = '<body>&</body>';
 *
 * //output: &lt;body&gt;&amp;&lt;/body&gt;
 * console.log( UE.utils.unhtml( html ) );
 *
 * ```
 */
template.helper('unhtml', function (str,reg) {
    return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
        if (b) {
            return a;
        } else {
            return {
                '<':'&lt;',
                '&':'&amp;',
                '"':'&quot;',
                '>':'&gt;',
                "'":'&#39;'
            }[a]
        }

    }) : '';
});

/**
 * 将str中的转义字符还原成html字符
 * @see UE.utils.unhtml(String);
 * @method html
 * @param { String } str 需要逆转义的字符串
 * @return { String } 逆转义后的字符串
 * @example
 * ```javascript
 *
 * var str = '&lt;body&gt;&amp;&lt;/body&gt;';
 *
 * //output: <body>&</body>
 * console.log( UE.utils.html( str ) );
 *
 * ```
 */
template.helper('html', function (str) {
    return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function (m) {
        return {
            '&lt;':'<',
            '&amp;':'&',
            '&quot;':'"',
            '&gt;':'>',
            '&#39;':"'",
            '&nbsp;':' '
        }[m]
    }) : '';
});

/**
* 获取纯文本
*/
template.helper('getText',function(str){
    var fillChar = '/\u200B/';
     var reg = new RegExp(fillChar, 'gm');
    //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
    var t = str.replace(reg, '').replace(/\u00a0/g, ' ');
    console.log(t);
    return t ;
    
});


template.config('openTag', '<%');
template.config('closeTag', '%>');

/**
 * dateDesc 时间倒序
 * @param {oldDate} 过去的时间戳
 * @return {string} 计算后的时间差
 */
template.helper('dateDesc', function(oldDate) {
    var now = new Date().getTime(),
        past = !isNaN(oldDate) ? oldDate : new Date(oldDate).getTime(),
        diffValue = now - past,
        res = '',
        s = 1000,
        m = 1000 * 60,
        h = m * 60,
        d = h * 24,
        hm = d * 15,
        mm = d * 30,
        y = mm * 12,
        _y = diffValue / y,
        _mm = diffValue / mm,
        _w = diffValue / (7 * d),
        _d = diffValue / d,
        _h = diffValue / h,
        _m = diffValue / m,
        _s = diffValue / s;
    if (_y >= 1) res = parseInt(_y) + '年前';
    else if (_mm >= 1) res = parseInt(_mm) + '个月前';
    else if (_w >= 1) res = parseInt(_w) + '周前';
    else if (_d >= 1) res = parseInt(_d) + '天前';
    else if (_h >= 1) res = parseInt(_h) + '小时前';
    else if (_m >= 1) res = parseInt(_m) + '分钟前';
    else if (_s >= 1) res = parseInt(_s) + '秒前';
    else res = '刚刚';
    return res;
});

/**
* commonPage 公共分页组件
* @param {object} config 样式配置目前只有激活后的类和显示多少个页码
* @param {number} page 当前页码
* @param {number} total 总页数
* @return {string} 激活页码后的html字符串
*/
window.commonPage = function (config) {
    var opt = {
        active:'active',
        showPage:3
    }
    for(var i in opt){
        if(config[i] === undefined){
            config[i] = opt[i]
        }
    }
    return function (page, total) {
        //当前页
        page = parseInt(page),total = parseInt(total);
        var str = '<a href="javascript:;" data-bind="'+page+'" class="'+config.active+'">' + page + '</a>';
        for (var i = 1; i <= config.showPage; i++) {
            //page-i>1证明page>config.showPage,所以page-i,在当前page的左边，循环config.showPage次
            if (page - i > 1) {
                str = '<a href="javascript:;" data-bind="'+(page-i)+'">' + (page - i) + '</a> ' + str;
            }
            //page+i<total证明page+i在total的左边，在page的右边，循环config.showPage次
            if (page + i < total) {
                str = str + ' ' + '<a href="javascript:;" data-bind="'+(page+i)+'">'+(page + i)+'</a>';
            }
        }
        //当前页的左边第config.showPage+1个a出现省略号，因为需求是当前页的左右各显示config.showPage个
        if (page - (config.showPage+1)> 1) {
            str = '<a>...</a> ' + str;
        }
        //当前页page>1时，出现上一张按钮
        if (page > 1) {
            str = '<a href="javascript:;" data-bind="'+(page-1)+'">上一页</a> ' + '<a href="javascript:;" data-bind="1">1</a>' + ' ' + str;
        }
        //当前页的左右边第config.showPage+1个a出现省略号，因为需求是当前页的左右各显示config.showPage个
        if (page + (config.showPage+1) < total) {
            str = str +' '+'<a>...</a>';
        }
        ////当前页page<total时，出现下一张按钮
        if (page < total) {
            str = str + ' ' + '<a href="javascript:;" data-bind="'+total+'">'+total +'</a>'+' '+'<a href="javascript:;" data-bind="'+(parseInt(page)+1)+'">下一页</a>';
        }
        return str;
    }
}

//alert
window.alertInfo = function(msg){
    if(!!document.getElementById('alertInfo')) return;
    var oDiv = document.createElement('div');
    oDiv.id = 'alertInfo';
    var divCssText = 'position:fixed;width:100%;height:30px;'
        +'left:0;bottom:150px;text-align:center;z-index:100;'
        +'-webkit-transition:all .3s ease-in-out';
    oDiv.style.cssText = divCssText;
    var oSpan = document.createElement('span');
    var spanCssText = 'color:#fff;font-size:14px;background:rgba(0,0,0,0.8);border-radius:20px;%;padding:10px 20px;';
    oSpan.style.cssText = spanCssText;
    oSpan.innerHTML = msg || '未知错误';
    oDiv.appendChild(oSpan);
    var oBody = document.body || document.documentElement;
    oBody.appendChild(oDiv);
    setTimeout(function(){
        oBody.removeChild(oDiv)
    },3000);
}

//modal封装
window.Modal = function () {
    var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
    var alr = $("#ycf-alert");
    var ahtml = alr.html();

    //关闭时恢复 modal html 原样，供下次调用时 replace 用
    //var _init = function () {
    //  alr.on("hidden.bs.modal", function (e) {
    //      $(this).html(ahtml);
    //  });
    //}();

    /* html 复原不在 _init() 里面做了，重复调用时会有问题，直接在 _alert/_confirm 里面做 */


    var _alert = function (options) {
        alr.html(ahtml);    // 复原
        alr.find('.ok').removeClass('btn-success').addClass('btn-primary');
        alr.find('.cancel').hide();
        _dialog(options);

        return {
            on: function (callback) {
                if (callback && callback instanceof Function) {
                    alr.find('.ok').click(function () { callback(true) });
                }
            }
        };
    };

    var _confirm = function (options) {
        alr.html(ahtml); // 复原
        alr.find('.ok').removeClass('btn-primary').addClass('btn-success');
        alr.find('.cancel').show();
        _dialog(options);

        return {
            on: function (callback) {
                if (callback && callback instanceof Function) {
                    alr.find('.ok').click(function () { callback(true) });
                    alr.find('.cancel').click(function () { callback(false) });
                }
            }
        };
    };

    var _dialog = function (options) {
        var ops = {
            msg: "提示内容",
            title: "操作提示",
            btnok: "确定",
            btncl: "取消"
        };

        $.extend(ops, options);

        var html = alr.html().replace(reg, function (node, key) {
            return {
                Title: ops.title,
                Message: ops.msg,
                BtnOk: ops.btnok,
                BtnCancel: ops.btncl
            }[key];
        });
        
        alr.html(html);
        alr.modal({
            width: 500,
            backdrop: 'static'
        });
    }

    return {
        alert: _alert,
        confirm: _confirm
    }

}();
