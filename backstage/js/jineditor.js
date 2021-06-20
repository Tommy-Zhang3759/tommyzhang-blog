window.onload=function(){
    console.log("%c%s%c%s",
            "padding:8px;border-radius:5px 0px 0px 5px;background-color:#e8e8e8;font-size:13px;",
            "Jin-editor.js","padding:8px;border-radius:0px 5px 5px 0px;background-color:#cfcfcf;font-size:13px;",
            "is loaded");
}

function jineditor(name,height,zindex,placeholder) {
    this.name = name;
    this.height = height;
    this.zindex = zindex;
    this.placeholder = placeholder;
    this.defaultstyle = true;
    this.load_dependent=true;
    this.btn_content = ["title", "link", "photo","format_bold","format_italic","format_strikethrough","code","remove","format_list_bulleted","format_list_numbered","format_quote","no_sim"];
    this.btn_info = ["标题","链接","照片","粗体文本","斜体文本","删除线","代码片段","分割线","无序列表","有序列表","引用","清空全部内容"];
    this.btn_type = [2,1,1,1,1,1,1,1,1,1,1,3];//1:普通按钮，2:带有二级菜单 3，功能性按钮
    this.btn_func=["1","2","3","4","5","6","7","8","9","10","11","removeall();"];
    this.custom_btn_content = [""];
    this.custom_btn_type=[""];
    this.custom_btn_info=[""];
    this.custom_btn_func=[""];
    this.custom_tb = "";
    this.custom_ta = "";
    this.marked="https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    this.tomd="";
    this.tooltip_delay=0;
    this.create = function() {
        try{
            if(isEmpty(this.name)==true){
                throw "no-name"
            }
            if(this.height<=40){
                throw "wrong-height"
            }
            if(this.height<100){
                throw "too-small"
            }
            if(this.zindex<=0){
                throw "zindex"
            }
            if(this.tooltip_delay<0){
                throw "invalid-delay"
            }
            if(isEmpty(this.placeholder)==true){
                throw "no-placeholder"
            }
        }
        catch(error){
            if(error=="no-name"){
                console.error("jin-editor:Cannot get editor name");
                return false;
            }
            if(error=="wrong-height"){
                console.error("jin-editor:Invalid height");
                return false;
            }
            if(error=="too-small"){
                console.warn("jin-editor:Editor is too small")
            }
            if(error=="zindex"){
                console.warn("jin-editor:The property 'z-index' is too small")
            }
            if(error=="no-placeholder"){
                console.warn("jin-editor:No placeholder text was filled in. There may have been an error")
            }
            if(error=="invalid-delay"){
                console.warn("jin-editor:Invalid tooltip delay (Property has a value less than zero)")
            }
        }
        editor=document.getElementById(this.name);
        editor.innerHTML="<div id='je-toolbar'></div><textarea id='je-textarea'></textarea>";
        toolbar=document.getElementById("je-toolbar");
        textarea=document.getElementById("je-textarea");
        if(this.defaultstyle==true){
            editor.style.height=this.height;
            editor.style.zIndex=this.zindex;
            editor.style.boxShadow="0px 0px 10px 1px #e5e5e5";
            editor.style.borderRadius="5px";
            editor.style.overflow="hidden";
            toolbar.style.borderBottom="1px solid #e5e5e5";
            toolbar.style.width="100%";
            toolbar.style.minheight="36px";
            textarea.style.width="100%";
            taheight=this.height-61;
            textarea.style.height=String(taheight)+"px";
            textarea.style.width="calc(100% - 30px)";
            textarea.style.border="0px";
            textarea.style.padding="15px 15px 10px 15px";
            textarea.style.resize="none";
            textarea.style.outline="none";
            textarea.style.letterSpacing="0.65px";
        }
        else{
            try{
                if(isEmpty(this.custom_ta)==true){
                    throw "nostyle-ta"
                }
                else if(isEmpty(this.custom_tb)==true){
                    throw "nostyle-tb"
                }
            }
            catch(error){
                if(error=="nostyle-ta"){
                    console.error("jin-editor:Missing style property for textarea");
                }
                if(error=="nostyle-tb"){
                    console.error("jin-editor:Missing style property for toolbar");
                }
            }
            toolbar.setAttribute("class",this.custom_tb);
            textarea.setAttribute("class",this.custom_ta);
        }
        if(this.load_dependent==true){
            load(this.tomd);
            load(this.marked);
        }
        textarea.setAttribute("placeholder",this.placeholder);


        title_menu=["一级标题","二级标题","三级标题","四级标题","五级标题","六级标题"];
        title_map=["# ","## ","### ","#### ","##### ","###### "];
        map=["null","[链接名称](链接地址)","\n![alt 属性文本](图片地址)\n\n","**粗体文本**","_斜体文本_","~~带有删除线文本~~","\n```代码文本```\n","\n------\n\n","\n- 无序列表项","\n数字. 有序列表项","\n> 引用内容"];


        tmp_btngroup=document.createElement("div");
        toolbar.appendChild(tmp_btngroup);
        tmp_btngroup.setAttribute("class","mdui-btn-group");
        for(i=0;i<this.btn_content.length;i++){
            var tmp_btn=document.createElement("button");
            tmp_btngroup.appendChild(tmp_btn);
            tmp_btn.setAttribute("class","mdui-btn mdui-btn-sm");
            tmp_btn.setAttribute("mdui-tooltip","{content:'"+this.btn_info[i]+"',position:'top',delay:"+this.tooltip_delay+"}");
            tmp_btn.innerHTML+="<i class='mdui-icon material-icons'>"+this.btn_content[i]+"</i>";
            if(this.btn_type[i]==2){
                tmp_sec=document.createElement("div");
                tmp_btn.appendChild(tmp_sec);
                tmp_sec.setAttribute("class","je-selector");
                tmp_sec.setAttribute("id","je-sec-"+this.btn_content[i]);
                tmp_sec.style.display="none";
                tmp_btn.style.zIndex=this.zindex+1;
                tmp_btn.setAttribute("onfocus","showsec('"+this.btn_content[i]+"')");
                tmp_btn.setAttribute("onblur","hidesec('"+this.btn_content[i]+"')");
                var create_sec;
                eval("create_sec="+this.btn_content[i]+"_menu.length");
                for(j=0;j<create_sec;j++){
                    var tmp_sec=document.createElement("div");
                    var sec=document.getElementById("je-sec-"+this.btn_content[i]);
                    sec.appendChild(tmp_sec);
                    tmp_sec.setAttribute("class","je-sec-items mdui-ripple");
                    eval("tmp_sec.innerHTML+="+this.btn_content[i]+"_menu[j]");
                    tmp_sec.setAttribute("onclick","insertAtCursor(textarea,"+this.btn_content[i]+"_map["+j+"]);"+"hidesec('"+this.btn_content[i]+"');");
                }
            }
            else if(this.btn_type[i]==3){
                tmp_btn.setAttribute("onclick",this.btn_func[i]);
            }
            else{tmp_btn.setAttribute("onclick","insertAtCursor(textarea,"+"map["+i+"]);")}
        }

        
    };
    this.append = function(appendcontent){
        textarea.value=textarea.value+appendcontent;
    }
    this.htmlcontent = function(){
        return marked(textarea.value);
    }
    this.mdcontent = function(){
        return toMarkdown(textarea.value);
    }
    this.getcontent = function(){
        return textarea.value;
    }
    this.clear = function(){
        textarea.value="";
    }
  }

