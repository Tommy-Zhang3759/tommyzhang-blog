var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
function login() {
    var username = document.getElementById("Username").value;
    var password = document.getElementById("Password").value;        
    document.cookie="NONE";
    
    httpRequest.open('POST', '/', true); //第二步：打开连接
    httpRequest.setRequestHeader("Content-type", "api/login_usernameAndPassword");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
            
    httpRequest.send(username+" "+password);//发送请求 将情头体写在send中
    /**
     * 获取数据后的处理程序
    */
    httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
            var json = httpRequest.responseText;//获取到服务端返回的数据
            console.log(json);
        }
    }
}