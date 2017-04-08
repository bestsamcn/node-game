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
	var getGameList = function() {
		var PAGE_SIZE = 2,
			PAGE_INDEX = 1;
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
		var allGame = $('#all-game');
		var totalInstall = $('#total-install');
		var totalSettlement = $('#total-settlement');
		var totalStream = $('#total-stream');
		var totalUser = $('#total-user');
		var startDateField = $('#start-date');
		var endDateField = $('#end-date');
		var searchTitVm = $('#search-tit-vm');
		var pageSizeOpt = document.getElementById('page-size');
		//必传参数
		var _channel_id = $('#channel-id').val();

		var searchValue = null;
		var modeValue = null;
		modeValue = $('#mode').val();
		var resetMode = modeValue;
		var startDateValue = null;
		var endDateValue = null;
		var isSearchKeyword = null;
		var game3 = {
			pagesizeInit:function(){
				PAGE_SIZE = !!window.getCookie('pagesize') ? parseInt(window.getCookie('pagesize')) : 10;
				for(var i=0; i<pageSizeOpt.length; i++){
					if(pageSizeOpt[i].value == PAGE_SIZE){
						pageSizeOpt.selectedIndex = i;
					}
				}
			},
			setPagesize:function(){
				var that = this;
				var changeFunc = function(){
					var val = this.value;
					window.setCookie('pagesize', val, 100);
					PAGE_SIZE = val;
					PAGE_INDEX = 1;
					that.getGameList();
				}
				pageSizeOpt.onchange = changeFunc
			},
			getGameList: function(pageIndex, pageSize) {
				var _pageSize = pageSize || PAGE_SIZE;
				var _pageIndex = pageIndex || PAGE_INDEX;
				var obj = {};
				if (!_channel_id || _channel_id.length !== 24) {
					alertInfo('异常');
					return false;;
				}
				obj.channelId = _channel_id;
				obj.search = searchValue;
				obj.pageSize = _pageSize;
				obj.pageIndex = _pageIndex;
				obj.mode = modeValue;
				obj.startDate = startDateValue;
				obj.endDate = endDateValue;
				$.ajax({
					type: 'get',
					dataType: 'json',
					url: '/api/game/getGameList',
					data: obj,
					success: function(res) {
						if (res.retCode !== 0) {
							alertInfo(res.msg || '获取渠道数据失败');
							return;
						}
						var tpl = modeValue === '1' ? 'game-cpa-list-tpl' : 'game-cps-list-tpl';
						var gameHeaderHtm = template('game-header-tpl', {
							mode: modeValue
						});
						gameHeaderVm.html(gameHeaderHtm)
						var html = template(tpl, {
							game: res
						});
						gameListVM.html(html);
						totalGame.html(res.total);
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
						//设定总数
						if (modeValue === '1') {
							totalInstall.html(res.totalInstall);
							totalSettlement.html(res.totalSettlement);
						} else {
							totalUser.html(res.totalAddition);
							totalStream.html(res.totalAddition);
							totalSettlement.html(res.totalSettlement);
						}
					}
				});
			},
			pageClick: function() {
				var that = this;
				var nextPageClick = function() {
					PAGE_INDEX++;
					that.getGameList(PAGE_INDEX);
				}
				var prevPageClick = function() {
					PAGE_INDEX--;
					that.getGameList(PAGE_INDEX);
				}
				nextPageBtn.on('click', nextPageClick);
				prevPageBtn.on('click', prevPageClick);
			},
			searchGame: function() {
				var that = this;
				var searchFunc = function(e) {
					e && e.preventDefault();
					window.event && (window.event.returnValue = false);
					PAGE_INDEX = 1;
					searchValue = searchInput.val();
					that.getGameList(PAGE_INDEX);
				}
				searchBtn.on('click', searchFunc);
			},
			searchSmart:function(){
				var that = this;
				//focus
				var getSearchTit = function(){
					var keywords = '';
					var _this = this;
					_this.timer && clearTimeout(_this.timer);
					_this.timer = setTimeout(function(){
						keywords = _this.value;
						isSearchKeyword = 1;
						var obj = {};
						obj.channelId = _channel_id;
						obj.mode = modeValue;
						obj.search = keywords;
						obj.isSearchKeyword = isSearchKeyword;
						obj.pageIndex = 1;
						obj.pageSize = 5;
						$.ajax({
							type:'get',
							dataType:'json',
							data:obj,
							url:'/api/game/getGameList',
							success:function(res){
								if(res.retCode !== 0){
									alertInfo(res.msg || '获取搜索提示失败');
									return;
								}
								var _html = template('search-tit-tpl', {game:res});
								searchTitVm.show().html(_html);
							},
							fail:function(){
								alertInf('异常');
							}
						});
					},500);
				}
				//blur
				var relSearchTit = function(){
					var _this = this;
					_this.value = '';
					setTimeout(function(){
						searchTitVm.html('').hide();
					},200);
					
				}
				//正式请求
				var clickSearchTit = function(){
					var _this = $(this);
					var textValue = _this.html();
					searchInput.val(textValue);
					PAGE_INDEX = 1;
					searchValue = textValue;
					that.getGameList();
					searchTitVm.html('').hide();
				}
				searchInput[0].oninput = getSearchTit;
				searchTitVm.on('click', '.game-tit', clickSearchTit);
				searchInput[0].onblur = relSearchTit;
			},
			filterMode: function() {
				var that = this;
				mode[0].onchange = function() {
					PAGE_INDEX = 1;
					modeValue = this.value;
					var gameHeaderHtm = template('game-header-tpl', {
						mode: modeValue
					});
					gameHeaderVm.html(gameHeaderHtm)
					that.getGameList(PAGE_INDEX);
				}
			},
			refreshDocument: function() {
				refreshBtn.on('click', function() {
					window.location.reload();
				});
			},
			resetAllGame: function() {
				var that = this;
				var resetAll = function() {
					searchValue = null;
					modeValue = resetMode;
					startDateValue = null;
					endDateValue = null;
					PAGE_INDEX = 1;
					searchInput.val('');
					mode.val(modeValue);
					startDateField.val('');
					endDateField.val('');
					that.getGameList();
				}
				resetAllGameBtn.on('click', resetAll);
			},
			chooseStartDate: function(d) {
				var that = game3;
				that.end.min = d; //开始日选好后，重置结束日的最小日期
				that.end.start = d //将结束日的初始值设定为开始日
				startDateValue = d;
				PAGE_INDEX = 1;
				!!endDateValue && that.getGameList();
			},
			chooseEndDate:function(d){
				var that = game3;
				that.start.max = d; //结束日选好后，重置开始日的最大日期
				PAGE_INDEX = 1;
				endDateValue = d;
				!!startDateValue && that.getGameList();
			},
			init: function() {
				if (!/^\/user/ig.test(window.location.pathname)) return;
				var that = this;
				this.pagesizeInit();
				this.setPagesize();
				that.start = {
					elem: '#start-date',
					format: 'YYYY-MM-DD',
					min: '2016-01-01', //设定最小日期为当前日期
					max: laydate.now(), //最大日期
					istime: true,
					istoday: false,
					choose: that.chooseStartDate,
					clear:function(){
						startDateValue = null;
						PAGE_INDEX = 1;
						that.start.start = laydate.now();
						that.end.min = '2016-01-01';
						!endDateValue && that.getGameList();
						laydate.reset();
					}
				};
				that.end = {
					elem: '#end-date',
					format: 'YYYY-MM-DD',
					min: '2016-01-01',
					max: laydate.now(),
					istime: true,
					istoday: false,
					choose: that.chooseEndDate,
					clear:function(){
						endDateValue = null;
						that.end.min = '2016-01-01';
						that.end.start = laydate.now();
						PAGE_INDEX = 1;
						!startDateValue && that.getGameList();
						laydate.reset();
					}
				};
				laydate(that.start);
				laydate(that.end);
				this.resetAllGame();
				this.getGameList();
				this.pageClick();
				this.filterMode();
				this.refreshDocument();
				this.searchGame();
				this.searchSmart();
			}
		}
		game3.init();

	}
	getGameList();
})();