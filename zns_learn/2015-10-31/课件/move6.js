// 运动框架
function getStyle(obj,name){
			return obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name];
		};

/*
	json = {width:200,height:200}
*/		

//var timer=null;  //全局变量 极其不好！
function	move(obj,json,time,end){
		var start={}; //start = { width:100,height:100} 
		var dis ={};  //dis={width:200,height:200}
		
		for(var name in json){
			start[name]=parseFloat(getStyle(obj,name));
			dis[name] =json[name]-start[name];
		}
		var count=Math.floor(time/30);
		//运动总次数
		var n=0; // 当前运动次数
		clearInterval(obj.timer); // 清除定时器
		obj.timer=setInterval(function(){
			n++; //运动次数加1
			
			for( var name in json){
				var a=n/count;
				var cur =start[name]+dis[name]*a*a;
				if(name=='opacity'){
					obj.style.opacity=	cur;
					obj.style.filter='alpha(opacity:'+cur*100+')';
				}else{
					obj.style[name]=cur+'px'; 
					//对象.样式名=起始位置+运动距离*(当前运动次数/运动总次数)
				}	
			}
				
			if(n==count){ //如果当前运动次数与总次数相等(最后一次)
					clearInterval(obj.timer); //停止定时器
					end&&end();
			}
		},30);
	}
	
	
	
	
	
	
	
	