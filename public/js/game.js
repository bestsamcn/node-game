/**
 * 游戏
 */
;(function(){
	$('#refresh-btn').on('click', function(){
		window.location.reload();
	});

	laydate && laydate({
        elem: '#input-date', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
        event: 'focus' //响应事件。如果没有传入event，则按照默认的click
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
		
	}

})();