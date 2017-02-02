/**
 * 用户
 */
;(function(){
	//刷新
	$('#refresh-btn').on('click', function(){
		window.location.reload();
	});

		/**
	 * 游戏列表
	 */
	var getGameList = function(){
		var PAGE_SIZE = 2, PAGE_INDEX = 1;
		var prevPageBtn = $('#prev-page-btn');
		var nextPageBtn = $('#next-page-btn');
		var gameListVM = $('#game-list-vm');
		var gameHeaderVm = $('#game-header-vm');
		var searchBtn = $('#game-search-btn');
		var searchInput = $('#game-search-input');
		var refreshBtn = $('#refresh-btn');
		var mode = $('#mode');
		var totalGame = $('#total-game');
		var resetAllGameBtn = $('#reset-all-game-btn');
		//必传参数
		var _channel_id = $('#channel-id').val();
		var searchValue = null;
		var modeValue = null;
		modeValue = $('#mode').val();
		var resetMode = modeValue;
		var inputDateValue = null;
		var game3 = {
			getGameList:function(pageIndex, pageSize){
				var _pageSize = pageSize || PAGE_SIZE;
				var _pageIndex = pageIndex || PAGE_INDEX;
				var obj = {};
				if(!_channel_id || _channel_id.length !== 24){
					alertInfo('异常');
					return false;;
				}
				obj.channelId = _channel_id;
				obj.search = searchValue;
				obj.pageSize = _pageSize;
				obj.pageIndex = _pageIndex;
				obj.mode = modeValue;
				obj.inputDate = inputDateValue;
				$.ajax({
					type:'get',
					dataType:'json',
					url:'/api/game/getGameList',
					data:obj,
					success:function(res){
						if(res.retCode !== 0 ){
							alertInfo(res.msg || '获取渠道数据失败');
							return;
						}
						var tpl = modeValue === '1' ? 'game-cpa-list-tpl' : 'game-cps-list-tpl';
						var gameHeaderHtm = template('game-header-tpl',{mode:modeValue});
						gameHeaderVm.html(gameHeaderHtm)
						var html = template(tpl,{gameList:res.data});
						gameListVM.html(html);
						totalGame.html(res.total);
						if(res.total <= _pageSize*_pageIndex){
							nextPageBtn.attr('disabled',true);
						}else{
							nextPageBtn.attr('disabled',false);
						}
						if(res.pageIndex > 1){
							prevPageBtn.attr('disabled', false);
						}else{
							prevPageBtn.attr('disabled', true);
						}
					}
				});
			},
			pageClick:function(){
				var that = this;
				var nextPageClick = function(){
					PAGE_INDEX++;
					that.getGameList(PAGE_INDEX);
				}
				var prevPageClick = function(){
					PAGE_INDEX--;
					that.getGameList(PAGE_INDEX);
				}
				nextPageBtn.on('click',nextPageClick);
				prevPageBtn.on('click',prevPageClick);
			},
			searchGame:function(){
				var that = this;
				var searchFunc = function(e){
					e && e.preventDefault();
					window.event && (window.event.returnValue = false);
					PAGE_INDEX = 1;
					searchValue = searchInput.val();
					that.getGameList(PAGE_INDEX);
				}
				searchBtn.on('click', searchFunc);
			},
			filterMode:function(){
				var that = this;
				mode[0].onchange = function(){
					PAGE_INDEX = 1;
					modeValue = this.value;
					var gameHeaderHtm = template('game-header-tpl',{mode:modeValue});
					gameHeaderVm.html(gameHeaderHtm)
					that.getGameList(PAGE_INDEX);
				}
			},
			refreshDocument:function(){
				refreshBtn.on('click',function(){
					window.location.reload();
				});
			},
			resetAllGame:function(){
				var that = this;
				var resetAll = function(){
					searchValue = null;
					modeValue = resetMode;
					inputDateValue = null;
					PAGE_INDEX = 1;
					searchInput.val('');
					laydate.reset('');
					$('#mode').val(modeValue);
					$('#input-date').val('');
					that.getGameList();
				}
				resetAllGameBtn.on('click', resetAll);
			},
			chooseDate:function(d){
				var that = game3;
				inputDateValue = d;
				PAGE_INDEX = 1;
				that.getGameList();
			},	
			init:function(){
				if(!/^\/user/ig.test(window.location.pathname)) return;
				laydate && laydate({
			        elem: '#input-date', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
			        event: 'focus', //响应事件。如果没有传入event，则按照默认的click
			        choose:game3.chooseDate
			    });
			    this.resetAllGame();
				this.getGameList();
				this.pageClick();
				this.filterMode();
				this.refreshDocument();
				this.searchGame();
			}
		}
		game3.init();
		
	}
	getGameList();

})();