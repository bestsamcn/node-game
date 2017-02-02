/**
 * 游戏
 */
;(function(){
	$('#refresh-btn').on('click', function(){
		window.location.reload();
	});
	
	/**
	 * cpa
	 */
	var CpaGameFunc = function(){
		var addCpaGameForm = $('#add-cpa-game-form');	
		var addCpaGameBtn = $('#add-cpa-game-btn');
		var game1 = {
			validateForm:function(){
				var that = this;
				var b = true;
				if(!addCpaGameForm[0].gameName.value || addCpaGameForm[0].gameName.value < 2){
					b = false;
					alertInfo('游戏名称长度不能少于2位');
					addCpaGameForm[0].gameName.blur();
					addCpaGameForm[0].gameName.focus();
					return b;
				}
				if(isNaN(addCpaGameForm[0].installAmount.value) || addCpaGameForm[0].installAmount.value < 0){
					b = false;
					alertInfo('安装数不能小于0或者不存在');
					addCpaGameForm[0].installAmount.blur();
					addCpaGameForm[0].installAmount.focus();
					return b;
				}
				if(isNaN(addCpaGameForm[0].singlePrize.value) || addCpaGameForm[0].singlePrize.value <= 0){
					b = false;
					alertInfo('单价不能小于0或者不存在');
					addCpaGameForm[0].singlePrize.blur();
					addCpaGameForm[0].singlePrize.focus();
					return b;
				}
				if(!addCpaGameForm[0].inputDate.value || addCpaGameForm[0].inputDate.value < 10 || !/^(\d{4})-(\d{2})-(\d{2})$/g.test(addCpaGameForm[0].inputDate.value)){
					b = false;
					alertInfo('日期长度只能为10位，且为yyyy-MM-dd的格式');
					addCpaGameForm[0].inputDate.blur();
					addCpaGameForm[0].inputDate.focus();
					return b;
				}
				return b;
			},
			addCpaGame:function(){
				var that = this;
				var _channel_id = $("#channel-id");
				var postInfo = function(e){
					e && e.preventDefault();
					e && e.stopPropagation();
					window.event && (window.event.returnValue = false);
					window.event && (window.event.cancelBubble = true);

					if(!_channel_id.val() || _channel_id.val().length !== 24){
						alertInfo('无该记录存在1');
						return;
					}
					if(!addCpaGameForm[0].channelName.value){
						alertInfo('无该记录存在2');
						return false;
					}
					if(!that.validateForm()) return;
					var obj = {};
					obj.id = _channel_id.val();
					obj.gameName = addCpaGameForm[0].gameName.value;
					obj.channelName = addCpaGameForm[0].channelName.value;
					obj.installAmount = addCpaGameForm[0].installAmount.value;
					obj.singlePrize = addCpaGameForm[0].singlePrize.value;
					obj.inputDate = addCpaGameForm[0].inputDate.value;
					$.ajax({
						type:'post',
						dataType:'json',
						data:obj,
						url:'/api/game/addCpaGame',
						success:function(res){
							if(res.retCode !==0){
								alertInfo(res.msg || '添加游戏失败');
								return;
							}
							alertInfo(res.msg || '添加游戏成功');
							addCpaGameForm[0].reset();
						},
						error:function(){
							alertInfo('异常');
						}
					});
				}
				addCpaGameBtn.on('click',postInfo);
			},
			init:function(){
				if(!addCpaGameForm[0]) return;	
				this.addCpaGame();
			}
		}
		game1.init();
	}
	CpaGameFunc();

	/**
	 * cps
	 */
	var CpsGameFunc = function(){
		var addCpsGameForm = $('#add-cps-game-form');
		var addCpsGameBtn  = $('#add-cps-game-btn');
		var _channel_id = $('#channel-id');
		var channelName = $('#channelName');
		var gameName = addCpsGameForm.find('#gameName');
		var additionUser = addCpsGameForm.find('#additionUser');
		var splitRatio = addCpsGameForm.find('#splitRatio');
		var totalStream = addCpsGameForm.find('#totalStream');
		var inputDate = addCpsGameForm.find('#inputDate');
		var game2 = {
			addCpsGameForm:addCpsGameForm,
			addCpsGameBtn:addCpsGameBtn,
			validateForm:function(){
				var b = true;
				if(!_channel_id.val() || _channel_id.val().length !== 24){
					alertInfo('无改渠道记录存在');
					b = false;
					return b;
				}
				if(!gameName.val() || gameName.val().length < 2){
					alertInfo('游戏名称长度不能少于2位');
					gameName[0].focus();
					b = false
					return b;
				}
				if(!additionUser.val() || isNaN(additionUser.val()) || parseInt(additionUser.val())<0){
					alertInfo('新增用户只能为数字，并不能少于0个');
					additionUser[0].focus();
					b = false
					return b;
				}
				if(!splitRatio.val() || isNaN(splitRatio.val()) || parseInt(splitRatio.val())<0 || parseInt(splitRatio.val())>100){
					alertInfo('分成比例只能为数字，并不能少于0个大于100，单位是%');
					splitRatio[0].focus();
					b = false
					return b;
				}
				if(!totalStream.val() || isNaN(totalStream.val()) || parseInt(totalStream.val())<0){
					alertInfo('总流水只能为数字，并不能少于0');
					totalStream[0].focus();
					b = false
					return b;
				}
				if(!inputDate.val() || inputDate.val().length !== 10 || !/^(\d{4})-(\d{2})-(\d{2})$/g.test(inputDate.val())){
					alertInfo('日期长度只能为10位，且为yyyy-MM-dd的格式');
					inputDate[0].focus();
					b = false
					return b;
				}
				return b;
			},
			addCpsGame:function(){
				var that = this;
				var postInfo = function(e){
					e && e.preventDefault();
					e && e.stopPropagation();
					window.event && (window.event.returnValue = false);
					window.event && (window.event.cancelBubble = true);
					if(!that.validateForm()){
						return false;
					}
					if(!channelName.val()){
						alertInfo('无该记录存在');
						return false;
					}
					var obj = {};
					obj.id = _channel_id.val();
					obj.gameName = gameName.val();
					obj.channelName = channelName.val();
					obj.channelName = channelName.val();
					obj.additionUser = additionUser.val();
					obj.splitRatio = splitRatio.val();
					obj.totalStream = totalStream.val();
					obj.inputDate = inputDate.val();
					$.ajax({
						type:'post',
						dataType:'json',
						data:obj,
						url:'/api/game/addCpsGame',
						success:function(res){
							if(res.retCode !==0){
								alertInfo(res.msg || '添加游戏失败');
								return;
							}
							alertInfo(res.msg || '添加游戏成功');
							addCpsGameForm[0].reset();
						},
						error:function(){
							alertInfo('异常');
						}
					});
				}
				that.addCpsGameBtn.on('click',postInfo);
			},
			init:function(){
				if(!this.addCpsGameForm[0]) return;	
				this.addCpsGame();
			}
		}
		game2.init();
	}
	CpsGameFunc();

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
				if(!/^\/game\/\w{24}/ig.test(window.location.pathname)) return;
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

	/**
	 * 修改cpa游戏
	 */
	var editCpaGame = function(){
		var editCpaGameForm = $('#edit-cpa-game-form');
		var editCpaGameBtn = $('#edit-cpa-game-btn');
		var game4 = {
			validateForm:function(){
				var that = this;
				var b = true;
				if(!editCpaGameForm[0].gameName.value || editCpaGameForm[0].gameName.value < 2){
					b = false;
					alertInfo('游戏名称长度不能少于2位');
					editCpaGameForm[0].gameName.blur();
					editCpaGameForm[0].gameName.focus();
					return b;
				}
				if(isNaN(editCpaGameForm[0].installAmount.value) || editCpaGameForm[0].installAmount.value < 0){
					b = false;
					alertInfo('安装数不能小于0或者不存在');
					editCpaGameForm[0].installAmount.blur();
					editCpaGameForm[0].installAmount.focus();
					return b;
				}
				if(isNaN(editCpaGameForm[0].singlePrize.value) || editCpaGameForm[0].singlePrize.value <= 0){
					b = false;
					alertInfo('单价不能小于0或者不存在');
					editCpaGameForm[0].singlePrize.blur();
					editCpaGameForm[0].singlePrize.focus();
					return b;
				}
				if(!editCpaGameForm[0].inputDate.value || editCpaGameForm[0].inputDate.value < 10 || !/^(\d{4})-(\d{2})-(\d{2})$/g.test(editCpaGameForm[0].inputDate.value)){
					b = false;
					alertInfo('日期长度只能为10位，且为yyyy-MM-dd的格式');
					editCpaGameForm[0].inputDate.blur();
					editCpaGameForm[0].inputDate.focus();
					return b;
				}
				return b;
			},
			editCpaGame:function(){
				var that = this;
				var postInfo = function(e){
					e && e.preventDefault();
					e && e.stopPropagation();
					window.event && (window.event.returnValue = false);
					window.event && (window.event.cancelBubble = true);
					if(!that.validateForm()) return;
					var obj = {};
					obj.gameId = editCpaGameForm[0].gameId.value;
					obj.gameName = editCpaGameForm[0].gameName.value;
					obj.installAmount = editCpaGameForm[0].installAmount.value;
					obj.singlePrize = editCpaGameForm[0].singlePrize.value;
					obj.inputDate = editCpaGameForm[0].inputDate.value;
					$.ajax({
						type:'post',
						dataType:'json',
						data:obj,
						url:'/api/game/editCpaGame',
						success:function(res){
							if(res.retCode !==0){
								alertInfo(res.msg || '修改游戏失败');
								return;
							}
							alertInfo(res.msg || '修改游戏成功');
						},
						error:function(){
							alertInfo('异常');
						}
					});
				}
				editCpaGameBtn.on('click',postInfo);
			},
			init:function(){
				if(!/^\/game\/editGame\/1\/\w{24}/ig.test(window.location.pathname)) return;
				this.editCpaGame();
			}
		}
		game4.init();
	} 
	editCpaGame();

	/**
	 * 修改cps游戏
	 */
	var editCpsGame = function(){
		var editCpsGameForm = $('#edit-cps-game-form');
		var editCpsGameBtn = $('#edit-cps-game-btn');
		var game5 = {
			validateForm:function(){
				var b = true;
				if(!editCpsGameForm[0].gameName.value || editCpsGameForm[0].gameName.value.length < 2){
					alertInfo('游戏名称长度不能少于2位');
					editCpsGameForm[0].gameName.focus();
					b = false
					return b;
				}
				if(!editCpsGameForm[0].additionUser.value || isNaN(editCpsGameForm[0].additionUser.value) || parseInt(editCpsGameForm[0].additionUser.value)<0){
					alertInfo('新增用户只能为数字，并不能少于0个');
					editCpsGameForm[0].additionUser.focus();
					b = false
					return b;
				}
				if(!editCpsGameForm[0].splitRatio.value || isNaN(editCpsGameForm[0].splitRatio.value) || parseInt(editCpsGameForm[0].splitRatio.value)<0 || parseInt(editCpsGameForm[0].splitRatio.value)>100){
					alertInfo('分成比例只能为数字，并不能少于0个大于100，单位是%');
					editCpsGameForm[0].splitRatio.focus();
					b = false
					return b;
				}
				if(!editCpsGameForm[0].totalStream.value || isNaN(editCpsGameForm[0].totalStream.value) || parseInt(editCpsGameForm[0].totalStream.value)<0){
					alertInfo('总流水只能为数字，并不能少于0');
					editCpsGameForm[0].totalStream.focus();
					b = false
					return b;
				}
				if(!editCpsGameForm[0].inputDate.value || editCpsGameForm[0].inputDate.value.length !== 10 || !/^(\d{4})-(\d{2})-(\d{2})$/g.test(editCpsGameForm[0].inputDate.value)){
					alertInfo('日期长度只能为10位，且为yyyy-MM-dd的格式');
					inputDate[0].focus();
					b = false
					return b;
				}
				return b;
			},
			editCpsGame:function(){
				var that = this;
				var postInfo = function(e){
					e && e.preventDefault();
					e && e.stopPropagation();
					window.event && (window.event.returnValue = false);
					window.event && (window.event.cancelBubble = true);
					if(!that.validateForm()) return;
					var obj = {};
					obj.gameId = editCpsGameForm[0].gameId.value;
					obj.gameName = editCpsGameForm[0].gameName.value;
					obj.additionUser = editCpsGameForm[0].additionUser.value;
					obj.splitRatio = editCpsGameForm[0].splitRatio.value;
					obj.totalStream = editCpsGameForm[0].totalStream.value;
					obj.inputDate = editCpsGameForm[0].inputDate.value;
					$.ajax({
						type:'post',
						dataType:'json',
						data:obj,
						url:'/api/game/editCpsGame',
						success:function(res){
							if(res.retCode !==0){
								alertInfo(res.msg || '修改游戏失败');
								return;
							}
							alertInfo(res.msg || '修改游戏成功');
						},
						error:function(){
							alertInfo('异常');
						}
					});
				}
				editCpsGameBtn.on('click',postInfo);
			},
			init:function(){
				if(!/^\/game\/editGame\/2\/\w{24}/ig.test(window.location.pathname)) return;
				this.editCpsGame();
			}
		}
		game5.init();
	} 
	editCpsGame();


	/**
	 * 删除游戏
	 */
	var delGame = function(){
		var gameListVm = $('#game-list-vm');
		var game6 = {
			confirmFunc:function(cb){
				 swal({
		            title: "确定删除该游戏？",
		            text: "删除后将无法恢复，请谨慎操作！",
		            type: "warning",
		            showCancelButton: true,
		            confirmButtonColor: "#f05050",
		            confirmButtonText: "删除",
		            cancelButtonText:"取消",
		            closeOnConfirm: false
		        }, function() {
		        	cb && cb();
		        });
			},
			delInfo:function(){
				var that = this;
				var delFunc = function(){
					var $this = $(this);
					console.log($this)
					var _mode = $this.attr('data-mode');
					var _game_id = $this.attr('data-id');
					if(!_mode || (_mode != 1 && _mode != 2)){
						alertInfo('异常');
						return;
					}
					if(!_game_id || _game_id.length !== 24){
						alertInfo('异常');
						return;
					}
					that.confirmFunc(function(){
						$.ajax({
							type:'get',
							dataType:'json',
							data:{
								gameId:_game_id,
								mode:_mode
							},
							url:'/api/game/delGame',
							success:function(res){
								if(res.retCode !== 0){
									alertInfo(res.msg || '删除失败');
									return;
								}
								alertInfo(res.msg || '删除成功');
								$this.parent().parent().remove();
								swal({
									type:'success',
									title:'删除成功',
									timer:1000
								});
							},
							error:function(){
								alertInfo('异常');
							}
						});
					})
					
				}
				gameListVm.on('click', '.delete-game-btn', delFunc);
			},
			init:function(){
				if(!/^\/game\/\w{24}/ig.test(window.location.pathname)) return;
				console.log(window.location.pathname)
				this.delInfo();
			}
		}
		game6.init();
	}
	delGame();
})();