function load(src){
    var head=document.getElementsByTagName("head")[0];
    var tmp_load=document.createElement("script");
    tmp_load.type="text/javascript";
    tmp_load.src=src;
    head.appendChild(tmp_load);
    tmp_load.onload = function(){
        console.log("'",src,"' is loaded");
    };
}

function showsec(sec_name){
    var sec=document.getElementById("je-sec-"+sec_name);
    sec.style.display="block";
}
function hidesec(sec_name){
    var sec=document.getElementById("je-sec-"+sec_name);
    sec.style.display="none";
}
function insertAtCursor(obj,str) {
    if (document.selection) {
        obj.focus();
        var sel = document.selection.createRange();
        sel.text = str;
    } 
    else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;

    } else {
        obj.value += str;
    }
    obj.focus();
}
function getSelectText(obj) {
    if (window.getSelection) {
        if (obj.selectionStart != undefined && obj.selectionEnd != undefined) {
            return obj.value.substring(obj.selectionStart, obj.selectionEnd);
        } 
        else{
            return "";
        }
    } 
    else {
        return document.selection.createRange().text;
    }
}
function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
    }else{
        return false;
    }
}

document.onkeydown=function(event){
	var e = window.event.keyCode;
	if(e==49&&event.ctrlKey&&event.shiftKey){
		insertAtCursor(textarea,title_map[0]);
	}
    if(e==50&&event.ctrlKey&&event.shiftKey){
		insertAtCursor(textarea,title_map[1]);
    }
    if(e==51&&event.ctrlKey&&event.shiftKey){
		insertAtCursor(textarea,title_map[2]);
    }
    if(e==52&&event.ctrlKey&&event.shiftKey){
		insertAtCursor(textarea,title_map[3]);
    }
    if(e==53&&event.ctrlKey&&event.shiftKey){
		insertAtCursor(textarea,title_map[4]);
    }
    if(e==54&&event.ctrlKey&&event.shiftKey){
		insertAtCursor(textarea,title_map[5]);
    }
    if(e==76&&event.ctrlKey&&event.shiftKey){
		insertAtCursor(textarea,map[7]);
    }
    if(e==66&&event.ctrlKey){
        var tmp_str=getSelectText(textarea);
        if(isEmpty(tmp_str)==false){
            insertAtCursor(textarea,"**"+tmp_str+"**");
        }
    }
    if(e==73&&event.ctrlKey){
        var tmp_str=getSelectText(textarea);
        if(isEmpty(tmp_str)==false){
            insertAtCursor(textarea,"_"+tmp_str+"_");
        }
	}
};

function removeall(){
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
                textarea.value="";
            }
          }
        ]
      }); 
}