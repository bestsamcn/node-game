(function(){


	/**
	 * 添加渠道
	 */
	var addChannel = function(){
		var _oForm = $('#add-channel-form');
		var _addChannelBtn = $('#add-channel-btn');
		var chanel = {
			oForm:_oForm,
			addChannelBtn:_addChannelBtn,
			//验证表单
			validateForm:function(){
				var that = this;
				var b = true;
				if(that.oForm[0].company.value && that.oForm[0].company.value.length < 2){
					alertInfo('公司名称长度不能少于2位');
					b = false;
					that.oForm[0].company.blur();
					that.oForm[0].company.focus();
					return b;
				}
				if(!that.oForm[0].channel.value || that.oForm[0].channel.value.length < 2){
					alertInfo('渠道名称长度不能少于2位');
					b = false;
					that.oForm[0].channel.blur();
					that.oForm[0].channel.focus();
					return b;
				}
				if(!that.oForm[0].mode.value || that.oForm[0].mode.value.length !== 1){
					alertInfo('请选择合作模式');
					b = false;
					return b;
				}
				if(!that.oForm[0].account.value|| that.oForm[0].account.value.length < 2){
					alertInfo('账号长度不能少于2位');
					b = false;
					that.oForm[0].account.blur();
					that.oForm[0].account.focus();
					return b;
				}
				if(!that.oForm[0].password.value || that.oForm[0].password.value.length < 6){
					alertInfo('账号长度不能少于6位');
					b = false;
					that.oForm[0].password.blur();
					that.oForm[0].password.focus();
					return b;
				}
				if(that.oForm[0].repassword.value !== that.oForm[0].password.value){
					alertInfo('两次密码输入不一致');
					b = false;
					that.oForm[0].repassword.blur();
					that.oForm[0].repassword.focus();
					return b;
				}
				return b;		
			},
			postForm:function(){
				var that = this;
				var postInfo = function(e){
					e && e.preventDefault();
					window.event && (window.event.returnValue = false);
					if(!that.validateForm()){
						return false;
					}
					var obj = that.oForm.serialize();
					delete obj.repassword;
					$.ajax({
						type:'post',
						dataType:'json',
						url:'/api/admin/addChannel',
						data:obj,
						success:function(res){
							if(res.retCode !== 0){
								alertInfo(res.msg || '添加失败');
								return;
							}
							alertInfo('渠道添加成功');
							that.oForm[0].reset();
							setTimeout(function(){
								window.location.href='/admin';
							},1000)
						},
						error:function(){
							alertInfo('添加失败');
						}
					});
				} 
				that.addChannelBtn.on('click',postInfo);
			},	
			init:function(){
				this.postForm();
			}
		}
		chanel.init();
	}
	addChannel();

	/**
	 * 渠道列表
	 */
	var channelList = function(){
		var PAGE_SIZE = 2, PAGE_INDEX = 1;
		var prevPageBtn = $('#prev-page-btn');
		var nextPageBtn = $('#next-page-btn');
		var channelListVM = $('#channel-list-vm');
		var searchBtn = $('#channel-search-btn');
		var searchInput = $('#channel-search-input');
		var refreshBtn = $('#refresh-btn');
		var modeRadio = document.getElementsByName('mode');
		var totalChannel = $('#total-channel');
		var searchValue = null;
		var modeValue = null;
		var channel = {
			getChannelList:function(pageIndex, pageSize){
				var _pageSize = pageSize || PAGE_SIZE;
				var _pageIndex = pageIndex || PAGE_INDEX;
				var obj = {};
				obj.mode = modeValue;
				obj.search = searchValue;
				obj.pageSize = _pageSize;
				obj.pageIndex = _pageIndex;
				$.ajax({
					type:'get',
					dataType:'json',
					url:'/api/admin/getChannelList',
					data:obj,
					success:function(res){
						if(res.retCode !== 0 ){
							alertInfo(res.msg || '获取渠道数据失败');
							return;
						}
						var html = template('channel-list-tpl',{channelList:res.data});
						channelListVM.html(html);
						totalChannel.html(res.total);
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
					that.getChannelList(PAGE_INDEX);
				}
				var prevPageClick = function(){
					PAGE_INDEX--;
					that.getChannelList(PAGE_INDEX);
				}
				nextPageBtn.on('click',nextPageClick);
				prevPageBtn.on('click',prevPageClick);
			},
			filterMode:function(){
				var that = this;
				for(var i = 0 ;i<modeRadio.length; i++){
					modeRadio[i].onclick = function(){
						PAGE_INDEX = 1;
						modeValue = this.value;
						that.getChannelList(PAGE_INDEX);
					}
				}
			},
			searchChannel:function(){
				var that = this;
				var searchFunc = function(e){
					e && e.preventDefault();
					window.event && (window.event.returnValue = false);
					PAGE_INDEX = 1;
					searchValue = searchInput.val();
					that.getChannelList(PAGE_INDEX);
				}
				searchBtn.on('click', searchFunc);
			},
			refreshDocument:function(){
				refreshBtn.on('click',function(){
					window.location.reload();
				});
			},	
			init:function(){
				if(window.location.pathname !== '/admin') return;
				this.getChannelList();
				this.pageClick();
				this.filterMode();
				this.refreshDocument();
				this.searchChannel();
			}
		}
		channel.init();
	}
	channelList();
})();