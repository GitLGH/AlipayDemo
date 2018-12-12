// 支付宝登录
 function alipay(result) {
             if(result[0]=="200"&&result[1]=="9000"){
                //授权登录成功
             	$.ajax({
					type: "get",
					url: apis.getAlipayInfo,//调用后台接口根据auth_code取支付宝账户的基本信息
					dataType: "json",
					cache: false, //缓存
					async: true, //异步
					data: {
						'authCode':result[2],
						'appID':result[4],
						'scope':result[3],
						'type': 2
					},
					success: function(result) {
							alert("授权登录成功,支付宝账户的Id为："+result.data.alipayId);
					}
				});
             }else{
               mui.toast("取消了支付宝授权");
             }
		}


$(function() {
	 // 点击支付宝登录按钮跳转到插件
        mui.init();
    	mui.plusReady(function () {
        		document.getElementById('Alipay').addEventListener('tap', function() {
        	     		 $.ajax({
                    		type: "post",
                    		url: apis.getUrl,//调用后台接口取到请求授权的路径
                    		dataType: "json",
                    		cache: false, //缓存
                    		async: true, //异步
                    		contentType: "application/json",
                    		success: function(result) {
                    		    if(result.data!=null && result.data!=''){
                    		      //同步 var returndata=plus.Alipay.alipayLogin(result.data);
                    		      //异步
                    		      plus.Alipay.alipayLogin(result.data, function( result ) {
                    		         //成功之后异步带回来的数据加入判断
                    		         if(result!=null&&result!=''){
                    		              alipay(result);
                    		         }
                    		       },function(result){
                    		         window.location.href ="error.html";
                    		       });
                    		    }else{
                    		       mui.toast("系统内部异常,请联系管理员！");
                    		    }
                    		         }});
        		    });
        		});
})