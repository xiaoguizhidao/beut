function JBFWS() {
    
    var glob = {
        curSlide : 0,
        xStop    : null,
        xStart   : null
    };
    
    this.init = function(params){
        glob.params = params;
        
        if (glob.params.showBigButtons === 0) {
            $j(".JB_Button_Left_BG,  .JB_Button_Left").remove();
            $j(".JB_Button_Right_BG, .JB_Button_Right").remove();
        }
        
        
        $j(".JB_FWS, .JB_Slide, .JB_Container").height(glob.params.height);
//      $j(".JB_Slide_Content").height($j(".JB_FWS").height() - 30);
        $j(".JB_FWS").width(glob.params.width);
        
        container.setWidth();
        container.setBackgrounds();
        control.pagination();
        control.bindControls();
        control.dragSlide();
        control.autoSlide();
        display.bindControls();
    };
    
    var container = {
        setWidth : function(){
            $j(".JB_Container").width($j(".JB_Slide").length * display.width());
            $j(".JB_Slide").width(display.width());
            $j(".JB_Container").stop().css({left: -glob.curSlide * display.width()});
        },
        setBackgrounds : function(){
            /* Set slides background */
            $j(".JB_Slide > img[name=background]").each(function(i){
                var source = $j(this).attr("src");
                $j(this).after($j('<div></div>').css({
                    backgroundImage: "url('"+source+"')",
                    backgroundSize:"cover",
                    width: "100%",
                    height:"100%",
                    backgroundRepeat:"no-repeat",
                    position: "absolute",
                    backgroundPosition:"center"                    
                }));
                $j(this).remove();
            });
        }
    };
    
    var display = {
        bindControls: function(){
            $j(window).on("resize", function(){
                container.setWidth();
            });
        },
        width: function(){
            return $j(".JB_FWS").width();
        }
    };
    
    var control = {
        bindControls: function(){
            
            $j(".JB_ReadMore a").on("mouseover", function(){
                $j(this).parent().find(".JB_ReadMore_BG").stop().animate({
                    opacity:1
                }, 200);
            });
            $j(".JB_ReadMore a").on("mouseout", function(){
                $j(this).parent().find(".JB_ReadMore_BG").stop().animate({
                    opacity:0.44
                }, 200); 
            });
            
            if (glob.params.showBigButtons === 1) {
                $j(".JB_Button_Right").on("click", function(){
                    control.next();
                });
                $j(".JB_Button_Left").on("click", function(){
                    control.prev();
                });
                $j(".JB_Button_Right").on("mouseover", function(){
                    $j(".JB_Button_Right_BG").stop().animate({
                        opacity: 1
                    }, 200);
                });
                $j(".JB_Button_Right").on("mouseout", function(){
                    $j(".JB_Button_Right_BG").stop().animate({
                        opacity: 0.44
                    }, 200);
                });
                $j(".JB_Button_Left").on("mouseover", function(){
                    $j(".JB_Button_Left_BG").stop().animate({
                        opacity: 1
                    }, 200);
                });
                $j(".JB_Button_Left").on("mouseout", function(){
                    $j(".JB_Button_Left_BG").stop().animate({
                        opacity: 0.44
                    }, 200);
                });
            }
          
            if (glob.params.showSmallButtons === 1) {
                $j(".JB_Page").on("click", function(){
                    if ($j(this).hasClass("active")) {
                        return;
                    }
                    var dir;
                    $j(".JB_Page").removeClass("active");
                    $j(this).addClass("active");

                    if ($j(this).index() > glob.curSlide) {
                        dir = "prev";
                    } else {
                        dir = "next";
                    }
                    glob.curSlide = $j(this).index();
                    control.slideTo(dir);
                });
            }
        },
        dragSlide: function(){
          
          if (glob.params.dragSlide === 0) return;
          
          /* Extends BindControls */
          $j(".JB_Container").draggable({
                axis: "x",
                start: function(event, ui){
                    $j(".JB_Container").stop();
                    glob.xStart = ui.offset.left;
                },
                stop: function(event, ui){
                    glob.xStop = ui.offset.left;
                    
                    if (glob.xStart > glob.xStop) {
                        
                        if (glob.curSlide + 1 >= $j(".JB_Slide").length) {
                            $j(".JB_Container").stop().animate({
                                left: -glob.curSlide * display.width()
                            }, 1000, "easeOutElastic");
                            return;
                        }
                        
                        glob.curSlide++;
                        $j(".JB_Container").stop().animate({
                            left: -glob.curSlide * display.width()
                        }, 750, "easeOutExpo");
            
                        $j(".JB_Page").removeClass("active");
                        $j(".JB_Page:eq("+glob.curSlide+")").addClass("active");
                    } else {
                        
                        if (glob.curSlide <= 0) {
                            glob.curSlide = 0;
                            $j(".JB_Container").stop().animate({
                                left: -glob.curSlide * display.width()
                            }, 1000, "easeOutElastic");
                            return;
                        }
                        
                        glob.curSlide--;
                        $j(".JB_Container").stop().animate({
                            left: -glob.curSlide * display.width()
                        }, 750, "easeOutExpo");
            
                        $j(".JB_Page").removeClass("active");
                        $j(".JB_Page:eq("+glob.curSlide+")").addClass("active");
                    }
                }
            });
        },
        
        pagination: function(){
            if (glob.params.showSmallButtons === 1) {
                var pages = $j(".JB_Slide").length;
                var i = 0;
                while (i < pages) {
                    $j('<div class="JB_Page"></div>').appendTo(".JB_Pages");
                    i++;
                }
                $j(".JB_Page").removeClass("active");
                $j(".JB_Page:eq("+glob.curSlide+")").addClass("active");
            }
        },
        next: function(){
            if (glob.curSlide + 1 >= $j(".JB_Slide").length) {
                /* Rewind */
                glob.curSlide = 1;
                control.prev();
                return;
            }
           
            glob.curSlide++;
            $j(".JB_Container").stop().animate({
                left: -glob.curSlide * display.width()
            }, glob.params.slideSpeed, glob.params.slideEffect);
            
            $j(".JB_Page").removeClass("active");
            $j(".JB_Page:eq("+glob.curSlide+")").addClass("active");
            
            if (glob.params.slideDelay === 0 || glob.params.slideSpeed2 === 0) {return;}
            
            $j(".JB_Slide:eq("+glob.curSlide+")").find(".JB_Slide_Content").css({
                left: display.width()
            });
            
            $j(".JB_Slide:eq("+glob.curSlide+")").find(".JB_Slide_Content").delay(glob.params.slideDelay).animate({
                left:0
            }, (glob.params.slideSpeed2), glob.params.slideEffect2);
        },
        prev: function(){
            if (glob.curSlide === 0){return;}
            
            glob.curSlide--;
            $j(".JB_Container").stop().animate({
                left: -glob.curSlide * display.width()
            }, glob.params.slideSpeed, glob.params.slideEffect);
            
            $j(".JB_Page").removeClass("active");
            $j(".JB_Page:eq("+glob.curSlide+")").addClass("active");
            
            if (glob.params.slideDelay === 0 || glob.params.slideSpeed2 === 0) {return;}
            
            $j(".JB_Slide:eq("+glob.curSlide+")").find(".JB_Slide_Content").css({
                left: -1 * display.width()
            });
            
            $j(".JB_Slide:eq("+glob.curSlide+")").find(".JB_Slide_Content").delay(glob.params.slideDelay).animate({
                left:0
            }, (glob.params.slideSpeed2), glob.params.slideEffect2);
        },
        slideTo: function(dir){
            $j(".JB_Container").stop().animate({
                left: -glob.curSlide * display.width()
            }, glob.params.slideSpeed, glob.params.slideEffect);
            
            $j(".JB_Slide:eq("+glob.curSlide+")").find(".JB_Slide_Content").css({
                left: dir === "next" ? -1 * display.width() :  display.width()
            });
            
            $j(".JB_Slide:eq("+glob.curSlide+")").find(".JB_Slide_Content").delay(glob.params.slideDelay).animate({
                left:0
            }, (glob.params.slideSpeed2), glob.params.slideEffect2);
        },
                
        autoSlide: function(){
            if (glob.params.autoSlide === 0 ) return;
            var interval = setInterval(function(){
                control.next();
            }, glob.params.autoSlideDelay + glob.params.slideSpeed);
            $j(".JB_FWS").on("mouseover", function(){clearInterval(interval);});
            $j(".JB_FWS").on("mouseout", function(){
                clearInterval(interval); 
                interval = setInterval(function(){
                    control.next();
                }, glob.params.autoSlideDelay + glob.params.slideSpeed);
            });
        }
    };
};