 /*
 * Functionality for ZR.panels
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2011 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 */
jQuery(function() {
  ZR.util.blackLabel();
  jQuery('.desktop').on('click','.zelimglink',function(e){
    e.preventDefault();
  });
});


ZR.panels = {
	zelImgStor: new Array,
	loadImages: function(imgnms) {
		var limgs = new Array;
		limgs = imgnms.split(",");
		var limgsObj = new Array;
		for (var g=0; g<limgs.length; g++) {
			if ( ZR.panels.zelImgStor[limgs[g]] == null || ZR.panels.zelImgStor[limgs[g]] == "" ) {
				//image has not been loaded, load it.
        limgsObj[g] = new Image;
				limgsObj[g].onload = function() {
				  ZR.panels.zelImgStor[limgs[g]] = "loaded";
				}
				limgsObj[g].src = limgs[g];
			}
    }
	}
}

/*
 * Functionality for ZR.panels nixon elite module
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.elite - scripts for zelElite modules
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2012 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 * 
 */
 
ZR.panels.elite = {
  openCloseFooter: function(e) {
		var idToOpen = jQuery(e).attr("data-open-footer-id");
  	if (jQuery(e).is(":visible")) {
			var hiddenEl = jQuery('#' + idToOpen).children('.module_main_promo');
  		jQuery('#openfootertextlink').html(jQuery('#hideCollectionText').val());
			if (!hiddenEl.is(":visible")) {
			  console.log('not visible? ');
				var winHeight = jQuery(window).height();
				var scrollBottom = jQuery(window).scrollTop() + winHeight;
				var eParent = jQuery(e).closest('.panel');
				/*var hiddenEl = jQuery('#' + idToOpen).children('.zelslide');*/
				var hiddenElOffset = eParent.offset().top + eParent.outerHeight(true);
				var hiddenElHeight =  hiddenEl.height();
				var hiddenElOffsetBottom =  hiddenElOffset + hiddenElHeight;
				if(scrollBottom < hiddenElOffsetBottom) {
					var scrollToPosInt = hiddenElOffsetBottom - winHeight + 40;
					ZR.util.scrollToPos( scrollToPosInt ,1000)
				}
				
				var idToOpenObj = jQuery("#"+idToOpen);
		    var theScroller = jQuery("#"+idToOpen).find('.module_main_promo');
		    var theScrollerId = theScroller.attr('id');
		    theScroller.css('opacity','0');
		    idToOpenObj.slideDown(500,function() {
		      ZR.panels.zeIScroll.scrolls[theScrollerId].refresh();  
		      ZR.panels.zeIScroll.scrolls[iscid].scrollToPage(1,0,0);
		      theScroller.fadeTo(500,1,function(){
		        if (jQuery(this).is(":visible")) {
		          jQuery('#openfootertextlink').html(jQuery('#hideCollectionText').val());
		        }
		      });
		    });
				
			}
			else {
			  jQuery('#' + idToOpen).slideFade(750);
			  jQuery('#openfootertextlink').html(jQuery('#viewCollectionText').val());
			}
  	} else {
			//scroll the window down to show the elite stuff.
			
		}
  	
  	
  }
}

jQuery(function() {
		jQuery('.elite .img a').hover(function(){
			jQuery(this).closest('.panel').find('.openfooterlink').css('text-decoration','underline');
		},function(){
		jQuery(this).closest('.panel').find('.openfooterlink').removeAttr('style');
		});			 
					 
					 
	jQuery("#content").on("click",".openfooterlink" , function() {
		ZR.panels.elite.openCloseFooter(jQuery(this));
  	return false;	  	
	});
});

/*
 * Functionality for ZR.panels nixon events module
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.events - scripts for zelImage modules
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2012 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 * 
 */
 
ZR.panels.events = {
  active: 0,
  working: false,
  init: function() {
    jQuery('div.events div.eventdetails:first').fadeIn(2000);
		jQuery('div.events').attr("data-curr-idx",0);
		jQuery('div.events').append("<div id='eventcontrol' class='control'></div>");
		for (var g=0; g < jQuery('div.events div.eventdetails').length; g++) {
		  jQuery("#eventcontrol").append("<div class='bullet' data-idx='" + g + "'></div>");
		}
	  jQuery("#eventcontrol div.bullet").click(function() {
	  	ZR.panels.events.goto(jQuery(this).attr('data-idx'),'def');
	  });
		ZR.panels.events.setBullet(0);
		jQuery("#eventcontrol").css('visibility','visible');
  },
  goto: function(idx,dir) {
  	if (ZR.panels.events.working) {
  		setTimeout("ZR.panels.events.goto("+idx+",'"+dir+"')");
  		return;
  	}
  	var currIdx = parseInt(jQuery('div.events').attr("data-curr-idx"));
    var dd = -1;
  	if (currIdx == idx) {
  		return;
  	}
  	ZR.panels.events.working = true;
  	if (currIdx > idx) { 
  		dd = 1;
  	}
  	jQuery('div.events div.eventdetails:eq('+currIdx+')').animate({left:(300*dd)+'px'},500,function() {
  		jQuery('div.events div.eventdetails').removeClass("active");
  		if (currIdx < idx) {
    		jQuery('div.events div.eventdetails:eq('+idx+')').css("left","300px");
  		}
  		else {
    		jQuery('div.events div.eventdetails:eq('+idx+')').css("left","-300px");
  		}
  		jQuery('div.events div.eventdetails:eq('+idx+')').addClass("active");
      jQuery('div.events div.eventdetails:eq('+idx+')').animate({left:'0px'},500,function() {
   			jQuery('div.events').attr("data-curr-idx",idx);
   			ZR.panels.events.working = false;
  	  });
  		currIdx = idx; 
  	});
  	ZR.panels.events.setBullet(idx);
  },
  setBullet: function(idx) {
    jQuery("div.events div.bullet").removeClass("active");
    jQuery("div.events div.bullet:eq(" + idx + ")").addClass("active");
  }
}

jQuery(function() {
  ZR.panels.events.init();
});

/*
 * Functionality for ZR.panels nixon press module
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.press - scripts for press modules
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2012 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 * 
 */
 
