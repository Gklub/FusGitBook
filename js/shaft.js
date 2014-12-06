/**
 * Created by FusGoethe on 14-12-2.
 */

var dom={},//显示的面板

    lastMouseWheelStep=0,   //滚轮

    z_indexE=-1,           //决定层次

    navDirection=1,    //判定前进方向

    config= {
        // The "normal" size of the presentation, aspect ratio will be preserved
        // when the presentation is scaled to fit different resolutions
        title_width: 960,
        title_height: 700,

        index_width:777,
        index_height:8888,

        // Factor of the display size that should remain empty around the content
        margin: 0.1,

        // Bounds for smallest/largest possible scale to apply to content
        minScale: 0.2,
        maxScale: 1.0,

        // Display controls in the bottom right corner
        controls: true,

        // Enable keyboard shortcuts for navigation
        keyboard: true,

        // Enable the slide overview mode
        overview: true,


        // Turns fragments on and off globally
        fragments: true,

        // Flags if the presentation is running in an embedded mode,
        // i.e. contained within a limited portion of the screen
        embedded: false,


        // Enable slide navigation via mouse wheel
        mouseWheel: false,


        // Hides the address bar on mobile devices
        hideAddressBar: true,

        // Opens links in an iframe preview overlay
        previewLinks: false,

        // Focuses body when page changes visiblity to ensure keyboard shortcuts work
        focusBodyOnPageVisiblityChange: true,

        // Transition style
        transition: 'default', // default/cube/page/concave/zoom/linear/fade/none

        // Transition speed
        transitionSpeed: 'default', // default/fast/slow

        // Transition style for full page slide backgrounds
        backgroundTransition: 'default', // default/linear/none

        // Number of slides away from the current that are visible
        viewDistance: 3,

        // Script dependencies to load
        dependencies: []
    },
     // The current scale of the presentation (see width/height config)
    scale = 1,

    // A delay used to activate the overview mode
    activateOverviewTimeout = 0,

    // A delay used to deactivate the overview mode
    deactivateOverviewTimeout = 0,

    // Flags if the interaction event listeners are bound
    eventsAreBound = false;




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
    dom.cover_wrapper.setAttribute("id","bookcover_next");
    dom.cover_wrapper.setAttribute("name","bookcover");

    for(var i=0;i<dom.title_wrapper.length;i++){
        dom.title_wrapper[i].setAttribute("id","title_"+(i+1)+"_next");
        dom.title_wrapper[i].setAttribute("name","title_"+(i+1));

        var title_index=dom.title_wrapper[i].querySelectorAll(".index");

        for(var j=0;j<title_index.length;j++){
            title_index[j].setAttribute("id","t_"+(i+1)+"_index_"+(j+1)+"_next");
            title_index[j].setAttribute("name","t_"+(i+1)+"_index_"+(j+1));
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
    var domNow=document.querySelector(".now");
    var domNext=document.querySelectorAll(".next");
    var domPast=document.querySelectorAll(".past");


    //排now
    if(!!domNow.attributes.id)
    domNow.attributes.id.value=domNow.attributes.name.value+"_overview";
    domNow.style.zIndex=z_indexE;

    //排next
    for(var i=0;i<domNext.length;i++){
        domNext[i].attributes.id.value=domNext[i].attributes.name.value+"_next";
        domNext[i].style.zIndex="inherit";
        domNext[i].style.display="block";
    }

    //隐
    toArray(domNow.querySelectorAll(".next .box")).forEach(function(elf){
        if(!elf.classList.contains("title"))elf.style.display="none";
    });

    //额外的,防止鼠标移开后变色
    if(domNow.classList.contains("title")||domNow.classList.contains("index")){
        domNow.classList.add(domNow.classList[0]+"_now");
        domNow.classList.remove((domNow.classList[0]+"_over"));
    }
    if(domNow.classList.contains("bookcover")||domNow.classList.contains("title")){
        for(var i=0;i<domNext.length;i++){
            if(domNext[i].classList.contains(domNext[i].classList[0]+"_now")){
                domNext[i].classList.add(domNext[i].classList[0]+"_over");
                domNext[i].classList.remove(domNext[i].classList[0]+"_now");
                break;
            }
        }
    }

    //做效果
    if(navDirection>0){
        z_indexE++;

    }else{
        z_indexE--;
    }


    addmouseWhell();
}








//前滚鼠标处理方式
function upFocusPosition(){

    removemouseWhell();

    var upelf=domcument.querySelector(".tonext");

   if(!!upelf){

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

    removemouseWhell();

    var downElf=domcument.querySelector(".now");

    if(!downElf.classList.contains("ebook")){
 //先处理该层及下层元素
        var downElfPare=downElf.parentNode;

        toArray(downElf.querySelectorAll(".now > .box")).forEach(function(elf){
            elf.classList.remove("next");
        });

        //该类名仅仅用于选择该层所有box
        downElfPare.classList.add("tonow");
        toArray(downElfPare.querySelectorALL(".tonow > .box")).forEach(function(elf){
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

    if(!document.querySelector(".now").classList.contains("ebook")) {

        var outEC = outelf.classList;

        outEC.add(outEC[0] + "_out");
        outEC.remove(outEC[0] + "_over");

        if (outEC.contains("tonext"))outEC.remove("tonext");
    }else{
        return false;
    }
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




