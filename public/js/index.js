$(function(){
    //菜单点击
    J_iframe
    $(".J_menuItem").on('click',function(){
        var url = $(this).attr('href');
        if(url === '/' || url === '/home'){
        	window.location.href='/';
        	return;
        }
        $("#J_iframe").attr('src',url);
        return false;
    });
    $("#edit-password-btn").on('click',function(){
        var url = $(this).attr('href');
        if(url === '/' || url === '/home'){
            window.location.href='/';
            return;
        }
        $("#J_iframe").attr('src',url);
    });
});