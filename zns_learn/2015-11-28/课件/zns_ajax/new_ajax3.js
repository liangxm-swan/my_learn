'use strict'
function json2url(json){
	var arr = [];
	for(var i in json){
		arr.push(i+'='+json[i]);
	}
	return arr.join('&');
}
function ajax(url,data,fnSucc,fnFail){
	
	//1.创建ajax对象
	if(window.XMLHttpRequest){
		var oAjax = new XMLHttpRequest();
	}else{
		var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
	}
	//2.打开连接
	oAjax.open('GET',url+'?'+json2url(data),true);
	//3.发送请求
	oAjax.send();
	//4.接收
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			if(oAjax.status>=200&&oAjax.status<300||oAjax.status==304){
				fnSucc&&fnSucc(oAjax.responseText);
			}else{
				fnFail&&fnFail();
			}
		}
	};
}







