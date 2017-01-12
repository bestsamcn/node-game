/**
 * 登录注册js
 */

var checkClass = function(){
	$('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

/**
 * 登录
 */
var signup = function(){
	var oForm = $('#signin-form');
	var oBtn = $('#signin-btn');
	var postInfo = function(e){
		e && e.preventDefault();
		window.event && (window.event.returnValue = false);
		if(oForm[0].account.value.length < 2){
			oForm[0].account.blur();
			oForm[0].account.focus();
			alertInfo('用户名长度不能少于2位');
			return;
		}
		if(oForm[0].password.value.length < 6){
			oForm[0].password.blur();
			oForm[0].password.focus();
			alertInfo('用户名长度不能少于6位');
			return;
		}
		if(oForm[0].repassword.value !== oForm[0].password.value){
			oForm[0].repassword.blur();
			oForm[0].repassword.focus();
			alertInfo('两次密码输入不一致');
			return;
		}
		if(oForm[0].agreement.checked !== true){
			alertInfo('请同意协议');
			return;
		}
		var obj = oForm.serialize();
		delete obj.repassword;
		delete obj.agreement;

		$.ajax({
			type:'post',
			dataType:'json',
			url:'/api/user/signup',
			data:obj,
			success:function(res){
				if(res.retCode !== 0){
					alertInfo(msg || '注册失败');
					return;
				}
				alertInfo('注册成功');
				window.location.href="#";
			},
			error:function(){
				alertInfo('注册失败');
			}
		});
	}
	oBtn.on('click', postInfo);
}

$(function(){
	checkClass();
	signup();
});