/**
 * Created by FusGoethe on 14-12-2.
 */

var dom={},//显示的面板

    lastMouseWheelStep=0,   //滚轮

    z_indexE=5,           //决定层次

    navDirection=0,    //判定前进方向

    config= {
        //决定overview时的颜色，最好和mouseover时一样；
      title_over_BG:"#626975",

      index_over_BG:"#8797B7"


    };





window.onload=start;

function start(){

    stepu();

    addeventListens();

    layout();
}

function stepu(){

    dom.ebook_wrapper = document.querySelector( '.ebook' );
    dom.title_wrapper = document.querySelectorAll( '.title' );
    dom.index_wrapper = document.querySelectorAll('.index');
    dom.cover_wrapper = document.querySelector('.bookcover');
    dom.passage_wrapper = document.querySelectorAll('.passage');
    dom.name=document.querySelectorAll('[class$="name"]');

    dom.ebook_wrapper.classList.add("now");
    dom.cover_wrapper.classList.add("next");
    dom.cover_wrapper.classList.add("tonext");


    //通过”box“类，将容器和其他元素分开来,先给title和index添加好背景
    dom.ebook_wrapper.classList.add("box");
    dom.cover_wrapper.classList.add("box");
    toArray(dom.title_wrapper).forEach(function(elf){
        elf.classList.add("title_out");
        elf.classList.add("box");
    });

    toArray(dom.index_wrapper).forEach(function(elf){
       // elf.style.display="none";//背景颜色没添加
        elf.classList.add("box");
        elf.classList.add("index_out")
    });

    toArray(dom.passage_wrapper).forEach(function(elf) {
        elf.classList.add("box");
    });


    //写上id和name
    dom.cover_wrapper.setAttribute("id","bookcover");

    for(var i=0;i<dom.title_wrapper.length;i++){
        dom.title_wrapper[i].setAttribute("id","title_"+(i+1));

        var title_index=dom.title_wrapper[i].querySelectorAll(".index");

        for(var j=0;j<title_index.length;j++){
            title_index[j].setAttribute("id","t_"+(i+1)+"_index_"+(j+1));
        }
    }

    //这行要放到layoutforcover中
    toArray(dom.name).forEach(function(elf){
        elf.style.display="none";
    });

}







function addeventListens(){

    //为title和index及其name添加变化
    toArray(dom.title_wrapper).forEach(function(elf){
        elf.addEventListener("mouseover",function(){elfmouseover(elf);},false);
        elf.addEventListener("mouseout",function(){elfmouseout(elf);},false);
    });

    toArray(dom.index_wrapper).forEach(function(elf){
        elf.addEventListener("mouseover",function(){elfmouseover(elf);},false);
        elf.addEventListener("mouseout",function(){elfmouseout(elf);},false);
    });


    //添加鼠标事件
    addmouseWhell();

}






//布局
function layout(){


    var domNow=document.querySelector(".now"),
        domNext=document.querySelectorAll(".next"),
        domPast=document.querySelectorAll(".past");

    //显
    toArray(domNext).forEach(function(elf){
       elf.style.display="block";
    });

    //隐
    toArray(domNow.querySelectorAll(".next .box")).forEach(function(elf){
        if(!elf.classList.contains("title"))elf.style.display="none";
    });

    //做效果
    if(navDirection>0){
        z_indexE+=5;


        var domHeight,
            domWidth,
            domNowHeight=domNow.offsetHeight,
            domNowWidth=domNow.offsetWidth,
            scaleh, scalew;

        if(!!domPast){
            for(var i=0;i<domPast.length;i++){
                if(!!domPast[i].querySelector(".now")){
                    domHeight=domPast[i].offsetHeight;
                    domWidth=domPast[i].offsetWidth;
                }
            }
        }else{
            domHeight=dom.cover_wrapper.offsetHeight;
            domWidth=dom.cover_wrapper.offsetWidth;
        }

        //该部分计算缩放比例
        scaleh = domHeight/domNowHeight;
        scalew = domWidth/domNowWidth;

        domNow.setAttribute("style","z-index: "+z_indexE);

        transformElement(domNow,"scale("+scalew+","+scaleh+")");


        domNow.classList.add("overview");

        //额外的,防止鼠标移开后变色
        if(domNow.classList.contains("title")){
            domNow.setAttribute("style","background: "+config.title_over_BG);
        }else if(domNow.classList.contains("index")){
            domNow.setAttribute("style","background: "+config.index_over_BG);
        }

    }else if(navDirection<0){
        z_indexE-=5;

        for(var i=0;i<domNext.length;i++){
            if(domNext[i].classList.contains("overview")){
                transformElement(domNext[i],"scale(1,1)");
                domNext[i].removeAttribute("style");
                domNext[i].classList.remove("overview");
            }
        }
    }

    addmouseWhell();
}