ZR.panels.press = {
  active: 0,
  working: false,
  init: function() {
    jQuery('div.press div.pressdetails:first').fadeIn(2000);
		jQuery('div.press').attr("data-curr-idx",0);
		jQuery('div.press').append("<div id='presscontrol' class='control'></div>");
		for (var g=0; g < jQuery('div.press div.pressdetails').length; g++) {
		  jQuery("#presscontrol").append("<div class='bullet' data-idx='" + g + "'></div>");
		}
	  jQuery("#presscontrol div.bullet").click(function() {
	  	ZR.panels.press.goto(jQuery(this).attr('data-idx'),'def');
	  });
		ZR.panels.press.setBullet(0);
		jQuery("#presscontrol").css('visibility','visible');
  },
  goto: function(idx,dir) {
  	if (ZR.panels.press.working) {
  		setTimeout("ZR.panels.press.goto("+idx+",'"+dir+"')");
  		return;
  	}
  	var currIdx = parseInt(jQuery('div.press').attr("data-curr-idx"));
  	if (currIdx == idx) {
  		return;
  	}
  	ZR.panels.press.working = true;
  	var dd = -1; 
  	if (currIdx > idx) { 
  		dd = 1;
  	}
  	jQuery('div.press div.pressdetails:eq('+currIdx+')').animate({left:(300*dd)+'px'},500,function() {
  		jQuery('div.press div.pressdetails').removeClass("active");
  		if (currIdx < idx) {
    		jQuery('div.press div.pressdetails:eq('+idx+')').css("left","300px");
  		}
  		else {
    		jQuery('div.press div.pressdetails:eq('+idx+')').css("left","-300px");
  		}
  		jQuery('div.press div.pressdetails:eq('+idx+')').addClass("active");
      jQuery('div.press div.pressdetails:eq('+idx+')').animate({left:'0px'},500,function() {
   			jQuery('div.press').attr("data-curr-idx",idx);
   			ZR.panels.press.working = false;
  	  });
  		currIdx = idx; 
  	});
  	ZR.panels.press.setBullet(idx);
  },
  setBullet: function(idx) {
    jQuery("div.press div.bullet").removeClass("active");
    jQuery("div.press div.bullet:eq(" + idx + ")").addClass("active");
  }
}


jQuery(function() {
  ZR.panels.press.init();
});

/*
 * Functionality for ZR.panels nixon product category slider module
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.prodCat - scripts for product category slider modules
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2012 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 * 
 */
 
ZR.panels.prodCat = {
  active: 0,
  working: false,
	sliding: new Array,
	settings: new Array,
  init: function(e) {
    var i = jQuery(e).attr("id")
    ZR.panels.prodCat.settings[i] = new Array;
    ZR.panels.prodCat.settings[i]['speed'] = ( jQuery(e).attr("data-animspeed") != null && jQuery(e).attr("data-animspeed") != "" ) ? parseInt(jQuery(e).attr("data-animspeed")) : 500;
    jQuery(e).children('div.product:first').fadeIn(2000);
  	jQuery(e).children('div.product:first').addClass("active");
		jQuery(e).attr("data-curr-idx",0);
    if (jQuery(e).children('div.product').size() > 1) {
      jQuery(e).append("<div class='npbut next'></div>");
      jQuery(e).append("<div class='npbut prev'></div>");
			jQuery(e).children("div.npbut").fadeIn('slow');
			jQuery(e).children("div.npbut.next").click(function() {
				ZR.panels.prodCat.next(jQuery(e).attr("id"));
			});
			jQuery(e).children("div.npbut.prev").click(function() {
				ZR.panels.prodCat.previous(jQuery(e).attr("id"));		
			});
    }
  },
  goto: function(i,idx,ui,dir) {
  	//alert("i:" + i + ", idx:" + idx + ", ui:" + ui + ", dir:" + dir + ", sliding:" + ZR.panels.prodCat.sliding[i]);
		if ( ZR.panels.prodCat.sliding[i] ) {
      setTimeout("ZR.panels.prodCat.goto('" + i + "','" + idx + "','" + ui + "','" + dir + "')",100);
	    return; 
	  }
		var curIdx = jQuery("#"+i).attr("data-curr-idx");
		if ( idx != curIdx ) {
			ZR.panels.prodCat.sliding[i] = true;
			if ( dir == 'right') {
			  ZR.panels.prodCat.moveRight(i,idx);
			}
			else if (dir == 'left') {
			  ZR.panels.prodCat.moveLeft(i,idx);
			}
			else {
				if ( idx < curIdx ) {
					ZR.panels.prodCat.moveLeft(i,idx);
				}
				else {
				  ZR.panels.prodCat.moveRight(i,idx);
				}
			}
		}
		jQuery("#"+i).attr("data-curr-idx",idx);
  },
  next: function(i) {
		var curIdx = parseInt(jQuery("#" + i).attr("data-curr-idx"));
		var nextIdx = curIdx + 1;
		if ( (curIdx + 1) == jQuery("#" + i).children("div.product").size() )  {
		  nextIdx = 0;
		}
		ZR.panels.prodCat.goto(i,nextIdx,false,'right');
  },
  previous: function(i) {
		var curIdx = parseInt(jQuery("#" + i).attr("data-curr-idx"));
		var nextIdx = curIdx - 1;
		if ( nextIdx < 0 ) {
		  nextIdx = jQuery("#" + i).children("div.product").size() - 1;
		}
		ZR.panels.prodCat.goto(i,nextIdx,false,'left');
  },
  moveLeft: function(i,idx) {
  	jQuery("#" + i).children("div.product:eq("+idx+")").css("display","block");
  	jQuery("#" + i).children("div.product:eq("+idx+")").css("left","-100%");
  	jQuery("#" + i).children("div.product.active").css("left","0%");
  	jQuery("#" + i).children("div.product.active").animate({left: "100%"},ZR.panels.prodCat.settings[i]['speed'],function() {
			jQuery(this).removeClass('active');
			ZR.panels.prodCat.sliding[i] = false;
    	jQuery("#" + i).children("div.product:eq("+idx+")").animate({left: "0%"},ZR.panels.prodCat.settings[i]['speed'],function() {
				jQuery(this).addClass("active");
			});
	  });
  },
  moveRight: function(i,idx) {
  	jQuery("#" + i).children("div.product:eq("+idx+")").css("display","block");
  	jQuery("#" + i).children("div.product:eq("+idx+")").css("left","100%");
  	jQuery("#" + i).children("div.product.active").css("left","0%");
  	jQuery("#" + i).children("div.product.active").animate({left: "-100%"},ZR.panels.prodCat.settings[i]['speed'],function() {
			jQuery(this).removeClass('active');
			ZR.panels.prodCat.sliding[i] = false;
    	jQuery("#" + i).children("div.product:eq("+idx+")").animate({left: "0%"},ZR.panels.prodCat.settings[i]['speed'],function() {
				jQuery(this).addClass("active");
			});
	  });
  }
}

jQuery(function() {
	jQuery(".panel.prodcat").each(function() {
		ZR.panels.prodCat.init(jQuery(this));
	});
});

/*
 * Functionality for ZR.panels nixon product list slider module
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.prodList - scripts for product list slider modules
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2012 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 * 
 */
 
