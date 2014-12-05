/**
 * Created by FusGoethe on 14-12-2.
 */

var dom={},//显示的面板

    lastMouseWheelStep=0,   //滚轮

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
        elf.classList.add("box");
    });

    toArray(dom.index_wrapper).forEach(function(elf){
        elf.style.display="none";//背景颜色没添加
        elf.classList.add("box");
    });

    toArray(dom.passage_wrapper).forEach(function(elf) {
        elf.classList.add("box");
    })


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
    })

    toArray(dom.index_wrapper).forEach(function(elf){
        elf.addEventListener("mouseover",function(){elfmouseover(elf);},false);
        elf.addEventListener("mouseout",function(){elfmouseout(elf);},false);
    })


    //添加鼠标事件
    document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false );
    document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );


}




//布局
function layout(){


}


//前滚鼠标处理方式
function upFocusPosition(){
    var upelf=domcument.querySelector(".tonext");

   if(!!upelf){
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

       layout();

   }else{
       return false;
   }

}


//后滚鼠标处理方式
function downFocusPosition(){
    var downElf=domcument.querySelector(".now");

    if(!downElf.classList.contains("ebook")){
        var downElfPare=downElf.parentNode;

        toArray(downElf.querySelectorAll(".now > .box")).forEach(function(elf){
            elf.classList.remove("next");
        });

        toArray(downElfPare.querySelectorALL(".past > .box")).forEach(function(elf){
            elf.classList.add("next");
            if(!elf.classList.contains("now"))elf.classList.remove("past");
        });
        downElf.classList.remove("now");

        if(downElf.classList.contains("bookcover"))downElf.classList.add("tonext");


        downElfPare.classList.add("now");
        downElfPare.classList.remove("past");

        layout();

    }else{
        return false;
    }

}


//mouseover的处理方式
function elfmouseover(overelf){
                                                                                             //缺给titlename换装
    //只有处于next层的元素才能tonext
    if(overelf.classList.contains("next"))overelf.classList.add("tonext");


}

//mouseout的处理方式
function elfmouseout(outelf){

    if(outelf.classList.contains("tonext"))outelf.classList.remove("tonext");
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




