/**
 * 获取留言列表 
 * @param  {Number} pageIndex 分页索引
 * @param  {Number} pageSize 每页分数数量 
 */
var getMessageList = function(pageIndex, pageSize){
	var _pageIndex = pageIndex || 1;
	var _pageSize = pageSize || 10;
	var vm = $('#message-list-vm');
	var page = $('#message-list-page');
	$.ajax({
		type:'get',
		dataType:'json',
		data:{pageIndex:_pageIndex, pageSize:_pageSize},
		url:'/api/message/getMessageList',
		success:function(res){
			console.log(res);
			if(res.retCode !== 0){
				return;
			}
			var html = template('message-list-tpl',{messageList: res.data});
			vm.html(html);
		},
		error:function(){
			alertInfo('获取留言分页失败');
		}
	});
}
$(function(){
	getMessageList(1,10);
});
