var totalMessage = document.getElementById('total-message');
var totalMessageNumber = parseInt(totalMessage.innerHTML);
var prevPageBtn = $('#prev-page-btn');
var nextPageBtn = $('#next-page-btn');
var pageIndex = 1;
var pageSize = 2;
var pageListVm = $('#message-list-vm');
/**
 * 获取留言列表 
 * @param  {Number} pageIndex 分页索引
 * @param  {Number} pageSize 每页分数数量 
 */
var getMessageList = function(index, size) {
        var _pageIndex = index || 1;
        var _pageSize = size || 10;

        var page = $('#message-list-page');
        $.ajax({
            type: 'get',
            dataType: 'json',
            data: { pageIndex: _pageIndex, pageSize: _pageSize },
            url: '/api/message/getMessageList',
            success: function(res) {
                console.log(res);
                if (res.retCode !== 0) {
                    return;
                }
                //显示总数
                totalMessage && (totalMessage.innerHTML = res.total);
                //控制上下分页按钮
                if (res.total < _pageSize * _pageIndex) {
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
    var _delEvent = function(e) {
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
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "删除",
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
        			$this.parent().parent().remove();
        			totalMessage.innerHTML = pageIndex;
        			swal("删除成功！", "您已经永久删除了这条信息。", "success");
        		}
        	});
            
        });
    }
    pageListVm.on('click','.btn',_delEvent);
}




$(function() {
    getMessageList(pageIndex, pageSize);
    messageListPage();
    delMessage();
});