ZR.panels.prodList = {
  active: 0,
  working: false,
	sliding: new Array,
	settings: new Array,
  init: function(e) {
    var i = jQuery(e).attr("id")
    ZR.panels.prodList.settings[i] = new Array;
    ZR.panels.prodList.settings[i]['speed'] = ( jQuery(e).attr("data-animspeed") != null && jQuery(e).attr("data-animspeed") != "" ) ? parseInt(jQuery(e).attr("data-animspeed")) : 500;
    jQuery(e).children('div.product').fadeIn(2000);
		jQuery(e).attr("data-curr-idx",0);
    if (jQuery(e).children('div.productdata').size() > 1) {
      jQuery(e).append("<div class='npbut next'></div>");
      jQuery(e).append("<div class='npbut prev'></div>");
			jQuery(e).children("div.npbut").fadeIn('slow');
			jQuery(e).children("div.npbut.next").click(function() {
				ZR.panels.prodList.next(jQuery(e).attr("id"));
			});
			jQuery(e).children("div.npbut.prev").click(function() {
				ZR.panels.prodList.previous(jQuery(e).attr("id"));		
			});
    }
  	jQuery(".viewcolorslink, .prodlist .swatches img").click(function() {
  		ZR.panels.prodList.showThumbs(i,jQuery(this));
  		return false;
  	});
  },
  goto: function(i,idx,ui,dir) {
  	//alert("i:" + i + ", idx:" + idx + ", ui:" + ui + ", dir:" + dir + ", sliding:" + ZR.panels.prodList.sliding[i]);
		if ( ZR.panels.prodList.sliding[i] ) {
      setTimeout("ZR.panels.prodList.goto('" + i + "','" + idx + "','" + ui + "','" + dir + "')",100);
	    return; 
	  }
		var curIdx = jQuery("#"+i).attr("data-curr-idx");
		if ( idx != curIdx ) {
			ZR.panels.prodList.sliding[i] = true;
			if ( dir == 'right') {
			  ZR.panels.prodList.moveRight(i,idx);
			}
			else if (dir == 'left') {
			  ZR.panels.prodList.moveLeft(i,idx);
			}
			else {
				if ( idx < curIdx ) {
					ZR.panels.prodList.moveLeft(i,idx);
				}
				else {
				  ZR.panels.prodList.moveRight(i,idx);
				}
			}
		}
		jQuery("#"+i).attr("data-curr-idx",idx);
  },
  next: function(i) {
		var curIdx = parseInt(jQuery("#" + i).attr("data-curr-idx"));
		var nextIdx = curIdx + 1;
		if ( (curIdx + 1) == jQuery("#" + i).children("div.productdata").size() )  {
		  nextIdx = 0;
		}
		ZR.panels.prodList.goto(i,nextIdx,false,'right');
  },
  previous: function(i) {
		var curIdx = parseInt(jQuery("#" + i).attr("data-curr-idx"));
		var nextIdx = curIdx - 1;
		if ( nextIdx < 0 ) {
		  nextIdx = jQuery("#" + i).children("div.productdata").size() - 1;
		}
		ZR.panels.prodList.goto(i,nextIdx,false,'left');
  },
  moveRight: function(i,idx) {
    ZR.panels.prodList.hideSwatches(i,true);
    ZR.panels.prodList.swapInfo(i,idx);
    var ele = jQuery("#"+i);
    var prodImg = jQuery("#" + i + " .product .prodimg");
    prodImg.animate({left: "-100%"},ZR.panels.prodList.settings[i]['speed'],function() {
      jQuery(this).html(jQuery("#productdata-" + i + "-" + idx + " .prodimg").html());
      prodImg.css("left","100%");
      prodImg.animate({left: "0%"},ZR.panels.prodList.settings[i]['speed'],function() {
      	ele.children(".product").children(".info").fadeIn('fast');
  			ZR.panels.prodList.sliding[i] = false;
      });
    });
  },
  moveLeft: function(i,idx) {
    ZR.panels.prodList.hideSwatches(i,true);
    ZR.panels.prodList.swapInfo(i,idx);
    var ele = jQuery("#"+i);
    var prodImg = jQuery("#" + i + " .product .prodimg");
    prodImg.animate({left: "100%"},ZR.panels.prodList.settings[i]['speed'],function() {
      jQuery(this).html(jQuery("#productdata-" + i + "-" + idx + " .prodimg").html());
      prodImg.css("left","-100%");
      prodImg.animate({left: "0%"},ZR.panels.prodList.settings[i]['speed'],function() {
      	ele.children(".product").children(".info").fadeIn('fast');
  			ZR.panels.prodList.sliding[i] = false;
      });
    });
  },
  swapInfo: function(i,idx) {
  	jQuery("#" + i + ' .product .info').fadeOut('fast',function(){
  		jQuery("#" + i + ' .product .name').html(jQuery("#productdata-" + i + "-" + idx + " .name").html());
  		jQuery("#" + i + ' .product .price').html(jQuery("#productdata-" + i + "-" + idx + " .price").html());
  		jQuery("#" + i + ' .product .swatches').html(jQuery("#productdata-" + i + "-" + idx + " .swatches").html());
  		jQuery("#" + i + ' .product .allswatches').html(jQuery("#productdata-" + i + "-" + idx + " .allswatches").html());
  		jQuery("#" + i + ' .product .viewall').html(jQuery("#productdata-" + i + "-" + idx + " .viewall").html());
  		jQuery(".viewcolorslink, .prodlist .swatches img").click(function() {
  			ZR.panels.prodList.showThumbs(i,jQuery(this));
  			return false;
  		});
    });
  },
  showThumbs: function(i,e) {
  	jQuery(e).parent().siblings(".allswatches").removeClass("onerow").removeClass("tworow").removeClass("threerow")
  	var swatchesCt = jQuery(e).parent().siblings(".allswatches").children("img").length;
  	if ( swatchesCt < 10 ) {
  		jQuery(e).parent().siblings(".allswatches").addClass("onerow");
  	}
  	else if ( swatchesCt < 19 ) {
  		jQuery(e).parent().siblings(".allswatches").addClass("tworow");
    	jQuery(e).parent().siblings(".info").fadeOut('slow');
  	}
  	else { 
  		jQuery(e).parent().siblings(".allswatches").addClass("threerow");
  	}
  	jQuery(e).parent().siblings(".allswatches").fadeIn('slow', function() {
    	jQuery(this).addClass("hover");
      jQuery(this).mouseenter(function() {
      	jQuery(this).addClass("hover");
      });
      jQuery(this).mouseleave(function() {
      	jQuery(this).removeClass("hover");
      	setTimeout("ZR.panels.prodList.hideSwatches('"+i+"',false)",500);
      });
  	});
    ZR.panels.prodList.wireSwatches(e);
  },
  hideSwatches: function(i,now) {
  	if ( now ) {
  		jQuery('#' + i + ' .product .allswatches').css('display','none');
  	}
  	else {
    	if ( !jQuery('#' + i + " .product .allswatches").hasClass("hover") ) {
    		if ( !jQuery('#' + i + " .product .info:first").is(':visible') ) {
    			jQuery('#' + i + " .product .info").fadeIn('slow');
    		}
    	  jQuery('#' + i + ' .product .allswatches').fadeOut('slow');
      }
  	}
  },
  wireSwatches: function(e) {
    jQuery(e).parent().parent().children(".allswatches").children("img").click(function() {
			jQuery(this).siblings().removeClass('active');
			jQuery(this).addClass('active');
    	jQuery(this).parent().siblings(".prodimg").children("a").children("img").attr("src",jQuery(this).attr("thumbImg"));
    	jQuery(this).parent().siblings(".prodimg").children("a").attr("href",jQuery(this).attr("chref"));
    	jQuery(this).parent().siblings(".name").children("a").attr("href",jQuery(this).attr("chref"));
    	jQuery(this).parent().siblings(".swatches").children("img").attr("src", jQuery(this).attr("src"));
    });
  }
}