//前滚鼠标处理方式
function upFocusPosition(){



    var upelf=document.querySelector(".tonext");

   if(!!upelf){

       removemouseWhell();

       var nowpast=document.querySelectorAll(".past");

       //过上层（非直系上层和所有上上层）除去past
       if(!!nowpast) toArray(nowpast).forEach(function(elf){
           elf.classList.remove("past");
       });

       upelf.parentNode.classList.add("past");
       upelf.parentNode.classList.remove("now");

       upelf.classList.add("now");
       upelf.classList.remove("tonext");

       toArray(document.querySelectorAll(".next")).forEach(function(elf){
           if(!elf.classList.contains("now"))elf.classList.add("past");
           elf.classList.remove("next");
       });


       toArray(upelf.querySelectorAll(".now > .box")).forEach(function(elf){
           elf.classList.add("next");
       });


       //这是方向
       navDirection=1;
       layout();


   }else{
       return false;
   }

}


//后滚鼠标处理方式
function downFocusPosition(){



    var downElf=document.querySelector(".now");

    if(!downElf.classList.contains("ebook")){

        removemouseWhell();
 //先处理该层及下层元素
        var downElfPare=downElf.parentNode;



        toArray(downElf.querySelectorAll(".now > .box")).forEach(function(elf){
            elf.classList.remove("next");
        });

        //该类名仅仅用于选择该层所有box
        downElfPare.classList.add("tonow");
        toArray(downElfPare.querySelectorAll(".tonow > .box")).forEach(function(elf){
            elf.classList.add("next");
            if(!elf.classList.contains("now"))elf.classList.remove("past");
        });
        downElfPare.classList.remove("tonow");

        downElf.classList.remove("now");

        //为了在ebook为now时还能往里层
        if(downElf.classList.contains("bookcover"))downElf.classList.add("tonext");


 //再处理上层及上上层元素
        downElfPare.classList.add("now");
        downElfPare.classList.remove("past");

        if(!downElfPare.classList.contains("ebook")){

            var downElfPP=downElfPare.parentNode;

            //该类名与之上的有类似作用；
            downElfPP.classList.add("totonow");
            toArray(downElfPP.querySelectorAll(".totonow > .box")).forEach(function(elf){
                if(!elf.classList.contains("now")) elf.classList.add("past");
            });
            downElfPP.classList.remove("totonow");

            downElfPP.classList.add("past");
        }


        //方向
        navDirection=-1;
        layout();


    }else{
        return false;
    }

}





//mouseover的处理方式
function elfmouseover(overelf){

    if(!document.querySelector(".now").classList.contains("ebook")){

        var overEC=overelf.classList;

        //背景换装
        overEC.add(overEC[0]+"_over");
        overEC.remove(overEC[0]+"_out");


        //缺给titlename换装
        //只有处于next层的元素才能tonext
        if(overEC.contains("next"))overEC.add("tonext");
    }else{
        return false;
    }

}


//mouseout的处理方式
function elfmouseout(outelf){
    
        var outEC = outelf.classList;

        outEC.add(outEC[0] + "_out");
        outEC.remove(outEC[0] + "_over");

        if (outEC.contains("tonext"))outEC.remove("tonext");

}









function addmouseWhell(){
    document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false );
    document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );
}

function removemouseWhell(){
    document.removeEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false );
    document.removeEventListener( 'mousewheel', onDocumentMouseScroll, false );
}


/**
 * Converts the target object to an array.
 */
function toArray( o ) {

    return Array.prototype.slice.call( o );

}




/**
 * Applies a CSS transform to the target element.
 */
function transformElement( element, transform ) {

    element.style.WebkitTransform = transform;
    element.style.MozTransform = transform;
    element.style.msTransform = transform;
    element.style.OTransform = transform;
    element.style.transform = transform;

}







/**
 * Handles mouse wheel scrolling, throttled to avoid skipping
 * multiple slides.鼠标事件
 */
function onDocumentMouseScroll( event ) {

    if( Date.now() - lastMouseWheelStep > 600 ) {

        lastMouseWheelStep = Date.now();

        var delta = event.detail || -event.wheelDelta;
        if( delta > 0 ) {
            upFocusPosition();
        }
        else {
            downFocusPosition();
        }

    }

}




