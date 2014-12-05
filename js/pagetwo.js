/**
 * Created by FusGoethe on 14-11-12.
 */

window.onload = control;
document.onmousedown =mouseclick;

function control(){

    for(var i=0;i<document.images.length;i++)
       if(document.images[i].className=="mokuai"){
           shollow(document.images[i]);
           document.getElementById(document.images[i].id+"_a").href =document.images[i].id+"_h.html"
       }
    document.getElementById("bt").onmousedown=changer;

}



function shollow(thisImages){
    thisImages.outImage = new Image();
    thisImages.overImage = new Image();

    thisImages.outImage.src = "img/"+thisImages.id+".png";
    thisImages.overImage.src = "img/"+thisImages.id+"_s.png";

    thisImages.onmouseout = function(){
        this.src = thisImages.outImage.src;
    }
    thisImages.onmouseover = function(){
        this.src = thisImages.overImage.src;
    }
}

function changer() {                                                            //变换按钮大小
    var imgstyle = document.getElementById("c_mokuai_1");
    var inum1=600;var inum2=400;

    if (this.value == "yuan") {
        imgstyle.setAttribute("style","height: "+inum1+"px;width: "+inum2+"px;");                                             //.value="height: 600px;width: 400px;";
        this.value = "noyuan";
    }
    else {
        imgstyle.setAttribute("style","height: 300px;width: 200px;");                                            //.value="height: 300px;width: 200px;";
        this.value = "yuan";
    }
}


function mouseclick(){
    if(window.event.button==2)
    event.returnValue= false;

}