jQuery(function() {
	jQuery(".panel.prodlist").each(function() {
		ZR.panels.prodList.init(jQuery(this));
	});
});

/*
 * Functionality for ZR.panels nixon twitter feeds
 * 
 * Object Organization:
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2012 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 * 
 */

jQuery(function() {
  ZR.Social.Twitter.populateWidget('#tWidget'); // Populate Twitter widget
});

/*
 * Functionality for ZR.panels video modules
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.video - scripts for video Modules
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2011 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 */
ZR.panels.video = {
  currentlyPlaying: null,
  play: function(container,url) {
  	vw = jQuery(container).parent().parent().width();
  	vh = jQuery(container).parent().parent().height();
  	jQuery(container).height(vh);
    jQuery(container).fadeIn(1000,function(){ 
      jQuery(container).oembed(url, 
        {
          embedMethod: 'fill',
          maxWidth: vw,
          maxHeight: vh,
          vimeo:{autoplay: true, maxWidth: vw, maxHeight: vh}
         }
      );
      setTimeout("ZR.panels.video.setHeightsAndPadding()",1000);
    });
    return false;
  },
  setHeightsAndPadding: function() {
  	jQuery('.videobox:visible').each(function() {
    	vh = jQuery(this).children("iframe").height();
    	vch = jQuery(this).height();
    	ph = (vch - vh ) / 2;
    	/* alert("vh:" + vh + " vch:" + vch + " ph:" + ph); */
    	jQuery(this).height(jQuery(this).height() - ph);
    	jQuery(this).css("paddingTop",ph);
  	});
  },
  playWithEvents: function(container, url, panelId) {
    /*
     * NOTE: This function doesn't use oembed, rather it performs a simple
     * insert of HTML code into the container, and then adds some event
     * listeners to the loaded [Vimeo] player.
     * 
     * JS Events API: http://developer.vimeo.com/player/js-api#events
     */
    var oldHtml = jQuery(container).html(),
        newHtml = '',
        playMask = jQuery('.playLink', jQuery(panelId)),
        blackLabel = jQuery('.desktop .blacklabel', jQuery(panelId)),
        iframeName = 'iframe' + panelId.substring(1);
    jQuery(container).fadeIn(1000,function(){
        newHtml = '<iframe id="' + iframeName + '" src="' + url + '" frameborder="0"';
        newHtml = newHtml + ' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        jQuery(container).html(newHtml).ready(function() {
            playMask.hide();
            blackLabel.hide();
            jQuery('.vidthumb', jQuery(panelId)).hide();
            // Prepare video event listeners
            Froogaloop.prototype.init(jQuery('#' + iframeName).get(0));
            Froogaloop.prototype.addEvent('ready', function(response) {
              Froogaloop.prototype.addEvent('play', function(response) {
                // Allow pausing of currently playing video and playing of newly selected one
                if(ZR.panels.video.currentlyPlaying === null) {
                  ZR.panels.video.currentlyPlaying = iframeName;
                } else {
                  // Pause the other playing video
                  jQueryf(jQuery('#' + ZR.panels.video.currentlyPlaying).get(0)).api('pause');
                  // Set this as the currently playing video
                  ZR.panels.video.currentlyPlaying = iframeName;
                }
              });
              Froogaloop.prototype.addEvent('finish', function(response) {
                // Reset the playing element
                ZR.panels.video.currentlyPlaying = null;
              });
            });
        });
    });
    return false;
  }
}

/*
 * Functionality for ZR.panels zelimage modules
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.zelimg - scripts for zelImage modules
 *
 * 
 * Author: Henry Roberts 
 * Copyright: 2011 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 */
 
ZR.panels.zelImage = {
  showCaption : function(e) {
  	jQuery(e).parent().append("<div class='captionbox'>" + jQuery(e).attr("data-caption") + "</div>");
  } 	
}

jQuery(function() {
	jQuery('.panel.zelimg a.fancybox').fancybox();
	jQuery('.panel.zelimg .camera').click(function() {
		ZR.panels.zelImage.showCaption(this);
	});
});


/*
 * Functionality for ZR.panels zel iScroll modules
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.zeIScroll - scripts for zelSlide module
 *
 * Author: Henry Roberts 
 * Copyright: 2011 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 *
 */

