
$(function (){

	/* ====== 初始化 ====== */
	init();
	function init(){
		var info = localStorage.getItem('key');
		var jsonData = null;
		if(info) {
			jsonData = JSON.parse(info);
			$(".loginText").val(jsonData.userName);
			$(".loginPassword").val(jsonData.userPassWord);
		}
	};

	/* ====== 显示登陆框 ====== */
	$("#loginShow").on("click",function (){
		$("#mask").css({
			width: $(window).width(),
			height: $(window).height(),
			display:"block"
		});
		$("#loginBox").show();
	});

	/* ====== 关闭登陆框 ====== */
	$(".close").click(function (){
		$("#mask").hide();
		$("#loginBox").hide();
	});

	/* ====== 登录名 ====== */
	$(".loginText").blur(function(event) {
		var val = $(this).val();
		userNameFn(val);
	});
	$(".loginText").focus(function(event) {
		$(".Tip1").hide();
	});

	/* ====== 登录密码 ====== */
	$(".loginPassword").blur(function(event) {
		var val = $(this).val();
		userPassFn(val);
	});
	$(".loginPassword").focus(function(event) {
		$(".Tip2").hide();
	});

	/* ====== 登录确定 ====== */
	$('.loginSent').on('click',function() {
		var data = {};
		var info = '';
		var userTxt = $(".loginText").val();
		var passWordTxt = $(".loginPassword").val();
		var checkLogin = userNameFn(userTxt);
		var checkPass = userPassFn(passWordTxt);
		if(checkLogin && checkPass) {

			//记住登陆密码
			if($('.checkbox').prop('checked')) {
				data.userName = userTxt;
				data.userPassWord = passWordTxt;
				info = JSON.stringify(data);
				localStorage.setItem('key',info);
			}else {
				info = localStorage.getItem('key');
				if(info) {
					localStorage.removeItem('key');
				}
			}
			window.location.href = '../page/yunpan.html';
		};
	});

	//用户名格式验证
	function userNameFn(val) {
		var checked1 = checkemail(val);
		var checked2 = basicValidateMobile(val).onOff;

		if(!checked1 && !checked2){
			$(".Tip1").show();
			return false;
		}
		return true;
	};

	//密码格式验证
	function userPassFn(val) {
		var re = /^[a-zA-Z][0-9a-zA-Z]{5,15}$/g;
		var val = $(".loginPassword").val();
		if(!re.test(val)){
			$(".Tip2").show();
			return false;
		}
		return true;
	};
});

/* ====== 邮箱验证 ====== */
function checkemail(email){
	var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	var ss = email.split(".")[1];
	if(!reg.test(email)||ss.length<2){
		return false ;
	}else{
		return true ;
	}
};

/* ====== 手机号验证 ====== */
function basicValidateMobile(mobile) {
    var re = /^0*(86)*(13|15|14|18|17)\d{9}$/;
    var req = /^\d*$/;
    if(mobile){
        if($.trim(mobile) == "" || $.trim(mobile).length < mobile.length){
            return {onOff:false, message:"手机号码不可填写空格，请仔细核对正确填写！"};
        }else if(mobile.length!=11){
			 return {onOff:false, message:"手机号码格式不对，请正确填写！"};
		}else if(!re.test(mobile)){
            if(req.test(mobile) && mobile.length < 11){
                return {onOff:false, message:"手机号码不可少于11位，请正确填写！"};
            }else{
                return {onOff:false, message:"手机号码格式不对，请正确填写！"};
            }
        }else{
            return{onOff:true, message:"手机号正确"};
        }
    }else{
        return {onOff:false, message:"手机号码不能为空！"};
    }
};