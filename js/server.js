var http=require("http"),
    fs=require("fs"),
    url=require("url");
//创建一个服务
var server1=http.createServer(function(req,res){
	//解析客户端请求地址中的文件目录名称以及传递给当前服务器的数据内容。
	var urlObj=url.parse(req.url,true),
	pathname=urlObj['pathname'],
	query=urlObj['query'];
	//如果客户端请求资源不存在，服务会中止，添加try chatch捕获错误信息，服务才不会报错，可继续执行.
	
	//处理静态信息的请求====>>>>>>>>>前端路由
	var reg=/\.(HTML|JS|CSS|JSON|TXT|ICO|JPG|GIF|PNG|BMP)/i;
	if(reg.test(pathname)){
		//获取请求文件的后缀名
		var suffix=reg.exec(pathname)[1].toUpperCase();
		//根据请求文件的后缀名获取到当前文件的MIME类型
		var suffixMIME="text/plain";
		switch (suffix){
			case "HTML":
			suffixMIME="text/html";
			break;
			
			case "css":
			suffixMIME="text/css";
			break;
			
			case "js":
			suffixMIME="text/javascript";
			break;
			
		}
		
		try{
			var conFile=fs.readFileSync("."+pathname,"utf-8");
			res.writeHead(200,{'cont-type':'suffixMIME +;charset=utf-8;'})
			res.end(conFile);
		}chatch(e){
			res.writeHead(404,{'cont-type':'text/plain;charset=utf-8;'});
			res.end("the file you requst is not found");
		}	
	}
	
	//api数据接口的处理
	var con=null,result=null,customId=null,customPath="./json/custom.json";
	//获取所有客户信息
	con=fs.readFileSync(custompath,"utf-8")
	    con.length===0?con="[]":null;//防空
	    con=JSON.parse(con);
	
	
	if(pathname==="/getList"){
//	    con=fs.readFileSync(custompath,"utf-8")
//	    con.length===0?con="[]":null;//防空
//	    con=JSON.parse(con);
//	    //开始返回数据
	    result={
		    code:1,
		    msg:"没有任何信息",
		    data:null
	    };
	
	    if (con.length>0) {
		    result={
			    code:0,
		        msg:"成功",
		        data:con
		    }
	    }
	    res.writeHead(200,{'content-type':'application/json;chartset=utf-8'});
	    res.end(JSON.stringify(result));//转化为json格式字符串。
	    return;
	}
	
	//获取个别客户信息：根据传递进来的客户ID
	if(pathname==="/getInfo"){
		customId=query["id"];
		
		result={
			code:1,
			msg:"客户不存在",
			data:null
		}
		for(var i=0;i<con.length;i++){
			if(con[i]["id"]===customId){
				result={
					code:0,
					msg:"成功",
					data:con[i]
				};
			}
		}
//		con=fs.readFileSync(customPath,"utf-8");
//		con.length===0 ?con="[]":null;
//		JSON.parse(con);
		
	}
	
	
	//根据客户信息删除客户
	if(pathname==="/removeInfo"){
		customId=query["id"];
		var flag=false;
		for(var i=0;i<con.length;i++){
			if(con[i]["id"]==customId){
				con.splice(i,1);
				flag=true;
				break;
			}
		}
		result={
			code:1,
			msg:"删除失败"
		}
		if(flag){
			fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');
			result={
				code:0,
				msg:"删除成功"
			};
		}
		res.writeHead(200,{"content-type":"application/json;charset=utf-8;"});
		res.end(JSON.stringify(result));
		return;	
	}
	
//	res.code=con.length===0?1:0;
//	res.msg=con.length===0?"没有任何信息":"成功";
//	res.data=con;
	
});	



//	try{
//		var con=fs.readFileSync("."+path,"utf-8")
//	    res.end(con);
//	}catch(e){
//		res.end("the file you requst is not find")
//	}

//为当前的服务配置端口
server1.listen(81,function(){
	console.log("server is success, listening on 81 port")
});