ZR.panels.zeIScroll = {
  startedResizing: false,
  lastWindowResize: new Date().getTime(),
  scrolls: new Array,
  isPlaying: new Array,
  init: function() {
    
    
    /* The following adds arrows and disables scrolling for Android 4 which as of now sucks, yay Chrome */
    if(navigator.userAgent.match(/Android 4/i) && navigator.userAgent.match(/Version\/4/i)){
      jQuery('.scrollleft,.scrollright').addClass('showarrows');
      jQuery('#slidespacer').addClass('slidespaceroverride');
    }
    
    jQuery(".module_main_promo").each(function() {
    	iscid = jQuery(this).attr("id");
    	ZR.panels.zeIScroll.setIScrollImages();
  		if (jQuery("#" + iscid).parent().children('.infolayercontents0').length > 0) {
  		  jQuery("#" + iscid).children('div.infolayer').html(jQuery("#" + iscid).parent().children('.infolayercontents0').html());
  		  jQuery("#" + iscid).children('div.infolayer').css("display","block");
  		}
  		if (jQuery("#" + iscid).parent().children('.mobinfolayercontents0').length > 0) {
  		  jQuery("#" + iscid).children('div.mobinfolayer').html(jQuery("#" + iscid).parent().children('.mobinfolayercontents0').html());
  		  jQuery("#" + iscid).children('div.mobinfolayer').css("display","block");
  		}
    	slidect = jQuery(this).children("ul").children("li").size();
    	jQuery(this).children("ul").css("width",(slidect * 100) + "%");
    	jQuery(this).children("ul").children("li").css("width",(100 / slidect) + "%");
    	ZR.panels.zeIScroll.scrolls[iscid] = new iScroll(iscid, {
        snap : 'li',
        momentum : false,
        hScrollbar : false,
        vScrollbar : false,
        vScroll: false,
        hScroll: true,
        lockDirection : true,
        
        onScrollStart : function(e) {
          //nothing yet
        },
        onBeforeScrollStart : function(e) {
          //nothing yet
        },
        onBeforeScrollMove : function(e) {
         //nothing yet
        },
        onScrollEnd : function() {
          ZR.panels.zeIScroll.fixPosition(this.wrapper.getAttribute("id"),this.currPageX);
        },
        onTouchEnd : function() {
        	ZR.panels.zeIScroll.hideAndShowLabel(this.wrapper.getAttribute("id"));
          ZR.panels.zeIScroll.isPlaying[this.wrapper.getAttribute("id")] = false;
        }
      });
    	ZR.panels.zeIScroll.scrolls[iscid].scrollToPage(1,0,0);
			jQuery(this).attr("data-curr-idx",0);
			jQuery(this).append("<div id='zelslidecontrol" + iscid + "' class='control " + jQuery(this).data("control") + "'></div>");
			jQuery("#zelslidecontrol" + iscid).html("");
			for (var g=0; g<(slidect-2); g++) {
			  jQuery("#zelslidecontrol" + iscid).append("<div class='bullet' data-target=" + iscid + " data-idx='" + g + "'></div>");
			}
		  jQuery("#zelslidecontrol" + iscid + " div.bullet").click(function() {
		  	ZR.panels.zeIScroll.clickBullet(jQuery(this).attr('data-target'),jQuery(this).attr('data-idx'))
		  });
			ZR.panels.zeIScroll.setBullet(iscid,0);
    	setTimeout("ZR.panels.zeIScroll.setArrowVert('"+iscid+"')",1000);
    	if(jQuery(this).data("autoplay")) {
    		ZR.panels.zeIScroll.isPlaying[iscid] = true;
    		setTimeout("ZR.panels.zeIScroll.play('" + iscid + "')", jQuery(this).data("slidedelay"));
    	}
    });
    jQuery(".scrollright").click(function() {
    	ZR.panels.zeIScroll.isPlaying[jQuery(this).attr("data-target")] = false;
    	ZR.panels.zeIScroll.next(jQuery(this).attr("data-target"),true);
      return false;
    });
    jQuery(".scrollleft").click(function() {
    	ZR.panels.zeIScroll.isPlaying[jQuery(this).attr("data-target")] = false;
    	ZR.panels.zeIScroll.prev(jQuery(this).attr("data-target"));
      return false;
    });
  },
  hideInfoLabel : function(iscid) {
  	jQuery("#" + iscid).children('div.infolayer').children().fadeOut(250,function() {
  		jQuery("#" + iscid).children('div.infolayer').html();
		});
  	jQuery("#" + iscid).children('div.mobinfolayer').fadeTo(250,0,function() {
  		jQuery("#" + iscid).children('div.mobinfolayer').html();
		});
  },
  swapAndShowInfoLabel : function(iscid) {
  	cp = ( ZR.panels.zeIScroll.scrolls[iscid].currPageX - 1);
  	slidect = jQuery("#"+iscid).children("ul").children("li").size() - 2;
  	if ( cp == slidect ) {
  		cp = 0;
  	}
  	if (jQuery("#" + iscid).parent().children('.infolayercontents'+cp).length > 0) {
    	jQuery('.infolayercontents'+cp).children().css("display","none");
    	jQuery("#" + iscid).children('div.infolayer').html(jQuery("#" + iscid).parent().children('.infolayercontents'+cp).html());
    	jQuery("#" + iscid).children('div.infolayer').children().fadeIn(250);
  	}
  	if (jQuery("#" + iscid).parent().children('.mobinfolayercontents'+cp).length > 0) {
    	jQuery('.mobinfolayercontents'+cp).css("display","none");
    	jQuery("#" + iscid).children('div.mobinfolayer').html(jQuery("#" + iscid).parent().children('.mobinfolayercontents'+cp).html());
    	jQuery("#" + iscid).children('div.mobinfolayer').fadeTo(250,1);
  	}
  },
  hideAndShowLabel : function(iscid) {
  	ZR.panels.zeIScroll.hideInfoLabel(iscid);
  	setTimeout("ZR.panels.zeIScroll.swapAndShowInfoLabel('"+iscid+"')",350);
  },
  fixPosition : function(iscid,currPageX) {
  	slidect = jQuery("#"+iscid).children("ul").children("li").size();
  	if (currPageX == 0) {
  		ZR.panels.zeIScroll.scrolls[iscid].scrollToPage((slidect-2),0,0);
  		ZR.panels.zeIScroll.setBullet(iscid,(slidect-3));
  	}
  	else if ( currPageX == (slidect-1) ) {
  		ZR.panels.zeIScroll.scrolls[iscid].scrollToPage(1,0,0);
  		ZR.panels.zeIScroll.setBullet(iscid,0);
  	}
  	else {
  		ZR.panels.zeIScroll.setBullet(iscid,(parseInt(currPageX)-1));
  	}
  },
  play : function(iscid) {
  	if (ZR.panels.zeIScroll.isPlaying[iscid]) {
    	ZR.panels.zeIScroll.next(iscid,false);
    	setTimeout("ZR.panels.zeIScroll.play('" + iscid + "',false)", jQuery("#"+iscid).data("slidedelay"));
    }
  },
  clickBullet : function(iscid,idx) {
  	ZR.panels.zeIScroll.hideInfoLabel(iscid);
  	ZR.panels.zeIScroll.isPlaying[iscid] = false;
  	// contains all logic
  	if (ZR.panels.zeIScroll.scrolls[iscid].isReady()) {
  		ZR.panels.zeIScroll.setBullet(iscid,idx);
    	ZR.panels.zeIScroll.scrolls[iscid].scrollToPage((parseInt(idx)+1), 0, jQuery("#"+iscid).data("animspeed"));
  		setTimeout("ZR.panels.zeIScroll.swapAndShowInfoLabel('" + iscid + "')",jQuery("#" + iscid).data("animspeed"));
    } 
    else {
      setTimeout("ZR.panels.zeIScroll.clickBullet('"+iscid+"','"+idx+"')", 50);
    }
  },
	setBullet : function(iscid,idx) {
    jQuery("#" + iscid + " div.bullet").removeClass("active");
    jQuery("#" + iscid + " div.bullet:eq(" + idx + ")").addClass("active");
  },
  prev : function(iscid) {
  	cp = ZR.panels.zeIScroll.scrolls[iscid].currPageX;
    if (ZR.panels.zeIScroll.scrolls[iscid].isReady()) {
    	ZR.panels.zeIScroll.hideInfoLabel(iscid);
    	ZR.panels.zeIScroll.scrolls[iscid].scrollToPage('prev', 0, jQuery("#"+iscid).data("animspeed"));
      setTimeout("ZR.panels.zeIScroll.swapAndShowInfoLabel('" + iscid + "')",jQuery("#" + iscid).data("animspeed"));
    	if ( cp == 1 ) {
      	slidect = jQuery("#"+iscid).children("ul").children("li").size();
    		ZR.panels.zeIScroll.setBullet(iscid,(slidect-3));
    		setTimeout("ZR.panels.zeIScroll.scrolls['" + iscid + "'].scrollToPage(" + (slidect-2) + ",0,0)",jQuery("#" + iscid).data("animspeed"));
    	}
    	else {
    		ZR.panels.zeIScroll.setBullet(iscid,cp-2);
    	}
    } 
    else {
      setTimeout("ZR.panels.zeIScroll.prev('"+iscid+"')", 50);
    }
  },
  next : function(iscid,isclicked) {
  	cp = ZR.panels.zeIScroll.scrolls[iscid].currPageX;
    if (ZR.panels.zeIScroll.scrolls[iscid].isReady()) {
    	ZR.panels.zeIScroll.hideInfoLabel(iscid);
    	ZR.panels.zeIScroll.scrolls[iscid].scrollToPage('next', 0, jQuery("#"+iscid).data("animspeed"));
  		setTimeout("ZR.panels.zeIScroll.swapAndShowInfoLabel('" + iscid + "')",jQuery("#" + iscid).data("animspeed"));
     	slidect = jQuery("#"+iscid).children("ul").children("li").size();
    	if ( cp == (slidect-2) ) {
    		ZR.panels.zeIScroll.setBullet(iscid,0);
    		setTimeout("ZR.panels.zeIScroll.scrolls['" + iscid + "'].scrollToPage(1,0,0)",jQuery("#" + iscid).data("animspeed"));
    	}
    	else {
    		ZR.panels.zeIScroll.setBullet(iscid,cp);
    	}
    } 
    else {
      if (isclicked) {
        setTimeout("ZR.panels.zeIScroll.next('"+iscid+"',"+isclicked+")", 50);
      }
    }
  },
  refreshIScrollers : function() {
    if (ZR.panels.zeIScroll.startedResizing) {
      if ( ( new Date().getTime() - ZR.panels.zeIScroll.lastWindowResize ) < 250 ) {
        setTimeout("ZR.panels.zeIScroll.refreshIScrollers()",50);
      }
      else {
        jQuery(".module_main_promo").each(function() {
        	ZR.panels.zeIScroll.scrolls[jQuery(this).attr("id")].scrollToPage(ZR.panels.zeIScroll.scrolls[jQuery(this).attr("id")].currPageX, 0, 100);
          ZR.panels.zeIScroll.setArrowVert(jQuery(this).attr("id"));
        });
        ZR.panels.zeIScroll.setIScrollImages();
        ZR.panels.zeIScroll.startedResizing = false;
      }
    }
  },
  setIScrollImages : function() {
  	jQuery(".module_main_promo").each(function() {
      var sw = jQuery('#page').width();
      jQuery(this).children("ul").children("li").children("img").each(function() {
        if ( sw > 767 ) {
          jQuery(this).attr("src",jQuery(this).attr("lg-src"));
        }
        else {
          jQuery(this).attr("src",jQuery(this).attr("sm-src"));
        }
      });
  	});
  },
  setArrowVert : function(iscid) {
    nt = Math.round(( jQuery("#"+iscid).height() - 68 ) / 2);
    jQuery("#" + iscid + " .scrollleft, #" + iscid + " .scrollright").css("top",nt + "px"); 
  }
}

