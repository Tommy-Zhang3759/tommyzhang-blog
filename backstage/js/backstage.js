var drawer = new mdui.Drawer("#drawer");
document.getElementById('toggle').addEventListener('click', function () {
    drawer.toggle();
  });

function cleaneditor(){
    mdui.dialog({
        title: '确定要清除所有数据吗？',
        content: '数据可能会丢失',
        buttons: [
          {
            text: '取消'
          },
          {
            text: '清除',
            onClick: function(){
                je.clear();
            }
          }
        ]
      }); 
}
function deletear(){
    mdui.alert("删除成功");
}
function editar(arnum){
    var xhr=new XMLHttpRequest();
    url="../../arhtml/"+arnum+".html";
    console.log(url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
                je=new jineditor(arnum,500,3,"请键入内容");
                je.create();
                console.log(toMarkdown(xhr.responseText));
                je.append(toMarkdown(xhr.responseText));
                mdui.alert("成功创建编辑区");
            }
        }
    xhr.open("GET",url,false);
    xhr.send(null);
    console.log(xhr.responseText);
}

function applyarticle(){
    window.alert(je.htmlcontent());
    getarinfo();
    var apply=new XMLHttpRequest();
    arcontent=je.htmlcontent();
    data={'content':arcontent,'author':arauthor.value,'title':artitle.value,'subtitle':arsubtitle.value};
    console.log(JSON.stringify(data));
    apply.open("POST","/",false);  //调用AddDataToServer
    apply.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");   //设置请求头信息
    apply.onreadystatechange = function () {
    if (apply.readyState == 4 && apply.status == 200) {
            mdui.alert("Success!");
        }
    }
    apply.send(JSON.stringify(data)); //设置为发送给服务器数据JSON.stringify(data)
}

function gethtml(){
    window.alert("HTML代码："+je.htmlcontent());
}

function getmd(){
    window.alert("MD："+je.mdcontent());
}

function getarinfo(){
    var arauthor=document.getElementById("arauthor");
    var artitle=document.getElementById("artitle");
    var arsubtitle=document.getElementById("arsubtitle");
    if(arauthor.value=="")
    {
        mdui.alert("作者不能为空！");
        return false;
    }
    if(artitle.value=="")
    {
        mdui.alert("标题不能为空！");
        return false;
    }
    if(arsubtitle.value=="")
    {
        mdui.alert("副标题不能为空！");
        return false;
    }
    return true;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
         }
         if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
         }
     }
    return "";
}
function getHashCode(str){
    str = str.toLowerCase();
    var hash  =   1315423911,i,ch;
    for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));
    }
    return  (hash & 0x7FFFFFFF);
}