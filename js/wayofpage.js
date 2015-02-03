/**
 * Created by FusGoethe on 14-12-10.
 */


var view={},//显示的面板

    lastMouseWheelStep=0,   //滚轮

    z_indexE=5,           //决定层次

    navDirection=0,    //判定前进方向

    IsInIframe=0,      //判断是否在iframe中

    config= {
        //决定title,index,bookcover的背景
        title_over_BG:"#FFFFFF",

        index_over_BG:"#FFFFFF",

        title_BG:"#000000",

        index_BG:"#000000",

        bookcoverBG:"url('img/bookcover_0.png')",

        title_name: '#FFFFFF',

        title_over_name:'#000000',

        index_name: '#FFFFFF',

        index_over_name:'#000000',


    };





window.onload=start;

function start(){

    setup();

    //测量窗口大小
    analysisView();

    //布局
    layout();

    addeventListens();

    //启用更新
    update();


}




function setup(){

    view.ebook_wrapper = document.querySelector( '.ebook' );
    view.title_wrapper = document.querySelectorAll( '.title' );
    view.index_wrapper = document.querySelectorAll('.index');
    view.cover_wrapper = document.querySelector('.bookcover');
    view.passage_wrapper = document.querySelectorAll('.passage');
    view.name=[];
    view.introduction=[];
    view.styleLoad=document.createElement("div");

    //styleLoad只用来储存style
    view.styleLoad.style.display="none";

    //删选name和introduction
     var p=view.ebook_wrapper.querySelectorAll("p");
    toArray(p).forEach(function(elf){
        if(elf.classList.contains("introduction")) view.introduction.push(elf);
        else view.name.push(elf);
    });

    view.ebook_wrapper.classList.add("now");
    //overview为全屏的所有box
    view.ebook_wrapper.classList.add("overview");
    view.cover_wrapper.classList.add("next");
    view.cover_wrapper.classList.add("tonext");


    //通过”box“类，将容器和其他元素分开来,先给title和index添加好背景
    view.ebook_wrapper.classList.add("box");
    view.cover_wrapper.classList.add("box");
    toArray(view.title_wrapper).forEach(function(elf){
        bookcoverChange(elf,config.title_BG);
        elf.classList.add("box");
    });

    toArray(view.index_wrapper).forEach(function(elf){
        elf.classList.add("box");
        bookcoverChange(elf,config.index_BG);
    });

    toArray(view.passage_wrapper).forEach(function(elf) {
        elf.classList.add("box");
    });

    //给name添加颜色
    toArray(view.name).forEach(function(elf){
        if(elf.classList.contains("title_name")) elf.style.color=config.title_name;
        else elf.style.color=config.index_name;
    });


    //写上id，cover不加过度，以防开场时的小动作
    view.cover_wrapper.setAttribute("id","bookcoverStart");
    bookcoverChange(view.cover_wrapper,config.bookcoverBG);


    for(var i=0;i<view.title_wrapper.length;i++){
        view.title_wrapper[i].setAttribute("id","title_"+(i+1));

        var title_index=view.title_wrapper[i].querySelectorAll(".index");

        for(var j=0;j<title_index.length;j++){
            title_index[j].setAttribute("id","t_"+(i+1)+"_index_"+(j+1));
        }
    }

}


//得到body的高和宽
function analysisView() {
    config.bodyHeight = document.body.offsetHeight;
    config.bodyWidth = document.body.offsetWidth;

}


function analysisFont(){
    //为字体的合适程度做准备

    var aimNext=document.querySelector(".next");


         config.nextHeight=aimNext.offsetHeight;
         config.nextWidth=aimNext.offsetWidth;

}


//用来换背景
function bookcoverChange(elf,piece){
    elf.style.background=piece;
    elf.style.backgroundSize="100% 100%";
    elf.style.backgroundRepeat="no-repeat";
    elf.style.backgroundPosition="center";
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


    //控制name和introduction的显隐
    toArray(view.name).forEach(function(elf){
        if(elf.parentNode.classList.contains("next")) elf.style.display="block";
        else elf.style.display='none';
    });
    toArray(view.introduction).forEach(function(elf){
        if(elf.parentNode.classList.contains("now")) elf.style.display="block";
        else elf.style.display="none";
    });

    //做效果
    if(navDirection>0){
        z_indexE+=5;


        //为cover添上过度效果
        if(view.cover_wrapper.attributes.id.value=="bookcoverStart")
        view.cover_wrapper.attributes.id.value="bookcover";


        viewNow.style.zIndex=z_indexE;
        //调整位置
        viewNow.style.top=0+"px";
        viewNow.style.left=0+"px";


        viewNow.style.height=config.bodyHeight+"px";
        viewNow.style.width=config.bodyWidth+"px";
        viewNow.style.borderRadius=0+"%";
        viewNow.style.border="0px";
        viewNow.classList.add("overview");

        if(viewNext[0].classList.contains("passage")) makePassage(viewNext[0]);


        navDirection=0;

    }else if(navDirection<0){
        z_indexE-=5;

        for(var i=0;i<viewNext.length;i++){
            if(viewNext[i].classList.contains("overview")){

                viewNext[i].removeAttribute("style");

               if(viewNext[i].classList.contains("bookcover"))     bookcoverChange(viewNext[i],config.bookcoverBG);
                else if(viewNext[i].classList.contains("title")) bookcoverChange(viewNext[i],config.title_BG);
                else bookcoverChange(viewNext[i],config.index_BG);


                viewNext[i].classList.remove("overview");
            }
        }

        navDirection=0;
    }






    addmouseWhell();
}



