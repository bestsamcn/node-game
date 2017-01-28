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
				if(!that.oForm[0].channelName.value || that.oForm[0].channelName.value.length < 2){
					alertInfo('渠道名称长度不能少于2位');
					b = false;
					that.oForm[0].channelName.blur();
					that.oForm[0].channelName.focus();
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
					alertInfo('密码长度不能少于6位');
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

	/**
	 * 编辑渠道信息
	 */
	var editChannel = function(){
		var editChannelForm = $('#edit-channel-form');
		var editChannelBtn = $('#edit-channel-btn');
		var channelId = $('#channel-id').val();
		var channel = {
			oForm:editChannelForm,
			editChannelBtn:editChannelBtn,
			channelId:channelId,
			//验证表单
			validateForm:function(){
				var that = this;
				var b = true;
				if(!that.channelId){
					alertInfo('无改渠道信息存在');
					b = false;
					return b;
				}
				if(!that.oForm[0].channelName.value || that.oForm[0].channelName.value.length < 2){
					alertInfo('渠道名称长度不能少于2位');
					b = false;
					that.oForm[0].channelName.blur();
					that.oForm[0].channelName.focus();
					return b;
				}
				if(!that.oForm[0].mode.value || that.oForm[0].mode.value.length !== 1){
					alertInfo('请选择合作模式');
					b = false;
					return b;
				}
				if(that.oForm[0].company.value && that.oForm[0].company.value.length < 2){
					alertInfo('公司名称长度不能少于2位');
					b = false;
					that.oForm[0].company.blur();
					that.oForm[0].company.focus();
					return b;
				}
				if(that.oForm[0].realName.value && that.oForm[0].realName.value.length < 2){
					alertInfo('姓名长度不能少于2位');
					b = false;
					that.oForm[0].realName.blur();
					that.oForm[0].realName.focus();
					return b;
				}
				if(that.oForm[0].mobile.value && !/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g.test(that.oForm[0].mobile.value)){
					alertInfo('手机号码格式错误');
					b = false;
					that.oForm[0].mobile.blur();
					that.oForm[0].mobile.focus();
					return b;
				}
				if(that.oForm[0].email.value && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(that.oForm[0].email.value)){
					alertInfo('邮箱格式错误');
					b = false;
					that.oForm[0].email.blur();
					that.oForm[0].email.focus();
					return b;
				}
				if(!that.oForm[0].gender.value || that.oForm[0].gender.value.length !== 1){
					alertInfo('请选择性别');
					b = false;
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
						return;
					}
					var obj = that.oForm.serialize();

					$.ajax({
						type:'post',
						dataType:'json',
						url:'/api/admin/editChannel',
						data:obj,
						success:function(res){
							console.log(res);
							if(res.retCode !== 0){
								alertInfo(res.msg || '修改失败');
								return;
							}
							alertInfo(res.msg || '修改成功');
						},
						error:function(){
							alertInfo('修改失败');
						}
					});
					return false;
				}
				that.editChannelBtn.on('click',postInfo);
			},
			init:function(){
				if(window.location.pathname.indexOf('/admin/editChannel/') === -1 ) return;
				this.postForm();
			}
		}
		channel.init();
	}
	editChannel();

	/**
	 * 修改密码
	 */
	var editChannelPassword = function(){
		var editChannelPasswordBtn = $('#edit-channel-password-btn');
		var editChannelPasswordForm = $('#edit-channel-password-form');
		var channelId = $('#channel-id').val();
		var channel = {
			editChannelPasswordBtn:editChannelPasswordBtn,
			editChannelPasswordForm:editChannelPasswordForm,
			channelId:channelId,
			validateForm:function(){
				var that = this;
				var b = true
				if(!that.editChannelPasswordForm[0].password.value || that.editChannelPasswordForm[0].password.value.length < 6){
					alertInfo('密码长度不能少于6位');
					b = false;
					that.editChannelPasswordForm[0].password.blur();
					that.editChannelPasswordForm[0].password.focus();
					return b;
				}
				if(that.editChannelPasswordForm[0].password.value !== that.editChannelPasswordForm[0].repassword.value){
					alertInfo('两次密码输入不一致');
					b = false;
					that.editChannelPasswordForm[0].repassword.blur();
					that.editChannelPasswordForm[0].repassword.focus();
					return b;
				}
				return b;
			},
			postForm:function(){
				if(!this.channelId || this.channelId.length !== 24){
					alertInfo('无该渠道信息存在');
					return;
				}
				var postInfo = function(e){
					e && e.preventDefault();
					window.event && (window.event.returnValue = false);
					var obj = editChannelPasswordForm.serialize();
					delete obj.repassword;
					$.ajax({
						type:'post',
						dataType:'json',
						url:'/api/admin/editChannelPassword',
						data:obj,
						success:function(res){
							if(res.retCode !== 0){
								alertInfo(res.msg || '修改失败');
								return;
							}
							alertInfo(res.msg || '修改成功');
						},
						error:function(){
							alertInfo('修改失败');
						}
					});
				}
				this.editChannelPasswordBtn.on('click',postInfo);
			},
			init:function(){
				if(window.location.pathname.indexOf('/admin/editChannelPassword/') === -1 ) return;
				this.postForm();
			}
		}
		channel.init();
	}
	editChannelPassword();
})();