jQuery(window).on('resize',function() {
	ZR.panels.zeIScroll.lastWindowResize = new Date().getTime();
  if (!ZR.panels.zeIScroll.startedResizing) {
  	ZR.panels.zeIScroll.startedResizing = true;
    setTimeout("ZR.panels.zeIScroll.refreshIScrollers()",50);
  }
});

jQuery(function() {
	ZR.panels.zeIScroll.init();
});


/*
 * Functionality for ZR.panels zelimage modules
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.zeslide - scripts for zelSlide module
 *
 * Author: Henry Roberts 
 * Copyright: 2011 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 *
 */
 
ZR.panels.zelSlide = {
  imgs: new Array,
  hrefs: new Array,
	playing: new Array,
	sliding: new Array,
	settings: new Array,
	init: function(e) {
    var i = jQuery(e).attr("id");
		var imgnms = jQuery(e).attr("data-images");
		var hrefurls = jQuery(e).attr("data-hrefs");
		ZR.panels.loadImages(imgnms);
		if (jQuery(e).parent().children('.infolayercontents0').length > 0) {
		  jQuery(e).children('div.infolayer').html(jQuery(e).parent().children('.infolayercontents0').html());
		  jQuery(e).children('div.infolayer').css("display","block");
		}
		var buttHeight = jQuery(e).children('div.prevbuttoncontainer').children('div.prevbutton').height();
		var containHeight = jQuery(e).height();
		var newT = ((containHeight-buttHeight)/2) + "px";
		jQuery(e).children('div').children('div.prevbutton, div.nextbutton').css("top",newT);

		if ( imgnms != null && imgnms.length > 1 ) {
		  ZR.panels.zelSlide.sliding[i] = false;
			ZR.panels.zelSlide.settings[i] = new Array;
			ZR.panels.zelSlide.settings[i]['speed'] = ( jQuery(e).attr("data-animspeed") != null && jQuery(e).attr("data-animspeed") != "" ) ? parseInt(jQuery(e).attr("data-animspeed")) : 500;
			ZR.panels.zelSlide.settings[i]['pause'] = ( jQuery(e).attr("data-slidedelay") != null && jQuery(e).attr("data-slidedelay") != "" ) ? parseInt(jQuery(e).attr("data-slidedelay")) : 2000;
			ZR.panels.zelSlide.settings[i]['spooling'] = ( jQuery(e).attr("data-spooling") != null && jQuery(e).attr("data-spooling") != "" ) ? parseInt(jQuery(e).attr("data-spooling")) : true;
			ZR.panels.zelSlide.settings[i]['easing'] = ( jQuery(e).attr("data-easing") != null && jQuery(e).attr("data-easing") != "" ) ? jQuery(e).attr("data-easing") : "easeOutBounce";
			ZR.panels.zelSlide.settings[i]['pauseOnHover'] = ( jQuery(e).attr("data-pauseonhover") != null && jQuery(e).attr("data-pauseonhover") != "" ) ? parseInt(jQuery(e).attr("data-pauseonhover")) : true;
			ZR.panels.zelSlide.imgs[i] = new Array;
			ZR.panels.zelSlide.imgs[i] = imgnms.split(",");
			ZR.panels.zelSlide.hrefs[i] = new Array;
			ZR.panels.zelSlide.hrefs[i] = hrefurls.split(",");
			jQuery(e).children("img.slide").remove();
			jQuery(e).append("<img src='" + ZR.panels.zelSlide.imgs[i][0] + "' data-href='" + ZR.panels.zelSlide.hrefs[i][0] + "' class='slide active' />");
			if (ZR.panels.zelSlide.hrefs[i][0] != "") {
				jQuery(e).children("img.slide").on("click", function() { ZR.panels.zelSlide.goToLink(this); });
				jQuery(e).children("img.slide").css("cursor","pointer");
			}
			
			jQuery(e).attr("data-curr-idx",0);
			jQuery(e).append("<div id='zelslidecontrol" + jQuery(e).attr("id") + "' class='control " + jQuery(e).attr("data-control") + "'></div>");
			jQuery("#zelslidecontrol" + jQuery(e).attr("id")).html("");
			for (var g=0; g<ZR.panels.zelSlide.imgs[i].length; g++) {
			  jQuery("#zelslidecontrol" + jQuery(e).attr("id")).append("<div class='bullet' data-target=" + i + " data-idx='" + g + "'></div>");
			}
		  jQuery("#zelslidecontrol" + jQuery(e).attr("id") + " div.bullet").click(function() {
		  	ZR.panels.zelSlide.goto(jQuery(this).attr('data-target'),jQuery(this).attr('data-idx'),true,'def');
		  });
			ZR.panels.zelSlide.setBullet(i,0);
			jQuery("#zelslidecontrol" + jQuery(e).attr("id")).css('visibility','visible');
 			if (jQuery(e).attr("data-autoplay") != null && jQuery(e).attr("data-autoplay") == "true") {
 				ZR.panels.zelSlide.playing[i] = true;
 				setTimeout("ZR.panels.zelSlide.play('" + i + "')",ZR.panels.zelSlide.settings[i]['pause']);
 			}
		}
		jQuery('div.prevbutton').click(function() { ZR.panels.zelSlide.previous(i); });
		jQuery('div.nextbutton').click(function() { ZR.panels.zelSlide.next(i); });
		//jQuery('div.prevbutton').fadeIn(500);
	  //jQuery('div.nextbutton').fadeIn(500);
	},
	goto: function(i,idx,ui,dir) {
		//(container id, number to go to, user interacted)
		if ( ZR.panels.zelSlide.sliding[i] ) { 
	    if ( ZR.panels.zelSlide.settings[i]['spooling'] ) {
	      setTimeout("ZR.panels.zelSlide.goto('" + i + "','" + idx + "','" + ui + "','" + dir + "')",100);
	    }
	    return; 
	  }
		if ( ui ) {
		  ZR.panels.zelSlide.playing[i] = false;
		}
		var curIdx = jQuery("#"+i).attr("data-curr-idx");
		if ( idx != curIdx ) {
			ZR.panels.zelSlide.hideInfoLabel(i);
			ZR.panels.zelSlide.setBullet(i,idx);
			ZR.panels.zelSlide.sliding[i] = true;
			if ( jQuery("#"+i).attr("data-effect") == "crossfade") {
			  ZR.panels.zelSlide.crossFade(i,idx);
			}
			else if ( jQuery("#"+i).attr("data-effect") == "horizslide" ) {
				if ( dir == 'right') {
				  ZR.panels.zelSlide.moveRight(i,idx);
				}
				else if (dir == 'left') {
				  ZR.panels.zelSlide.moveLeft(i,idx);
				}
				else {
					if ( idx < curIdx ) {
						ZR.panels.zelSlide.moveLeft(i,idx);
					}
					else {
					  ZR.panels.zelSlide.moveRight(i,idx);
					}
				}
		  }
			else if ( jQuery("#"+i).attr("data-effect") == "vertslide" ) {
				if ( idx < curIdx ) {
					ZR.panels.zelSlide.moveUp(i,idx);
				}
				else {
					ZR.panels.zelSlide.moveDown(i,idx);
				}
			}
			else {
				alert("Oops, data-effect: '" + jQuery("#"+i).attr("data-effect") + "' has not been defined.");
			}
		}
		jQuery("#"+i).attr("data-curr-idx",idx)
	},
	setBullet: function(i,idx) {
    jQuery("#" + i + " div.bullet").removeClass("active");
    jQuery("#" + i + " div.bullet:eq(" + idx + ")").addClass("active");
  },
  play: function(i) {
  	if ( ZR.panels.zelSlide.playing[i] ) {
  		var curIdx = parseInt(jQuery("#" + i).attr("data-curr-idx"));
  		var nextIdx = curIdx + 1;
  		//alert( (curIdx + 1) + "==" + jQuery("#" + i + " img.slide").length);
  		if ( (curIdx + 1) == ZR.panels.zelSlide.imgs[i].length )  {
  		  nextIdx = 0;
  		}
  		ZR.panels.zelSlide.goto(i,nextIdx,false,'def');
			setTimeout("ZR.panels.zelSlide.play('" + i + "')",ZR.panels.zelSlide.settings[i]['pause']);
  	}
  },
  moveUp: function(i,idx) {
    jQuery("#"+i).append("<img src='" + ZR.panels.zelSlide.imgs[i][idx] + "' data-href='" + ZR.panels.zelSlide.hrefs[i][idx] + "' class='slide onbottom' />");
		if (ZR.panels.zelSlide.hrefs[i][idx] != "") {
			jQuery("#"+i).children("img.slide").on("click", function() { ZR.panels.zelSlide.goToLink(this); });
			jQuery("#"+i).children("img.slide").css("cursor","pointer");
		}
  	jQuery("#" + i + " img.slide.onbottom").animate({top: "0%"},{easing: ZR.panels.zelSlide.settings[i]['easing'], duration: ZR.panels.zelSlide.settings[i]['speed'], complete: function() {
  		jQuery(this).removeClass("onbottom");
  		jQuery(this).addClass("active");
  	}});
  	jQuery("#" + i + " img.slide.active").animate({top: "-100%"},{easing: ZR.panels.zelSlide.settings[i]['easing'], duration: ZR.panels.zelSlide.settings[i]['speed'], complete: function() {
  		jQuery(this).remove();
			ZR.panels.zelSlide.sliding[i] = false;
			ZR.panels.zelSlide.showInfoLabel(i,idx);
  	}});
  },
  moveDown: function(i,idx) {
    jQuery("#"+i).append("<img src='" + ZR.panels.zelSlide.imgs[i][idx] + "' data-href='" + ZR.panels.zelSlide.hrefs[i][idx] + "' class='slide ontop' />");
		if (ZR.panels.zelSlide.hrefs[i][idx] != "") {
			jQuery("#"+i).children("img.slide").on("click", function() { ZR.panels.zelSlide.goToLink(this); });
			jQuery("#"+i).children("img.slide").css("cursor","pointer");
		}
  	jQuery("#" + i + " img.slide.ontop").animate({top: "0%"},{easing: ZR.panels.zelSlide.settings[i]['easing'], duration: ZR.panels.zelSlide.settings[i]['speed'], complete: function() {
  		jQuery(this).removeClass("ontop");
  		jQuery(this).addClass("active");
  	}});
  	jQuery("#" + i + " img.slide.active").animate({top: "100%"},{easing: ZR.panels.zelSlide.settings[i]['easing'], duration: ZR.panels.zelSlide.settings[i]['speed'], complete: function() {
  		jQuery(this).remove();
			ZR.panels.zelSlide.sliding[i] = false;
			ZR.panels.zelSlide.showInfoLabel(i,idx);
    }});
  },
  moveLeft: function(i,idx) {
		jQuery("#"+i).append("<img src='" + ZR.panels.zelSlide.imgs[i][idx] + "' data-href='" + ZR.panels.zelSlide.hrefs[i][idx] + "' class='slide onleft' />");
		if (ZR.panels.zelSlide.hrefs[i][idx] != "") {
			jQuery("#"+i).children("img.slide").on("click", function() { ZR.panels.zelSlide.goToLink(this); });
			jQuery("#"+i).children("img.slide").css("cursor","pointer");
		}
		jQuery("#" + i + " img.slide.onleft").animate({left: "0%"},{easing: ZR.panels.zelSlide.settings[i]['easing'], duration: ZR.panels.zelSlide.settings[i]['speed'], complete: function() {
			jQuery(this).removeClass("onleft");
			jQuery(this).addClass("active");
		}});
		jQuery("#" + i + " img.slide.active").animate({left: "100%"},{easing: ZR.panels.zelSlide.settings[i]['easing'], duration: ZR.panels.zelSlide.settings[i]['speed'], complete: function() {
			jQuery(this).remove();
			ZR.panels.zelSlide.sliding[i] = false;
			ZR.panels.zelSlide.showInfoLabel(i,idx);
	  }});
  },
  moveRight: function(i,idx) {
		jQuery("#"+i).append("<img src='" + ZR.panels.zelSlide.imgs[i][idx] + "' data-href='" + ZR.panels.zelSlide.hrefs[i][idx] + "' class='slide onright' />");
		if (ZR.panels.zelSlide.hrefs[i][idx] != "") {
			jQuery("#"+i).children("img.slide").on("click", function() { ZR.panels.zelSlide.goToLink(this); });
			jQuery("#"+i).children("img.slide").css("cursor","pointer");
		}
		jQuery("#" + i + " img.slide.onright").animate({left: "0%"},{easing: ZR.panels.zelSlide.settings[i]['easing'], duration: ZR.panels.zelSlide.settings[i]['speed'], complete: function() {
			jQuery(this).removeClass("onright");
			jQuery(this).addClass("active");
		}});
		jQuery("#" + i + " img.slide.active").animate({left: "-100%"},{easing: ZR.panels.zelSlide.settings[i]['easing'], duration: ZR.panels.zelSlide.settings[i]['speed'], complete: function() {
			jQuery(this).remove();
			ZR.panels.zelSlide.sliding[i] = false;
			ZR.panels.zelSlide.showInfoLabel(i,idx);
	  }});
  },
  crossFade: function(i,idx) {
		jQuery("#"+i).append("<img src='" + ZR.panels.zelSlide.imgs[i][idx] + "' data-href='" + ZR.panels.zelSlide.hrefs[i][idx] + "' class='slide tofade' />");
		if (ZR.panels.zelSlide.hrefs[i][idx] != "") {
			jQuery("#"+i).children("img.slide").on("click", function() { ZR.panels.zelSlide.goToLink(this); });
			jQuery("#"+i).children("img.slide").css("cursor","pointer");
		}
		jQuery("#" + i + " img.slide.tofade").css("opacity",0);
		jQuery("#" + i + " img.slide.tofade").animate({opacity:1},ZR.panels.zelSlide.settings[i]['speed'],function() {
			jQuery("#" + i + " img.slide.active").remove();
			jQuery(this).removeClass("tofade");
			jQuery(this).addClass("active");
			ZR.panels.zelSlide.sliding[i] = false;
			ZR.panels.zelSlide.showInfoLabel(i,idx);
		});
  },
  hideInfoLabel: function(i) {
  	jQuery("#" + i).children('div.infolayer').children().fadeOut(250,function() {
  		jQuery("#" + i).children('div.infolayer').html();
		});
  },
  showInfoLabel: function(i,idx) {
  	if (jQuery("#" + i).parent().children('.infolayercontents'+idx).length > 0) {
    	jQuery('.infolayercontents'+idx).children().css("display","none");
    	jQuery("#" + i).children('div.infolayer').html(jQuery("#" + i).parent().children('.infolayercontents'+idx).html());
    	jQuery("#" + i).children('div.infolayer').children().fadeIn(250);
  	}
  },
  next: function(i) {
  	ZR.panels.zelSlide.playing[i] = false;
		var curIdx = parseInt(jQuery("#" + i).attr("data-curr-idx"));
		var nextIdx = curIdx + 1;
		if ( (curIdx + 1) == ZR.panels.zelSlide.imgs[i].length )  {
		  nextIdx = 0;
		}
		ZR.panels.zelSlide.goto(i,nextIdx,false,'right');
  },
  previous: function(i) {
  	ZR.panels.zelSlide.playing[i] = false;
		var curIdx = parseInt(jQuery("#" + i).attr("data-curr-idx"));
		var nextIdx = curIdx - 1;
		if ( nextIdx < 0 ) {
		  nextIdx = ZR.panels.zelSlide.imgs[i].length - 1;
		}
		ZR.panels.zelSlide.goto(i,nextIdx,false,'left');
  },
  goToLink: function(ele) {
  	if (jQuery(ele).attr("data-href")) {
  	  self.location = jQuery(ele).attr("data-href");
  	}
  }
}

jQuery(function() {
	jQuery(".panel.zelslide").each(function() {
	  ZR.panels.zelSlide.init(jQuery(this));
	});
});

/*
 * Functionality for ZR.panels nixonproduct modules
 * 
 * Object Organization:
 *  ZR.panels - core script pieces needed for the basic structure
 *  ZR.panels.nixonProduct - scripts for zelSlide module
 *
 * Author: Henry Roberts 
 * Copyright: 2011 The ZaneRay Group, Inc
 * ALL RIGHTS RESERVED
 *
 */
 
ZR.panels.nixonProduct = {
  // do nothing		
}




