var Gettitle=new XMLHttpRequest();
Gettitle.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var title=document.getElementsByClassName("articletitle");
      console.log(Gettitle.responseText);
      var tmp="",c,res,num=0;
      res=Gettitle.responseText;
      for(i=0;i<=res.length;i++){
          c=res[i];
          if(c=="\\"){
              title[num].innerHTML=tmp;
              num++;
              i++;
              tmp="";
              if(num==title.length){
                  break;
              }
          }
          else{
              tmp+=c;
          }
      }
    }
  };
Gettitle.open("GET","database.db",false);
Gettitle.send(null);