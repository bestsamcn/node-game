
var totalMessage = document.getElementById('total-message');
var totalMessageNumber = totalMessage && parseInt(totalMessage.innerHTML);
var prevPageBtn = $('#prev-page-btn');
var nextPageBtn = $('#next-page-btn');
var pageIndex = 1;
var pageSize = 2;
var pageListVm = $('#message-list-vm');
var delMessageBtn = $('#del-message-btn');
var parentWindow = window.parent;
var PWtotalMessageNumber1=parentWindow.document.getElementById('total-message-number1');
var readFilter = document.getElementsByName('filter');
var searchInput = document.getElementById('message-search-value');
var searchBtn = document.getElementById('message-search-btn');
var search = null;
var filter = null;
/**
 * 获取留言列表 
 * @param  {Number} pageIndex 分页索引
 * @param  {Number} pageSize 每页分数数量 
 */
var getMessageList = function(index, size) {
    if(window.location.pathname !== '/message') return;
    var _pageIndex = index || 1;
    var _pageSize = size || 10;
    var obj ={};
    obj.pageIndex = _pageIndex;
    obj.pageSize = _pageSize;
    obj.filter = filter
    
    obj.search = search;
    var page = $('#message-list-page');
    $.ajax({
        type: 'get',
        dataType: 'json',
        data: obj,
        url: '/api/message/getMessageList',
        success: function(res) {
            if (res.retCode !== 0) {
                return;
            }
            //显示总数
            totalMessage && (totalMessage.innerHTML = res.total);
            //控制上下分页按钮
            if (res.total <= _pageSize * _pageIndex) {
                nextPageBtn.attr('disabled', true);
            } else {
                nextPageBtn.attr('disabled', false);
            }
            if (res.pageIndex > 1) {
                prevPageBtn.attr('disabled', false);
            } else {
                prevPageBtn.attr('disabled', true);
            }
            var html = template('message-list-tpl', { messageList: res.data });
            pageListVm.html(html);
        },
        error: function() {
            alertInfo('获取留言分页失败');
        }
    });
}
/**
 * 分页点击
 */
var messageListPage = function() {
    var _prevPage = function() {
        pageIndex--;
        getMessageList(pageIndex, pageSize);
    }
    var _nextPage = function() {
        pageIndex++;
        getMessageList(pageIndex, pageSize);
    }
    prevPageBtn.on('click', _prevPage);
    nextPageBtn.on('click', _nextPage);
}
/**
 * 留言删除
 */
var delMessage = function() {
    var _delEvent = function() {
        var $this = $(this);
        var _id = $this.attr('data-id');
        if (!_id || _id.length !== 24) {
            alertInfo('异常');
            return;
        }
        swal({
            title: "确定删除该留言？",
            text: "删除后将无法恢复，请谨慎操作！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f05050",
            confirmButtonText: "删除",
            cancelButtonText:"取消",
            closeOnConfirm: false
        }, function() {
        	$.ajax({
        		type:'get',
        		dataType:'json',
        		url:'/api/message/delMessage',
        		data:{id:_id},
        		success:function(res){
        			if(res.retCode !== 0){
        				alertInfo('删除失败');
        				return;
        			}
                    
                    //控制父级window的信息
                    PWtotalMessageNumber1.innerHTML = parseInt(PWtotalMessageNumber1.innerHTML)-1;
                    totalMessage && (totalMessage.innerHTML = parseInt(totalMessage.innerHTML)-1);
        			if($this.parent().parent()) $this.parent().parent().remove();
                    
        			swal("删除成功！", "您已经永久删除了这条信息。", "info");
                    setTimeout(function(){
                        if(window.location.pathname.indexOf('/message/messageDetail') !== -1) {
                            window.location.href='/message';
                        }
                    },1000);

        		},
                error:function(){
                    alertInfo('删除失败');
                }
        	});
            
        });
    }
    pageListVm.on('click','.btn',_delEvent);
    delMessageBtn.on('click',_delEvent);
}

/**
 * 刷新窗口
 */
var refreshDocument = function(){
    $('#refresh-document').on('click',function(){
        window.location.reload();
    });
}

/**
 * 条件筛选已读，未读
 */
var filterMessageList = function(){
    for(var i=0; i< readFilter.length; i++){
        readFilter[i].onclick = function(){
            filter = this.value;
            pageIndex = 1;
            getMessageList(pageIndex,pageSize);
        }
    }
}

/**
 * 搜索
 */
var searchMessage = function(){
    if(!searchBtn) return;
    searchBtn.onclick = function(e){
        e && e.preventDefault();
        window.event && (window.event.returnValue=false);
        search = searchInput.value;
        pageIndex = 1;
        getMessageList(pageIndex,pageSize);
    }
}






$(function() {
    getMessageList(pageIndex, pageSize);
    messageListPage();
    delMessage();
    refreshDocument();
    filterMessageList();
    searchMessage();
    readMessage();
});
