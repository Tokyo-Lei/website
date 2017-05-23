~function(){
	function createXHR(){
	var xhr=null,
	flag=false;
	ary=[
	function(){
		return new XMLHttpRequest;
	},
	function(){
		return new ActiveXObject("microsoft.XMLHTTP");
	},
	function(){
		return new ActiveXObject("Msxml2.XMLHTTP");
	},
	function(){
		return new ActiveXObject("Msxml3.XMLHTTP");
	}
	];
	
	 for (var i=0; i<ary.length;i++) {
	 	var curFn=ary[i];
	 	try{
	 		xhr=curFn();
	 		//本次循环没有错误；说明此方法兼容，下次可直接执行此方法，这需要把xhr重写此方法。
	 		createXHR=curFn;
	 		flag=true;
	 		break;
	 	}catch(e){
	 		//本次循环出现错误，继续下一次循环.
	 	}
	 } 
	 
	if(!flag){
		throw new Error("your brower is not support ajax,please change your brower ,try again")
	}
	return xhr;
  };
     function ajax(options){
	//把需要使用的参数设置为一个初始值
	var _default={
		url:"",
		type:"get",
		dataType:"json",
		async:true,
		data:null,
		gethead:null,
		success:null
	    }
	//使用用户自己传递的参数覆盖默认的值
	for (var key in options) {
		if(options.hasOwnProperty(key)){
			_default[key]=options[key];
		}
	}
	
	//如果当前请求是get，我们需要在末尾加随机数清除缓存。
	if (_default.type==="get") {
		_default.url.indexOf("?") >=0 ?_default.url+="&":_default.url +="?";
		_default.url +="_="+Math.random();
	}
	
	
	//send ajax
	var xhr=createXHR();
	xhr.open(_default.type,_default.url,async);
	xhr.onreadystatechange=function(){
		if(/^2\d{2}$/.text(xhr.status)){
			if(xhr.readyState===2){
				if(typeof _default.gethead==="function"){
					_default.gethead.call(xhr);
				}
			}
			if(xhr.readyState===4){
				var val=xhr.responseText;
				if(_default.dataType==="json"){
					val="JSON" in window?JSON.parse(val):eval("("+val+")");//考虑兼容所以判断
				}
				_default.success && _default.success.call(xhr,val);
			}
		}
	}
	xhr.send(_default.data);
    }
     
     
     window.ajax=ajax;//释放到全局
}();