//写文章
function makePassage(elf){
    var url="passage/"+elf.parentNode.attributes.id.value+".html";


    elf.innerHTML = [                                                                                // 为什么是方括号？
        '<iframe src="'+ url +'"></iframe>',
         '<p><small>&copy; FusGeothe</small><p>'
    ].join('');

    addIframeMouse();
}



//更新界面和文字
function update(){
    if(navDirection==0){
        if(config.bodyHeight!=document.body.offsetHeight||config.bodyWidth!=document.body.offsetWidth)
        updateView();

        updateDisplay();

        updateFont();

        //使ebook得introduction更大
        if(view.ebook_wrapper.classList.contains("now"))
            view.ebook_wrapper.querySelector('p').style.fontSize=0.6*view.cover_wrapper.offsetHeight+"px";
    }

    setTimeout(update,10);
}



//防止窗口改变时出现bug
function updateView(){
    var viewBox=document.querySelectorAll(".overview");

        //得到页面大小
    analysisView();

     for(var i=0;i<viewBox.length;i++){
         viewBox[i].style.height=config.bodyHeight+"px";
         viewBox[i].style.width=config.bodyWidth+"px";
     }

}




function updateFont(){
    //得到next的大小
    analysisFont();
    //调整适合的字体大小
    var toFontSize=Math.min(config.nextHeight,config.nextWidth)/6;
    var toFontTop=(config.nextHeight-toFontSize)/4;

    toArray(view.name).forEach(function(elf){
                elf.style.fontSize=toFontSize+"px";
                elf.style.top=toFontTop/2+"px";
    });



}



function updateDisplay(){
    var viewNext =document.querySelectorAll(".next");
    var viewNow =document.querySelector(".now");

    //控制box的显隐性
    toArray(viewNext).forEach(function(elf){
        elf.style.display="block";
    });
    toArray(viewNow.querySelectorAll(".next .box")).forEach(function(elf){
        elf.style.display="none";
    });

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

    if(!downElf.classList.contains("ebook")&&!IsInIframe){

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
     //当ebook为now，overelf为now时不执行
    if(!(document.querySelector(".now").classList.contains("ebook")||overelf.classList.contains("now"))){

        var overEC=overelf.classList;
        var overP=overelf.querySelector(".next > p");

        //背景换装
        if(overEC.contains("title")) bookcoverChange(overelf,config.title_over_BG);
        else bookcoverChange(overelf,config.index_over_BG);


        //只有处于next层的元素才能tonext
        if(overEC.contains("next")) overEC.add("tonext");



        if(overEC.contains("title")&&!overEC.contains("overview")){
            //字体颜色变换
            overP.style.color=config.title_over_name;

            bookcoverChange(view.cover_wrapper,"url('img/bookcover_"+overelf.attributes.id.value+".png')");

            overelf.style.zIndex=z_indexE+5;

        }else if(overEC.contains("index")) overP.style.color=config.index_over_name;


    }else{
        return false;
    }

}



//mouseout的处理方式与之上的相反
function elfmouseout(outelf){


    if(!outelf.classList.contains("overview")){
        var outEC = outelf.classList;
        var outP;


        outelf.classList.add("sort");
        outP=outelf.querySelector(".sort > p");
        outelf.classList.remove("sort");


        if(outEC.contains("title")&&!outEC.contains("overview")){


            outP.style.color=config.title_name;

            bookcoverChange(view.cover_wrapper,"url('img/bookcover_0.png')");

            outelf.removeAttribute("style");

        }else outP.style.color=config.index_name;


        if(outEC.contains("title")) bookcoverChange(outelf,config.title_BG);
        else bookcoverChange(outelf,config.index_BG);

        if (outEC.contains("tonext"))outEC.remove("tonext");
    }


}



//为iframe添加动作
function addIframeMouse(){
    var aimIframe=document.querySelectorAll("iframe");

    toArray(aimIframe).forEach(function(elf){
        if(!elf.classList.contains("hasMouseListen")){
            elf.addEventListener('mouseover',function(){IsInIframe=1;},false);
            elf.addEventListener('mouseout',function(){IsInIframe=0;},false);

            elf.classList.add('hasMouseListen');
        }
    })
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


