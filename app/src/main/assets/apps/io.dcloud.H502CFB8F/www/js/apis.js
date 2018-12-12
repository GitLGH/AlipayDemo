var base_api_url = 'http://IP地址:端口号/';
var apis = {};
var url_obj = {};
var my_img_url = '';

$(function() {
	my_img_url = base_api_url;
	apis = {
		//支付宝授权
		'getUrl': base_api_url + '项目名称/获取授权路径的接口名称',
		//支付宝授权信息
		'getAlipayInfo': base_api_url + '项目名称/获取支付宝账户信息的接口名称',
	}
})

function getlocalStorage(_key) {
	return window.localStorage.getItem(_key);
}

function setlocalStorage(_key, _val) {
	return window.localStorage.setItem(_key, _val);
}

// 带标题栏控件的Webview窗口
var webview = null;

function titleNViewWebview(obj) {
	//创建窗口
	//在窗口中增加scalable:true,属性可支持缩放
	webview = plus.webview.create(obj.html, obj.id, {
		scalable: true,
		'titleNView': {
			'backgroundColor': '#1f7ebe',
			'titleText': obj.title,
			'titleColor': '#FFFFFF',
			//'autoBackButton': true,
			'buttons': [{
				text: '返回',
				float: 'left',
				fontSize: '14px',
				onclick: function() {
					plus.webview.getWebviewById(obj.id).close();
				}
			}]
		}
	});
	//解决缩放问题

	//webview.show('slide-in-right');
	webview.addEventListener('titleUpdate', function(e) {
		//console.log('页面跳转');
		if(window.plus) {
			onNetChange();
		}
	});
}

//获取当前设备的网络类型
function plusReady() {
	var types = {};
	types[plus.networkinfo.CONNECTION_UNKNOW] = "Unknown connection";
	types[plus.networkinfo.CONNECTION_NONE] = "None connection";
	types[plus.networkinfo.CONNECTION_ETHERNET] = "Ethernet connection";
	types[plus.networkinfo.CONNECTION_WIFI] = "WiFi connection";
	types[plus.networkinfo.CONNECTION_CELL2G] = "Cellular 2G connection";
	types[plus.networkinfo.CONNECTION_CELL3G] = "Cellular 3G connection";
	types[plus.networkinfo.CONNECTION_CELL4G] = "Cellular 4G connection";
	//console.log("Network: " + types[plus.networkinfo.getCurrentType()]);
	webview.show('slide-in-right');
}

function onNetChange() {
	var nt = plus.networkinfo.getCurrentType();
	switch(nt) {
		case plus.networkinfo.CONNECTION_ETHERNET:
		case plus.networkinfo.CONNECTION_WIFI:
			//console.log("当前网络为WiFi");
			webview.show('slide-in-right');
			break;
		case plus.networkinfo.CONNECTION_CELL2G:
		case plus.networkinfo.CONNECTION_CELL3G:
		case plus.networkinfo.CONNECTION_CELL4G:
			//console.log("当前网络非WiFi");
			webview.show('slide-in-right');
			break;
		default:
			webview.show('slide-in-right');
			//console.log("当前没有网络");
			mui.alert('请检查网络连接！！！', '提示', function() {
				
			});
			break;
	}
}

function guid() {
	function S4() {
		return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return(S4() + "-" + S4() + "-" + S4() + "-" + S4());
}