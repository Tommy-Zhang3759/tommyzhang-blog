var menusty = document.getElementById("navMenu");

function closemenu(){
    menusty.style.transform="none";
}
        
function openmenu(){
    menusty.style.transform="translateX(calc(-65vw - 125px))";
}
        
function Totop(){
    var timer = null;
    totop.onclick = function(){
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn(){
    var oTop = document.body.scrollTop || document.documentElement.scrollTop;
    if(oTop > 0){
    document.body.scrollTop = document.documentElement.scrollTop = oTop - 65;
    timer = requestAnimationFrame(fn);
    }else{
        cancelAnimationFrame(timer);
        }
    });
    }
    console.log('To top: Success');
}
