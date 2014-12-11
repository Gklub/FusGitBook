/**
 * Created by FusGoethe on 14-12-10.
 */


var view={},//显示的面板

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

    setup();

    //测量浏览器的可见区大小
    analysis();

    addeventListens();

    //布局
    layout();

    //更新页面
    updateView();



}




function setup(){

    view.ebook_wrapper = document.querySelector( '.ebook' );
    view.title_wrapper = document.querySelectorAll( '.title' );
    view.index_wrapper = document.querySelectorAll('.index');
    view.cover_wrapper = document.querySelector('.bookcover');
    view.passage_wrapper = document.querySelectorAll('.passage');
    view.name=document.querySelectorAll("p");

    view.ebook_wrapper.classList.add("now");
    view.cover_wrapper.classList.add("next");
    view.cover_wrapper.classList.add("tonext");


    //通过”box“类，将容器和其他元素分开来,先给title和index添加好背景
    view.ebook_wrapper.classList.add("box");
    view.cover_wrapper.classList.add("box");
    toArray(view.title_wrapper).forEach(function(elf){
        elf.classList.add("title_out");
        elf.classList.add("box");
    });

    toArray(view.index_wrapper).forEach(function(elf){
        // elf.style.display="none";//背景颜色没添加
        elf.classList.add("box");
        elf.classList.add("index_out")
    });

    toArray(view.passage_wrapper).forEach(function(elf) {
        elf.classList.add("box");
    });


    //写上id
    view.cover_wrapper.setAttribute("id","bookcover");

    for(var i=0;i<view.title_wrapper.length;i++){
        view.title_wrapper[i].setAttribute("id","title_"+(i+1));

        var title_index=view.title_wrapper[i].querySelectorAll(".index");

        for(var j=0;j<title_index.length;j++){
            title_index[j].setAttribute("id","t_"+(i+1)+"_index_"+(j+1));
        }
    }


}


function analysis(){
    config.bodyHeight=document.body.offsetHeight;
    config.bodyWidth=document.body.offsetWidth;


}



function addeventListens(){

    //为title和index及其name添加变化
    toArray(view.title_wrapper).forEach(function(elf){
        elf.addEventListener("mouseover",function(){elfmouseover(elf);},false);
        elf.addEventListener("mouseout",function(){elfmouseout(elf);},false);
    });

    toArray(view.index_wrapper).forEach(function(elf){
        elf.addEventListener("mouseover",function(){elfmouseover(elf);},false);
        elf.addEventListener("mouseout",function(){elfmouseout(elf);},false);
    });


    //添加鼠标事件
    addmouseWhell();

}



//布局
function layout(){


    var viewNow=document.querySelector(".now");

    var viewNext=document.querySelectorAll(".next"),
        viewPast=document.querySelector(".past");

    //显
    toArray(viewNext).forEach(function(elf){
        elf.style.display="block";
    });



    //隐
    //太过下层的元素
    toArray(viewNow.querySelectorAll(".next .box")).forEach(function(elf){
        if(!elf.classList.contains("title"))elf.style.display="none";
    });


    //隐去name
    toArray(view.name).forEach(function(elf){
        if(elf.parentNode.classList.contains("next"))
        elf.style.display="block";
        else elf.style.display="none";
    });


    //做效果
    if(navDirection>0){
        z_indexE+=5;


        if(viewNow.classList.contains("title")){
            viewNow.style.background=config.title_over_BG;
        }else if(viewNow.classList.contains("index")){
            viewNow.style.background=config.index_over_BG;

        }

        viewNow.style.zIndex=z_indexE;
        //调整位置
        viewNow.style.top=0+"px";
        viewNow.style.left=0+"px";


        viewNow.style.height=config.bodyHeight+"px";
        viewNow.style.width=config.bodyWidth+"px";

        viewNow.classList.add("overview");
        navDirection=0;

    }else if(navDirection<0){
        z_indexE-=5;

        for(var i=0;i<viewNext.length;i++){
            if(viewNext[i].classList.contains("overview")){
                transformElement(viewNext[i],"scale(1,1)");
                viewNext[i].removeAttribute("style");
                viewNext[i].classList.remove("overview");
            }
        }

        navDirection=0;
    }

    addmouseWhell();
}



//防止窗口改变时出现bug
function updateView(){
    if(navDirection==0) {
        var viewNow=document.querySelector(".now");

        //得到页面大小
        analysis();

        viewNow.style.height=config.bodyHeight;
        viewNow.style.width=config.bodyWidth;
    }

    setTimeout(updateView,1000);
}











//前滚鼠标处理方式
function upFocusPosition(){



    var upelf=document.querySelector(".tonext");

    if(!!upelf){

        //这是方向
        navDirection=1;

        removemouseWhell();

        //上层除去past
        upelf.parentNode.classList.add("past");
        upelf.parentNode.classList.remove("now");
        if(!upelf.parentNode.classList.contains("ebook")) upelf.parentNode.parentNode.classList.remove("past");

        upelf.classList.add("now");
        upelf.classList.remove("tonext");

        toArray(document.querySelectorAll(".next")).forEach(function(elf){
            elf.classList.remove("next");
        });

        toArray(upelf.querySelectorAll(".now > .box")).forEach(function(elf){
            elf.classList.add("next");
        });



        layout();


    }else{
        return false;
    }

}



//后滚鼠标处理方式
function downFocusPosition(){



    var downElf=document.querySelector(".now");

    if(!downElf.classList.contains("ebook")){

        //方向
        navDirection=-1;

        removemouseWhell();
        //先处理该层及下层元素
        var downElfPare=downElf.parentNode;


        toArray(downElf.querySelectorAll(".now > .box")).forEach(function(elf){
            elf.classList.remove("next");
        });


        toArray(downElfPare.querySelectorAll(".past > .box")).forEach(function(elf){
            elf.classList.add("next");
        });


        downElf.classList.remove("now");

        //为了在ebook为now时还能往里层
        if(downElf.classList.contains("bookcover")) downElf.classList.add("tonext");


        //再处理上层
        downElfPare.classList.add("now");
        downElfPare.classList.remove("past");


        if(!downElfPare.classList.contains("ebook")) downElfPare.parentNode.classList.add("past");



        layout();


    }else{
        return false;
    }

}




//mouseover的处理方式
function elfmouseover(overelf){

    if(!document.querySelector(".now").classList.contains("ebook")){

        var overEC=overelf.classList;
        var overP=overelf.querySelector(".next > p");

        //背景换装
        overEC.add(overEC[0]+"_over");
        overEC.remove(overEC[0]+"_out");


        //给titlename换装
        overP.classList.add(overEC[0]+"_over_name");
        overP.classList.remove(overEC[0]+"_name");

        //只有处于next层的元素才能tonext
        if(overEC.contains("next"))overEC.add("tonext");
    }else{
        return false;
    }

}


//mouseout的处理方式
function elfmouseout(outelf){

    var outEC = outelf.classList;
    var outP;


    outelf.classList.add("sort");
    outP=outelf.querySelector(".secrt > p");
    outelf.classList.remove("sort");

    outEC.add(outEC[0] + "_out");
    outEC.remove(outEC[0] + "_over");

    outP.classList.add(outEC[0]+"_name");
    outP.classList.remove(outEC[0]+"_over_name");

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
