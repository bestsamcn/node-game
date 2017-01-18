
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
