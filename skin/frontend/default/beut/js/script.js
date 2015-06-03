var ZR = window.ZR || {};
jQuery(function(){
	ZR.util.init();
	ZR.lb.ajax();
  ZR.lb.inline();
  ZR.SiteCountryMap.setCurrent();
  ZR.mobile.init();
});

jQuery(window).load(function(){
  ZR.util.loadPromoBar();
});




var loader = '<div class="loading"></div>';

ZR.util = {
    isMobile: false, //resets on init
    initMobile: null,
    initDesktop: null,
    mobileSize: 767,
    resizeFunction: null,
		init: function() {
		  
      jQuery("#siteMenu").on("click","a",function(e){
        e.preventDefault();
        var link = jQuery(this);
        var href = link.attr("href");
        var locale = jQuery.trim(link.attr("class"));
        jQuery.cookie('locale', locale, { expires: 30, path : '/', domain : 'nixon.com' });
        location.href = href;
      });


			/*check for touch support and hide address bar if there is.*/
			if ("ontouchstart" in document.documentElement) {
				window.scrollTo(0, 1);
				ZR.touch = true;
				ZR.util.touchNav();
			}
	
			ZR.util.screenWidthCheck();
			ZR.util.placeholder();
			ZR.util.selectNav();
			ZR.util.selectGlow();
			ZR.util.topNav.init();
			ZR.util.radioLabel();
			ZR.util.preloadButtons();
			ZR.User.initLoginLink();
			

      var initialTriggers = jQuery("*[data-triggeronload=true]");

      if ( initialTriggers.length > 0 ){
        /** only makes sense at this time to trigger one event.. first in first out **/
        jQuery(initialTriggers[0]).removeAttr("data-triggeronload").trigger("click");
      }

      ZR.util.bindGALinkTracking();
			
			jQuery('#mailinput').blur(function(){
				if(this.value != ''){
					jQuery('#mailform').submit();
				}
			});

			jQuery('a.anchor').click(function(){
        ZR.util.scrollAnchor(this);
        return false;
			});
	
			
			jQuery(window).resize(function(){
				ZR.util.screenWidthCheck();
			});
			
		
		},
    
    geoLocateErrors : function (error) {
      switch(error.code) {
      case error.PERMISSION_DENIED: console.log("Permission denied");
      break;
      case error.POSITION_UNAVAILABLE: console.log("Position unavailable");
      break;
      case error.TIMEOUT: console.log("Timed out");
      break;
      default: console.log("Unknown error");
      break;
      }
    },
		
    bindGALinkTracking : function(){
      // Example HTML attributes: data-ga-track="true" data-ga-event="Sign Up" data-ga-group="Account" data-ga-val="Create New Account"
      jQuery("*[data-ga-track='true']").each(function() {
        jQuery(this).on('click', function(e) {
        var link = jQuery(this);
        var event = jQuery.trim(link.attr("data-ga-event"));
        var value = jQuery.trim(link.attr("data-ga-val"));
        var type = jQuery.trim(link.attr("data-ga-group"));
          if ( event.length === 0 || value.length === 0 || type.length === 0 ) return;
        _gaq.push(['_trackEvent', type, event, value]);
      });
      });
    },

		//set a property if we are on a mobile or narrow screen
		screenWidthCheck: function(){
		  
		  var divPage = jQuery('#page');
		  if(divPage.legth > 0){
		    var winWidth = jQuery('#page').width();
		  } 
      else {
        var winWidth = jQuery(window).width();
      }
      
		  // Splash screen missing the width plugin? winWidth is null for me there. - MTR 8/1/2012
		  if(winWidth === null) {
		    return;
		  }
		  
		  /*Switch to Mobile Mode*/
		  if(winWidth < ZR.util.mobileSize && ZR.util.isMobile == false){
		    ZR.util.isMobile = true;
		    
		    //ZR.util.initMobile; //call a specific function for mobile;
		    jQuery('html').addClass('mobile');
		    jQuery('html').removeClass('desktop');
		    
		    if (ZR.util.initMobile) {
		      ZR.util.initMobile();
		    }
		    
		    if (ZR.util.resizeFunction) {
          ZR.util.resizeFunction();
        }
		  } 
		  
		  /*Switch to Desktop Mode*/
		  else if (winWidth > ZR.util.mobileSize && ZR.util.isMobile == true) {
		    ZR.util.isMobile = false;
		    
		    //set the subnav heights
		    
		    //ZR.util.initDesktop; //call a specific function for desltop;
		    jQuery('html').addClass('desktop');
		    jQuery('html').removeClass('mobile');
		    ZR.util.topNav.setNavHeights();
		    
		    if (ZR.util.initDesktop) {
          ZR.util.initDesktop();
        }
        
        if (ZR.util.resizeFunction) {
          ZR.util.resizeFunction();
        }
		  } 
		  else if(winWidth <ZR.util.mobileSize) {
		    ZR.util.isMobile = true;
			}
			else {
				ZR.util.isMobile = false;
			}
		  
		  if(ZR.util.isMobile == true){
        var winHeight = jQuery(window).height();
        var contentHeight = winHeight - 44; //44 is the header
        //jQuery('.no-touch #contentwrapper, .overflowscrolling #contentwrapper').css('height',contentHeight);
        //jQuery('.no-touch #mobilenav, .overflowscrolling #mobilenav').css('height',contentHeight); 
		  }
		  
		},
		loadPromoBar:function(){
		  var promoBar = jQuery('.promobar');
		  
		  //If there is a promobar proceed. 
		  if(promoBar.length > 0){
		    var sessionURL = '/includes/set-session-value/',
		        promoClose = jQuery('.promoclose'),
		        promoBarRestore = jQuery('#promobarrestore');
		    
		    //If nothing is shown (first time in session) show the promo bar
		    if(!promoBar.hasClass('active') && !promoBarRestore.hasClass('active')){
		      promoBar.addClass('active');
		    }
		    
		    promoClose.on('click',function(){
		      promoBar.removeClass('active');
		      promoBarRestore.addClass('active');
		      
		      jQuery.ajax({
		        type: 'POST',
		        url: sessionURL,
		        data: {
		          'name': 'headerPromo',
		          'value': 'hide'
		        },
		        success: function(data) {
//	            console.log('headerPromo hide');
//	            console.log(data);
	          }
		      });
		      
		      
		      
		      
		    });
		    
		    promoBarRestore.on('click',function(){
          promoBarRestore.removeClass('active');
          promoBar.addClass('active');
          
          jQuery.ajax({
            type: 'POST',
            url: sessionURL,
            data: {
              'name': 'headerPromo',
              'value': 'show'
            },
            success: function(data) {
//              console.log('headerPromo show');
//              console.log(data);
            }
          });
          
		    });
		  }
		},
		preloadButtons: function(){
			var imgPrimaryBtn = new Image();
					imgPrimaryBtn.src="/images/common/btn-load-primary.gif";
			var imgSecondaryBtn = new Image();
					imgSecondaryBtn.src="/images/common/btn-load-secondary.gif";
		},
		/*placehodler functionality for input fields*/
		placeholder: function(){
			jQuery('.placeholder input, .placeholder textarea').each(function(){
				/*If anything has a value hide the label when the page loads. */
				var inputVal = this.value;
				if(inputVal.length > 0){
					jQuery(this).prev('label').hide();
				}
			});
			
			jQuery('.placeholder input, .placeholder textarea').bind('keydown',function(event){
				var inputVal = this.value;
				if(inputVal.length == 0 && event.keyCode>54){
					
					jQuery(this).prev('label').hide();
				}
			});
			
			jQuery('.placeholder input, .placeholder textarea').bind('keyup',function(event){
				var inputVal = this.value;
				if(inputVal.length > 0){
					jQuery(this).prev('label').hide();
				} else {
					jQuery(this).prev('label').fadeIn('200');
				}
			});
			
			jQuery('.placeholder input, .placeholder textarea').bind('blur',function(event){
				var inputVal = this.value;
				if(inputVal.length == 0) {
					jQuery(this).prev('label').show();
				}
				else {
					jQuery(this).prev('label').hide();
				}
			});
		},


  /**
   * Bound on a new layer, div, etc, added to the DOM
   * via ajax call.
   * use ZR.util.ajaxPlaceholder.apply( jQuery(newItemSelector) );
   */
    ajaxPlaceholder: function(){
      var o = jQuery(this);

      o.find('.placeholder input, .placeholder textarea').each(function(){
        /*If anything has a value hide the label when the page loads. */
        var inputVal = this.value;
        if(inputVal.length > 0){
          jQuery(this).prev('label').hide();
        }
      });

      o.find('.placeholder input, .placeholder textarea').bind('keydown',function(event){
        var inputVal = this.value;
        if(inputVal.length == 0 && event.keyCode>54){

          jQuery(this).prev('label').hide();
        }
      });

      o.find('.placeholder input, .placeholder textarea').bind('keyup',function(event){
        var inputVal = this.value;
        if(inputVal.length > 0){
          jQuery(this).prev('label').hide();
        } else {
          jQuery(this).prev('label').fadeIn('200');
        }
      });

      o.find('.placeholder input, .placeholder textarea').bind('blur',function(event){
        var inputVal = this.value;
        if(inputVal.length == 0) {
          jQuery(this).prev('label').show();
        }
        else {
          jQuery(this).prev('label').hide();
        }
      });
    },
		
		selectNav: function(){
			jQuery('.selectnav').hover(
				function(){
					var activeItem = jQuery(this).find('.active');
					var activeIdx = jQuery(this).find('.options li').index(activeItem);
					jQuery(this).data('activeIdx',activeIdx);
					jQuery(this).find('.options').stop(true,true).slideDown('200');
				},
				function(){
					var selectOptions = jQuery(this).find('.options'),
							activeIdx = jQuery(this).data('activeIdx');
					selectOptions.slideUp('200');
					jQuery(this).find('.options li:eq(' + activeIdx + ')').addClass('active');
				}
			);
			jQuery('.selectnav .options a').mouseover(function(){
				var activeIdx = jQuery(this).closest('.selectnav').data('activeIdx');
				jQuery(this).closest('.options').children('li').removeClass('active');
			});
		},
		
		selectGlow : function(){
			//fix to add a shadow to a select menu on focus
			jQuery('select').bind('focus',function(){
				jQuery(this).parent('.glow').addClass('glowon');
			});
			jQuery('select').bind('blur',function(){
				jQuery(this).parent('.glow').removeClass('glowon');
			});
		},
		
		topNav : {
			speed: 400,
			subNavHeight : new Array(),
			activeId: null,
			hoverId: null,
			animating: false,
			menuOpen: false,

			//toggles hover and click menu behavior
			navOnHover: false,
			
			init: function() {
				ZR.util.topNav.storeSelect();
				jQuery('.gendermenu.inactive').css('display','none'); //have to do this or else it defaults to list-item when you fade it in. 
				ZR.util.topNav.setNavHeights();
				if ( ZR.util.topNav.navOnHover ) {
				  //no more hover behavior 3/13/2012 per nixon -shr 
  				jQuery('.topnav').hoverIntent({
  					 over: function() {
  							ZR.util.topNav.callMenu(this.id);
  					 },
  					 sensitivity: 3,
  					 out: function() {}
  				});
  				jQuery('.subnav').on("mouseover",function() {
  					ZR.util.topNav.setHover(this.id);
  				});
    			jQuery('#primarymenu').on('mouseleave',function(){
    				ZR.util.topNav.waitCloseMenu();
    			});
				}
				else {
					//nav on click
					jQuery('.topnav a.topnavlink').click(function() {
					  if (!jQuery(this).hasClass('usehref')) {
					    return ZR.util.topNav.clickOpenMenu(jQuery(this).parent(".topnav").attr("id"));
					  }
					  else {
					    return true;
					  }
					});
				}
			}, //end init
			
			setNavHeights:function(){
			  jQuery('#primarymenu .subnav').each(function(n){
          ZR.util.topNav.subNavHeight[n] = jQuery(this).outerHeight(true); //get the outerHeights of the menus
          //console.log('ZR.util.topNav.subNavHeight[n]: ' + ZR.util.topNav.subNavHeight[n]);
          jQuery(this).css('margin-top','-' + ZR.util.topNav.subNavHeight[n] + 'px');
        });
			},
			clickOpenMenu: function(id) {
				if (ZR.util.topNav.menuOpen) {
					if ( id == ZR.util.topNav.activeId) {
						ZR.util.topNav.hideMenu();
						return false;
					} 
					else {
					  ZR.util.topNav.hideShowMenu(id);
					  return false;
					}
				}
				else {
					ZR.util.topNav.showMenu(id);
				  return false;
				}
			},
			
			waitCloseMenu: function() {
				if(ZR.util.topNav.animating) {
					var t = setTimeout(function(){
						ZR.util.topNav.waitCloseMenu();
					},50);
				}
				else {
  				ZR.util.topNav.setHover(null);
  				var menuTimeout = setTimeout(function(){
  					if(ZR.util.topNav.hoverId == null) {
  						ZR.util.topNav.hideMenu();
  					}
  				},800);
				}
			},
			
			setHover: function(id) {
				ZR.util.topNav.hoverId = id;
			},
			
			callMenu: function(id) {
				ZR.util.topNav.setHover(id);
				if (ZR.util.topNav.hoverId == ZR.util.topNav.activeId) {
					return;
				}
				if(ZR.util.topNav.animating) {
					var t = setTimeout(function(){
						ZR.util.topNav.callMenu(id);
					},50);
				}
				else {
					var t = setTimeout(function(){
						ZR.util.topNav.triggerMenu(id);
					},175);
				}
			},
			
			triggerMenu: function(id){
				if(ZR.util.topNav.hoverId == id){
					ZR.util.topNav.animating = true;
					if(ZR.util.topNav.menuOpen) {
						ZR.util.topNav.hideShowMenu(id);
					}
					else {
						ZR.util.topNav.showMenu(id);
					}
				}
			},
			
			showMenu: function(id){
				var idx = jQuery('.topnav').index(document.getElementById(id));	//gets the index if the element in the array .topnav
				ZR.util.topNav.activeId = id;	
				var subNavWrap = jQuery(id.replace('topnav','#subnavwrap'));
				var subNavEl = jQuery(id.replace('topnav','#subnav'));
				var subnavHeight = ZR.util.topNav.subNavHeight[idx];
				var subnavWrapHeight = subnavHeight -1; //accounts for the border
				
				subNavEl.css({
					display: 'block',
					opacity: 0
				});
  			subNavEl.stop().animate(
					{ 
						'margin-top': 0 + 'px',
						opacity: 1
					},
					ZR.util.topNav.speed,function(){
						jQuery('.subnav').css('margin-top','0px'); //set all subnav items to margin top 0 so they can x-fade
						ZR.util.topNav.animating = false;
						ZR.util.topNav.menuOpen = true;
					}
				);
				
				jQuery('#headercontents').stop().animate(
					{ 'padding-bottom': subnavHeight + 'px'},
					ZR.util.topNav.speed
				);
			},
			
			hideShowMenu: function(id){
				var activeNavId = ZR.util.topNav.activeId;
				ZR.util.topNav.activeId = id;	
				var idx = jQuery('.topnav').index(document.getElementById(id));	
				var subNavEl = jQuery(activeNavId.replace('topnav','#subnav'));
				var subnavHeight = ZR.util.topNav.subNavHeight[idx];
				var subnavWrapHeight = subnavHeight -1; //accounts for the border
				
			 subNavEl.stop().fadeOut(
					300,function(){
					jQuery('#headercontents').stop().animate(
						{ 'padding-bottom': subnavHeight + 'px'},
							300,
							function(){
								ZR.util.topNav.showMenu(id);
						});
					}
				);
			},
			
			hideMenu: function() {
				if(ZR.util.topNav.animating) {
					var t = setTimeout(function(){
						ZR.util.topNav.hideMenu();
					},50);
					return;
				}
				ZR.util.topNav.animating = true
        jQuery('#primarymenu .subnav').each(function(i) {
          jQuery(this).fadeOut(ZR.util.topNav.speed,function(){
						jQuery(this).animate({
							'opacity': 0,
							'margin-top': '-' +  ZR.util.topNav.subNavHeight[i] + 'px'
						}, ZR.util.topNav.speed,function() {
							if(i == 0) {
                //if we are at the first one then hide the header contents. 
								jQuery('#headercontents').stop().animate(
  								{ 'padding-bottom': 0 + 'px'},
  								ZR.util.topNav.speed, function() {
  									ZR.util.topNav.animating = false;
  									ZR.util.topNav.menuOpen = false;
  									ZR.util.topNav.activeId = null;
  									ZR.util.topNav.setHover(null);
 								});
							}
							jQuery(this).css('display', 'none');
						});
					});
          
        });
			},
			
			storeSelect: function(){
			
				var navStoreSelect = jQuery('.navstoreselect');
				jQuery('.navstoreselect').mouseenter(function(){
					var selectId = this.id;
					var gender = selectId.replace('navstore','');
					if(!jQuery(this).hasClass('active')){
						
						jQuery(this).siblings().removeClass('active'); 
						jQuery(this).addClass('active');
						
						var activeMenu = jQuery('.gendermenu.active'); //set 'em as vars so we can swap classes later
						var inactiveMenu = jQuery('.gendermenu.inactive');
						activeMenu.removeClass('active').addClass('inactive');		
						inactiveMenu.removeClass('inactive').addClass('active');	
						
						activeMenu.fadeOut(500,function(){
							inactiveMenu.stop().fadeIn(500,function(){
								inactiveMenu.css('display','block');
								activeMenu.css('display','none');
							});
						});
					}																																
				});
			}
		},

		

    autoLoadResults : function( anchor, button, offset ){
      ZR.Base.log("ZR.Base.autoLoadResults()", null, "DEBUG");
      var o=0;

      if ( typeof anchor !== 'string'){
        ZR.Base.log("anchor must be a string : the id of the anchor on the page to fire when reached", null, "ERROR");
        return false;
      }
      if ( typeof button !== 'string'){
        ZR.Base.log("button must be a string : the id of the button to click when the anchor is reached", null, "ERROR");
        return false;
      }
      if ( typeof offset !== 'undefined' && ZR.Base.isNumeric(offset)){
        o = offset;
      }
      else{
        if ( ! ZR.Base.isNumeric(offset) ){
          ZR.Base.log("offset must be a number. defines how much higher than the anchor position to trigger the click", null, "ERROR");
        }
      }

      jQuery(window).on("scroll.viewmore", jQuery.debounce(100, function(){
          var vmbutton = jQuery("#" + anchor + "[name!='data-fired']");
          if ( vmbutton.length != 0 ){
            jQuery(vmbutton).attr("data-fired","true");
            var currentPosition = jQuery(window).scrollTop() + o;
            var fireat = jQuery(document).height() - jQuery(window).height() - ( jQuery(document).height() - vmbutton.offset().top );
            if  ( currentPosition >= fireat ){
              var btn = jQuery("#" + button);
              btn.trigger("click").attr("disabled","disabled");
              ZR.util.hideButton(button);
            }
          }
          return true;
        })
      );
     // jQuery("img.lazy").lazyload();

    },


		/*---------------------------------------------
		
		Trigger the topnav if the menus are closed
		otherwise trigger the click
		
		-----------------------------------------------*/
		touchNav: function(){
			jQuery('.topnavlink').click(function(){
				var relLink = this.rel;	
				if(jQuery('#subnav' + relLink).is(':visible')) {
					return true;														
				}
				else {
					return false;
				}
			});
		},
		
		
		
		
		//activates .radiolabel click for mobile webkit
		radioLabel: function(){
			jQuery('.radiolabel').attr('onclick','');
		},
		
		mailto: function(){
			jQuery('.mailto').each(function(){
																 
				var emailAddr = jQuery(this).text();
						emailAddr = emailAddr.replace('[at]','@');
				jQuery(this).text(emailAddr)
				jQuery(this).attr('href','mailto:' + emailAddr)		
				
			});
		},
		
		//function that scrolls the page to a certain <a name="anchorName"></a>  on the page. 
		scrollAnchor: function(el,offset){
			
				
			
			if(offset != null){
				var offsetPx = offset;
			}
			else 
			if (ZR.Settings.anchorOffset != null && ZR.Settings.anchorOffset != undefined && ZR.Settings.anchorOffset != '') {
				var offsetPx = ZR.Settings.anchorOffset;
			}
			else {
				var offsetPx = 10;
			}

      var pageHref = (location.href.indexOf("?") != -1 ) ? (location.href.split("?"))[0] : location.href;
      var url = el.href;
      var linkHref = (url.indexOf("?") != -1 ) ? (url.split("?"))[0] : url;
      var linkHref = (linkHref.indexOf("#") != -1 ) ? (linkHref.split("#"))[0] : linkHref;

			var anchorName = url.split('#'),
					anchorName = anchorName.pop();
			
			if( linkHref == pageHref ) {
				if(jQuery('#' + anchorName).length) {
					var eOffset = jQuery('#' + anchorName).offset().top - offsetPx,
							scrollPos = eOffset;
					jQuery('html, body').stop().animate({
						scrollTop: scrollPos
					}, 1500, 'easeInOutCubic');
				} else {
					return;
				}
			}
			else {
				//we are not on the same page fire the Go functionality
				var goURL = url.replace('#','?go=');
				window.location = goURL;
			}
	
			
			
		},
		
		
		scrollToPos: function(pos,speed){
			if(speed == null){
				var speed = 1000;
			}
			jQuery('html, body').stop().animate({
			scrollTop: pos
			}, speed, 'easeInOutCubic');
		},
		
		//function that scrolls the page to a certain #id  on the page. 
		scrollToId: function(idName,offset){
			if(offset != null){
			  if (ZR.util.isMobile) {
			    var offsetPx = 0;
			  }
			  else {
			    var offsetPx = offset;
			  }
			}
			else {
				var offsetPx = 50;
			}
	
			var eOffset = jQuery('#' + idName).offset().top - offsetPx;
			var scrollPos = eOffset;
			jQuery('html, body').stop().animate({
			scrollTop: scrollPos
			}, 1000, 'easeInOutCubic');
		},
		scrollToObject : function(o,offset){
			if ( o.length != 0 ){

        if(offset != null){
          var eOffset = o.offset().top - offset;
        }
        else {
          var eOffset = o.offset().top - 10;
        }
				var scrollPos = eOffset;
				jQuery('html, body').stop().animate({
				scrollTop: scrollPos
				}, 1000, 'easeInOutCubic');
			}
		},
		focusAndScrollTo : function(field){
			ZR.Base.log("ZR.util.focusAndScrollTo()", null, "DEBUG");
			if ( typeof field == 'undefined' ) return;
	
			var o = jQuery(field);
			if ( o.length != 0 ){
				if ( typeof o.attr("id") !== 'undefined' )
				ZR.util.scrollToId( o.attr("id") );
				o.focus();
			}
		},
		hideButton : function(id) {
			var currentClass = jQuery('#' + id).attr('class');
			var btnWidth = jQuery('#' + id).width();
			var btnWidthPad = (btnWidth-16)/2;
			var btnHeight = jQuery('#' + id).height();
			var btnHeightPad = (btnHeight-16)/2;
			jQuery('#' + id).attr('disabled',true);
			var btnHTML = jQuery('#' + id).html();
			var btnHTMLObj = jQuery("#"+id);
			//Set the data on the Button Object
		 btnHTMLObj.data( 'btnVal', btnHTML);
			jQuery('#' + id).html('<span class="loading" style="height: ' + btnHeight + 'px; width: ' + btnWidth + 'px;" title="loading"/>');
		},
	
	
		disableButton : function(id){
			jQuery('#' + id).attr('disabled',true);
		},
	
		enableButton : function(id){
			var btn = jQuery('#' + id);
			btn.removeAttr('disabled');
			var val = btn.data('btnVal');
			if( typeof val !== 'undefined' ){
				btn.html(val);
			}
		},
	
		limitText : function(el,n) {
			var areaContents = el.val();
			var idName = el.attr("id");
			var contLength = areaContents.length;
			var contRemaining = n - contLength;
			var label = jQuery('#' + idName+'counter');
			if( contRemaining < 0 ) {
				contRemaining = 0;
			}
			label.html(contRemaining + ' ' + ZR.Settings.alerts.base.limitTextLabel);
			var remainAlertInt = n - 10;
			if(contLength > remainAlertInt) {
				label.addClass('error');
			} else {
				label.removeClass('error');
			}
			if (contLength > n) {
				var contTrunc = areaContents.slice(0,n);
				el.val(contTrunc);
			}
		},
		
		switchPosition : function(switch1,switch2) { 
		  if (ZR.util.isMobile) {
        jQuery(switch1).insertBefore(switch2);
      }
		  else {
        jQuery(switch1).insertAfter(switch2);
      }
		  ZR.util.initMobile = function() {
		    ZR.util.switchPosition(switch1,switch2);
		  }
		  ZR.util.initDesktop = function() {
		    ZR.util.switchPosition(switch1,switch2);
      }
		},
		
		pageHeader : {
      isSticky : false,
      callback : [],
			canScroll: true,
      addCallback : function(fn){
        ZR.util.pageHeader.callback.push(fn);
      },
			checkScroll : function(){
				var initScrollHeight = jQuery(window).height() +  jQuery('#mainheader').outerHeight() + jQuery('#footer').outerHeight() + jQuery('.pageheader').outerHeight() + 80; //don't allow the page header scroll if the page is shorter than this
				if(jQuery(window).width() > 970 && jQuery(window).height() > 650 && jQuery(document).height() > initScrollHeight) {
					ZR.util.pageHeader.canScroll = true;
				}
				else {
					ZR.util.pageHeader.canScroll = false;
				}
				return ZR.util.pageHeader.canScroll;
			},
			
			init : function() {
				if(!ZR.util.isMobile && jQuery('.ie7').length  == 0 && jQuery('.ie6').length  == 0 && !Modernizr.touch){ //ie7 and ie6 fixed position blows up with html doctype
				//Check scroll on resize
				
				jQuery(window).on('resize',function(){
					 ZR.util.pageHeader.checkScroll();
					 
					 if(ZR.util.scrollSidebar) {
							ZR.util.pageHeader.sidebarOffset = jQuery('#page').offset().left + 640;
							if(sidebar.hasClass('fixedsidebar')){
								sidebar.css('left',ZR.util.pageHeader.sidebarOffset + 'px');
							}
						}
				});
					
					
				// Make the pageheader sticky once the footer comes into view
					var pagehead = jQuery('.pageheader'),
							pageWindow = jQuery(document),
							content = jQuery('#content'),
							mainHeader = jQuery('#mainheader'),
							promoBar = jQuery('#promobar'),
							pageHeadWidth = pagehead.width(),
							pageHeadHeight = pagehead.outerHeight(),
							scrollPos,
							headerPos = pagehead.offset().top,
							top = '0';
								
					if(ZR.util.scrollSidebar) {
						var pageBody = jQuery('body')
								bodyHeight = pageBody.outerHeight(true),
								sidebar = jQuery('#sidebarcontent'),
								sidebarPos = sidebar.offset().top,
								sidebarHeight = sidebar.outerHeight(true);
								footerHeight = jQuery('#footer').outerHeight(true),
								maxSidebarTop = bodyHeight - pageHeadHeight - sidebarHeight - footerHeight;
								
						ZR.util.pageHeader.sidebarOffset = sidebar.offset().left - 10;
					}

					ZR.util.pageHeader.canScroll = ZR.util.pageHeader.checkScroll;

					pageWindow.scroll(jQuery.throttle(50, function(){
	          //We've got to use jquery on the promobar.active because we need to see if it exists to add it here. 
						headerPos = mainHeader.outerHeight() + jQuery('#promobar.active').outerHeight();
						
						if(ZR.util.pageHeader.canScroll){
							scrollPos = pageWindow.scrollTop();

            				//scroll the header
							if (scrollPos >= headerPos ){
                              if (ZR.util.pageHeader.isSticky != true){
                                for (cb = 0; cb < ZR.util.pageHeader.callback.length; cb++){
                                  var fn = ZR.util.pageHeader.callback[cb];
                                  fn(true);
                                }
                              }

                              ZR.util.pageHeader.isSticky = true;
								pagehead.addClass('fixedheader');
								pagehead.css({
									width: pageHeadWidth + 'px',	// required, otherwise the width blows up
									top: 0
								});
								content.css('padding-top', pagehead.outerHeight() + 'px');
							} else {
                              if (ZR.util.pageHeader.isSticky != false){
                                for (cb = 0; cb < ZR.util.pageHeader.callback.length; cb++){
                                  var fn = ZR.util.pageHeader.callback[cb];
                                  fn(false);
                                }
                              }
                              ZR.util.pageHeader.isSticky = false;
								pagehead.removeClass('fixedheader');
								content.css({
									paddingTop: '0',
									top: top
								});
							}
							
							//scroll the sidebar
							if(ZR.util.scrollSidebar) {
								if (scrollPos >= (sidebarPos - pageHeadHeight) ){
									
									if(scrollPos >= (maxSidebarTop - 40)){ //sidebar goes below footer /absolute position it. 
										sidebar.addClass('abssidebar');
										sidebar.addClass('fixedsidebar');
										sidebar.css({ top: (maxSidebarTop - 81) + 'px', left: 'auto'});								
									} else { //sidebar floats, fixed position it. 
										sidebar.removeClass('abssidebar');
										sidebar.addClass('fixedsidebar');
										sidebar.css({ top: (pageHeadHeight - 1) + 'px', left: ZR.util.pageHeader.sidebarOffset + 'px'});
									}
										
								
								}	else {
									sidebar.removeClass('fixedsidebar');
									//sidebar.css({ top: pageHeadHeight + 'px'});
								}
							}
							
						} else {
						  // Make sure header doesn't stick
						  ZR.util.pageHeader.isSticky = false;
                          pagehead.removeClass('fixedheader');
                          content.css({
                              paddingTop: '0',
                              top: top
                          });
						} //end can scroll
					}));
				} // end !ZR.util.isMobile	
			} //end init
		}, //end pageHeader
		
		blackLabel: function(){
			jQuery('.desktop .blacklabel:visible').each(function(){
				var labelHeight = jQuery(this).outerHeight() * -1;
				jQuery(this).css('bottom',labelHeight + 'px');
			});
		},
		
		
		
		
	
		sectionAnchors: function(offset){

			/*--------------------------------------------
			
				Note:
				all the anchor links in the #sectionutility
				need a class of .anchor
				
				all the Divs need a class of 
				.sectionanchor for this to work
			
			---------------------------------------------*/
			
			var scrollPos,
					theWindow = jQuery(window),
					sectionAnchor = jQuery('.sectionanchor'),
					headerHeight = jQuery('.pageheader').outerHeight(),
					currentAnchor = jQuery('#sectionutility a.anchor:eq(0)'),
					lastIdx = sectionAnchor.length - 1,
					atAnchorIdx = null;

      if(typeof offset === 'undefined') {
				offset = 0;
			}
			
			jQuery('#sectionutility a.anchor').click(function(){
				var headerOffset = jQuery('.pageheader').outerHeight() + offset; //25 is the padding on top of the columns
				ZR.util.scrollAnchor(this, headerOffset);
			});
			
			theWindow.scroll( jQuery.throttle(100, function(){
				scrollPos = theWindow.scrollTop();

				sectionAnchor.each(function(n){

          var cur = Math.floor(jQuery(this).offset().top - headerHeight - offset);

          if(cur <= scrollPos) {
						atAnchorIdx = n;
					}

					//when we are done loopings set it.
					if((n + 1) == sectionAnchor.length && atAnchorIdx !== null ) {
						currentAnchor.removeClass('active');
						if(theWindow.scrollTop() >= (jQuery('body').height() - theWindow.height() - 21)) {
							var atAnchor = jQuery('#sectionutility a.anchor:eq(' + lastIdx + ')');
						}
						else {
							var atAnchor = jQuery('#sectionutility a.anchor:eq('+ atAnchorIdx +')');
						}
						
						if(atAnchor !== undefined) {
							atAnchor.addClass('active');
							currentAnchor = atAnchor;
						}
					}
				});
			}) );
		},
		slideFaq: function(anchorTag) {
			var question = jQuery(anchorTag).parent(),
					answer = question.attr('id').replace('question', 'answer'),
					container = jQuery('#topFaqs', 'aside');
	
			if(!jQuery('#' + answer, container).is(':visible')) {
			 jQuery('a:first', question).css('font-weight', 'bold');
			 jQuery('#' + answer, container).slideFade(400);
			} else {
			 jQuery('a:first', question).css('font-weight', 'normal');
			 jQuery('#' + answer, container).slideFade(400);
			}
		},
    inlineSlide: function(anchorTag) {
    var question = jQuery(anchorTag).parent(),
      answer = question.attr('id').replace('question', 'answer');

    if(!jQuery('#' + answer).is(':visible')) {
      jQuery('#' + answer).slideFade(400);
    } else {
      jQuery('#' + answer).slideFade(400);
    }
  },
	
	
	/*------------------------------------------
	
	function that handles view more for a 
	lot of the gallery pages. 
	
	--------------------------------------------*/
	viewMore: function(){
		var viewMoreBtn = jQuery('#viewmorebutton');
		var viewMoreCount = viewMoreBtn.attr('data-more');
		var remainingThumbs = jQuery('.morethumb.hide').length;
		viewMoreBtn.click(function(){
			var remainingThumbs = jQuery('.morethumb.hide').length;	
			
			var hiddenThumbs = jQuery('.morethumb.hide:lt(' + viewMoreCount + ')');

			hiddenThumbs.each(function(n){
				var imgSrc = jQuery(this).attr('data-src');
				jQuery(this).find('.moreimg').attr('src',imgSrc);				
			})
			
			hiddenThumbs.find('.moreimg').imagesLoaded(function(){
				jQuery(this).closest('.morethumb').fadeIn(function(){
					jQuery(this).removeClass('hide');
					jQuery(this).css({"display" : "block"});
				});
				ZR.util.blackLabel();
			});				
			
			if(remainingThumbs > viewMoreCount && remainingThumbs < (viewMoreCount * 2)) {
				jQuery('#viewmorecount').text(remainingThumbs - viewMoreCount);
			} else 
			if(remainingThumbs <= viewMoreCount) {
				jQuery('#viewmorenav').animate({opacity: 0,height: 0,padding: 0},function(){
				  jQuery("#footerinner").css({"border":"none"});
				});
			}
			return false;
		});
	}

};


/*-------------------------------------------------
	Core Lightbox function
-------------------------------------------------*/

ZR.lb = {
  onprev: false,
  onnext : false,
  ajax: function(){
    jQuery('.desktop .ajaxbox').each(function(){
      var url = this.href.replace(".html", "/");
      var urlArr = url.split('/'),
          hideImage = jQuery(this).attr("data-noimage"),
          boxType = jQuery(this).attr("data-type"),
          qs = '',
          useUrl = jQuery(this).attr("data-url");

      if ( typeof hideImage !== 'undefined' ) {
        qs = "?noimage=" + hideImage;
      }

      if ( typeof boxType === 'undefined' ) {
        boxType = 'ajax';
      }

      if ( ZR.Base.isEmpty(useUrl) ) {
        urlArr.pop();
        var refid = urlArr.pop(); //pop it like it's hot, twice to get at the refid
            refid = refid.replace('.html',''); //Get rid of .html extension if it is there.
        var ajaxURL = '/includes/ajax-box/' + refid + '/' + qs;
      }
      else {
        var ajaxURL = useUrl;
      }

      jQuery(this).fancybox({
        scrolling: 'auto',
        href: ajaxURL,
        type: boxType,
        prevEffect	: 'none',
        nextEffect	: 'none',
        afterShow : function(){
          ZR.lb.moveArrows(jQuery(this)[0]);
        },
        onUpdate : function(){
          ZR.lb.moveArrows();
        }
      });
    });

    jQuery('.iframebox').each(function(){
      var url = this.href.replace(".html", "/");
      var _scrolling = 'no';
      var _width = 560;
      var _height = 340;
      var urlArr = url.split('/'),
        hideImage = jQuery(this).attr("data-noimage"),
        boxType = jQuery(this).attr("data-type"),
        scrollType = jQuery(this).attr("data-scroll"),
        widthX = jQuery(this).attr("data-width"),
        heightY = jQuery(this).attr("data-height"),
        printLink = jQuery(this).attr("data-print"),
        qs = '?';

      if ( typeof hideImage !== 'undefined' ) {
        qs += "&noimage=" + hideImage;
      }

      if ( typeof scrollType !== 'undefined' ) {
        if ( scrollType.toLowerCase() == 'yes' || scrollType.toLowerCase() == 'no' || scrollType.toLowerCase() == 'auto' ){
          _scrolling = scrollType;
        }
      }

      if ( typeof widthX !== 'undefined' && ZR.Base.isNumeric(widthX) ) {
        _width = Number(widthX);
      }

      if ( typeof heightY !== 'undefined' && ZR.Base.isNumeric(heightY) ) {
        _height = Number(heightY);
      }

      if ( typeof boxType === 'undefined' ) {
        boxType = 'ajax';
      }

      if ( typeof printLink !== 'undefined' ) {
        if ( printLink.toLowerCase() == 'true' ){
          qs += "&printlink=true";
        }
      }


      urlArr.pop();
      var refid = urlArr.pop(); //pop it like it's hot, twice to get at the refid
      refid = refid.replace('.html',''); //Get rid of .html extension if it is there.
      if ( qs == '?' ) qs = '';
      var ajaxURL = '/includes/iframe-box/' + refid + '/' + qs;

//      console.log("width: " + width + " height: " + height + " scrollType: " + scrolling)

      jQuery(this).fancybox({
        'scrolling': _scrolling,
        'width' : _width,
        'height' : _height,
        'href' : ajaxURL,
        'autoScale' : true,
        'autoDimensions' : true,
        'type' : boxType,
        'prevEffect'	: 'none',
        'nextEffect'	: 'none',
        'afterShow' : function(){
          ZR.lb.moveArrows(jQuery(this)[0]);
        },
        'onUpdate' : function(){
          ZR.lb.moveArrows();
        }
      });
    });
  },
  zoom: function(){
    jQuery('.desktop .zoom').fancybox({
      afterShow : function(){
        ZR.lb.moveArrows(jQuery(this)[0]);
      },
      onUpdate : function(){
        ZR.lb.moveArrows();
      }
    });
    jQuery('html:not(.desktop) #pdp .zoom').children().unwrap();
    
    
  },
  video: function(){
    jQuery(".desktop a.video").fancybox({
      width				: 720,
      height			: 405,
      autoScale 	: false,
      type				: "iframe",
      prevEffect	: 'none',
      nextEffect	: 'none',
      afterShow : function(){
        ZR.lb.moveArrows(jQuery(this)[0]);
      },
      onUpdate : function(){
        ZR.lb.moveArrows();
      }
    });
    jQuery(".mobile a.videolink").on("click",function() {
      var container = jQuery(this).find(".videobox"),
          url = jQuery(this).attr("href"),
          id = jQuery(this).attr("id") + 'iframe';
      ZR.VideoGallery.playFeatured(container,id,url);
      /*var newHtml = '',
          videoBox = jQuery(this).find(".videobox"),
          blackLabelHtml = jQuery(this).children(".blacklabel"),
          url = jQuery(this).attr("href");
      videoBox.fadeIn(1000,function(){
        newHtml = '<iframe src="' + url + '" frameborder="0"';
        newHtml = newHtml + ' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        videoBox.html(newHtml).append(blackLabelHtml);
      });*/
      return false;
    });
  },
  inline: function(){
    jQuery('.desktop .fbinline').each(function(){
     jQuery(this).fancybox({
        scrolling: 'auto',
        afterShow : function(){
          ZR.lb.moveArrows(jQuery(this)[0]);
        },
        onUpdate : function(){
          ZR.lb.moveArrows();
        }
      });
    });
  },
  hideFbArrowImage : function(img,container,valid){
    if (!valid){
      img.attr("data-hide", true);
    }
    else {
      img.removeAttr("data-hide");

      if (container.hasClass("fancybox-prev")){
        if ( container.find("img").length == 0 ){
          container.find('span').prepend(img);
        }
        else {
          container.find('img').replaceWith(img);
        }
        if(ZR.lb.onprev){
          jQuery(".fancybox-prev").trigger("mouseenter");
        }
      }
      else if (container.hasClass("fancybox-next")) {
        if ( container.find("img").length == 0 ){
          container.find('span').append(img);
        }
        else {
          container.find('img').replaceWith(img);

          if (container.hasClass("fancybox-prev")){
            if ( container.find("img").length == 0 ){
              container.find('span').prepend(img);
            }
            else {
              container.find('img').replaceWith(img);
            }
            if(ZR.lb.onnext){
              jQuery(".fancybox-next").trigger("mouseenter");
            }
          }

        }

        if(ZR.lb.onprev){
          jQuery(".fancybox-prev").trigger("mouseenter");
        }
      }
      else if (container.hasClass("fancybox-next")) {
        if ( container.find("img").length == 0 ){
          container.find('span').append(img);
        }
        else {
          container.find('img').replaceWith(img);
        }
        if(ZR.lb.onnext){
          jQuery(".fancybox-next").trigger("mouseenter");
        }
      }

    }

  },

  isValidImageUrl : function(img,container,callback){
    return jQuery("<img>", {
      src: img.src,
      'class':jQuery(img).attr('class'),
      error: function() { callback(jQuery(this), container, false); },
      load: function() { callback(jQuery(this), container, true); }
    });
  },

  moveArrows : function(o){
    var w = jQuery(window).width();
    var fb = jQuery(".fancybox-wrap").width();
    var prev = jQuery(".fancybox-prev");
    var next = jQuery(".fancybox-next");
    var previmg = prev.find(".prev-image");
    var nextimg = next.find(".next-image");

    if(typeof o === 'object'){
      var items = o.group;
      var prevElemIdx = -1;
      var nextElemIdx = -1;

      if ( typeof items === 'object'){
        for ( x = 0; x < items.length; x++ ){
          if ( items[x] == o.element ){
            if ( x != 0 ){
              prevElemIdx = x - 1;
            }
            else {
              prevElemIdx = items.length - 1;
            }
            if ( x != (items.length - 1) ){
              nextElemIdx = x + 1;
            }
            else {
              nextElemIdx = 0;
            }
          }
        }
      }

      var prevContentImage = null;
      var nextContentImage = null;
      var prevContentImageSrc = "";
      var nextContentImageSrc = "";

      if (prevElemIdx != -1){
        prevContentImage = jQuery(items[prevElemIdx]).find('.fb-arrow-anchor');
        if ( prevContentImage.length != 0 ){
          prevContentImageSrc = prevContentImage.attr("src");
        }
      }
      if (nextElemIdx != -1){
        nextContentImage = jQuery(items[nextElemIdx]).find('.fb-arrow-anchor');
        if ( nextContentImage.length != 0 ){
          nextContentImageSrc = nextContentImage.attr("src");
        }
      }

      /** came from fancybox load callback, not window resize **/
      previmg = ZR.lb.isValidImageUrl({src:prevContentImageSrc,className:"prev-image hide"},prev,ZR.lb.hideFbArrowImage);
      nextimg = ZR.lb.isValidImageUrl({src:nextContentImageSrc,className:"next-image hide"},next,ZR.lb.hideFbArrowImage);

    }


    if (ZR.Base.digitOnly(w) && ZR.Base.digitOnly(fb)){
      var diff = (w-fb);
      var e = diff/2;

      if(e>=200){

        prev.show();
        next.show();

        prev.css({
          width: e + "px",
          left: "-" + e + "px"
        });
        next.css({
          width: e + "px",
          right: "-" + e + "px"
        });

        previmg.removeAttr("data-hide");
        nextimg.removeAttr("data-hide");

        jQuery(".fancybox-prev, .fancybox-next").off(".imgeffect");
        jQuery(".fancybox-next").on("mouseenter.imgeffect", function(){
          var span = jQuery(this).find("span");
          var img = span.find("img[data-hide!='true']");
          if ( img.length != 0 ){
            span.css("padding-right","90px");
            img.show();
          }
          else {
            span.css("padding-right","46px");
          }
          ZR.lb.onnext=true;
        }).on("mouseleave.imgeffect", function(){
            var span = jQuery(this).find("span");
            span.css("padding-right","46px");
            var img = span.find("img[data-hide!='true']");
            if ( img.length != 0 ){
              img.hide();
            }
            ZR.lb.onnext=false;
          });
        jQuery(".fancybox-prev").on("mouseenter.imgeffect", function(){
          var span = jQuery(this).find("span");
          var img = span.find("img[data-hide!='true']");
          if ( img.length != 0 ){
            span.css("padding-left","90px");
            img.show();
          }else {
            span.css("padding-right","46px");
          }
          ZR.lb.onprev=true;
        }).on("mouseleave.imgeffect", function(){
            var span = jQuery(this).find("span");
            span.css("padding-left","46px");
            var img = span.find("img[data-hide!='true']");
            if ( img.length != 0 ){
              img.hide();
            }
            ZR.lb.onprev=false;
          });



      }
      else if(e>100){
        prev.show();
        next.show();
        prev.css({
          width: e + "px",
          left: "-" + (e-2) + "px"
        });
        next.css({
          width: e + "px",
          right: "-" + (e-2) + "px"
        });
        previmg.hide().attr("data-hide",true);
        nextimg.hide().attr("data-hide",true);
      }
      else {
        prev.hide();
        next.hide();
      }
    }

  }
};

ZR.mobile = {
  OS: null,
	init: function(){

	//Set the viewport meta tags courtesy of http://adactio.com/journal/4470/
	if (navigator.userAgent.match(/iPhone/i)) {
	    ZR.mobile.OS = 'iOS';
	    var viewportmeta = document.querySelector('meta[name="viewport"]');
	    if (viewportmeta) {
	      viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
	      document.body.addEventListener('gesturestart', function() {
	        viewportmeta.content = 'width=device-width, minimum-scale=1, maximum-scale=2';
	      }, false);
	    }
	  } else if (navigator.userAgent.match(/Android/i)) {
	    ZR.mobile.OS = 'Android';
	  }
	  
	  
	  ZR.mobile.menus();
	  
	},
	
	menus: function(){
	  var contentDiv = jQuery('#page');
	  var mobileNav = jQuery('#mobilenav');
	  var winHeight = jQuery(window).height();
	  var subnavHeight = null;
	  
	  
	//sets the height of the menus to the largest submenu
	  var getSubnavHeight = function(){
	    
	    subnavHeight = winHeight;
	    
	    if(jQuery('#mobtopnav').height() > subnavHeight){
	      subnavHeight = jQuery('#mobtopnav').height();
	    }
	    
	    jQuery('.mobsubnav').each(function(i,el){
	      var thisHeight = jQuery(el).height();
	      if (thisHeight > subnavHeight) {
	          subnavHeight = thisHeight;
	      }
	    });
	    
	    if(subnavHeight > winHeight) {
	      subnavHeight = subnavHeight + jQuery('#mobsearch').outerHeight();
	    }
	    
	  }
	  
	  var resetSubmenu = function(){
      jQuery('#mobtopnav').removeClass('subnavon');
      //jQuery('#mobilenav').scrollTop(0);
      var t = setTimeout(function(){
        jQuery('#mobtopnav li').removeClass('active');
      }, 400);
    }
	  
	  var toggleMenu = function(){
	    contentDiv.toggleClass('mobilemenu');
	    
      if(!contentDiv.hasClass('mobilemenu')) {
        jQuery('#page').removeAttr('style');
        resetSubmenu();
        var t= setTimeout(function(){
           mobileNav.removeClass('active');
        },400);
      }
      else {
        
        
        
        
        
        mobileNav.addClass('active');
        
        if(subnavHeight == null){
          getSubnavHeight();
        }
        
        
        contentDiv.height(subnavHeight);
        
      }
	  }
	  
	  jQuery('.mobtopnavitem .mobtoplink').on('click',function(){
	    var parentLi = jQuery(this).parents('li');
	    if(parentLi.hasClass('active')){
	      parentLi.removeClass('active');
	      jQuery('#mobtopnav').removeClass('subnavon');
	      resetSubmenu();
	    }
	    else {
	      parentLi.addClass('active');
	      jQuery('#mobtopnav').addClass('subnavon');
	      jQuery('body').animate({scrollTop : 0});
	    }
	    return false;
	  });
	  
	  jQuery('#navtoggle').on('click',function(){
      toggleMenu();
      return false;
    });
	  
	  jQuery('#page').on('click',function(event){
	    if(contentDiv.hasClass('mobilemenu')){
  	    event.preventDefault();
        toggleMenu();
        return false;
	    }
    });
	  
	  jQuery('.backlink').on('click',function(){
	    resetSubmenu();
	    return false;
	  });
	  
	},
	
	/*Begin Mobile Category/Search page functions
	-------------------------------------------------- */
	categoryFilters : function(){
	  /*if(ZR.util.isMobile == true){*/
	    //console.log('Mobile Filters');
	    var parentCol;
  	  jQuery('#page').on('click','.mobile .catfiltercol h5',function(){
  	    parentCol = jQuery(this).parents('.catfiltercol');
  	    jQuery('.catfiltercol.active ul').slideUp();
  	    if(!parentCol.hasClass('active')){
  	      jQuery('.catfiltercol.active').removeClass('active');
  	      jQuery(this).parents('.catfiltercol').addClass('active');
          jQuery(this).next('ul').slideDown();
  	    } 
  	    else {
  	      parentCol.removeClass('active');
  	    }
  	   
  	  });
	 /* }*/
	  /*else {
	    console.log('not mobile Filters');
	    jQuery('.catfiltercol h5').off('click');
	  }*/
	}
}

ZR.Base = {



  showLogging :false,
  logType : "DEBUG", /* DEBUG,ERROR,INFO */
  numberPattern : /^\d|\.|-jQuery/,
  currencyPattern : /^\d|\.|\,|-jQuery/,
  digitPattern : /^\d|\.jQuery/,
  phonePattern : /^1?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})jQuery/,
  emailPattern : /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)jQuery/i,
  validPassword : /^(((?=.*[a-z])(?=.*[A-Z])(?=.*[\d]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[\W]))|((?=.*[a-z])(?=.*[\d])(?=.*[\W]))|((?=.*[A-Z])(?=.*[\d])(?=.*[\W]))).{8,}jQuery/,
  warmPassword : /^(((?=.*[a-z])(?=.*[\d]))|((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[\W]))|((?=.*[A-Z])(?=.*[\d]))|((?=.*[A-Z])(?=.*[\W]))|((?=.*[\d])(?=.*[\W]))).{6,}jQuery/,
  coldPassword : /^(((?=.*[a-z])(?=.*[\d]))|((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[\W]))|((?=.*[A-Z])(?=.*[\d]))|((?=.*[A-Z])(?=.*[\W]))|((?=.*[\d])(?=.*[\W]))).{4,}jQuery/,

  isNumeric : function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },


  isiPhone : function (){
    var deviceAgent = navigator.userAgent.toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
    return (agentID != null);
  },
  isValidPassword : function(str){
    return ZR.Base.validPassword.test(str);
  },

  isWarmPassword : function(str){
    return ZR.Base.warmPassword.test(str);
  },

  isColdPassword : function(str){
    return ZR.Base.coldPassword.test(str);
  },

  isValidEmail : function(str) {
	return ZR.Base.emailPattern.test(str);
  },


  checkUSPhoneNumber : function(num){
    if (ZR.Base.phonePattern.test(num)) {
        return num.replace(ZR.Base.phonePattern, "(jQuery1) jQuery2-jQuery3");
    } else {
        return false;
    }
  },




  /**
   *  Checks that console exists, and that the global showLogging is on.
   *  Outputs the string message, as well as the object (when passed) to the console, based on the logging type
   *  for the item.  If DEBUG, all logging is on, otherwise it will only be output if the submitted log arguments
   *  match the global logType
   *  @param msg the message to log
   *  @param o an object to log on the following line, typically a jQuery object that is being used
   *  @param t the type for this log entry, DEBUG | INFO | ERROR
   */
  log : function( msg, o, t){
    if ( ZR.Base.showLogging && typeof console !== 'undefined'){
      var showLog = false;
      if ( ZR.Base.logType === "DEBUG" ) showLog = true;
      else if (typeof t !== 'undefined'){
        if ( t === ZR.Base.logType ) showLog = true;
      }
      if ( showLog ){
        console.log("%s", msg);
        if ( o != null && typeof o === 'object' ){
          console.log("%o", o);
        }
      }
    }
  },





  /**
   * returns the numeric portion of a currency string
   * @param str
   */
  currencyValue : function( str ) {
     str += '';
     var out = '';
     for( var i = 0; i < str.length; i++ ) {
       if( ZR.Base.currencyPattern.test( str.charAt(i) ) ) {
         if( !( ( str.charAt(i) == '.' && out.indexOf( '.' ) != -1 ) ||
           ( str.charAt(i) == '-' && out.length != 0 ) ) ) {
             out += str.charAt(i);
         }
       }
     }
     return (out - 0);
  },





  /**
   * Call when a Country Select changes, and an associated
   * State Select should be updated.
   * @param input the Country Select Element
   */
  countrySetStates : function(input){
    ZR.Base.log("Base.countrySetStates()", null, "DEBUG");
    var CountrySelect = jQuery(input);
    var StateSelect = jQuery("select[data-parentselect='" + CountrySelect.attr("name") + "']");
    if (! CountrySelect.length || ! StateSelect.length ) return false;

    var countryCode = CountrySelect.val();

    StateSelect.html(jQuery("<option/>").text("Loading..").attr({value:""})).attr("disabled","disabled");

    /** try to get this countryCode from our DOM cache **/
    if (typeof ZR.Cache.countryStates[countryCode] !== 'undefined'){
      ZR.Base.replaceStateOptions(StateSelect,ZR.Cache.countryStates[countryCode]);
      return;
    }

    jQuery.ajax({
      url : "/getcountries/",
      type : "GET",
      dataType : "json",
      data: {
        country_code : countryCode
      },
      success: function(data){
        if ( typeof data === 'object' ){
          /** add to the DOM cache **/
          ZR.Cache.countryStates[countryCode] = data.country.states;
          /** update the state select **/
          ZR.Base.replaceStateOptions(StateSelect,data.country.states);
        } else {
          ZR.Base.log("jQuery.ajax.success() : response is not an object", null, "ERROR");
        }
      },
      error : function(response){
        ZR.Base.log("jQuery.ajax.error() : " + response.statusText, null, "ERROR");
      }
    });

  },





  /**
   * Updates the State Select options with the
   * supplied array of state objects [{ name, ID, code },n..]
   * @param input the State Input to Update
   * @param states the Array of State Objects
   */
  replaceStateOptions : function(input,states){
    ZR.Base.log("Base.replaceStateOptions()", null, "DEBUG");

    if (! states.length ) {
      input.html(jQuery("<option/>").text("Not Required").attr({value:""})).attr("disabled","disabled");
      return;
    }

    input.html('').removeAttr("disabled");
    input.append(jQuery("<option/>").text( ZR.Settings.alerts.base.stateDefaultOption ).attr({value:""}));

    for ( i = 0; i < states.length; i++ ){
      var state = states[i];
      input.append( jQuery("<option/>").text(state.name).attr({value:state.code}) );
    }

  },





  /**
   * Copies the value of field 1 to field 2, optionally force to copy, even when field 2 has a value.
   * @param el1 the field to copy the value from
   * @param el2 the field to copy the value to
   * @param always true|false to copy always, or only when el2 is empty
   */
  copyFieldVal : function(el1, el2, always){
    var from = jQuery("#" + el1);
    var to = jQuery("#" + el2);
    if ( from.length != 0 && to.length != 0 ){
      if ( always || jQuery.trim(to.val()).length == 0 ){
        to.val(from.val()).trigger('keyup');
      }
    }
    else {
      ZR.Base.log("Base.copyFieldVal()" + el1 + " or " + el2 + " not found on page.", null, "DEBUG");
    }

  },





  /**
   * returns a random number between the two supplied
   * @param from the starting number
   * @param to the ending number
   */
  randomBetweenTwoNumbers : function( from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
  },



  /**
   *  Returns a string with all characters, other than numbers removed
   *  No periods, or hyphens
   *  @param str the string to process
   *  @return the modified string
   */
  digitOnly : function( str ) {
     str += '';
     var out = '';
     for( var i = 0; i < str.length; i++ ) {
       if( ZR.Base.digitPattern.test( str.charAt(i) ) ) {
         if( !( ( str.charAt(i) == '.' && out.indexOf( '.' ) != -1 ) ||
           ( str.charAt(i) == '-' && out.length != 0 ) ) ) {
             out += str.charAt(i);
         }
       }
     }
     return out;
   },




  /**
   *  return true or false if a JS object or structure is empty
   *  @param o the object to check
   */
  isEmpty : function(o) {
    if ( typeof o === 'object' ) {
      for(var p in o) {
        if (o[p] != o.constructor.prototype[p])
          return false;
      }
      return true;
    }
    else {
      return ZR.Base.nullOrEmpty(o);
    }
  },





  /**
   *  return true or false if a string is either null, or empty
   *  @param str the string to check
   */
  nullOrEmpty : function(str){
    return typeof str === 'undefined' || str == null || ! jQuery.trim(str).length;
  }




};

ZR.Social = {
	proto: ('https:' == document.location.protocol ? 'https:' : 'http:'),
	tools: {
		convertLinks: function(input) {
			if(input === undefined || input.length < 1) {
				return input;
			}
			var answer = '',
					inputAsArray = input.split(' '),
				  i = 0;
			for(i = 0; i < inputAsArray.length; i++) {
				if(inputAsArray[i].indexOf('http') !== -1) {
					answer = answer + ' <a href="' + inputAsArray[i] + '" target="_new">' + inputAsArray[i] + '</a>';
				} else {
					answer = answer + ' ' + inputAsArray[i];
				}
			}
			return answer;
		},
		convertHashes: function(input) {
			if(input === undefined || input.length < 1) {
				return input;
			}
			var answer = '',
					inputAsArray = input.split(' '),
				  i = 0;
			for(i = 0; i < inputAsArray.length; i++) {
				if(inputAsArray[i].indexOf('#') !== -1) {
					answer = answer + ' <a href="http://www.twitter.com/search?q=' + inputAsArray[i].replace('#','%23') + '&src=hash" target="_blank">' + inputAsArray[i] + '</a>';
				} else {
					answer = answer + ' ' + inputAsArray[i];
				}
			}
			return answer;
		},
		convertAts: function(input) {
      if(input === undefined || input.length < 1) {
        return input;
      }
      var answer = '',
          inputAsArray = input.split(' '),
          i = 0;
      for(i = 0; i < inputAsArray.length; i++) {
        if(inputAsArray[i].indexOf('@') !== -1) {
          var userName = inputAsArray[i].replace('@','');
              userName = userName.replace(':','');
          answer = answer + ' <a href="http://www.twitter.com/' + userName + '" target="_blank">' + inputAsArray[i] + '</a>';
        } else {
          answer = answer + ' ' + inputAsArray[i];
        }
      }
      return answer;
    },
		simplifyDatetime: function(input) {
			// The input format should be in UTC format (Wed Apr 04 23:08:49 +0000 2012)
			// Returns the day of the week and timestamp (ex. Monday at 11:32am)
			if(input === undefined || input.length < 1) {
				return input;
			}
			// Check for invalid format (year at end of string)
			var answer = '',
			    today = new Date(),
			    dateObj = new Date(input),
			    hours = '',
			    minutes = '';
			if(isNaN(dateObj.getDay())) {
			  var year = today.getUTCFullYear(),
			      output = '';
			  if(input.indexOf(year) == input.length - 4) {
			    output = input.substring(0, 10);
			    output = output + ' ' + year;
			    output = output + ' ' + input.substring(11, 25);
			    dateObj = new Date(output);
			  }
			}
			// Day of Week
			switch(dateObj.getDay()) {
				case 0:	// sunday
					answer = 'Sunday at';
					break;
				case 1:
					answer = 'Monday at';
					break;
				case 2:
					answer = 'Tuesday at';
					break;
				case 3:
					answer = 'Wednesday at';
					break;
				case 4:
					answer = 'Thursday at';
					break;
				case 5:
					answer = 'Friday at';
					break;
				case 6:	// saturday
					answer = 'Saturday at';
					break;
			}
			if(answer !== '') {
				answer = answer + ' ';
			}
			// Time
//			hours = dateObj.getUTCHours();
//			minutes = dateObj.getUTCMinutes();
            hours = dateObj.getHours();
            minutes = dateObj.getMinutes();
            amPm = 'am';
			if(hours > 12) {
				hours = hours - 12;
				amPm = 'pm';
			}
			if(minutes < 10) {
			  minutes = '0' + minutes;
			}
			answer = answer + hours + ':' + minutes + ' ' + amPm;
			return answer;
		}
	},
	Twitter: {
		response: {},	// holds a filtered view of the JSON response, content dependent on last function call
		populateWidget: function(element) {
			var user = jQuery(element).attr('data-screen-name'),
				  count = jQuery(element).attr('data-count'),
				  includeFollow = jQuery(element).attr('data-follow'),
				  i = 0, html = '';
			// Fetch data and build list
			ZR.Social.Twitter.fetchTweets(user, count, function() {
				var htmlText = '', datetime = '', followCount = 0, lastItem = '', rawdate = '';
				for(i = 0;i < ZR.Social.Twitter.response.count; i++) {
				  htmlText = ZR.Social.Twitter.response[i].text;
					datetime = ZR.Social.tools.simplifyDatetime(ZR.Social.Twitter.response[i].datetime);
          rawdate = ZR.Social.Twitter.response[i].datetime;
					followCount = ZR.Social.Twitter.response[i].followerCount;
					lastItem = (ZR.Social.Twitter.response.count == (i + 1))? ' last' : '';
					html = '<li class="tweet ' + lastItem + '" style="background: url(\'' + ZR.Social.Twitter.response[i].userImg + '\') no-repeat 0 0;">';
					html = html + '<span class="content">' + htmlText + '</span>';
					html = html + '<span class="timestamp convertTimestamp">' + datetime + '</span>';
					html = html + '</li>';
					jQuery(element).append(html);
          //DateFormatting.init();
				}
			});
		},
		// Retrieves the tweets for the specified screen name, with a limit on the # return of count.
		fetchTweets: function(screenName, count, whenReadyAction, downLoadCt) {
			if(downLoadCt === undefined) {
				downLoadCt = 15;
			} 
			if(count === undefined) {
				count = 5;
			}
			if(screenName === undefined) {
				screenName = 'Nixon_Now';
			}
			var url = ZR.Social.proto + '//api.twitter.com/1/statuses/user_timeline.json?include_rts=1';
			url = url + '&screen_name=' + screenName + '&count=' + downLoadCt;
			url = url + '&exclude_replies=0&callback=?';
			jQuery.getJSON(url, function(data,i) {
				ZR.Social.Twitter.response.count = 0;
				var showCt = count;
				if ( data.length < count ) {
					showCt = data.length;
				}
				var isReply = false;
				
				for(i = 0; i < showCt; i++) {
				  if(data[i].in_reply_to_screen_name != null){
				    isReply = true;
		       }
				  else {
				    isReply = false;
				  }
				  
				  if(data[i].retweeted_status != undefined){
				    var tweetText = 'RT @' + data[i].retweeted_status.user.screen_name+ ': '+ data[i].retweeted_status.text;
				  }
				  else {
				    var tweetText = data[i].text;
				  }
				
				  //var isAt = tweetText.substring(0,1);
				  tweetText = ZR.Social.tools.convertLinks(tweetText);
				  tweetText = ZR.Social.tools.convertHashes(tweetText);
				  tweetText = ZR.Social.tools.convertAts(tweetText);
				 
				  if(isReply == false){
  					ZR.Social.Twitter.response[ZR.Social.Twitter.response.count] = {
  							followerCount: data[i].user.followers_count,
  							datetime: data[i].created_at,
  							text: tweetText,
  							userImg: (ZR.Social.proto === 'https:' ? data[i].user.profile_image_url_https : data[i].user.profile_image_url)
  					}
  					
  					ZR.Social.Twitter.response.count++;
				  }
  				else {
  				  if(showCt < downLoadCt){
  				    showCt++; //increment the count so we can get an extra tweet if it is a reply.
  				  }
  				}
					
				}
				if(jQuery.isFunction(whenReadyAction)) {
					whenReadyAction();
				}
			});
		}
	}
};

/**
 * Used as storage for items that might be requested multiple times on a page
 * and will not change between requests.
 */
ZR.Cache = {
  countryStates : {},
  zipCodeRates : {},
  taxRates : {},
  orderValues : {},
  zipCodeLookup : {},
  lastZipCode : null
};

/**
 * Used to process the MailChimp Newsletter signups.  Validates the email address
 * first, then submits via AJAX, applying post-submission processing as needed.
 */
ZR.Newsletter = {
	Signup: {
		FooterSubmit: function() {
			var container = jQuery('#footersignup'),
				form = jQuery('form', container);
				button = jQuery('button', form),
				emailAddress = jQuery('#emailInput', form),
				dataToSubmit = jQuery(':input', form).serialize();
			// Validate the Email Address
			if(!ZR.Base.isValidEmail(emailAddress.val())) {
				// Notify the User of invalid email, focus email field
				alert("Invalid email address, please correct");
				emailAddress.focus();
				return false;
			}
			
			// GA Event
			_gaq.push(['_trackEvent', 'Newsletter', 'Newsletter Signup', 'Submit']);

			// POST via AJAX
			jQuery.post(form.attr('action'), dataToSubmit, function(data, status, xhr) {
				if (button.attr('data-done') == 'soundclash') {
				  var html = "<p style='text-align:center;'>THANK YOU. WE'LL BE IN TOUCH.</p>";
				  container.html(html);
				}
				else {
				  button.text(button.attr('data-done'));
				}
			});

			// Change Button Label on Success
			return false;	// prevent regular form submission
		},
		CheckoutSubmit: function(form) {
			// Updates hidden form fields for zInformer values and MailChimp signup
			var zinEmail = jQuery(':input[name="zin_value_EMAIL-1"]', form),
				zinFullname = jQuery(':input[name="zin_value_FULLNAME-1"]', form),
				zinZipcode = jQuery(':input[name="zin_value_ZIPCODE-1"]', form),
				signupCheck = jQuery(':input[name="email_signup_confirm"]', form),
				srcEmail = jQuery(':input[name="email"]', form).val(),
				srcFirstname = jQuery(':input[name="first_name"]', form).val(),
				srcLarstname = jQuery(':input[name="last_name"]', form).val(),
				srcZipcode = jQuery(':input[name="zo_bill_postal_code"]', form).val();
			// Validate that we want to signup, if not, don't check or transfer values
			if(!signupCheck.is(':checked')) {
				jQuery(':input[name^="zin_"]', form).remove();
			} else {
				// Email Address
				if(srcEmail !== '') {
					zinEmail.val(srcEmail);
				}
				// First and Last Name
				if(srcFirstname !== '' || srcLarstname !== '') {
					zinFullname.val(srcFirstname + ' ' + srcLarstname);
				}
				// Zip Code
				if(srcZipcode !== '') {
					zinZipcode.val(srcZipcode);
				}
			}
		},
		EditAccountSubmit: function() {
			// Updates hidden form fields for zInformer values and MailChimp signup
			var form = jQuery('form[idjQuery="accountform"]'),
				zinEmail = jQuery(':input[name="zin_value_EMAIL-1"]', form),
				zinFullname = jQuery(':input[name="zin_value_FULLNAME-1"]', form),
				zinZipcode = jQuery(':input[name="zin_value_ZIPCODE-1"]', form),
				zinGender = jQuery(':input[name="zin_value_GENDER-1"]', form),
				zinSubscribed = jQuery(':input[name="zin_value_SUBSCRIBED-1"]', form),
				srcEmail = jQuery(':input[name="NIXON_USER.USERID"]', form).val(),
				srcFirstname = jQuery(':input[name="NIXON_USER_ADDRESS_BILLING.FIRST_NAME"]', form).val(),
				srcLastname = jQuery(':input[name="NIXON_USER_ADDRESS_BILLING.LAST_NAME"]', form).val(),
				srcZipcode = jQuery(':input[name="NIXON_USER_ADDRESS_BILLING.POSTAL_CODE"]', form).val(),
				srcMaleGender = jQuery('#checkboxMale', form),
				srcFemaleGender = jQuery('#checkboxFemale', form);

			// Email Address
			if(srcEmail !== '') {
				zinEmail.val(srcEmail);
			}
			// First and Last Name
			if(srcFirstname !== '' || srcLastname !== '') {
				zinFullname.val(srcFirstname + ' ' + srcLastname);
			}
			// Zip Code
			if(srcZipcode !== '') {
				zinZipcode.val(srcZipcode);
			}
			// Gender
			if(srcMaleGender.is(':checked') && srcFemaleGender.is(':checked')) {
				zinGender.val('BOTH');
			} else {
				zinGender.val('');
				if(srcMaleGender.is(':checked')) {
					zinGender.val('MALE');
				}
				if(srcFemaleGender.is(':checked')) {
					zinGender.val('FEMALE');
				}
			}
			// Preferred Mailings are independent ZIN values, validate checked state
			if(jQuery('#checkboxSurf', form).is(':checked')) {
				jQuery(':input[name="zin_value_SURF-1"]', form).val('TRUE');
			}
			if(jQuery('#checkboxSkate', form).is(':checked')) {
				jQuery(':input[name="zin_value_SKATE-1"]', form).val('TRUE');
			}
			if(jQuery('#checkboxSnow', form).is(':checked')) {
				jQuery(':input[name="zin_value_SNOW-1"]', form).val('TRUE');
			}
			if(jQuery('#checkboxArts', form).is(':checked')) {
				jQuery(':input[name="zin_value_ARTS-1"]', form).val('TRUE');
			}
			// Save Subscription State
			if(jQuery('#radio_signup', form).is(':checked')) {
				zinSubscribed.val('TRUE');
			} else {
				zinSubscribed.val('FALSE');
			}
		},
		CreateAccountSubmit: function() {
			// Updates hidden form fields for zInformer values and MailChimp signup
			var form = jQuery('#editaccountform'),
				zinEmail = jQuery(':input[name="zin_value_EMAIL-1"]', form),
				zinFullname = jQuery(':input[name="zin_value_FULLNAME-1"]', form),
				zinZipcode = jQuery(':input[name="zin_value_ZIPCODE-1"]', form),
				zinGender = jQuery(':input[name="zin_value_GENDER-1"]', form),
				srcEmail = jQuery(':input[name="NIXON_USER.USERID"]', form).val(),
				srcFirstname = jQuery(':input[name="NIXON_USER.FIRST_NAME"]', form).val(),
				srcLastname = jQuery(':input[name="NIXON_USER.LAST_NAME"]', form).val(),
				srcZipcode = jQuery(':input[name="NIXON_USER_ADDRESS_BILLING.POSTAL_CODE"]', form).val(),
				srcMaleGender = jQuery('#checkboxMale', form),
				srcFemaleGender = jQuery('#checkboxFemale', form);
			// Email Address
			if(srcEmail !== '') {
				zinEmail.val(srcEmail);
			}
			// First and Last Name
			if(srcFirstname !== '' || srcLastname !== '') {
				zinFullname.val(srcFirstname + ' ' + srcLastname);
			}
			// Zip Code
			if(srcZipcode !== '') {
				zinZipcode.val(srcZipcode);
			}
			// Gender
			if(srcMaleGender.is(':checked') && srcFemaleGender.is(':checked')) {
				zinGender.val('BOTH');
			} else {
				zinGender.val('');
				if(srcMaleGender.is(':checked')) {
					zinGender.val('MALE');
				}
				if(srcFemaleGender.is(':checked')) {
					zinGender.val('FEMALE');
				}
			}
			// Preferred Mailings are independent ZIN values, validate checked state
			if(jQuery('#checkboxSurf', form).is(':checked')) {
				jQuery(':input[name="zin_value_SURF-1"]', form).val('TRUE');
			}
			if(jQuery('#checkboxSkate', form).is(':checked')) {
				jQuery(':input[name="zin_value_SKATE-1"]', form).val('TRUE');
			}
			if(jQuery('#checkboxSnow', form).is(':checked')) {
				jQuery(':input[name="zin_value_SNOW-1"]', form).val('TRUE');
			}
			if(jQuery('#checkboxArts', form).is(':checked')) {
				jQuery(':input[name="zin_value_ARTS-1"]', form).val('TRUE');
			}
			// Save Subscription State
			if(jQuery('#joinnewsletter', form).is(':checked')) {
				zinSubscribed.val('TRUE');
			} else {
				zinSubscribed.val('FALSE');
			}
		}
	}
};



/**
 * Checkout Script Object
 * Contains functions For the Checkout Funnel
 *
 **/
ZR.Checkout = {

  /** Functions Specific to the Cart Detail Page **/
  Cart : {

     maxQuantities : {},
    /**
     *  Load any functions required at page startup,
     *  hook items in jQuery, etc.
     */
    init : function(loggedin){
      ZR.Base.log("Checkout.Cart.init()", null, "DEBUG");

      jQuery("#continueCheckoutForm").submit(ZR.Checkout.Cart.validateCartSubmit);

      /** Hooks the zipcode field, to call for new rates on keyup **/
      jQuery("#cartzip").keyup( jQuery.debounce(500,ZR.Checkout.Cart.captureZipCodeKeyPress) );
      jQuery("#cartzip").keydown( ZR.Checkout.Cart.limitZipCodeKeyPress );

      /** Hooks the shipping method radios on click, to update the UI **/
      jQuery(document).on("click", ":input[name='zo_shipping_method_id']", jQuery.debounce(300,ZR.Checkout.Cart.selectShippingRate) );

      /**
       *  If the wrapper class for ship rates is hidden, disable them
       *  so they aren't submitted with the form.  The query to check
       *  rates by zip code will enable them.
       */
      if ( jQuery("#shipRateWrapper").is(":hidden") ){
        jQuery(":input[name='zo_shipping_method_id']").each( function(){
          jQuery(this).attr("disabled","disabled");
        });
      }

      jQuery("input[id^='qty-']").forceNumeric();
      jQuery("input[id^='qty-']").keyup(ZR.Checkout.Cart.updateHiddenQuantity)
        .keyup(ZR.Checkout.Cart.submitOnQuantityChange);


    },

    setMaxVars : function(o){
      ZR.Checkout.Cart.maxQuantities = o;
    },





    /**
     *  Fired just as the form is submitted to ensure all quantities are valid
     *  and ready for a submit.
     */
    validateCartSubmit : function(){
      var items = jQuery("input[id^='qtyhidden-']");
      var canContinue = true;
      items.each(function(){
        var qty = Number(jQuery(this).val());
        var id = jQuery(this).attr("id");
        var args = id.split("-");
        if ( isNaN(qty) || qty <= 0 ){
          canContinue = false;
          var detailWrapper = jQuery("#itemDetail-" + args[1]);
          var err = detailWrapper.find("p.error").filter(function(){
             return jQuery.trim(jQuery(this).text()) == ZR.Settings.alerts.checkout.itemQuantityError;
          });
          if( err.length == 0 ){
            detailWrapper.append("<p class='error'>"+ZR.Settings.alerts.checkout.itemQuantityError+"</p>");
          }
        }
      });

			ZR.util.hideButton('cartbutton');
      return canContinue;
    },





    /**
     * Limits the kepress of the zip code field
     * to numeric items and keeps the length <= 5
     * @param e
     */
    limitZipCodeKeyPress : function(e){
      if ( ZR.Settings.locale.code == "en_US"){
        var key = e.which || e.keyCode;
        var curval = jQuery(this).val();
        var selectedText = ZR.Checkout.Cart.getSelectedText();

        if ( selectedText.length != 0 ){
          if (curval.indexOf(selectedText) != -1){
            curval = curval.replace(selectedText, '');
            jQuery(this).val(curval);
          }
        }

        if ( curval.length >= 5 && !e.ctrlKey && key != 8 && key != 9 && key != 13 && key != 46){
          return false;
        }

        if ( e.ctrlKey ||
            (key >= 48 && key <= 57) ||
            // Numeric keypad
            (key >= 96 && key <= 105) ||
            // Backspace and Tab and Enter
            key == 8 || key == 9 || key == 13 ||
            // Home and End
            key == 35 || key == 36 ||
            // left and right arrows
            key == 37 || key == 39 ||
            // Del and Ins
            key == 46 || key == 45) return true;

        return false;
      }
    },

    /**
     * Returns the selected text of an object on the page
     */
    getSelectedText : function () {
      if (typeof window.getSelection === 'function') {
        return window.getSelection();
      }
      else if (typeof document.getSelection === 'function') {
        return document.getSelection();
      }
      else if (typeof document.selection !== 'undefined') {
        return document.selection.createRange().text;
      }
      else return "";
    },


    /**
     * Captures a keypress in the zip code field.  Limits the input to a numeric value
     * and then fires the action to modify and submit the form when the length is 5 (for us)
     * @param e event
     */
    captureZipCodeKeyPress : function(e){
      if ( ZR.Settings.locale.code == "en_US"){
        var key = e.which || e.keyCode;
        if (typeof key === 'undefined' ||  (key >= 48 && key <= 57) || (key >= 96 && key <= 105) ){
          var val = ZR.Base.digitOnly( jQuery(this).val() );
          jQuery(this).val(val);
          if ( jQuery(this).val().length == 5 ){
            ZR.Checkout.Cart.submitOnZipCodeChange(val);
          }
        }
      } else if ( ZR.Settings.locale.code == "en_CA"){
        if ( jQuery('#cartzip').val().length >= 6 ){
          ZR.Checkout.Cart.submitOnZipCodeChange(jQuery('#cartzip').val());
        }
      }
    },


    editSalesTaxForRepairOrder: function() {
      var taxWrapper = jQuery('#taxWrapper');
      var shipRateWrapper = jQuery('#shipRateWrapper');
      var taxShipEditableRow = jQuery('#formGetShippingOptions').parents('div.carttotalrow');
      taxWrapper.addClass('hide');
      shipRateWrapper.addClass('hide');
      taxShipEditableRow.removeClass('hide');
      jQuery('#cartzip').focus();
    },


    /**
     * Changes the option on the cart edit form to handle a zipcode change
     * adds the zip code hidden input to the form, then submits it.
     *
     * The action on this submit should handle the change, calculate tax and shipping
     * rates and then return to the cart again.
     * @param val the zip code value to submit
     */
    submitOnZipCodeChange : function(val){
      var form = jQuery("#continueCheckoutForm");
      form.attr("action", ZR.Settings.url.servlet);
      var option = form.find("input[name='OPTION']");
      var postalcode = form.find("input[name='postalCode']");
      var optionHandler = 'EDITCARTZIPCODE';
      var isRepairOrder = jQuery('form[name="formqtyupdate"]').is('.repair');
      if(isRepairOrder) {
        optionHandler = 'EDITREPAIRCARTZIPCODE';
      }
      if ( option.length == 0 ){
        form.append("<input type='hidden' name='OPTION' value='" + optionHandler + "'/>");
      }
      else {
        option.val(optionHandler);
      }
      if (postalcode.length == 0 ){
        form.append("<input type='hidden' name='postalCode' value='"+val+"'/>");
      }
      else {
        postalcode.val(val);
      }
      //jQuery("#cartbutton").trigger("click");
      var zipUrl = ZR.Settings.url.secureHost + "/cart/shiprates/";
      var wrapper = jQuery("#cartUpdateFormWrapper");
      jQuery("#cartbutton");
      ZR.util.hideButton("cartbutton");

      jQuery.ajax({
        url : zipUrl,
        type : "POST",
        data: form.serialize(),
        success: function(data){
          var response = jQuery(data);
          if ( response.attr("id") == "continueCheckoutForm" ){
            wrapper.html(response);
            if(isRepairOrder && jQuery('#cartTotalAmount', response).attr('data-totalnoship') > 0) {
              jQuery('#formGetShippingOptions').parents('div.carttotalrow').addClass('hide');
            }
            else if( (jQuery('body').hasClass('en_CA') || jQuery('body').hasClass('en_US')) && jQuery('#cartTotalAmount', response).attr('data-totalnoship') > 0) {

              /** only hide if the tax amount row exists **/
              if ( jQuery("#cartTaxAmount").find("a").length != 0 ){
                jQuery('#formGetShippingOptions').parents('div.carttotalrow').addClass('hide');
              }

              var shipSelected = jQuery(":input[name='zo_shipping_method_id']:checked");
              if ( shipSelected.length != 0 ){
                var amt = Number(shipSelected.attr("data-shipamount"));
                var ttlNoShip = Number(jQuery("#cartTotalAmount").attr("data-totalnoship"));
                var ttl = amt + ttlNoShip;
                var ttl = ttl.formatMoney(2,"jQuery",",",".");
                jQuery("#cartTotalAmount").find("h4").html(ttl);
              }
            }

          }
          else {
            ZR.Base.log("jQuery.ajax.error() : " + response, null, "ERROR");
            ZR.util.enableButton("cartbutton");
          }
        },
        error : function(response){
          ZR.Base.log("jQuery.ajax.error() : " + response.statusText, null, "ERROR");
          ZR.util.enableButton("cartbutton");
        }
      });
    },





    /**
     * Submits the form when a quantity change happens
     * to update the cart.  Performs some minor validation
     * to ensure that the item quantity meets standards
     * set in properties, and that it is a valid number
     * @param e
     */
    submitOnQuantityChange : function(e){

      var key = e.which || e.keyCode;
      if ( ! (key >= 48 && key <= 57) && ! (key >= 96 && key <= 105) ){
        return;
      }

      var maxWatches = ZR.Checkout.Cart.maxQuantities['watches'];
      var maxOther = ZR.Checkout.Cart.maxQuantities['other'];
      var itemType = jQuery(this).attr("data-category");
      var itemMax = 3;

      try {
        if ( itemType.length != 0 && typeof itemType !== 'undefined' ){
          if ( itemType == 'watches' ){
            itemMax = maxWatches;
          }
          else {
            itemMax = maxOther;
          }
        }
      } catch (Exception){
        /** do nothing **/
      }

      var qty = Number(jQuery.trim(jQuery(this).val()) );
      var id = jQuery(this).attr("id");
      var args = id.split("-");
      var detailWrapper = jQuery("#itemDetail-" + args[1]);
      var err = detailWrapper.find("p.error");

      if ( qty <= 0 ){
        if( err.length == 0 ){
          detailWrapper.append("<p class='error'>"+ZR.Settings.alerts.checkout.itemQuantityError+"</p>");
        } else {
          err.html(ZR.Settings.alerts.checkout.itemQuantityError);
        }
        jQuery(this).addClass("error");
      }
      else if ( qty > itemMax ){
        if( err.length == 0 ){
          detailWrapper.append("<p class='error'>"+ZR.Settings.alerts.checkout.itemMaxQuantityError + " " + itemMax + "</p>");
        } else {
          err.html(ZR.Settings.alerts.checkout.itemMaxQuantityError + " " + itemMax);
        }
        jQuery(this).addClass("error");
      }
      else if (qty > 0 && qty <= itemMax) {
        jQuery(this).val(qty);
        jQuery(this).parents("form[name='formqtyupdate']").submit();
        jQuery(this).removeClass("error");
      }

    },





    /**
     * Updates the hidden quantity in the form below that
     * updates the cart and moves to the address payment page
     */
    updateHiddenQuantity : function(){
      var id = jQuery(this).attr("id");
      var args = id.split("-");
      jQuery('#qtyhidden-' + args[1]).val( jQuery(this).val() );
    },





    /**
     * Fired when the shipping rate radio's are selected
     */
    selectShippingRate : function(){
      ZR.Base.log("Checkout.Cart.selectShippingRate()", null, "DEBUG");
      var form = jQuery("#continueCheckoutForm");
      form.find("input[name='OPTION']").val("EDITCARTSHIPPINGMETHOD");
      //jQuery("#continueCheckoutForm").attr("action", ZR.Settings.url.host + "/cart/");
//      jQuery("#cartbutton").trigger("click");

      var zipUrl = ZR.Settings.url.secureHost + "/cart/shiprates/";
      ZR.util.hideButton("cartbutton");

      jQuery.ajax({
        url : zipUrl,
        type : "POST",
        data: form.serialize(),
        success: function(data){
          var response = jQuery(data);
          if ( response.attr("id") == "continueCheckoutForm" ){
            jQuery("#cartUpdateFormWrapper").html(response);
          }
          else {
            ZR.Base.log("jQuery.ajax.error() : " + response, null, "ERROR");
            ZR.util.enableButton("cartbutton");
          }
        },
        error : function(response){
          ZR.Base.log("jQuery.ajax.error() : " + response.statusText, null, "ERROR");
          ZR.util.enableButton("cartbutton");
        }
      });
    },




    /**
     * Checks to see if the cartzip field has a value in it
     * if so, it fires the ajax call to grab data used when different
     * shipping rates are selected.
     *
     * Function should only really be fired on page load (from init)
     * @deprecated
     */
    validateZipCode : function(){
      ZR.Base.log("Checkout.Cart.validateZipCode()", null, "DEBUG");
      var zipfield = jQuery("#cartzip");
      if ( zipfield.length == 0 ) return;
      var original = zipfield.attr("data-zipcode");
      var current = zipfield.val();
      if ( current.length != 0 && current != original ){
        ZR.Checkout.Cart.updateShipAndTax(current);
      }
    }

  },


  /** Functions Specific to the Address/Payment Page **/
  AddressPayment : {



    init : function(){
      ZR.Base.log("Checkout.AddressPayment.init()", null, "DEBUG");

      ZR.Checkout.AddressPayment.initRecoverPasswordLink();

      /* Login Form Hooks */
      jQuery("#openLoginForm").on("click", ZR.Checkout.AddressPayment.toggleLogin);
      jQuery("#cancelLoginSubmit").on("click", ZR.Checkout.AddressPayment.toggleLogin);
      jQuery("#submitLoginRequest").on("click", ZR.Checkout.AddressPayment.loginAction);

      /* Capture an enter key tap when in the password field, and submit the form */
      jQuery('#loginPassword').keypress(ZR.Checkout.AddressPayment.captureLoginKeyStroke);

//      jQuery("#generatePassword")
//        .keyup(ZR.Checkout.AddressPayment.validatePasswordOnEntry)
//        .blur(ZR.Checkout.AddressPayment.validatePasswordOnBlur);


      /* when the email field is completed, transfer the value to the hidden billing email fields */
      jQuery("#inputEmail").blur(ZR.Checkout.AddressPayment.duplicateUserEmail).trigger("blur");
      jQuery("#inputEmail").on("keyup", jQuery.debounce(1000, ZR.Checkout.AddressPayment.checkUseridAvail) );
      jQuery("#inputEmail").on("blur", jQuery.debounce(100, ZR.Checkout.AddressPayment.checkUseridAvail) );


      /* Transfer the first and last name values to the billing address */
      jQuery("#inputFirstName, #inputLastName").blur(function(){
        var from = jQuery(this);
        var to = jQuery("#" + from.attr("id").replace("input","billing"));
        var toship = jQuery("#" + from.attr("id").replace("input","shipping"));

        to.val(from.val()).trigger("keyup");
        toship.val(from.val()).trigger("keyup");

      }).trigger("blur");

      jQuery("#billingCountrySelect").bind("change", ZR.Checkout.AddressPayment.updateBillingCountry );
      jQuery("#shippingCountrySelect").bind("change", ZR.Checkout.AddressPayment.updateShippingCountry );

      jQuery("#shippingStreet1").bind("change", ZR.Checkout.AddressPayment.checkShippingStreetChange );
      jQuery("#shippingCity").bind("change", ZR.Checkout.AddressPayment.checkShippingCityChange );

      if (ZR.Settings.locale.code == "en_US"){
        jQuery("#billingPhone").usphone();
        jQuery("#billingPhone").trigger("keyup");
      }
      else if (ZR.Settings.locale.code == "en_AU"){
        jQuery("#billingPhone").auphone();
        jQuery("#billingPhone").trigger("keyup");
      }

      jQuery("#billingPostalCode, #shippingPostalCode").keyup( ZR.Checkout.AddressPayment.zipCodeLookup );


      /* Capture the billAsShipToggle checkbox click */
      jQuery("#billAsShipToggle").click( ZR.Checkout.AddressPayment.toggleShippingAddress );


      /* Capture the Shipping Methods show/hide button */
      jQuery("#shippingOptionsEdit").click( ZR.Checkout.AddressPayment.toggleShippingMethod );


      /* Hook the paypal checkout link to the validation function */
      jQuery("#payPalLink").click( ZR.Checkout.AddressPayment.payPalCheckout );


      /** jp_JP allows COD through a radio button **/
      jQuery("input[name='PAYMENT_TYPE']").click( ZR.Checkout.AddressPayment.switchPaymentType );

      /** Hook all methods for the credit card fields */
      jQuery("#ccnumber")
        .focus( function() { ZR.Checkout.AddressPayment.showCreditCard(jQuery(this));} )
        .keyup( function() { ZR.Checkout.AddressPayment.checkCreditCard(jQuery(this));})
        .blur( function() { ZR.Checkout.AddressPayment.validateCreditCard(jQuery(this)); });

      jQuery("#ccexpmonth, #ccexpyear").bind("change,blur", ZR.Checkout.AddressPayment.mergeCCDate );

      jQuery("#cartgiftmsg").keyup(function(){ZR.util.limitText(jQuery(this), 250);});

      jQuery('#toggleGiftReceipt').change(ZR.Checkout.AddressPayment.activateGiftMsg);

      /* Hook the final Review Order button to make sure the OPTION is reset,
        then submit the form */
      jQuery("#submitPaymentForm").click( function(){
    	// Transfer form values to hidden form fields for MailChimp signups
        ZR.Newsletter.Signup.CheckoutSubmit(jQuery("#addressPaymentForm"));


        var hasGiftCard = false;
        var giftcards = jQuery(":input[name='gift_card_number']:visible");

        if ( giftcards.length != 0 ){
          giftcards.each(function(){
            if (jQuery.trim(jQuery(this).val()).length != 0 ){
              hasGiftCard = true;
            }
          });
        }


        if ( hasGiftCard ){
          ZR.Checkout.AddressPayment.hidePayPalCheckout();
        }


        /* Hook the form submit button to the enable credit card fields
           -- in case they have been disabled by a click on the PayPal
           button */
        if ( jQuery("input[name='PAYMENT_TYPE']:checked").val != 'COD' && ! hasGiftCard ){
          ZR.Checkout.AddressPayment.enableCreditCardFields();
        }

        /**
         * if we have gift cards as payment, and no credit card info has been entered
         * disable those fields so they don't throw validation errors
         */
        if ( hasGiftCard && jQuery.trim(jQuery("#ccnumber").val()).length == 0 ){
          ZR.Checkout.AddressPayment.disableCreditCardFields();
        }

        /* make sure the default option is set */
        jQuery("#addressPaymentForm").find("input[name='OPTION']").val("ADDRESS_PAYMENT");


        /* If the bill as ship is checked, do a final copy of the address
           just to make sure they are the same. */
        if ( ZR.Checkout.AddressPayment.useBillForShip() ){
          ZR.Checkout.AddressPayment.setShippingFromBilling();
        }

        jQuery("#addressPaymentForm").submit();

      });

      jQuery("#addressPaymentForm").submit(function(){
        ZR.Checkout.AddressPayment.validateShippingMethod();

        /**
         * some users using paypal, and selecting to create an account
         * are receiving errors about missing billingEmail in ZPassSetup.
         * Try to just do a sanity check that the hidden field is populated.
         * TODO: revisit if errors continue.
         */
        try {

          var ef = jQuery.trim(jQuery("#billingEmail").val());
          if( ef.length == 0 || ef == "GUEST"){
            jQuery("#billingEmail").val(jQuery.trim(jQuery("#inputEmail").val()));
          }
        } catch(err){}

      });

      /** gift card hooks **/
      jQuery("#gcCheckBalances").click( ZR.Checkout.AddressPayment.checkGiftCardBalances );
      jQuery("#giftCardLink").click( ZR.Checkout.AddressPayment.toggleGiftCard );
      jQuery("#gcQuantity").bind("change", function(){
        ZR.Checkout.AddressPayment.changeGiftCardFields( jQuery(this) );
      } );

      jQuery("input[id^='zo_gift_card_number']").live("keyup", ZR.Checkout.AddressPayment.checkGiftCardNumberFormat);
      jQuery("input[id^='zo_gift_card_number']").live("keyup", ZR.Checkout.AddressPayment.showHidePayPalCheckoutGCUpdate);


      /** when the create account checkbox is clicked, toggle the password form layer **/
      jQuery("#create_account").click(ZR.Checkout.AddressPayment.toggleGeneratePassword);


      ZR.Checkout.AddressPayment.validateAddressPayment();

      /* focus on the specific form element, if we're coming back for an edit */
      var scrollto = jQuery.getUrlVar('goto');
      if ( typeof scrollto !== 'undefined'){
        var selector = "";
        switch ( scrollto ) {
          case "shipping" :
            selector = ( jQuery("#billAsShipToggle").is(":checked") ) ? "#billingFirstName" : "#shippingFirstName";
            break;
          case "billing" :
            selector = "#billingFirstName";
            break;
          case "payment" :
            selector = "#ccnumber";
            break;
          case "user" :
            selector = "#inputFirstName";
            break;
        }
        if ( selector.length ){
          ZR.Checkout.AddressPayment.focusAndScrollTo(selector);
        }
      }
      else {
        var firstError = jQuery("label.error:visible:first").prev("input");
        if ( firstError.length != 0 ){
          ZR.util.scrollToObject(firstError);
        }
      }

      /**
       * Hook the billing address fields to copy to the shipping fields.
       */
      ZR.Checkout.AddressPayment.liveCopyBillingToShipping();

    },


    /**
     * Hide and Disable the PayPal link
     */
    hidePayPalCheckout : function(){
      var link = jQuery("#payPalLink");
      if ( link.length == 0 || ! link.is(":visible") ) return;
      jQuery("#payPalLink").attr("disabled","disabled").hide();
    },


    /**
     * Show and enable the PayPal link
     */
    showPayPalCheckout : function() {
      var link = jQuery("#payPalLink");
      if ( link.length == 0 || link.is(":visible") ) return;
      jQuery("#payPalLink").removeAttr("disabled").show();
    },


    /**
     * Checks to show or hide the paypal link depending on
     * gift card values
     */
    showHidePayPalCheckoutGCUpdate : function(){
      var hasGiftCard = false;
      var giftcards = jQuery(":input[name='gift_card_number']:visible");

      if ( giftcards.length != 0 ){
        giftcards.each(function(){
          if (jQuery.trim(jQuery(this).val()).length != 0 ){
            hasGiftCard = true;
          }
        });
      }

      if ( hasGiftCard ){
        ZR.Checkout.AddressPayment.hidePayPalCheckout();
      }
      else {
        ZR.Checkout.AddressPayment.showPayPalCheckout();
      }

    },


    pwCloseRequiresReload : false,
    initRecoverPasswordLink : function(){

      /**
       * Creates the signin popup and defines
       * some cleanup actions on close
       */
      jQuery(".lostpassword").fancybox({
        fitToView	: false,
        autoSize	: true,
        width : 360,
        height : 300,
        scrolling : "no"
      });

    },


    initPWRecoveryForm : function(iframe){
      iframelogin = false;
      if ( iframe === true ){
        iframelogin = iframe;
      }

      jQuery("#formforgotpw").submit(function(){return false;});
      jQuery("#cancelpasswdreq").click(function(){
        window.parent.ZR.Checkout.AddressPayment.pwCloseRequiresReload = false;
        window.parent.jQuery.fancybox.close(true);
//        jQuery.fancybox.close(true);
      });

      /**
       * Loads the two validators for the forms
       */
      ZR.User.iframelogin = iframelogin;
      ZR.Checkout.AddressPayment.validatePasswordRecovery();
    },




    /**
     * Creates the validator object for the password recovery
     * form and sets it in the ZR.User object for use
     * by other functions.
     */
    pwRecoveryValidator : null,

    validatePasswordRecovery: function() {
      ZR.Base.log("ZR.Checkout.AddressPayment.validatePasswordRecovery()", null, "DEBUG");

      var validator = jQuery('#formforgotpw').validate({
        submitHandler: function(form) {
          ZR.Checkout.AddressPayment.ajaxForgotPasswdSubmit( jQuery(form) );
          return false;
        }
      });

      ZR.Checkout.AddressPayment.pwRecoveryValidator = validator;

    },


    /**
     * Handles the ajax password recovery form submit,
     * if the request is successful, it fires
     * the function to reload the login form, otherwise
     * just presents an error
     * @param form
     */
    ajaxForgotPasswdSubmit : function(form){
      ZR.Base.log("ZR.Checkout.AddressPayment.ajaxForgotPasswdSubmit()", null, "DEBUG");
      var url = form.attr("action");
      var data = form.serialize();
      var emailField = form.find('#forgotemail');
      var email = jQuery.trim( emailField.val() );
      var emailName = emailField.attr("name");
      var errors = {};

      ZR.util.hideButton('sendemailbtn');

      //TODO validate this on iOS
      jQuery.ajax({
        url : url,
        async : false,
        type : "GET",
        data: data,
        complete: function(o){
          if ( o.status == 200 || o.statusText == "success" ){
            var response =  jQuery.parseJSON(o.responseText);
            if ( response.status != 'email_sent' ){
              errors[emailName] = ZR.Settings.alerts.signin[response.status];
            }
            else {
              jQuery("#formforgotpw").replaceWith(ZR.Settings.alerts.signin[response.status]);
              window.parent.jQuery.fancybox.update();
            }
          }
          else {
            errors[emailName] = ZR.Settings.alerts.signin.error;
          }
        },
        error : function(o){
          errors[emailName] = ZR.Settings.alerts.signin.error;
        }
      });

      if(! ZR.Base.isEmpty(errors) ){
        ZR.Checkout.AddressPayment.throwError(ZR.Checkout.AddressPayment.pwRecoveryValidator, errors);
      }
      ZR.util.enableButton('sendemailbtn');
    },



    /**
     * Generic function that will set errors on elements
     * in the form.  Requires the ZR.User.[validator] object
     * to use, as well as the map of errors to throw
     * {inputname : errortext}
     * @param validator
     * @param errors
     */
    throwError : function(validator, errors){
      ZR.Base.log("ZR.Checkout.AddressPayment.throwError()", null, "DEBUG");
      if ( errors != null && typeof errors === 'object'){
        validator.showErrors( errors );
      }
    },



    checkUseridAvail : function(e){
      var input = jQuery(this);
      var inputName = input.attr("name");
      var id = jQuery.trim(input.val());
      var createAccount = jQuery("#create_account").is(":checked");

      if ( id.length == 0 ) return;

      if ( !createAccount ) {
        /** clear errors? **/
        return;
      }

      if ( typeof ZR.Cache.orderValues.useridcheck === 'undefined' ){
        ZR.Cache.orderValues.useridcheck = {};
      }

      if ( typeof ZR.Cache.orderValues.useridcheck[id] === 'undefined' ){
        jQuery.getJSON(
          ZR.Settings.url.secureServlet + "?callback=?",
          {
            "OPTION" : "CHECK_USERID_AVAIL",
            "userid" : id,
            "callback" : "?"
          },
          function(data){
            ZR.Cache.orderValues.useridcheck[data.userid] = data;
            if ( data.userexists ){
              var errors = {};
              errors[inputName] = ZR.Settings.alerts.checkout.userAlreadyExists;
              ZR.Checkout.AddressPayment.throwValidatorError(errors);
            }
            else {
               /** clear errors? **/
            }
          }
        );
      }
      else {
        var rv = ZR.Cache.orderValues.useridcheck[id].userexists;
        if ( rv ){
          var errors = {};
          errors[inputName] = ZR.Settings.alerts.checkout.userAlreadyExists;
          ZR.Checkout.AddressPayment.throwValidatorError(errors);
        }
        else {
           /** clear errors? **/
        }
      }
    },





    checkShippingStreetChange : function(){
      ZR.Base.log("Checkout.AddressPayment.checkShippingStreetChange()", null, "DEBUG");
      var sInput = jQuery("#shippingStreet1");
      var bInput = jQuery("#billingStreet1");
      var useInput = bInput;

      if ( ! ZR.Checkout.AddressPayment.useBillForShip() ){
        useInput = sInput;
      }

      return ZR.Checkout.AddressPayment.checkForPOBox( useInput );
    },


    checkShippingCityChange : function(){
      ZR.Base.log("Checkout.AddressPayment.checkShippingCityChange()", null, "DEBUG");
      var sInput = jQuery("#shippingCity");
      var bInput = jQuery("#billingCity");
      var useInput = bInput;

      if ( ! ZR.Checkout.AddressPayment.useBillForShip() ){
        useInput = sInput;
      }

      return ZR.Checkout.AddressPayment.checkForAPOFPO( useInput );
    },



    checkForAPOFPO : function(o){
      ZR.Base.log("Checkout.AddressPayment.checkForAPOFPO()", null, "DEBUG");
      var zval = "";
      var cval = o.val();
      var inputName = o.attr("name");
      if ( inputName.indexOf("billing")){
        zval = jQuery("#billingPostalCode").val();
      }
      else {
        zval = jQuery("#shippingPostalCode").val();
      }
      if ( ZR.Checkout.Confirm.hasMilitaryAddress( cval , zval ) ){
        ZR.Base.log("Throwing Error: Address looks like APO/FPO)", null, "DEBUG");
        var errors = {};
        errors[inputName] = ZR.Settings.alerts.checkout.MilitaryAddressError;
        ZR.Checkout.AddressPayment.throwValidatorError(errors);
        return true;
      }
      return false;
    },


    checkForPOBox : function(o){
      ZR.Base.log("Checkout.AddressPayment.checkForPOBox()", null, "DEBUG");
      var val = o.val();
      var inputName = o.attr("name");
      if ( ZR.Checkout.Confirm.hasPostOfficeBox( val ) ){
        ZR.Base.log("Throwing Error: Address has PO Box()", null, "DEBUG");
        var errors = {};
        errors[inputName] = ZR.Settings.alerts.checkout.POBoxError;
        ZR.Checkout.AddressPayment.throwValidatorError(errors);
        return true;
      }
      return false;
    },



    validatePasswordOnBlur : function(){
      var o = jQuery(this);
      var val = o.val();
      var inputName = o.attr("name");
      var isValid = ZR.Checkout.AddressPayment.checkPasswordFormat(val);

      /**
       * You can show/hide something to the user here for true/false
       * verbiage.  Otherwise, you can modify the checkPasswordFormat
       * function to display something based on how close they
       * are to being successful.
       */
      if ( ! isValid ){
        var errors = {};
        errors[inputName] = ZR.Settings.alerts.checkout.passwordValidationError;
        ZR.Checkout.AddressPayment.throwValidatorError(errors);
      }

    },

    validatePasswordOnEntry : function(){
      var o = jQuery(this);
      var val = o.val();
      var isValid = ZR.Checkout.AddressPayment.checkPasswordFormat(val);

      /**
       * You can show/hide something to the user here for true/false
       * verbiage.  Otherwise, you can modify the checkPasswordFormat
       * function to display something based on how close they
       * are to being successful.
       */
//      if ( isValid ){
//
//      }
//      else {
//
//      }

    },

    checkPasswordFormat : function( val ) {

      /** the password is 8 chars and has 3 of the 4 requirements **/
      if ( ZR.Base.isValidPassword( val ) ){
//        o.removeAttr("style");
        return true;
      }
      /** the password is 6 chars and has 2 of the 4 requirements **/
      else if ( ZR.Base.isWarmPassword( val ) ){
//        o.css("border-color","yellow");
        return false;
      }
      /** the password is 4 chars and has 2 of the 4 requirements **/
      else if ( ZR.Base.isColdPassword( val ) ){
//        o.css("border-color","orange");
        return false;
      }
      /** the password is either under 4 chars, or only has 1 of the requirements **/
      else {
//        o.css("border-color","red");
        return false;
      }

    },


    switchPaymentType : function(){
      var type = jQuery(this).val();
      var paymentForm = jQuery("#creditCardPaymentData");

      if ( type == 'CC' ){
        ZR.Checkout.AddressPayment.enableCreditCardForm();
      } else if ( type == 'COD' ){
        ZR.Checkout.AddressPayment.disableCreditCardForm();
      }
    },



    disableCreditCardForm : function(){
      jQuery("#ccnumber, #cvvcode, #ccexpmonth, #ccexpyear").removeClass("requiredgroup").attr("disabled","disabled");
      jQuery("#creditCardPaymentData").slideFade(function(){});
    },

    enableCreditCardForm : function(){
      jQuery("#ccnumber, #cvvcode, #ccexpmonth, #ccexpyear").addClass("requiredgroup").removeAttr("disabled");
      jQuery("#creditCardPaymentData").slideFade(function(){});
    },


    activateGiftMsg : function() {
			jQuery('#giftCardMsg').slideFade();
      if(jQuery(this).is(':checked')){
        jQuery("#cartgiftmsgcounter").removeClass("hide");
        jQuery('#cartgiftmsg').removeAttr('disabled');
				jQuery('#cartgiftmsg').focus();
      }
      else {
        jQuery('#cartgiftmsg').attr('disabled',true);
        jQuery("#cartgiftmsgcounter").addClass("hide");
      }
    },


    updateBillingCountry : function(){
      ZR.Base.countrySetStates( jQuery(this) );
      jQuery("#billingCountry").val( jQuery(this).val() );
    },


    updateShippingCountry : function(){
      ZR.Base.countrySetStates( jQuery(this) );
      jQuery("#shippingCountry").val( jQuery(this).val() );
    },



    /**
     * Will focus on the field selector defined, and then
     * scroll the page to it.
     *
     * @param field can be any valid jQuery selector
     */
    focusAndScrollTo : function(field){
      ZR.Base.log("Checkout.AddressPayment.focusAndScrollTo()", null, "DEBUG");
      if ( typeof field == 'undefined' ) return;

      var o = jQuery(field);
      if ( o.length != 0 ){
        if ( typeof o.attr("id") !== 'undefined' )
        ZR.util.scrollToId( o.attr("id") );
        o.focus();
      }

    },





    /**
     * Listens to the keystrokes in the login form password field,
     * if this is an enter key, submit the form
     * @param e
     */
    captureLoginKeyStroke : function(e){
      ZR.Base.log("Checkout.AddressPayment.captureLoginKeyStroke()", null, "DEBUG");
      /** hide the error label, in case this is a second pass through **/
        if ( jQuery("#loginError").is(":visible") ) jQuery("#loginError").hide(0);

        if ( e.which == 13 ){
          e.preventDefault();
          e.stopPropagation();
          jQuery("#submitLoginRequest").trigger("click");
        }
    },





    /**
     * Modifies the UI for the selected number of gift card entries+pin
     * @param input the select which denotes how many fields to display
     */
    changeGiftCardFields : function(input){
      ZR.Base.log("Checkout.AddressPayment.hasGiftCards()", null, "DEBUG");

      var count = jQuery(input).val();
      var itemWrapper = jQuery(".giftCardItems");
      var currentItems = jQuery(".giftCardItem");
      var currentLength = currentItems.length;
      var difference = count - currentLength;

      if ( count != currentLength ){
        if ( count < currentLength ){
          /* removing items */
          for ( x = currentLength; x > count; x-- ){
            jQuery(currentItems[x-1]).remove();
          }
        }
        else {
          /* adding items by cloning the first item in the list, which will always exist */
          for ( x = currentLength + 1; x <= count; x++ ){
            var newCard = jQuery(currentItems[0]).clone(true);
            var numberField = newCard.find("input[id^='zo_gift_card_number']");
//            var pinField = newCard.find("input[id^='zo_gift_card_pin']");

            /*
              tabindex is the value of the cloned item's tabindex calculated by twos
              (two fields per loop) -- that way we don't have to worry about changing
               this script, if/when the tabindex changes on that item in the jsp page */
            var tabindex = Number(numberField.attr('tabindex')) + (x * 2) - 2;

            /* update the values/attributes for the items */
            numberField.val('').attr({"id":'zo_gift_card_number-' + x, "tabindex" : tabindex}).trigger('keyup');
//            pinField.val('').attr({"id":'zo_gift_card_pin-' + x, "tabindex" : tabindex + 1}).trigger('keyup');

            newCard.find("label.error").remove();
            newCard.find("label.balance").remove();

            /* append them to the wrapper div */
            itemWrapper.append(newCard);
						newCard.find('span').html(x);
          }
        }
      }

    },





    /**
     * Checks a credit card type against known regular expressions
     * of card types.  Does not validate the full string, or
     * luhn check it, it simply checks to see if it follows
     * a known pattern.
     *
     * @param input the field element to get the value from
     */
    checkCreditCard : function(input){
      ZR.Base.log("Checkout.AddressPayment.checkCreditCard()", null, "DEBUG");

      var val,num,type;
      val = jQuery(input).val();
      num = val.replace(/[^\d-\s]/g,'');
      type = ZR.Checkout.AddressPayment.checkCreditCardType( num );
      ZR.Checkout.AddressPayment.highlightCardIcon(type, false);

    },





    /**
     * checks if a number matches known patterns for credit cards.
     * This only validates that the starting digits are correct, but
     * does not do a full check on card number length.
     *
     *   ,'JCB'               : /^(?:2131|1800|35\d{3})\d{0,11}jQuery/
     *   ,'Diners'            : /^3(?:0[0-5]|[68][0-9])[0-9]{0,11}jQuery/
     *   ,'American Express'  : /^3[47][0-9]{0,13}jQuery/
     *
     * @param num the number string to check
     */
    checkCreditCardType : function(num){
      ZR.Base.log("Checkout.AddressPayment.checkCreditCardType()", null, "DEBUG");

      var cardpatterns = {};

      jQuery("#ccicons span").each(function(){

        var type = jQuery(this).attr("data-cardtype");
        if ( type == "Visa"){
          cardpatterns['Visa'] = /^4[0-9]{0,12}(?:[0-9]{3})?jQuery/;
        }
        else if ( type == "MasterCard"){
          cardpatterns['MasterCard'] = /^5[1-5][0-9]{0,14}jQuery/;
        }
        else if ( type == "Discover"){
          cardpatterns['Discover'] = /^6(?:011|5[0-9]{2})[0-9]{0,12}jQuery/;
        }
        else if ( type == "JCB"){
          cardpatterns['JCB'] = /^(?:2131|1800|35\d{3})\d{0,11}jQuery/;
        }
        else if ( type == "Diners"){
          cardpatterns['Diners'] = /^3(?:0[0-5]|[68][0-9])[0-9]{0,11}jQuery/;
        }
        else if ( type == "American Express"){
          cardpatterns['American Express'] = /^3[47][0-9]{0,13}jQuery/;
        }

      });


//      var cardpatterns = {
//        'Visa'              : /^4[0-9]{0,12}(?:[0-9]{3})?jQuery/
//       ,'MasterCard'        : /^5[1-5][0-9]{0,14}jQuery/
//       ,'Discover'          : /^6(?:011|5[0-9]{2})[0-9]{0,12}jQuery/
//      };

      return ZR.Checkout.AddressPayment.getCreditCardType(cardpatterns, num);

    },





    /**
     * Checks the balances of any gift cards which have numbers and pins entered.
     * errors out the inputs which are missing data.
     */
    checkGiftCardBalances : function(){
      ZR.Base.log("Checkout.AddressPayment.checkGiftCardBalances()", null, "DEBUG");

      if (! ZR.Checkout.AddressPayment.hasGiftCards() ){
        return false;
      }

      var item;
      var giftCards = jQuery(".giftCardItem");
      var hasErrors = false;

//      var data = ZR.Checkout.AddressPayment.getSerializedGiftCardString();


      /** Create form to send request, then submit it **/
      var form = jQuery("<form/>").attr({
        action : ZR.Settings.url.secureHost + "/cart/address-payment/",
        id : "GiftCardBalanceCheckForm",
        method : "POST"
      });

      form.append(jQuery("<input type='hidden' name='OPTION' value='GIFTCARD_CHECKOUT_PAGE_BALANCE_CHECK'/>"));


      for ( x = 0; x < giftCards.length ; x++ ){
        var idField = jQuery(giftCards[x]).find("input[id^='zo_gift_card_number']");
        var gcnel = jQuery(idField).clone();
            gcnel.attr("id",gcnel.attr("id")+"bal");
        var gcn = ZR.Checkout.AddressPayment.checkGiftCardValues( gcnel );

        if ( gcn  ){
          form.append(gcnel);
        }
      }

      jQuery('body').append(form);
      form.submit();

    },


    checkGiftCardNumberFormat : function(){
      var i = jQuery(this);
      var val = i.val();
      if (  val.indexOf("*") == -1 ){
        var cleanval = ZR.Base.digitOnly(val);

        if ( cleanval.length > 21 ){
          cleanval = cleanval.substr(0, 21);
        }

        i.val(cleanval);
      }
    },



    /**
     * returns the value of the input, or adds an error class
     * to the input and returns false
     * @param input the input to validate
     */
    checkGiftCardValues : function( input ){
      ZR.Base.log("Checkout.AddressPayment.checkGiftCardValues()", null, "DEBUG");

      var val = input.val();

      if ( val.indexOf("*") == -1){
        var cleanval = ZR.Base.digitOnly(val);
        var name = input.attr("name");

        if ( jQuery.trim(input.val() ).length == 0 ){
          input.addClass("error");
          return false;
        }

        if ( val != cleanval ){
          input.addClass("error");
          return false;
        }

        if ( val.length > 21 ){
          input.addClass("error");
          return false;
        }

      }

      input.removeClass("error");
      return input.val();


    },





    /**
     * clears the values of the fields in the layer, and triggers the
     * keyup listener which will show the span (label) again
     */
    clearShippingAddressFields : function(){
      ZR.Base.log("Checkout.AddressPayment.clearShippingAddressFields()", null, "DEBUG");

//      jQuery("#shippingAddressWrapper").find(":input:not(':disabled')").each(function(){
//        jQuery(this).val('').trigger('keyup');
//      });

      jQuery("#shippingFirstName").val('').trigger('keyup');
      jQuery("#shippingLastName").val('').trigger('keyup');
      jQuery("#shippingCompany").val('').trigger('keyup');
      jQuery("#shippingStreet1").val('').trigger('keyup');
      jQuery("#shippingCity").val('').trigger('keyup');
      jQuery("#shippingState").val('').trigger('keyup');
      jQuery("#shippingPostalCode").val('').trigger('keyup');

    },





    /**
     * Call to disable the credit card fields and not require validation
     * on them ( when doing PayPal processing, or similar )
     */
    disableCreditCardFields : function(){
      var paymentFields = jQuery("input, select","#creditCardFormFields").not("[name^='zop_card_type-']");
      paymentFields.each(function(){
        jQuery(this).attr("disabled","disabled").removeClass("error");
      });
    },





    /**
     * Transfers a users email address entered in the login section
     * to the billing email hidden inputs
     */
    duplicateUserEmail : function (){
      var email = jQuery.trim(jQuery(this).val());
      //jQuery("#billingEmail, #billingEmailConfirm").val(email);
      jQuery("#billingEmail").val(email);
    },





    /**
     * Call to enable the credit card fields
     */
    enableCreditCardFields : function(){
      var paymentFields = jQuery("input, select","#creditCardFormFields");
      paymentFields.each(function(){
        jQuery(this).removeAttr("disabled");
      });
    },





    /**
     * Compares a number string against known patterns
     * and returns the card type if a match is found.
     * @param patterns the patterns to match on
     * @param val the string to check
     */
    getCreditCardType : function(patterns, val){
      ZR.Base.log("Checkout.AddressPayment.getCreditCardType()", null, "DEBUG");

      val = val.replace(/[^\d]/g,'');
      for (var type in patterns) {
        if (patterns[type].test(val)) {
          return type;
        }
      }
      return 'unknown';

    },





    /**
     * returns a serialized string of gift card numbers and pins
     * or.. if an error exists in any of the card data, returns
     * false.
     */
    getSerializedGiftCardString : function(){
      ZR.Base.log("Checkout.AddressPayment.getSerialized()", null, "DEBUG");

      var data = "";
      var giftCards = jQuery(".giftCardItem");
      var hasErrors = false;

      for ( x = 0; x < giftCards.length ; x++ ){
        var gcnel = jQuery(giftCards[x]).find("input[id^='zo_gift_card_number']");
        var gcn = ZR.Checkout.AddressPayment.checkGiftCardValues( gcnel );

        if ( gcn ){
          data += "&zo_gift_card_number=" + gcn ;
        }
        else {
          hasErrors = true;
        }
      }

      if ( hasErrors ){
        return false;
      }

      return data;
    },





    /**
     * simple returns true|false if the page contains gift cards
     * It does not do any validation, other than checking if anything
     * has been entered
     */
    hasGiftCards : function(){
      ZR.Base.log("Checkout.AddressPayment.hasGiftCards()", null, "DEBUG");

      var giftCards = jQuery(".giftCardItem");
      if ( giftCards.length == 0 ) return false;

      for ( x = 0; x < giftCards.length ; x++ ){
        var gcnel = jQuery(giftCards[x]).find("input[id^='zo_gift_card_number']");
        var gcn = ZR.Checkout.AddressPayment.checkGiftCardValues( gcnel );

        if ( gcn ){
          return true;
        }
      }

      return false;
    },





    /**
     * turns on/off credit card icons based on the passed in type
     * @param type
     */
    highlightCardIcon : function(type, showInvalid){
      ZR.Base.log("Checkout.AddressPayment.highlightCardIcon()", null, "DEBUG");

      jQuery(".ccicon").not("#cc" + type).removeClass("active");
      jQuery("#cc" + type).addClass("active");

      /** sets the payment type input in the form **/
      jQuery("#paymenttype").val( type === 'unknown' ? ''  : type );

      if ( showInvalid && type === 'unknown' ){
        /** TODO Display an error or label that the card is invalid ? **/
      }

    },





    /**
     * checks if an input value appears to be a masked credit card
     * @param s the input value
     */
    isMasked : function(s) {
      ZR.Base.log("Checkout.AddressPayment.isMasked()", null, "DEBUG");

      var maskRegex = /^xxxx.*jQuery/i;
      return maskRegex.test(s);
    },





    /**
     * Passes the username/password values to the login form
     **/
    loginAction : function(){
      ZR.Base.log("Checkout.AddressPayment.loginAction()", null, "DEBUG");

      var u = jQuery.trim(jQuery("#loginUserName").val());
      var p = jQuery.trim(jQuery("#loginPassword").val());
      jQuery("#loginFormUserName").val(u);
      jQuery("#loginFormPassword").val(p);
      
      // GA Event
      _gaq.push(['_setCustomVar', 1, 'Logged In User', 'Yes', 2]);
      
      jQuery("#cartloginform").submit();

    },





    /**
     * On failure, show the error layer
     */
    loginFailure : function(){
      ZR.Base.log("Checkout.AddressPayment.loginFailure()", null, "DEBUG");

      jQuery("#loginError").html( (ZR.User.userView.error) ? ZR.User.userView.error : ZR.Settings.alerts.checkout.loginError ).slideToggle();

    },





    /**
     * If the login was successful, show the user info layer, and remove
     * the login form layer
     */
    loginSuccess : function(){
      ZR.Base.log("Checkout.AddressPayment.loginSuccess()", null, "DEBUG");

      var resetBilling = false;
      var address = ZR.User.userView["billingAddress"][0];


      /**
       * If the billing address is already populated with data
       * in the city,state,zip, do not copy the user address data in to it
       * unless it is all identical
       */

      if( typeof (address) === 'object' ){
        var ucity  = jQuery.trim(address.city).toLowerCase();
        var ustate = jQuery.trim(address.state).toLowerCase();
        var uzip   = jQuery.trim(address.postalCode).toLowerCase();

        var ccity  = jQuery.trim(jQuery("#billingCity").val()).toLowerCase();
        var cstate = jQuery.trim(jQuery("#billingState").val()).toLowerCase();
        var czip   = jQuery.trim(jQuery("#billingPostalCode").val()).toLowerCase();

        if ( czip.length != 0 && cstate.length != 0 && ccity.length != 0 ){
          if (uzip == czip && ustate == cstate && ucity == ccity) {
            resetBilling = true;
          }
        } else {
          resetBilling = true;
        }
      }


      if ( resetBilling ){
        ZR.Checkout.AddressPayment.setBillingAddressFromUser();
        ZR.Checkout.AddressPayment.setShippingFromBilling();
      }

      ZR.Checkout.AddressPayment.setLoginFromUser();

      jQuery("#loggedInDisplay").slideFade();
      jQuery("#logInUserData").remove();

    },





    /**
     * Validates a card number string against the Luhn Alogrithm
     * @param cardNumStr the card number to process
     */
    luhnCheck : function(cardNumStr) {
      ZR.Base.log("Checkout.AddressPayment.luhnCheck()", null, "DEBUG");

      cardNumStr = cardNumStr.replace(/[-\s]/g, "");

      if (cardNumStr.match(/\D/g)) return false;
      if (cardNumStr.length < 14) return false;

      var revCardNumStr = cardNumStr.split("").reverse().join("");

      var checkStr = "";
      for (var i = 0; i < revCardNumStr.length; i++) {
        if (i % 2 === 1) {
          checkStr += (parseInt(revCardNumStr.charAt(i), 10) * 2);
        } else {
          checkStr += parseInt(revCardNumStr.charAt(i), 10)
        }
      }

      var checkSum = 0;
      for (var i = 0; i < checkStr.length; i++) {
        checkSum += parseInt(checkStr.charAt(i), 10);
      }

      return checkSum % 10 === 0;

    },





    /**
     * merges the two credit card date drop downs in to one field.
     */
    mergeCCDate : function(){
      ZR.Base.log("Checkout.AddressPayment.mergeCCDate()", null, "DEBUG");

      expDateVal = jQuery('#ccexpmonth').val() + '/' + jQuery('#ccexpyear').val();
      expDateLength = expDateVal.length;
      if (expDateLength == 7) {
        // set the hidden, reset validation error
        jQuery('#ccexpdate').val(jQuery('#ccexpmonth').val() + '/' + jQuery('#ccexpyear').val());

        jQuery("#addressPaymentForm").validate().element("#ccexpdate");
      }
      else {
        jQuery('#ccexpdate').val('');
      }

    },





    /**
     * Process a PayPal Checkout (Button Click)
     */
    payPalCheckout : function(){
      ZR.Base.log("Checkout.AddressPayment.payPalCheckout()", null, "DEBUG");

      if ( ZR.Checkout.AddressPayment.hasGiftCards() ){
        /** TODO throw error (gift cards not allowed in conjunction with paypal) **/
        return false;
      }
      
      ZR.Newsletter.Signup.CheckoutSubmit(jQuery("#addressPaymentForm"));

      jQuery("#addressPaymentForm input[name='OPTION']").val("ADDRESS_PAYPAL");
      jQuery("#paymenttype").val("PAYPAL");
      
      // GA Tracking
      _gaq.push(['_setCustomVar', 3, 'PayPal User', 'Yes', 2]);

      /** TODO Make the form appear that it is disabled **/


      /** disable the credit card fields **/
      ZR.Checkout.AddressPayment.disableCreditCardFields();

      /* If the bill as ship is checked, do a final copy of the address
         just to make sure they are the same. */
      if ( ZR.Checkout.AddressPayment.useBillForShip() ){
        ZR.Checkout.AddressPayment.setShippingFromBilling();
      }

      jQuery("#addressPaymentForm").submit();

    },





    /**
     * sets the address on the form elements from the user object.
     * @param type billing | shipping (id's on the elements)
     */
    setBillingAddressFromUser : function(){
      ZR.Base.log("Checkout.AddressPayment.setBillingAddressFromUser()", null, "DEBUG");

      if( typeof (address = ZR.User.userView['billingAddress'][0]) === 'object' ){
        var email = ZR.User.userView.email;
        var userid = ZR.User.userView.userid;

        if( typeof address.phone.PHONE[0] === 'object' ){
          var phone = address.phone.PHONE[0];
        }

        jQuery("input[name='zo_bill_userid']").val(userid);
        jQuery("input[name='zo_bill_userid']").val(userid);

        jQuery("#billingEmail").val(email);
        //jQuery("#billingEmailConfirm").val(email);
        jQuery("#billingFirstName").val(address.firstName).trigger('keyup');
        jQuery("#billingMiddleInitial").val(address.middleName).trigger('keyup');
        jQuery("#billingLastName").val(address.lastName).trigger('keyup');
        jQuery("#billingCompany").val(address.company).trigger('keyup');
        jQuery("#billingStreet1").val(address.street1).trigger('keyup');
        jQuery("#billingCity").val(address.city).trigger('keyup');
        jQuery("#billingState").val(address.state).trigger('keyup');
        jQuery("#billingPostalCode").val(address.postalCode).trigger('keyup');
        jQuery("#billingCountry").val(address.countryCode).trigger('keyup');
        if ( phone ) jQuery("#billingPhone").val(phone.number).trigger('keyup');
      }

    },






    /**
     * sets the login ui elements with the user values
     */
    setLoginFromUser : function(){
      ZR.Base.log("Checkout.AddressPayment.setLoginFromUser()", null, "DEBUG");

      jQuery("#userFirstName").html(ZR.User.userView.firstname);
      jQuery("#userLastName").html(ZR.User.userView.lastname);
      jQuery("#userEmail").html(ZR.User.userView.userid);
    },





    /**
     * sets the shipping address in the form with the same values
     * as the billing address
     */
    setShippingFromBilling : function(){
      ZR.Base.log("Checkout.AddressPayment.setShippingFromBilling()", null, "DEBUG");

      var billForm = jQuery("*[name^='zo_bill_']");
      var value, name, osname, o, os;

      /**
       * for each element selected above, replace zo_bill with zo_ship, and set
       * that element's value to the same
       */
      billForm.each( function() {
        o = jQuery(this);
        value = o.val();
        name = o.attr('name');
        osname = name.replace('zo_bill_', 'zo_ship_');
        os = jQuery("*[name='" + osname + "']");
        if (os.length){
          ZR.Base.log("Setting " + osname + " to: " + value, null, "DEBUG");
          os.val(value).trigger("keyup").trigger("change");
        }
      });

    },





    /**
     *  Sets the zo_shipping_method_id from the
     *  Japan state table that is in the cache
     */
    selectJapanShippingMethod : function(){
      var state = jQuery("#shippingState").val();
      for ( var i  = 0; i < ZR.Cache.JPShipMethods.length; i++ ){
        var o = ZR.Cache.JPShipMethods[i];
        if ( o.name == state ){
          jQuery("#zo_shipping_method_id").val(o.ID);
          break;
        }
      }
    },





    /**
     * Adds the Japanese Shipping states and id's
     * to the cache.  When a user selects a state,
     * the associated ID is used as the shipping_method_id
     * @param states
     */
    setupJapanShipping : function(states){
      ZR.Cache.JPShipMethods = states;
    },





    /**
     * a map of errors should be submitted that contains input elements
     * as keys (erred element) and the message as the value.  If the input
     * element exists, this will add the error to the jQuery.validator and
     * display them.
     *
     * @param errors
     */
    setValidatorMessages : function(errors){

      var newMessages = {};
      var hasErrors = false;

      for ( i in errors ){
        var key = i;
        var message = errors[i];
        var keyAr = key.split(".");

        if ( keyAr.length > 1 )
          var input = keyAr[1];
        else
          var input = keyAr[0];

        var o = jQuery("input[name^='"+input+"']");

        if ( o.length ){
          newMessages[o.attr("name")] = message;
          hasErrors = true;
        }
      }

      if ( hasErrors ){

        ZR.Checkout.AddressPayment.throwValidatorError(newMessages);

        setTimeout(function(){
          var firstError = jQuery("label.error:visible:first");
          if ( firstError.length != 0 ){
            ZR.util.scrollToObject(firstError);
          }
        }, 250);
      }

    },





    /**
     * Shows the user entered credit card number, without spaces and
     * other chars stripped out.
     * @param input
     */
    showCreditCard : function(input){
      ZR.Base.log("Checkout.AddressPayment.showCreditCard()", null, "DEBUG");

      if (ZR.Checkout.Order.userCCNum){
        jQuery(input).val(ZR.Checkout.Order.userCCNum).trigger("keyup");
      }

    },





    /**
     * Toggles the password layer for new accounts, when
     * the checkbox is clicked.
     */
    toggleGeneratePassword : function(){
      ZR.Base.log("Checkout.AddressPayment.toggleGeneratePassword()", null, "DEBUG");

      var pwc = jQuery("#passwordWrapper");

      pwc.slideFade(function(){
				jQuery("#generatePassword").focus();
        jQuery("#inputEmail").trigger("blur");
        if ( pwc.is(":visible") ){
          pwc.find("input").each(function(){ jQuery(this).removeAttr("disabled"); });
        }
        else {
          pwc.find("input").each(function(){ jQuery(this).attr("disabled","disabled"); });
        }
			});


    },





    /**
     * show/hide the gift card form
     */
    toggleGiftCard : function(e){
      ZR.Base.log("Checkout.AddressPayment.toggleGiftCard()", null, "DEBUG");

      jQuery("#giftCardWrapper").slideFade();

    },





    /**
     * show/hide the login form vs the new account fields
     */
    toggleLogin : function() {
      ZR.Base.log("Checkout.AddressPayment.toggleLogin()", null, "DEBUG");

      /** remove the errors from the cart, if they exist **/
      jQuery("label.error").hide();
      jQuery("input.error, select.error").removeClass("error");

      jQuery("#loginFieldWrapper").slideFade();
      jQuery("#loginButtonWrapper").slideFade();
      jQuery("#guestCheckoutOutput").slideFade();

      ZR.util.scrollToId('carthaboutheader');

      jQuery("#loginFieldWrapper :input").each(function(){
        if ( jQuery(this).is(":disabled") ) {
          jQuery(this).removeAttr("disabled");
        }
        else {
          jQuery(this).attr("disabled", "disabled");
        }
      }) ;

			jQuery("#loginFieldWrapper input:first").focus();

    },





    /**
     * Toggles the shipping address layer, and clears the field
     * values when it is visible, replaces them with the default
     * user values when hidden again.
     */
    toggleShippingAddress : function(){
      ZR.Base.log("Checkout.AddressPayment.toggleShippingAddress()", null, "DEBUG");

      if ( jQuery("div#shippingAddressWrapper").is(":hidden") ){
//        ZR.Checkout.AddressPayment.clearShippingAddressFields();

        jQuery("#zo_use_bill_as_ship").val("0");
        jQuery("div#shippingAddressWrapper").slideFade(function(){
					jQuery('#shippingFirstName').focus().select();
				});
      }
      else {
        jQuery("div#shippingAddressWrapper").slideFade(function(){

          ZR.Checkout.AddressPayment.setShippingFromBilling();
          jQuery("#zo_use_bill_as_ship").val("1");
        });
      }

    },






    liveCopyBillingToShipping : function(){
      var wrapper = jQuery("#billingAddressWrapper");

      wrapper.find("input, select").each(function(){
        jQuery(this).bind("change", function(){
          if ( ZR.Checkout.AddressPayment.useBillForShip() ) {
            o = jQuery(this);
            value = o.val();
            name = o.attr('name');
            osname = name.replace('zo_bill_', 'zo_ship_');
            os = jQuery("*[name='" + osname + "']");
            if (os.length){
              ZR.Base.log("Setting " + osname + " to: " + value, null, "DEBUG");
              os.val(value).trigger("keyup").trigger("change");
            }
          }
        });
      });
    },








    /**
     * Toggle the display of the shipping Method Div
     * @param e
     */
    toggleShippingMethod : function(e){
      ZR.Base.log("Checkout.AddressPayment.toggleShippingMethod()", null, "DEBUG");

			jQuery("#shippingOptionsStatus").slideFade();
      jQuery("#shippingOptionsWrapper").slideFade();

    },





    /**
     * return if the billForShip checkbox is checked or not
     */
    useBillForShip : function(){
      ZR.Base.log("Checkout.AddressPayment.useBillForShip()", null, "DEBUG");
      return jQuery("input[name='ship_address_different']").is(":checked");
    },





    /**
     * Validates a credit card number against known patterns, and
     * performs a luhn check on the number.
     * @param input the field element to get the value from
     */
    validateCreditCard : function(input){
      ZR.Base.log("Checkout.AddressPayment.validateCreditCard()", null, "DEBUG");

      var val,num,cleanNum,type,isValid=false,showError=false;

      val = jQuery.trim(jQuery(input).val());

      if ( val.length == 0 ) return;
      if ( val.substr(0, 5) == "xxxx-" ) return;
      if ( val == '4007000000027' ) return true;
      if ( val == '4222222222222' ) return true;

      num = val.replace(/[^\d-\s]/g,'');
      cleanNum = val.replace(/[^\d]/g,'');

      /* set the stored values of the card */
      ZR.Checkout.Order.userCCNum = val;
      ZR.Checkout.Order.cleanCCNum = cleanNum;

      /* check the card type */
      type = ZR.Checkout.AddressPayment.validateCreditCardType( num );
      isValid = ZR.Checkout.AddressPayment.luhnCheck(num);
      ZR.Base.log("Card is Valid? " + isValid, null, "DEBUG");

      /* highlight the appropriate icon */
      ZR.Checkout.AddressPayment.highlightCardIcon(type, !isValid);

      /* bypass for testing */
      if ( num == '4222222222222'){
        type = "Visa";
        cleanNum = num;
        isValid = true;
      }

      if ( type != "unknown" && isValid ){
        jQuery(input).val(cleanNum).removeClass("error");
        return true;
      } else {
        if ( type == "unknown" ){
          var errors = {};
            errors["zop_account_number-1"] = ZR.Settings.alerts.checkout.unsupportedCreditCardType;
            ZR.Checkout.AddressPayment.throwValidatorError(errors);
          }
        jQuery(input).addClass("error");
        return false;
      }

    },





    /**
     * Checks if a number matches known patterns for credit cards.
     * This also verifies that the full string is the correct length
     *
     *   ,'JCB'               : /^(?:2131|1800|35\d{3})\d{11}jQuery/
     *   ,'Diners'            : /^3(?:0[0-5]|[68][0-9])[0-9]{11}jQuery/
     *   ,'American Express'  : /^3[47][0-9]{13}jQuery/
     *
     * @param num the number to check
     */
    validateCreditCardType : function(num){
      ZR.Base.log("Checkout.AddressPayment.validateCreditCardType()", null, "DEBUG");

      var cardpatterns = {};

      jQuery("#ccicons span").each(function(){

        var type = jQuery(this).attr("data-cardtype");
        if ( type == "Visa"){
          cardpatterns['Visa'] = /^4[0-9]{12}(?:[0-9]{3})?jQuery/;
        }
        else if ( type == "MasterCard"){
          cardpatterns['MasterCard'] = /^5[1-5][0-9]{14}jQuery/;
        }
        else if ( type == "Discover"){
          cardpatterns['Discover'] = /^6(?:011|5[0-9]{2})[0-9]{12}jQuery/;
        }
        else if ( type == "JCB"){
          cardpatterns['JCB'] = /^(?:2131|1800|35\d{3})\d{11}jQuery/;
        }
        else if ( type == "Diners"){
          cardpatterns['Diners'] = /^3(?:0[0-5]|[68][0-9])[0-9]{11}jQuery/;
        }
        else if ( type == "American Express"){
          cardpatterns['American Express'] = /^3[47][0-9]{13}jQuery/;
        }

      });

//      var cardpatterns = {
//        'Visa'              : /^4[0-9]{12}(?:[0-9]{3})?jQuery/
//       ,'MasterCard'        : /^5[1-5][0-9]{14}jQuery/
//       ,'Discover'          : /^6(?:011|5[0-9]{2})[0-9]{12}jQuery/
//      };

      return ZR.Checkout.AddressPayment.getCreditCardType(cardpatterns, num);

    },





    /**
     * jQValdiate rules for error placement, etc
     */
		validateAddressPayment: function() {
      ZR.Base.log("Checkout.AddressPayment.validateAddressPayment()", null, "DEBUG");

      var validator = jQuery('#addressPaymentForm').validate({

        rules: {
          password : {
            minlength: 6
          },
          confirm_password: {
            equalTo: "#generatePassword"
          },
          zo_bill_phone : {
            phoneUS : (ZR.Settings.locale.code == "en_US") ? true : false,
            phoneAU : (ZR.Settings.locale.code == "en_AU") ? true : false
          },
          zo_bill_postal_code : {
            digits: (ZR.Settings.locale.code == "en_US" || ZR.Settings.locale.code == "en_AU") ? true : false,
            minlength : (ZR.Settings.locale.code == "en_US") ? 5 : (ZR.Settings.locale.code == "en_AU") ? 4 : 3
          },
          zo_ship_postal_code : {
            digits: (ZR.Settings.locale.code == "en_US" || ZR.Settings.locale.code == "en_AU") ? true : false,
            minlength : (ZR.Settings.locale.code == "en_US") ? 5 : (ZR.Settings.locale.code == "en_AU") ? 4 : 3
          }
        },


        //set groups to validate on to produce one error for two input fields in a line
        groups: {
          userName: "first_name last_name",
          billName: "zo_bill_first_name zo_bill_last_name",
          billStateZip: "zo_bill_state zo_bill_postal_code",
          shipName: "zo_ship_first_name zo_ship_last_name",
          shipStateZip: "zo_ship_state zo_ship_postal_code",
          ccPayment: "zop_account_number-1 zop_card_code-1",
          ccExp: "cc_exp_month cc_exp_year"
        },

        errorPlacement: function(error, element) {
          var elName = element.attr("name");
          var o;
					var isMulti = true; //if there is more than one line we will need to prepend to a parent div called input multi, important for mobile.

          if ( elName == "first_name" || elName == "last_name" ){
            o = jQuery("#inputLastName");
          }
          else if ( elName == "zo_bill_first_name" || elName == "zo_bill_last_name" ) {
            o = jQuery("#billingLastName");
          }
          else if ( elName == "zo_bill_state" || elName == "zo_bill_postal_code" ) {
            o = jQuery("#billingPostalCode");
          }
          else if ( elName == "zo_ship_first_name" || elName == "zo_ship_last_name" ) {
            o = jQuery("#shippingLastName");
          }
          else if ( elName == "zo_ship_state" || elName == "zo_ship_postal_code" ) {
            o = jQuery("#shippingPostalCode");
          }
          else if ( elName == "zop_account_number-1" || elName == "zop_card_code-1" ) {
            o = jQuery("#cvvcode");
          }
          else if ( elName == "cc_exp_month" || elName == "cc_exp_year" ) {
            o = jQuery("#ccexpyear");
          }
          else {
            o = jQuery(element);
						isMulti = false;
          }

					if(!isMulti) {
         	 o.parent('.placeholder').prepend(error);
					}
					else {
						o.closest('.inputmulti').prepend(error);
					}

        },


        submitHandler : function(form){

          var hasPOBox = ZR.Checkout.AddressPayment.checkShippingStreetChange();
          var hasMilAddr = ZR.Checkout.AddressPayment.checkShippingCityChange();

          var ccnum = jQuery.trim(jQuery("#ccnumber").val());
          var cansubmit = true;

          if( hasPOBox || hasMilAddr ){
            var firstError = jQuery("label.error:visible:first");
            if ( firstError.length != 0 ){
              ZR.util.scrollToObject(firstError);
            }
            cansubmit=false;
            return false;
          }

          var hasGiftCard = false;
          var giftcards = jQuery(":input[name='gift_card_number']:visible");

          if ( giftcards.length != 0 ){
            giftcards.each(function(){
              if (jQuery.trim(jQuery(this).val()).length != 0 ){
                hasGiftCard = true;
              }
            });
          }

          if ( jQuery("input[name='PAYMENT_TYPE']:checked").val() != 'COD'
               && jQuery("#addressPaymentForm input[name='OPTION']").val() == "ADDRESS_PAYMENT"
               && ! hasGiftCard ){
            if ( ccnum.indexOf("xxxx") == -1 && ! ZR.Checkout.AddressPayment.validateCreditCard( jQuery("#ccnumber") )){
              var firstError = jQuery("label.error:visible:first");
              if ( firstError.length != 0 ){
                ZR.util.scrollToObject(firstError);
              }
              cansubmit=false;
              return false;
            }
          }

          if(cansubmit) {
            ZR.util.hideButton('submitPaymentForm');
            form.submit();
          }

        }

      });
			if(validator == true) {
				ZR.util.hideButton('submitPaymentForm');
			}
      ZR.Checkout.AddressPayment['validator'] = validator;

      return validator;

		},





    /**
     * If the locale is en_US, they would like the
     * phone number formatted to (xxx) xxx-xxxx.
     */
    validatePhoneNumber : function(){
      ZR.Base.log("Checkout.AddressPayment.validatePhoneNumber()", null, "DEBUG");

      var num = jQuery(this).val();
      if( ZR.Settings.locale.code == "en_US" ){
        var cleanNum = ZR.Base.checkUSPhoneNumber(num);

        if ( cleanNum === false){
//          jQuery(this).addClass("error");
        }
        else {
          jQuery(this).val(cleanNum);
        }
      }
    },





    /**
     * Checks to see if the country code is JP.  if so,
     * it fires the function to set the shipping_method_id
     * from a cache table.
     */
    validateShippingMethod : function(){
      ZR.Base.log("Checkout.AddressPayment.validateShippingMethod()", null, "DEBUG");

      var country = jQuery("#shippingCountry").val();
      if ( country == "JP" ){
        /* japan's shipping method is set via the shipping country id **/
        ZR.Checkout.AddressPayment.selectJapanShippingMethod();
      }
    },





    /**
     * Bind to a field that will be used for zip code lookups
     * and prefill the city/state/country
     *
     * This will require a little bit of intelligence since
     * the country is bound to what exists in the country select (or hidden text field)
     *
     * The simplest solution is to just limit the action to firing
     * only when the current locale is en_US.  If they decide to expand
     * the lookup database to other countries, we will need to change this
     * behavior.
     */
    zipCodeLookup : function(e){
      ZR.Base.log("Checkout.AddressPayment.zipCodeLookup()", null, "DEBUG");

      if (ZR.Settings.locale.code != 'en_US') return false;

      var o = jQuery(this);
      var val = o.val();
      var results = null;


      if ( typeof val !== 'undefined' && val.length == 5) {

        var cacheValue = ZR.Cache.zipCodeLookup[val];
        if ( typeof cacheValue !== 'undefined' ){
          results = cacheValue;
        }

        if ( results == null ){

          if ( ZR.Cache.lastZipCode == val ){
            ZR.Base.log("zipcode Looks the same to me, no action required", null, "DEBUG");
          }
          else {
            ZR.Cache.lastZipCode = val;
            ZR.Base.log("Looking Up Results for: " + val, null, "DEBUG");
            ZR.Checkout.AddressPayment.zipCodeAjaxCall(val, o);
          }

        }
        else {
          ZR.Base.log(val + " found in cache.", null, "DEBUG");
          ZR.Checkout.AddressPayment.zipCodeUiUpdate( results, o );
        }

      }

    },





    /**
     * Makes an Ajax call to lookup the zip code.  Expects
     * a JSON object back.  Stores those results in the Cache
     * with the zipcode as the key.  Passes the result object
     * off to the function to validate it and update the UI
     * @param zip the zip code to lookup
     * @param o the zip code input element we're working with
     */
    zipCodeAjaxCall : function(zip, o, dealer){
      ZR.Base.log("ZR.Checkout.AddressPayment.zipCodeAjaxCall()", null, "DEBUG");

      if ( document.location.href.indexOf("https") != -1){
        var ajaxURL = ZR.Settings.url.secureHost + "/postalcode-search/"
      }
      else {
        var ajaxURL = window.location.protocol + "//" + window.location.host + "/postalcode-search/"
      }
      jQuery.ajax({
        url : ajaxURL,
        type : "POST",
        dataType : "json",
        data: {
          postalCode : zip
        },
        complete: function(response){
          if ( response.status == 200 || response.statusText == "success" ){
            var data = jQuery.parseJSON(response.responseText);
            ZR.Cache.zipCodeLookup[zip] = data;
            ZR.Checkout.AddressPayment.zipCodeUiUpdate( data, o );
          }
          else {
            ZR.Base.log("An Error Occurred on the call: " + response.statusText, null, "DEBUG");
          }
        }
      });

    },





    /**
     * receives a JSON object that has not been validated.
     * If it is empty, or does not contain the required keys,
     * an error is thrown.
     *
     * If the country returned is not allowed based on the
     * users current locale, an error is thrown.
     *
     * Otherwise, the UI city/state/country is updated
     *
     * @param data a JSON object
     * @param o the zip code input element we're working with
     */
    zipCodeUiUpdate : function(data, o){
      ZR.Base.log("ZR.Checkout.AddressPayment.zipCodeUiUpdate()", null, "DEBUG");

      /** check that obj is a valid json object **/
      if ( typeof data !== 'object' ){
        ZR.Base.log("data sent in is not an object", null, "DEBUG");
        /** TODO throw an error **/
        return false;
      }

      var inputName = o.attr("name");
      var city = data.city;
      var state = data.state;
      var country = data.country;
      var errors = {};
          errors[inputName] = ZR.Settings.alerts.checkout.zipCodeNotValid;

      if ( typeof city === 'undefined' || typeof state === 'undefined' || typeof country === 'undefined' ){
        ZR.Base.log("missing city, state or country from data object", null, "DEBUG");
        o.addClass("invalidPostalCode");
        ZR.Checkout.AddressPayment.throwValidatorError(errors);
        return;
      }

      var canUpdate = false;

      var selectName = o.attr("id").replace("PostalCode","CountrySelect");
      var hiddenName = o.attr("id").replace("PostalCode","Country");
      var countrySelect = jQuery("#"+selectName);
      var hiddenCountry = jQuery("#"+hiddenName);
      if ( countrySelect.length == 0 ){
        ZR.Base.log("No CountrySelect found.. comparing to hidden _country_code input value", null, "DEBUG");
        if (hiddenCountry.val() == country){
          canUpdate = true;
        }
        else {
          ZR.Base.log("Countries do not match: current: " + hiddenCountry.val() + " requested: " + country, null, "DEBUG");
        }
      }
      else {
        ZR.Base.log("CountrySelect found.. checking to see if this country is an option in the select", null, "DEBUG");
        var option = countrySelect.find("option[value='"+country+"']");
        if ( option.length != 0 ) canUpdate = true;
      }


      if ( canUpdate ){
        ZR.Base.log("Country codes matched...Updating UI", null, "DEBUG");
        o.removeClass("invalidPostalCode");
        o.valid();

        var cityName = o.attr("id").replace("PostalCode","City");
        var stateName = o.attr("id").replace("PostalCode","State");
        jQuery("#"+cityName).val(city).trigger("keyup");
        jQuery("#"+stateName).val(state).trigger("keyup");
        hiddenCountry.val(country);
        if( countrySelect.length != 0 ){
          countrySelect.val(country);
        }
        ZR.Checkout.AddressPayment.updateAddressUI(o);
      }
      else {
        o.addClass("invalidPostalCode");
        ZR.Checkout.AddressPayment.throwValidatorError(errors);
      }

    },


    /**
     * billingCityWrapper
     * billingStateSelectWrapper
     * billingPostalCodeNoticeWrapper
     * billingCountryWrapper
     * @param o
     */
    updateAddressUI : function(o){
      /* o = the jQuery Object representing the focused postal code field */
      var type = o.attr("id").replace("PostalCode","");
      var city = jQuery("#" + type + "CityWrapper");
      var state = jQuery("#" + type + "StateSelectWrapper");
      var notice = jQuery("#" + type + "PostalCodeNoticeWrapper");
      var country = jQuery("#" + type + "CountryWrapper");
      var postal = jQuery("#" + type + "PostalCodeWrapper");

      city.removeClass("hide");
      state.removeClass("hide");
      notice.addClass("hide");
      country.removeClass("hide");
      postal.removeClass("half").addClass("quarter");

    },




    throwValidatorError : function(errors){
      ZR.Base.log("ZR.Checkout.AddressPayment.throwValidatorError()", null, "DEBUG");
      if ( errors != null && typeof errors === 'object'){
        var validator = ZR.Checkout.AddressPayment.validator || ZR.Checkout.AddressPayment.validateAddressPayment();
        validator.showErrors( errors );
      }
    }





  },



  /** Functions specific to the Confirm page **/
  Confirm : {


    /**
     * Fires when confirm page loads.  Add any hooks
     * or other items here
     * @param paypal
     */
    init : function( paypal ){

      jQuery("#confirmOrderForm").submit( function(){
        if ( paypal ){
          return ZR.Checkout.Confirm.payPalSubmit();
        }
        else {
					ZR.util.hideButton('completeButton');
          return ZR.Checkout.Confirm.standardSubmit();
        }
      });

    },





    /**
     *  Disables/Enables certain form elements when the paypal
     *  checkout button is clicked.
     */
    payPalSubmit : function(){
      var canContinue = true;
      var error = "";
      if ( ZR.Checkout.Confirm.hasPostOfficeBox( jQuery("#shippingAddress1").val() )
        || ZR.Checkout.Confirm.hasPostOfficeBox( jQuery("#shippingAddress2").val() ) ){
        canContinue = false;
        error = ZR.Settings.alerts.checkout.payPalPOBoxError;
      }
      if ( ZR.Checkout.Confirm.hasMilitaryAddress( jQuery("#shippingCity").val() , jQuery("#shippingPostalCode").val() ) ) {
        error = ZR.Settings.alerts.checkout.payPalMilitaryAddressError;
        canContinue = false;
      }
      if ( ! error.length ) {
        jQuery("#shippingError").remove();
      }
      else if (! jQuery("#shippingError","#shippingWrapper").length ) {
        jQuery("#shippingWrapper").append("<p class='error' id='shippingError'>" + error + "</p>");
      }

      return canContinue;
    },





    /**
     * Just return
     */
    standardSubmit : function(){
      var canContinue = true;
      var error = "";
      if ( ZR.Checkout.Confirm.hasPostOfficeBox( jQuery("#shippingAddress1").val() )
        || ZR.Checkout.Confirm.hasPostOfficeBox( jQuery("#shippingAddress2").val() )
      ){
        canContinue = false;
        error = ZR.Settings.alerts.checkout.payPalPOBoxError;
      }
      if ( ZR.Checkout.Confirm.hasMilitaryAddress( jQuery("#shippingCity").val() , jQuery("#shippingPostalCode").val() ) ) {
        error = ZR.Settings.alerts.checkout.payPalMilitaryAddressError;
        canContinue = false;
      }
      if ( ! error.length ) {
        jQuery("#shippingError").remove();
      }
      else if (! jQuery("#shippingError","#shippingWrapper").length ) {
        jQuery("#shippingWrapper").append("<p class='error' id='shippingError'>" + error + "</p>");
      }
      return canContinue;
    },


    /**
     * In Europe, law dictates that the user must check a checkbox agreeing to Terms and Conditions before
     * allowing the order to submit.
     */
    testReadyForSubmit : function(elementForTesting) {
      var source = jQuery(elementForTesting);
      var form = jQuery('#confirmOrderForm');
      var errorDisplay = jQuery('#confirmButtonError');
      
      if(source.is('button')) {
        if(form.is('[disabled]')) {
          errorDisplay.removeClass('hide');
          jQuery('#clickToSubmit').focus();
          return false;
        } else {
          return true;
        }
      } else {
        if(source.is(':checked')) {
          form.removeAttr('disabled');
          errorDisplay.addClass('hide');
          return true;
        } else {
          form.attr('disabled', 'disabled');
          return false;
        }
      }
    },
    


    /**
     * Checks to see if the address looks like a PO Box
     * @param a
     */
    hasPostOfficeBox : function (a) {
      var tmp = a.replace(/[^\w]/gi, "");
      if (tmp.search(/pobox/i) > -1 || tmp.search(/^po\d/i) > -1 || tmp.search(/^pob\d/i) > -1 || tmp.search(/postoffice/i) > -1) {
        return true;
      }
      return false;
    },





    /**
     * Checks to see if the address looks like an FPO/APO address
     * @param c
     * @param z
     */
    hasMilitaryAddress : function(c, z) {
      var noCheck = "fr_FR,it_IT,es_ES,de_DE,en_UK";
      if ( (ZR.Settings.locale.code.length != 0) && (noCheck.indexOf(ZR.Settings.locale.code) != -1) ){
        return false;
      }
      var tmp = c.replace(/[^A-Za-z0-9]/g, "");
      if (tmp.search(/^[ADF]POjQuery/i) > -1) {
        return true;
      }
      if (c.search(/\s*[ADF]PO\s+/i) > -1) {
        return true;
      }
      var pc = z.replace(/[^0-9]/g, "");
      if (pc.search(/^09|^340|^96[2-6]/) > -1) {
        return true;
      }
      return false;
    }

  },




  /** Functions specific to the Complete page **/
  Complete : {

    init : function(){

      jQuery('#btnviewdetails').click(function(){
        jQuery(this).slideFade();
        jQuery('#completeorderdetails').slideFade();
        return false;
      });

    }

  },


  /** temporary storage for items that change while processing/validating the page **/
  Order : {
    userCCNum : null,
    cleanCCNum : null
  }

};


/**
 * User Script Object
 * Contains functions specific to the User, Login
 * etc.
 */
ZR.User = {

  /** json map of user values **/
  userView : {"loggedin":false},

  /** holds validator objects once created, so they can be reused **/
  loginValidator : null,
  pwRecoveryValidator : null,
  accountValidator : null,
  iframelogin : false,

  SessionCheck: function(form) {
	  return true;
  },


  Authentication : {

    /**
     * Synchronous Login Request
     * Replaces the userView object, and also returns
     * it to the calling function.
     **/
    login : function(u,p){
      jQuery.ajax({
        url : "/login/",
        async : false,
        type : "POST",
        dataType : "json",
        data: {
          username : u,
          password : p
        },
        complete: function(o){
          if ( o.status == 200 || o.statusText == "success" ){
            ZR.User.userView = jQuery.parseJSON(o.responseText);
          }
          else {
            ZR.User.userView = {"loggedin":false,"error":o.statusText};
          }
        }
      });
      return ZR.User.userView;
    }
  }, /** END of Authentication **/




  /**
   * Functions specific to the edit account page
   */
  EditAccount : {

    init : function(){

      ZR.User.validateUserAccount();

      jQuery(":input[idjQuery=PostalCode]").bind("keyup",ZR.User.zipCodeLookup );
      jQuery(".shippingSameAsBilling").bind("click",ZR.User.toggleShippingLayer );

      jQuery("#billingCountrySelect").bind("change", ZR.User.updateBillingCountry );
      jQuery("#shippingCountrySelect").bind("change", ZR.User.updateShippingCountry );

      if (ZR.Settings.locale.code == "en_US"){
        jQuery("#billingPhone").usphone();
        jQuery("#billingPhone").trigger("keyup");
      }
      else if (ZR.Settings.locale.code == "en_AU"){
        jQuery("#billingPhone").auphone();
        jQuery("#billingPhone").trigger("keyup");
      }

      // Handle changes to the newsletter preferences
      jQuery(':input[type="checkbox"]', '#newsletterpreferences').bind('click', ZR.User.updateNewsletterPreferences );
      jQuery('#radio_nosignup', '#newsletterpreferences').bind('click', ZR.User.updateNewsletterPreferences );

      var scrollto = jQuery.getUrlVar('focus');
      if ( typeof scrollto !== 'undefined'){
        var selector = "";
        switch ( scrollto ) {
          case "shipping" :
            selector = "#turnOffShipping";
            if ( jQuery("#turnOffShipping").is(":checked") ) {
              jQuery("#turnOnShipping").trigger("click");
            }
            break;
          case "billing" :
            selector = "#billingFirstName";
            break;
          case "account" :
            selector = "#useremail";
            break;
          case "preferences" :
            selector = "#radio_signup";
            break;
        }
        if ( selector.length ){
          ZR.util.focusAndScrollTo(selector);
        }
      }
      else {
        var firstError = jQuery("label.error:visible:first").prev("input");
        if ( firstError.length != 0 ){
          ZR.util.scrollToObject(firstError);
        }
      }
    }


  }, /** END of EditAccount **/




  /**
   * Functions specific to the create account page
   */
  CreateAccount : {


	  init : function() {

      /**
       * make username & password fields required for create form.
       */
      jQuery("#useremail").addClass("required");
      jQuery("#userPassword").addClass("required");
      jQuery("#confirmUserPassword").addClass("required");

      var validator = ZR.User.validateUserAccount();

      jQuery(":input[idjQuery=PostalCode]").bind("keyup", ZR.User.zipCodeLookup );
      jQuery(".shippingSameAsBilling").bind("click", ZR.User.toggleShippingLayer );
      jQuery("#billingCountrySelect").bind("change", ZR.User.updateBillingCountry );
      jQuery("#shippingCountrySelect").bind("change", ZR.User.updateShippingCountry );

      if (ZR.Settings.locale.code == "en_US"){
        jQuery("#billingPhone").usphone();
        jQuery("#billingPhone").trigger("keyup");
      }
      else if (ZR.Settings.locale.code == "en_AU"){
        jQuery("#billingPhone").auphone();
        jQuery("#billingPhone").trigger("keyup");
      }


	      // Handle changes to the newsletter preferences
      jQuery(':input[type="checkbox"]', '#newsletterpreferences').bind('click', ZR.User.updateNewsletterPreferences );
      jQuery('#radio_nosignup', '#newsletterpreferences').bind('click', ZR.User.updateNewsletterPreferences );
	  }


  }, /** END of CreateAccount **/



  /*********************************************************************
   * Most functions below are shared between the Edit and
   * Create account Pages.
   *********************************************************************/


  /**
   * Captures clicks on the Newsletter preferences form elements.
   * Makes sure the main (yes|no) radios are selected based on
   * the status of any checkboxes.
   * Also updates the hidden field to True|false for any
   * checkboxes that are clicked.
   */
  updateNewsletterPreferences : function(){
    if( jQuery(this).is('#radio_nosignup') ) {
      jQuery(':input[type="checkbox"]', '#newsletterpreferences').removeAttr('checked');
      jQuery(':input[type="hidden"][data-parent^="checkbox"]', '#newsletterpreferences').val("FALSE");
      jQuery('#radio_nosignup', '#newsletterpreferences').attr("checked","checked");
    }
    else if( jQuery(':input[type="checkbox"]', '#newsletterpreferences').is(':checked') ) {
      jQuery('#radio_signup', '#newsletterpreferences').attr("checked","checked");
    }
    if ( jQuery(this).attr("type") == 'checkbox' ){
      jQuery(':input[type="hidden"][data-parent="'+ jQuery(this).attr("id") +'"]', '#newsletterpreferences').val( jQuery(this).is(":checked") ? "TRUE" : "FALSE");
    }

  },


  /**
   * Bind to a field that will be used for zip code lookups
   * and prefill the city/state/country
   *
   * This will require a little bit of intelligence since
   * the country is bound to what exists in the country select (or hidden text field)
   *
   * The simplest solution is to just limit the action to firing
   * only when the current locale is en_US.  If they decide to expand
   * the lookup database to other countries, we will need to change this
   * behavior.
   */
  zipCodeLookup : function(e){
    ZR.Base.log("ZR.User.zipCodeLookup()", null, "DEBUG");

    if (ZR.Settings.locale.code != 'en_US') return;

    var o = jQuery(this);
    var val = o.val();
    var results = null;


    if ( typeof val !== 'undefined' && val.length == 5) {

      var cacheValue = ZR.Cache.zipCodeLookup[val];
      if ( typeof cacheValue !== 'undefined' ){
        results = cacheValue;
      }

      if ( results == null ){

        if ( ZR.Cache.lastZipCode == val ){
          ZR.Base.log("zipcode Looks the same to me, no action required", null, "DEBUG");
        }
        else {
          ZR.Cache.lastZipCode = val;
          ZR.Base.log("Looking Up Results for: " + val, null, "DEBUG");
          ZR.User.zipCodeAjaxCall(val, o);
        }

      }
      else {
        ZR.Base.log(val + " found in cache.", null, "DEBUG");
        ZR.User.zipCodeUiUpdate( results, o );
      }

    }

  },





  /**
   * Makes an Ajax call to lookup the zip code.  Expects
   * a JSON object back.  Stores those results in the Cache
   * with the zipcode as the key.  Passes the result object
   * off to the function to validate it and update the UI
   * @param zip the zip code to lookup
   * @param o the zip code input element we're working with
   */
  zipCodeAjaxCall : function(zip, o){
    ZR.Base.log("ZR.User.zipCodeAjaxCall()", null, "DEBUG");

    if ( document.location.href.indexOf("https") != -1){
      var ajaxURL = ZR.Settings.url.secureHost + "/postalcode-search/"
    }
    else {
      var ajaxURL = window.location.protocol + "//" + window.location.host + "/postalcode-search/"
    }
    jQuery.ajax({
      url : ajaxURL,
      type : "POST",
      dataType : "json",
      data: {
        postalCode : zip
      },
      complete: function(response){
        if ( response.status == 200 || response.statusText == "success" ){
          var data = jQuery.parseJSON(response.responseText);
          ZR.Cache.zipCodeLookup[zip] = data;
          ZR.User.zipCodeUiUpdate( data, o );
        }
        else {
          ZR.Base.log("An Error Occurred on the call: " + response.statusText, null, "DEBUG");
        }
      }
    });

  },




  /**
   * Updates the UI with the appropriate city, state, country
   * that was returned from the zip code lookup.  Also throws
   * an error if the data is invalid
   * @param data
   * @param o
   */
  zipCodeUiUpdate : function( data, o){
    ZR.Base.log("ZR.User.zipCodeUiUpdate()", null, "DEBUG");

    /** check that obj is a valid json object **/
    if ( typeof data !== 'object' ){
      ZR.Base.log("data sent in is not an object", null, "DEBUG");
      /** TODO throw an error **/
      return;
    }

    var inputName = o.attr("name");
    var city = data.city;
    var state = data.state;
    var country = data.country;
    var errors = {};
        errors[inputName] = ZR.Settings.alerts.checkout.zipCodeNotValid;

    if ( typeof city === 'undefined' || typeof state === 'undefined' || typeof country === 'undefined' ){
      ZR.Base.log("missing city, state or country from data object", null, "DEBUG");
      o.addClass("invalidPostalCode");
      ZR.User.throwValidatorError(errors);
      return;
    }

    var canUpdate = false;

    var selectName = o.attr("id").replace("PostalCode","CountrySelect");
    var hiddenName = o.attr("id").replace("PostalCode","Country");
    var countrySelect = jQuery("#"+selectName);
    var hiddenCountry = jQuery("#"+hiddenName);

    if ( countrySelect.length == 0 ){
      ZR.Base.log("No CountrySelect found.. comparing to hidden _country_code input value", null, "DEBUG");
      if (hiddenCountry.val() == country){
        canUpdate = true;
      }
      else {
        ZR.Base.log("Countries do not match: current: " + hiddenCountry.val() + " requested: " + country, null, "DEBUG");
      }
    }
    else {
      ZR.Base.log("CountrySelect found.. checking to see if this country is an option in the select", null, "DEBUG");
      var option = countrySelect.find("option[value='"+country+"']");
      if ( option.length != 0 ) canUpdate = true;
    }


    if ( canUpdate ){
      ZR.Base.log("Country codes matched...Updating UI", null, "DEBUG");
      o.removeClass("invalidPostalCode");
      o.valid();

      var cityName = o.attr("id").replace("PostalCode","City");
      var stateName = o.attr("id").replace("PostalCode","State");
      jQuery("#"+cityName).val(city).trigger("keyup");
      jQuery("#"+stateName).val(state).trigger("keyup");
      hiddenCountry.val(country);
      if( countrySelect.length != 0 ){
        countrySelect.val(country);
      }

      var type = o.attr("id").replace("PostalCode","");
      var cityInputLayer = jQuery("#" + type + "CityInputDiv");
      var cityNoticeLayer = jQuery("#" + type + "CityNoticeDiv");
      var stateCountryLayer = jQuery("#" + type + "StateCountry");

      o.removeClass("invalidPostalCode").removeClass("error");

      cityInputLayer.show();
      cityNoticeLayer.hide();
      stateCountryLayer.show();

    }
    else {
      o.addClass("invalidPostalCode");
      ZR.User.throwValidatorError(errors);
    }


  },




  /**
   * Accepts a map of field names : error message for the form
   * and uses the created validator object to display
   * those errors on the elements.
   * @param errors
   */
  throwValidatorError : function(errors){
    ZR.Base.log("ZR.User.throwValidatorError()", null, "DEBUG");
    if ( errors != null && typeof errors === 'object'){
      var validator = ZR.User.accountValidator || ZR.User.validateUserAccount();
      validator.showErrors( errors );
    }
  },



  /**
   * Primary validator function for the create and edit account
   * forms.
   */
  validateUserAccount : function(){
    ZR.Base.log("ZR.User.validateUserAccount()", null, "DEBUG");

    var validator = jQuery('form[idjQuery="accountform"]').validate({

      rules: {
        "NIXON_USER.PASSWORD" : {
          minlength: 6
        },
        "NIXON_USER.CONFIRM_PASSWORD": {
          equalTo: "#userPassword"
        },
        "NIXON_USER_ADDRESS_BILLING_PHONE_PHONE.NUMBER" : {
          phoneUS : (ZR.Settings.locale.code == "en_US") ? true : false
        },
        "NIXON_USER_ADDRESS_BILLING.POSTAL_CODE" : {
          digits: (ZR.Settings.locale.code == "en_US") ? true : false,
          minlength : (ZR.Settings.locale.code == "en_US") ? 5 : 3,
          validPostalCode : true
        },
        "NIXON_USER_ADDRESS_SHIPPING.POSTAL_CODE" : {
          digits: (ZR.Settings.locale.code == "en_US") ? true : false,
          minlength : (ZR.Settings.locale.code == "en_US") ? 5 : 3,
          validPostalCode : true
        }
      },


      //set groups to validate on to produce one error for two input fields in a line
      groups: {
        billName: "NIXON_USER_ADDRESS_BILLING.FIRST_NAME NIXON_USER_ADDRESS_BILLING.LAST_NAME",
        billZipCity: "NIXON_USER_ADDRESS_BILLING.POSTAL_CODE NIXON_USER_ADDRESS_BILLING.CITY",
        billStateCountry : "NIXON_USER_ADDRESS_BILLING.STATE NIXON_USER_ADDRESS_BILLING.COUNTRY_CODE",
        shipStateCountry : "NIXON_USER_ADDRESS_SHIPPING.STATE NIXON_USER_ADDRESS_SHIPPING.COUNTRY_CODE",
        shipName: "NIXON_USER_ADDRESS_SHIPPING.FIRST_NAME NIXON_USER_ADDRESS_SHIPPING.LAST_NAME",
        shipStateZip: "NIXON_USER_ADDRESS_SHIPPING.POSTAL_CODE NIXON_USER_ADDRESS_SHIPPING.CITY"
      },

      errorPlacement: function(error, element) {
        var elName = element.attr("name");
        var o;
        var isMulti = true;


        if (elName == "NIXON_USER_ADDRESS_BILLING.FIRST_NAME" || elName == "NIXON_USER_ADDRESS_BILLING.LAST_NAME") {
          o = jQuery("#billingLastName");
        }
        else if (elName == "NIXON_USER_ADDRESS_SHIPPING.FIRST_NAME" || elName == "NIXON_USER_ADDRESS_SHIPPING.LAST_NAME") {
          o = jQuery("#shippingLastName");
        }
        else if (elName == "NIXON_USER_ADDRESS_BILLING.POSTAL_CODE" || elName == "NIXON_USER_ADDRESS_BILLING.CITY") {
          o = jQuery("#billingCity");
        }
        else if (elName == "NIXON_USER_ADDRESS_SHIPPING.POSTAL_CODE" || elName == "NIXON_USER_ADDRESS_SHIPPING.CITY") {
          o = jQuery("#shippingCity");
        }
        else if (elName == "NIXON_USER_ADDRESS_SHIPPING.STATE" || elName == "NIXON_USER_ADDRESS_SHIPPING.COUNTRY_CODE") {
          o = jQuery("#shippingCountry");
        }
        else if (elName == "NIXON_USER_ADDRESS_BILLING.STATE" || elName == "NIXON_USER_ADDRESS_BILLING.COUNTRY_CODE") {
          o = jQuery("#billingCountry");
        }
        else {
          o = jQuery(element);
          isMulti = false;
        }

        if (!isMulti) {
          o.parent('.placeholder').prepend(error);
        }
        else {
          o.closest('.inputmulti').prepend(error);
        }
      },
      submitHandler: function(form) {
        ZR.Newsletter.Signup.EditAccountSubmit();
        form.submit();
      }
    });

    ZR.User.accountValidator = validator;
    return validator;

  },





  /**
   * Updates the hidden billingCountry field if the country
   * select element changes. Also updates the list of states
   * available
   */
  updateBillingCountry : function(){
    ZR.Base.countrySetStates( jQuery(this) );
    jQuery("#billingCountry").val( jQuery(this).val() );
  },





  /**
   * Updates the hidden shippingCOuntry field if the country
   * select element changes.  Also updates the list of states
   * available
   */
  updateShippingCountry : function(){
    ZR.Base.countrySetStates( jQuery(this) );
    jQuery("#shippingCountry").val( jQuery(this).val() );
  },




  /**
   *  Captures a click on the radio for setting billing address
   *  the same as shipping address.
   *
   *  Currently, this clears the values of all fields, resets
   *  any errors that may exist on them, then closes the city,
   *  zip, country display to the default (for en_US)
   *
   *  This is the place to change any of that behavior.. If they
   *  decide that they want to copy the billing address in to the
   *  shipping address when the layer is closed, etc.
   */
  toggleShippingLayer : function(){
    var o = jQuery(this);
    var val = o.val();
    var layer = jQuery("#shippingAddress");

    if (val == 'FALSE'){
      ZR.User.clearShippingFields();
      ZR.User.resetShippingErrors();
      ZR.User.resetShippingCityDisplay();
      layer.show();
    }
    else if (val == 'TRUE'){
      layer.hide();
    }
  },




  /**
   * Shows/Hides appropriate layers when fired
   */
  resetShippingCityDisplay : function(){
    if (ZR.Settings.locale.code != "en_US") return false;
    jQuery("#shippingCityInputDiv").hide();
    jQuery("#shippingCityNoticeDiv").show();
    jQuery("#shippingStateCountry").hide();
  },




  /**
   * removes all label.errors from the container,
   * removes any error classes off the input elements.
   */
  resetShippingErrors : function(){
    var wrapper = jQuery("#shippingAddress");
    var labels = wrapper.find("label.error");
    var fields = wrapper.find(":input[type!='hidden']")
      .filter(function(){ return typeof jQuery(this).attr('readonly') == 'undefined' });

    fields.each(function(){
      jQuery(this).removeClass("error").removeClass("invalidPostalCode");
    });

    labels.each(function(){
      jQuery(this).remove();
    });

    ZR.User.accountValidator.valid();
  },





  /**
   * Clears out the shipping field values.  Sets all inputs
   * that are not hidden to null, and sets the selectedIndex
   * of any select elements back to 0
   */
  clearShippingFields : function(){
    var wrapper = jQuery("#shippingAddress");
    var fields = wrapper.find(":input[type!='hidden']")
      .filter(function(){ return typeof jQuery(this).attr('readonly') == 'undefined' });

    fields.each(function(){
      var o = jQuery(this);
      var type = o[0].nodeName.toLowerCase();
      if ( type === 'select' ){
        o[0].selectedIndex = 0;
      }
      else if ( type === 'input' ){
        o.val('');
      }
      o.trigger('keyup');
    });

  },



  initLoginLink : function(){
     
    /**
     * Creates the signin popup and defines
     * some cleanup actions on close
     */
		 
		var height = 405,
		    signInBox = jQuery(".signinbox");
		if (jQuery('body').hasClass('fr_FR')){
			height = 480;	
		}
		if(signInBox.length > 0){ 
  		signInBox.fancybox({
        fitToView	: false,
        autoSize	: true,
        width : 360,
        height : height,
        scrolling : "no",
        afterClose : function(){
          document.location.reload();
        }
      });
		}

  },



  initLoginForm : function(iframe,ssl){
    iframelogin = false;
    if ( iframe === true ){
      iframelogin = iframe;
    }
    /**
     * Hook all the buttons and actions in the signup form
     */
    if(iframelogin == true) {
      jQuery("#createaccountbutton").click(ZR.User.ajaxLoginCreateAccount);
    } 
    else {
      jQuery("#createaccountbutton").click(function(){
        window.location = ZR.Settings.url.secureHost + '/account/create-account/';
      });
    }
    
   /* jQuery("#loginlightbox #createaccountbutton").click(function(){
      window.location = '/account/create-account/';
    });*/
    jQuery("#forgotPassword").click(ZR.User.togglePasswdRecoveryForm);
    jQuery("#cancelpasswdreq").click(ZR.User.togglePasswdRecoveryForm);
    jQuery("#formforgotpw").submit(function(){return false;});
    jQuery("#loginform").submit(function(){return false;});

    /**
     * Loads the two validators for the forms
     */
    ZR.User.iframelogin = iframelogin;
    ZR.User.validatePasswordRecovery();
    ZR.User.validateSignin();
  },



  useEditPostLogin : function(){
    document.location.href = history.back(-1);
  },



  /**
   * The login validation is created on page load without any specific handling.
   * If you want a callback function to run when login is successful, instead
   * of simply loading the page.  Call this function and pass in the
   * valid callback function.
   *
   * example:
   *
   *   ZR.User.overrideLogin : function(){
   *     ZR.User.addLoginCallback(ZR.User.test);
   *     jQuery(".signinbox").trigger("click");
   *   }
   *
   * You would call the ZR.User.overrideLogin function when your link, button, action
   * is triggered
   *
   * Triggering the .signinbox link will load the signin lightbox.  If
   * the login is successful, the ZR.User.test function would then be
   * called
   *
   *
   * @param callback
   */
  addLoginCallback : function(callback){
    jQuery('#loginform').removeData('validator').unbind("submit");
    ZR.User.validateSignin(callback);
  },



  cartLoginSubmit : function(e){
    e.preventDefault();
    var username = jQuery.trim( jQuery(this).find('#username').val() );
    var password = jQuery.trim( jQuery(this).find('#password').val() );
    ZR.util.hideButton('formloginbtn');

    var loginResponse = ZR.User.Authentication.login(username,password);

    ZR.util.enableButton('formloginbtn');
  },




  /**
   * Submits the ajax login request and
   * handles the response. If valid, either
   * reloads the current page, or calls the
   * callback function
   * @param form
   */
  ajaxLoginSubmit : function(form, callback){
    ZR.Base.log("ZR.User.ajaxLoginSubmit()", null, "DEBUG");
    var url = form.attr("action");
    var returnTo = form.find(":input[name='returnTo']");
    var data = form.serialize();
    var emailField = form.find('#username');
    var emailName = emailField.attr("name");
    var errors = {};

    ZR.util.hideButton('formloginbtn');
    jQuery.getJSON(
      url + "&" + data + "&callback=?",
      function(response){
        if ( response.loggedin ){
          // GA Event
          _gaq.push(['_setCustomVar', 1, 'Logged In User', 'Yes', 2]);
          
          /** mobile single page addition **/
          if ( returnTo.length != 0 && jQuery.trim( returnTo.val() ).length != 0 ){
            document.location.href = returnTo.val();
          }
          else {

          var urlData = ZR.User.getAjaxCBOData();
          var loadUrl = urlData.baseUrl + "/za/NXN/ajax/proxy.jsp?section=reloadLoginSuccess";
          var iframe = jQuery("<iframe style='height:1px;width:1px;postion:absolute;left:-1000px;' frameborder='0' scrolling='no' src='"+loadUrl+"' hspace='0'/>");
          jQuery("body#loginlightbox").append(iframe);

          }



//          if ( typeof callback !== 'undefined' ){
//            jQuery(".fancybox-close").trigger("click");
//            var f = eval(callback);
//            f(response);
//          }
//          else {
//						//document.location.reload();
//          }
        }
        else {
          errors[emailName] = ZR.Settings.alerts.signin[response.error];
          ZR.User.userView = {"loggedin":false,"error":ZR.Settings.alerts.signin[response.error]};
          ZR.User.throwError(ZR.User.loginValidator, errors);
        }
      }
    )


    if(! ZR.Base.isEmpty(errors) ){
      ZR.User.throwError(ZR.User.loginValidator, errors);
    }
      ZR.util.enableButton('formloginbtn');

  },




  getAjaxCBOData : function(){
    var data = {};
    var url = location.href;
    var isSecure = (location.protocol.indexOf("https") != -1);
    var page = location.href;
    var path = location.pathname;
    if ( path.length > 1) {
      var server = page.replace(path, "");
    }
    else {
      var server = page;
    }

    if ( url.indexOf("?s=false") != -1 ){
      server = server.replace("https://", "http://").replace("?s=false", "");
    }
    else {
      server = server.replace("http://", "https://").replace("?s=true", "");
    }
    data.baseUrl = server;
    return data;
  },




  /**
   * If the create account button is clicked,
   * relocate to the form page
   * @param e
   */
  ajaxLoginCreateAccount : function(e){
    ZR.Base.log("ZR.User.ajaxLoginCreateAccount()", null, "DEBUG");
    ZR.util.hideButton('createaccountbutton');
    var urlData = ZR.User.getAjaxCBOData();
    var loadUrl = urlData.baseUrl + "/za/NXN/ajax/proxy.jsp?section=loadCreateAccount";
    var iframe = jQuery("<iframe style='height:1px;width:1px;postion:absolute;left:-1000px;' frameborder='0' scrolling='no' src='"+loadUrl+"' hspace='0'/>");
    jQuery("body#loginlightbox").append(iframe);
  },



  loadCreateAccount : function(){
    document.location.href = ZR.Settings.url.secureHost + '/account/create-account/';
  },





  /**
   * Toggles back and forth between the login form
   * and the password recovery form.
   * @param e
   */
  togglePasswdRecoveryForm : function(e){
    ZR.Base.log("ZR.User.togglePasswdRecoveryForm()", null, "DEBUG");
    jQuery("#signin").slideFade();
    jQuery("#retrievepassword").slideFade();
  },





  /**
   * After a successful password recovery submit,
   * this fires to clean up the login form, toggles
   * it back open, and then presents the user
   * with a notification that their password was sent
   */
  clearLoginAfterPasswordReset : function(){
    ZR.Base.log("ZR.User.clearLoginAfterPasswordReset()", null, "DEBUG");

    jQuery('#username', '#loginform').val( jQuery('#forgotemail', '#formforgotpw').val() );
    ZR.User.loginValidator.element('#username');

    jQuery('#password', '#loginform').val('');

    var errors = {};
    var nameField = jQuery('#username', '#loginform').attr('name');
    errors[nameField] = ZR.Settings.alerts.signin.checkemail;

    ZR.User.throwError(ZR.User.loginValidator, errors);
    ZR.User.togglePasswdRecoveryForm();
  },





  /**
   * Handles the ajax password recovery form submit,
   * if the request is successful, it fires
   * the function to reload the login form, otherwise
   * just presents an error
   * @param form
   */
  ajaxForgotPasswdSubmit : function(form){
    ZR.Base.log("ZR.User.ajaxForgotPasswdSubmit()", null, "DEBUG");
    var url = form.attr("action");
    var data = form.serialize();
    var emailField = form.find('#forgotemail');
    var email = jQuery.trim( emailField.val() );
    var emailName = emailField.attr("name");
    var errors = {};

    ZR.util.hideButton('sendemailbtn');

    jQuery.ajax({
      url : url,
      async : false,
      type : "POST",
      dataType : "json",
      data: data,
      complete: function(o){
        if ( o.status == 200 || o.statusText == "success" ){
          var response =  jQuery.parseJSON(o.responseText);
          if ( response.status != 'email_sent' ){
            errors[emailName] = ZR.Settings.alerts.signin[response.status];
          }
          else {
            ZR.User.clearLoginAfterPasswordReset();
          }
        }
        else {
          errors[emailName] = ZR.Settings.alerts.signin.error;
        }
      },
      error : function(o){
        errors[emailName] = ZR.Settings.alerts.signin.error;
      }
    });

    if(! ZR.Base.isEmpty(errors) ){
      ZR.User.throwError(ZR.User.pwRecoveryValidator, errors);
    }
    ZR.util.enableButton('sendemailbtn');
  },





  /**
   * Creates the validator object for the password recovery
   * form and sets it in the ZR.User object for use
   * by other functions.
   */
  validatePasswordRecovery: function() {
    ZR.Base.log("ZR.User.validatePasswordRecovery()", null, "DEBUG");

    var validator = jQuery('#formforgotpw').validate({
      submitHandler: function(form) {
        ZR.User.ajaxForgotPasswdSubmit( jQuery(form) );
        return false;
      }
    });

    ZR.User.pwRecoveryValidator = validator;

  },




  /**
   * Creates the validator object for the login
   * form and sets it in the ZR.User object for use
   * by other functions.
   */
  validateSignin: function(callback) {
    ZR.Base.log("ZR.User.validateSignin()", null, "DEBUG");

    var validator = jQuery('#loginform').validate({
      submitHandler: function(form) {
        ZR.User.ajaxLoginSubmit( jQuery(form), callback );
        return false;
      }
    });

    ZR.User.loginValidator = validator;

  },





  /**
   * Generic function that will set errors on elements
   * in the form.  Requires the ZR.User.[validator] object
   * to use, as well as the map of errors to throw
   * {inputname : errortext}
   * @param validator
   * @param errors
   */
  throwError : function(validator, errors){
    ZR.Base.log("ZR.User.throwError()", null, "DEBUG");
    if ( errors != null && typeof errors === 'object'){
      validator.showErrors( errors );
    }
  }

};




ZR.Wishlist = {

  /**
   * loads page specific bindings
   */
  init : function(){
    ZR.Base.log("ZR.Wishlist.init()", null, "DEBUG");
    jQuery("#addAllToCartButton").on("click", ZR.Wishlist.addAllItemsToCart);
    jQuery("#primarycontent").on("click", "a[id^='notifyme']", ZR.Wishlist.showNotifyMe);
    jQuery("#shareNowButton").on("click", ZR.Wishlist.shareWishList)

  },


  /**
   * Handles the button click event.  Loops through all
   * add buttons on the page, and fires them in a background
   * ajax request.  When all are complete, redirects to
   * the cart page.
   *
   * @param e the button clicked
   */
  addAllItemsToCart : function(e) {
    ZR.Base.log("ZR.Wishlist.addAllItemsToCart()", null, "DEBUG");

    var items = jQuery(".addtocartlink:visible");

    ZR.util.hideButton( jQuery(this).attr("id") );

    items.each(function(){
      var btn = jQuery(this);
      ZR.Wishlist.ajaxAddToCart(btn);
    });


    var canContinue = setInterval(function(){
      if ( (moveon = ZR.Wishlist.validateAddToCart()) ){
        clearInterval(canContinue);
        document.location.href = ZR.Settings.url.host + "/cart/"
      }
    },100);

  },



  /**
   * calls the actual URL to add the sku to the cart
   * @param btn the clicked button, which holds the URL
   * for the add to cart
   */
  ajaxAddToCart : function(btn){
    ZR.Base.log("ZR.Wishlist.ajaxAddToCart()", null, "DEBUG");

    var url = btn.attr("href");
    btn.data("adding-to-cart", true);

    jQuery.ajax({
      url : url,
      type : "GET",
      dataType : "html",
      success: function(data){
			  btn.removeData("adding-to-cart");
      },
      error : function(response){
        //TODO handle error? or just reset
        btn.removeData("adding-to-cart");
      }
    });

  },


  /**
   * Validates the add to cart function by looping over
   * each button clicked to see if it has returned yet.  A
   * data element is placed on the button when fired, and
   * removed when the call returns.
   */
  validateAddToCart : function(){
    ZR.Base.log("ZR.Wishlist.validateAddToCart()", null, "DEBUG");

    var items = jQuery(".addtocartlink:visible");
    var addComplete = true;

    items.each(function(){
      if( typeof jQuery(this).data("adding-to-cart") !== 'undefined'){
        addComplete = false;
      }
    });
    return addComplete;
  },


  showNotifyMe : function(e){
    e.preventDefault();
    //return; /* not implemented yet */
    var button = jQuery(this);
    var wrapper = button.parents("div.wishlistitem");
    var form = wrapper.find("div[id^='productnotify']");

    if ( form.length != 0 ) {
      form.slideFade(function(){
        if ( form.is(":visible") ){
          button.html(button.attr("data-cancel")).addClass("cancelmode");
        }
        else {
          button.html(button.attr("data-notify")).removeClass("cancelmode");
        }
      });
      return;
    };

    jQuery.ajax({
      url: button.attr('href'),
      type: "GET",
      cache: false,
      success: function(data, textStatus, jqXHR){
        button.html(button.attr("data-cancel")).addClass("cancelmode");
        wrapper.append(data);
        ZR.util.ajaxPlaceholder.apply( jQuery(wrapper) );
        wrapper.find(".notifymeform button").on("click",ZR.Wishlist.notifyMe);
      }
    });
  },



  notifyMe : function(e){
    e.preventDefault();
    var button = jQuery(this);
    var form = button.parents("form.notifymeform");
    var input = form.find("input.notifyemailfield");
    var email = jQuery.trim(input.val());

    if ( ! ZR.Base.isValidEmail(email) ){

      input.addClass("error");
      input.off("keyup.checkemail").on("keyup.checkemail", function(){
        if ( ZR.Base.isValidEmail( jQuery.trim(input.val()) ) ){
          jQuery(this).removeClass("error");
        }
        else {
          jQuery(this).addClass("error");
        }
      });

    }
    else {

      input.removeClass("error");

      jQuery.ajax({
        url : ZR.Settings.url.servlet,
        type : "POST",
        dataType : "json",
        data: form.serialize(),
        success: function(data){
          var message = "";
          if ( typeof data === 'object' && data.SUCCESS == true ){
            message = "<div class='wishlistresponse'><em>" + ZR.Settings.alerts.product.wishlist.success + "</em></div>";
          } else {
            ZR.Base.log("jQuery.ajax.success() : response is not an object", null, "ERROR");
            message = "<div class='wishlistresponse'><em class='red'>" + ZR.Settings.alerts.product.wishlist.failure + "</em></div>";
          }
          ZR.Wishlist.replaceContents( form ,message);
          setTimeout(ZR.Wishlist.closeNotification, 5000);
        },
        error : function(response){
          message = "<div class='wishlistresponse'><em class='red'>" + ZR.Settings.alerts.product.wishlist.failure + "</em></div>";
          ZR.Wishlist.replaceContents( form ,message);
          setTimeout(ZR.Wishlist.closeNotification, 5000);
        }
      });
      /** track notify me click **/
      _gaq.push(['_trackEvent', "notify_me", "click", "form_submit"]);
      form.parents("div.wishlistitem").find("a[class^='notifyme']").each(function(){
        jQuery(this).html(jQuery(this).attr("data-notify")).removeClass("cancelmode");
      });

    }

  },

  replaceContents : function(o,c){
    if ( jQuery(o).length != 0 ){
      jQuery(o).html(c);
    }
  },

  closeNotification : function(){
    jQuery('div.wishlistresponse:visible').slideFade();
  },

  shareWishList : function(){

    var button = jQuery(this);

    var tolist = jQuery.trim( jQuery("#wishlistEmailTo").val() );
    var toArray = tolist.split(",");

    if ( toArray.length == 0 ){
      jQuery("#wishlistEmailTo").addClass("error");
      return;
    }
    else {
      jQuery("#wishlistEmailTo").removeClass("error");
    }

    var emailString = "";
    var finalEmailArray = [];

    for ( i = 0; i < toArray.length; i++){
      var email = jQuery.trim(toArray[i]);
      if ( ZR.Base.isValidEmail(email) ){
        finalEmailArray.push(email);
      }
    }


    if ( finalEmailArray.length == 0 ){
      jQuery("#wishlistEmailTo").addClass("error");
      return;
    }
    else {
      jQuery("#wishlistEmailTo").removeClass("error");
    }


//    parms += "&friendsemail=" + email;
//    parms += "&sharecomment=" + comments;
//    parms += "&wishlistid="   + wishlistid;

    var shareComment = jQuery("#wishlistMessage").val();
    var wishListId = jQuery("#wishListId").val();


    jQuery("#sendFailures").remove();

    ZR.Wishlist.shareQueue = [];
    ZR.Wishlist.errorQueue = [];

    ZR.util.hideButton('shareNowButton');
    for ( x = 0; x < finalEmailArray.length; x++ ){

      var eml = finalEmailArray[x];

      ZR.Wishlist.shareQueue.push(finalEmailArray[x]);

      if ( document.location.href.indexOf("https") != -1){
        var hostUrl = ZR.Settings.url.secureServlet;
      }
      else {
        var hostUrl = ZR.Settings.url.servlet;
      }

      jQuery.ajax({
        url: hostUrl + "/includes/send-shared-wishlist-email.jsp",
        cache: false,
        objEmail : eml,
        data: {
          friendsemail : finalEmailArray[x],
          sharecomment : shareComment,
          wishlistid : wishListId
        },
        success : function(data){

          if ( data.indexOf("A System Error Has Occurred") != -1 ){
            ZR.Wishlist.errorQueue.push(this.objEmail);
          }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
          /** something happened **/
        },
        complete: function(XMLHttpRequest, textStatus){
          for( q = 0; q < ZR.Wishlist.shareQueue.length; q++ ){
            if ( ZR.Wishlist.shareQueue[q] == this.objEmail ){
              ZR.Wishlist.shareQueue.splice(q,1);
            }
          }

          if ( ZR.Wishlist.shareQueue.length == 0 ){

            if ( ZR.Wishlist.errorQueue.length == 0 ){
              jQuery("#shareNowButton").html("List Shared Successfully");
            }
            else {
              jQuery("#shareNowButton").html("List Sharing Complete");
              var failed = ZR.Wishlist.errorQueue.join(",");
              jQuery("#shareNowButton").parents("div.placeholder").after("<div class='placeholder' id='sendFailures' style='margin-top:15px;' ><div class='error'>Failed sending to: " + failed + "</div></div>");
            }


            setTimeout( function() {
              ZR.util.enableButton('shareNowButton');
              jQuery("#wishlistEmailTo").val('');
              jQuery("#wishlistMessage").val('');
            }, 3000);
          }
        }
      });
    }




  },

  shareQueue : [],
  errorQueue : []



};



ZR.category = {

  eliteBanner : null,
  defaultResults : null,
	isFiltering : false,

	init: function(){
		ZR.category.thumbSize();
		ZR.category.swatches();
		ZR.category.prevNext.set();
		ZR.category.filters();
		ZR.category.viewMore();
    ZR.category.storeNavigationData();
    ZR.util.autoLoadResults("viewmorenav","viewmorebutton",100);

    jQuery(".sortsearch").click(ZR.category.sortProducts);
    jQuery(".resetproducts").click(ZR.category.resetProducts);

    ZR.category.defaultResults = jQuery("#searchthumbs").html();


/**    if ( jQuery(":input[type='checkbox']:checked", "#catfilterform").length != 0 ){
      ZR.category.submitSearchQuery();
    }
**/

	},


  /**
   * Loops over existing product nodes on the page and
   * stores their primary data in a local object that is
   * accessible on subsequent pages.
   *
   * Used for prev > next buttons
   */
  storeNavigationData : function(){
    var products = jQuery(".catthumb", "#searchthumbs");
    if ( products.length == 0 ) return;

    var pA = [];

    products.each(function(){
      var el = jQuery(this);
      var itm = {};

      itm.prodrefid = el.attr("data-refid");
      var anchor = el.find("h4 a");
      if ( anchor.length != 0 ){
        itm.name = anchor.text();
        itm.url = anchor.attr("href");
      }

    });


  },



	thumbSize: function(){
		var screenWidth = screen.width;
//		console.log('screen width: ' + screen.width);
//		console.log('cookie: ' + jQuery.cookie('thumbSize'));
		
		if(screenWidth < 640 && jQuery.cookie('thumbSize') == null) {
			//jQuery.cookie('thumb
			jQuery.cookie('thumbSize','large');
			jQuery('#searchthumbs').addClass('largethumbs');
			jQuery('#searchthumbs').removeClass('smallthumbs');
			jQuery('#caticonlarge').addClass('active');
			jQuery('#caticonsmall').removeClass('active');
		}
		
		jQuery('.caticonlink').click(function(){
			if(!jQuery(this).hasClass('active')) {
				jQuery('.caticonlink').toggleClass('active');
				var thumbSize = this.rel;
				jQuery.cookie('thumbSize', thumbSize, { expires: 7 });
				if(thumbSize == 'large') {
					jQuery('#searchthumbs').addClass('largethumbs');
					jQuery('#searchthumbs').removeClass('smallthumbs');
				}
				else {
					jQuery('#searchthumbs').removeClass('largethumbs');
					jQuery('#searchthumbs').addClass('smallthumbs');
				}
			}
			return false;
		});
	},
	prevNext : {
		refid: '', // values to be set with Local Storage
		colorCode: '',
		prodURL: '',
		prodName: '',
		
		/*--------------------------------------------
		
			Sets all the data to local storage of all 
			visible Products in a collection
		
		---------------------------------------------*/
		
		set: function(){
			try {
  		  ZR.category.prevNext.refid = '';
  			ZR.category.prevNext.colorCode = '';
  			ZR.category.prevNext.prodURL = '';
  			ZR.category.prevNext.prodName = '';
  			
  			jQuery('.catthumbimglink').each(function(n){
  				var childImg = jQuery(this).children('.catthumbimg');
  				var imgSrc = childImg.attr('src');
  				var imgSrcArr = imgSrc.split('/');
  				var imgName = imgSrcArr.pop();
  				var imgNameArr = imgName.split('-');
  				var prodRef = imgNameArr[0];
  				var prodColor = imgNameArr[1];
  				
  				ZR.category.prevNext.refid = ZR.category.prevNext.refid + prodRef + '|';
  				ZR.category.prevNext.colorCode = ZR.category.prevNext.colorCode + prodColor + '|';
  				ZR.category.prevNext.prodURL = ZR.category.prevNext.prodURL + this.href + '|';
  				ZR.category.prevNext.prodName = ZR.category.prevNext.prodName + childImg.attr('alt') + '|';
  				if((n+1) == jQuery('.catthumbimglink').length) {
  					localStorage['catRefid'] = ZR.category.prevNext.refid;
  					localStorage['catColorCode'] = ZR.category.prevNext.colorCode;
  					localStorage['catProdURL'] = ZR.category.prevNext.prodURL;
  					localStorage['catProName'] = ZR.category.prevNext.prodName;
  				}
  			});	
			}
			catch (err){
			  //do nothing because the page will still work
			}
				
			
		},
		
		/*--------------------------------------------
		
			Gets all the data for previous/next that 
			is set on localStorage
		
		---------------------------------------------*/
		get: function(){
		  try{
  			//get all the values and split them into an array.
  			var refidStr = localStorage['catRefid'];
  			if(refidStr){
  			
  				var refidArr = refidStr.split('|'),
  						colorCodeStr = localStorage['catColorCode'],
  						colorCodeArr = colorCodeStr.split('|'),
  						prodURLStr = localStorage['catProdURL'],
  						prodURLArr = prodURLStr.split('|'),
  						prodNameStr = localStorage['catProName'],
  						prodNameArr = prodNameStr.split('|');
  					
  				jQuery.each(refidArr, function(n, val){
  					if(val == ZR.product.refid) {
  						var prevIdx = n - 1;
  						var nextIdx = n + 1;
  						if(n > 0){
  							ZR.category.prevNext.showArrows(refidArr[prevIdx], colorCodeArr[prevIdx], prodURLArr[prevIdx], prodNameArr[prevIdx], 'prev');
  						}
  						if((n + 2) < refidArr.length)
  							ZR.category.prevNext.showArrows(refidArr[nextIdx], colorCodeArr[nextIdx], prodURLArr[nextIdx], prodNameArr[nextIdx], 'next');
  						}
  				});
  			}
		  }
		  catch (err){
        //do nothing because the page will still work
      }
		},
		
		/*--------------------------------------------
		
			Writes the Arrows to the Product detail Page
		
		---------------------------------------------*/
		
		showArrows: function(refid,color,url,title,dir){

			var linkHTML = '<a href="' + url + '" class="arrowlink" id="arrow' + dir + '">',
					arrowImg = '<img src="/images/common/blank.gif" class="arrowimg" />',
					prodImg = '<span class="arrowimgbox"><img src="' + ZR.product.prodImageURL + '/selection/' + refid + '-' + color + '-view1.png" class="arrowprodimg" alt="' + title + '" title="' + title + '"></span>',
					prodTitle = '<span class="arrowlinklabel">' + title + '</span>'
					linkHTMLClose = '</a>';
					
			if(dir == 'prev') {
				var arrowHTML = linkHTML + arrowImg + prodImg + prodTitle + linkHTMLClose;
			}
			else {
				var arrowHTML = linkHTML + prodTitle + prodImg + arrowImg + linkHTMLClose;
			}
			jQuery('body').append(arrowHTML);
		}
	},
	
	
	
	hideElite: function(){
		jQuery('#catfilterform input[type=checkbox], .sortsearch').on("click.eliteslide", function(){
			jQuery('#categoryelite').slideFade(500,function(){
        ZR.category.eliteBanner = jQuery(this);
        jQuery(this).remove();
      });
		});
	},


  showElite: function(){
    jQuery("#caticons").before(ZR.category.eliteBanner);
    jQuery('#categoryelite').slideFade(500,function(){
      ZR.panels.zelSlide.init(jQuery("#zelicatslideshow"));
    });
  },



	/*---------------------------------------------------
		Function that activates/shows/hides the swatches
		and the correstponding thumbnail
	-----------------------------------------------------*/
	swatches: function(){
		var loadingHTML = '<span class="loading"></span>';

		/*-------------------------------------
			Show the swatches
		---------------------------------------*/
		jQuery('.catthumbswatchbox').live('click',function(){
			var parentThumb = jQuery(this).closest('.catthumb');
			var boxDiv = jQuery(this);
			parentThumb.addClass('swatchactive');
			jQuery(this).children('.catswatchview').fadeOut(200,function(el){
				var catThumbSwatch = boxDiv.find('.catthumbswatch');
				/*catThumbSwatch.css('opacity','0');*/
				catThumbSwatch.css('display','block');
				/*boxDiv.children('.active').css('display','block');*/
				/*boxDiv.find('.catthumbswatch:not(.active)').fadeIn(300);*/
			});
			return false;
		});

		/*-------------------------------------
			Hide the swatches
		---------------------------------------*/
		jQuery('.catthumbdetails').live('mouseleave',function(){
			var childViewLink = jQuery(this).find('.catswatchview'),
					swatchesToHide = jQuery(this).find('.catthumbswatch:not(.active)');
					parentThumb = jQuery(this).closest('.catthumb');
			if(!childViewLink.is(':visible')){
				jQuery(swatchesToHide).fadeOut(200,function(){
					childViewLink.fadeIn(150);
					parentThumb.removeClass('swatchactive');
				});
			}
		});

		/*-------------------------------------
			Click a swatch and load the thumb
		---------------------------------------*/
		jQuery('.catthumbswatch').live('click',function(){
			if(!jQuery(this).hasClass('active')) {
				var refid = jQuery(this).attr('data-refid'),
            uid = jQuery(this).attr('data-uniqueid'),
						colorid = jQuery(this).attr('data-color'),
						skuid = jQuery(this).attr('data-skurefid'),
						gender = jQuery(this).attr('data-gender'),
            pagegender = jQuery(this).attr('data-pagegender'),
						catThumbImg = jQuery('#catthumbimg' + uid),
						imageURL = catThumbImg.attr('src'),
            skuUrl = jQuery(this).attr('data-url');

				var imageURLArr = imageURL.split('/');
						imageURLArr.pop();
				var imagePath = imageURLArr.join('/');

				imagePath = imagePath + '/' + refid + '-' + colorid + '-view1.jpg';

        jQuery(this).siblings('.active').removeClass('active');
        jQuery(this).addClass('active');
        jQuery('#catthumbimglink' + uid).prepend(loadingHTML);

          var thumbImg = new Image();
          jQuery(thumbImg).load(function() {
            jQuery('.loading','#catthumbimglink' + uid).remove();
            catThumbImg.attr('src',imagePath);
            var href = jQuery('#catthumbimglink' + uid).attr("href");
            var clean = href.substr(0, href.lastIndexOf('?'));
            if ( clean.length == 0 ) clean = href;

            if ( typeof gender !== 'undefined' && typeof pagegender !== 'undefined' ){
              if ( gender == 'womens' ){
                if ( clean.indexOf(/\/womens\//) == -1){
                  clean = clean.replace(/\/mens\//,"/womens/")
                }
              }
              else if ( gender == 'mens' ){
                if ( clean.indexOf(/\/mens\//) == -1){
                  clean = clean.replace(/\/womens\//,"/mens/")
                }
              }
            }

            if ( typeof skuUrl !== 'undefined' ){
              jQuery('#catthumbimglink' + uid).attr("href",skuUrl);
            }
            else if ( typeof skuid !== 'undefined' ){
              jQuery('#catthumbimglink' + uid).attr("href",clean + "?sku=" + skuid);
            }
            else if ( typeof colorid !== 'undefined' ){
              jQuery('#catthumbimglink' + uid).attr("href",clean + "?COLORID=" + colorid);
            }
            else {
              jQuery('#catthumbimglink' + uid).attr("href",clean);
            }

          }).attr('src',imagePath).error(function(){
            alert('There was an error loading the thumbnail ' + imagePath);
        });
      }
		});



    jQuery('#searchthumbs').on('mouseover','.catthumbswatch',function(){
      var link = jQuery(this).parents(".catthumbswatchbox").find('a.catswatchview');
      link.addClass("underlined");
    });

    jQuery('#searchthumbs').on('mouseout','.catthumbswatch',function(){
      var link = jQuery(this).parents(".catthumbswatchbox").find('a.catswatchview');
      link.removeClass("underlined");
    });




	},

  searchRequest : function(){
		ZR.category.isFiltering = true;
    jQuery('#filterselected .radiolabel').remove();
    jQuery("#catfilterform input[type=checkbox]:checked").each(function(){

    	jQuery(this).closest('.radiolabel').clone().appendTo('#filterselected');
      jQuery('#filtersclear').appendTo('#filterselected');
    });

    ZR.category.submitSearchQuery();

  },


  generateFormData : function(){
    var fqCheckFields = jQuery('#catfilterform input[name^=fq_]:checked');
    var fqHiddenFields = jQuery('#catfilterform input[name^=fq_][type=hidden]');
    var plainFields = jQuery('#catfilterform input:not([name^=fq_])');
    var qryString = plainFields.serialize();
    var addFields = {};

    /** add hidden fields to structure **/
    fqHiddenFields.each(function(){
      var qryType = jQuery(this).attr("data-querytype");
      var facet = jQuery(this).attr("name").replace("fq_", "");
      var val = jQuery(this).val();
      if ( val.match(/\s/g) && facet.toLowerCase() != 'price' ){
        val = "\"" + encodeURIComponent(val) + "\"";
      }
      else {
        val = encodeURIComponent(val);
      }
      addFields[facet] = facet + ":" + val;
    });

    /** add checkboxes to structure. **/
    fqCheckFields.each(function(){
      var qryType = jQuery(this).attr("data-querytype");
      var facet = jQuery(this).attr("name").replace("fq_", "");
      var currentVal = addFields[facet] || "";
      if (currentVal.length != 0) currentVal += "+OR+";
      var val = jQuery(this).val();
      if ( val.match(/\s/g) && facet.toLowerCase() != 'price' ){
        val = "\"" + encodeURIComponent(val) + "\"";
      }
      else {
        val = encodeURIComponent(val);
      }
      addFields[facet] = currentVal + facet + ":" + val;
    });

    for ( var hf in addFields){
      var field = "facet.field={!ex="+hf+"}" + hf;
      var query = addFields[hf];
      qryString += "&" + field + "&" + "fq={!tag=" + hf + "}" + query
    }

    return qryString;
  },

  submitSearchQuery : function(force){
    var formdata = ZR.category.generateFormData();
    var sortVal = jQuery('#catfilterform #sort').val();
    var activeSort = jQuery('.sortsearch.active');
    var forceRefresh = (typeof force != 'undefined') ? force : false;

    var checkedBoxes = jQuery("#catfilterform :input[type='checkbox']:checked");
//    var showNewItems = ( jQuery('#catfilterform').find("#fqNewInput").length != 0 );

    if ( checkedBoxes.length != 0 || forceRefresh ){

      /** make sure the correct links is shown active, in case we came back from a history.back **/
      if ( activeSort.attr('data-sort') != sortVal ){
        jQuery(".sortsearch").removeClass('active');
        jQuery(".sortsearch[data-sort='"+sortVal+"']").addClass("active");
      }

      jQuery.ajax({
        url : "/search/load-results/",
        type : "POST",
        dataType : "html",
        data: formdata,
        success: function(data){
				var t = setTimeout(function(){ZR.category.isFiltering = false},1000);//reset after the scrolling completes
          if(jQuery(window).scrollTop() > jQuery('#mainheader').height() && !ZR.util.isMobile) {
            ZR.util.scrollToId('content',0);
          }
          jQuery("#searchthumbs").html(data);
          var count = jQuery("#numFound").val();
          jQuery("#resultsCount").html(count);

          //set the results to local storage for Previous and next
          ZR.category.prevNext.set();
          //jQuery("img.lazy").lazyload();
        },
        error : function(response){
          ZR.Base.log("jQuery.ajax.error() : " + response.statusText, null, "ERROR");
        }
      });

    }
    else {

      /** load original results **/
      jQuery("#searchthumbs").html(ZR.category.defaultResults);
			/*if(jQuery(window).scrollTop() > jQuery('#mainheader').height()) {*/
				ZR.util.scrollToId('content',0); /* Take out if statement, allows jail lazy load to kick in... */
				var t = setTimeout(function(){ZR.category.isFiltering = false},1000);//reset after the scrolling completes

			/*}*/
      var count = jQuery("#numFound").val();
      jQuery("#resultsCount").html(count);
      ZR.category.showElite();
      jQuery(".sortsearch").removeClass('active');
      jQuery(".sortsearch[data-sort='']").addClass("active");
      //jQuery("img.lazy").lazyload();
    }

  },

	viewMore: function(){
		jQuery('#viewmorebutton').live('click',function(){

      var resultsPage = jQuery(this).attr("data-results-page")

      if ( jQuery(this).attr("data-clicked") == null ){
        jQuery(this).attr("data-clicked", "true");
      }
      else {
        return;
      }

      var pageCount = jQuery(".catthumb", "#searchthumbs").length;

			var formdata = ZR.category.generateFormData();
					formdata += '&start=' + (pageCount);

			jQuery.ajax({
				url : resultsPage,
				type : "POST",
        cache : false,
				dataType : "html",
				data: formdata,
				success: function(data){
					jQuery('#viewmorenav').remove();
					jQuery("#searchthumbs").append(data);
					//jQuery("img.lazy").lazyload();
					var count = jQuery("#numFound").val();
					jQuery("#resultsCount").html(count);

				},
				error : function(response){
					ZR.Base.log("jQuery.ajax.error() : " + response.statusText, null, "ERROR");
				}
			});
				return false;
		});
	},


	filters: function(){
		var catFiltersWrap = jQuery('#catfilterswrap');
		var pageWindow = jQuery(window);
		var hideButton = jQuery('#catfilterbutton .up')
		/*-------------------------------------
			disable click on the links
		---------------------------------------*/
		jQuery('.searchfilterlink').live('click',function(){
			return false;
		});

		/*-------------------------------------
			Show/hide the filters
		---------------------------------------*/
		jQuery('#catfilterbutton').click(function(){
			jQuery('#catfilterbutton span').toggleClass('hide');
			if(jQuery('#filterselected input').length > 0) {
				jQuery('#filterselectedwrap').slideFade();
			//hide filter columns if we are mobile
				
				
			}
			
			if(ZR.util.isMobile){
        jQuery('.catfiltercol.active ul').slideUp();
        jQuery('.catfiltercol.active').removeClass('active');
      }

			
			
			
			catFiltersWrap.slideFade();
			return false;
		});
		
		
		/*-------------------------------------
			Hide filters when you scroll
		---------------------------------------*/
		pageWindow.scroll(function(){
		  if(!ZR.util.isMobile){
  			if(!hideButton.hasClass('hide') && ZR.category.isFiltering == false) {
  				jQuery('#catfilterbutton').trigger('click');
  			}
		  }
		});
		

		/*-------------------------------------
			When a filter is selected, clone it
			and append it to the selected filters
			div, and load the selected thumbs
		---------------------------------------*/

		jQuery('#catfilterform input[type=checkbox]').click(function(){
		  var colId = jQuery(this).closest('.catfiltercol').attr('id'),
          facetId = colId.replace('filter',''),
          labelDesc = jQuery(this).next('span').text();
		    
		  //load the descriptions next to the header for mobile.
		  if (jQuery(this).attr('checked')){
	      jQuery('#filterdesc' + facetId).append('<em id="labeldesc' + facetId + '"> ' + labelDesc + '</em>');
		  }
		  else {
		    jQuery('#labeldesc' + facetId).remove();
		  }
		  
		  //fire the search request
      jQuery.debounce(400,ZR.category.searchRequest());

		});
		/*-------------------------------------
			When a filter is removed, remove it from
			the #filterselected and uncheck from #catfilters
		---------------------------------------*/
		jQuery('#filterselected input').live('click',function(){
			var filterClass = jQuery(this).attr('class');
			var facetId = jQuery(this).attr("data-facetid"); 
			
			if (!jQuery(this).attr('checked')){
				jQuery('#catfilters input[data-facetid="'+facetId+'"]').attr('checked',false);
				
				ZR.category.loadFilters();
				jQuery(this).closest('.radiolabel').fadeOut(function(){
					jQuery(this).remove();
					if(jQuery('#filterselected input').length == 0) {
						jQuery('#filterselectedwrap').slideFade();
					}
				});
        ZR.category.submitSearchQuery();
			}
		});

   //var filtersClear = jQuery('#filtersclear');

		jQuery('#filtersclear').click(function(){
			var filtersClear = jQuery(this);
			
			//only need to do this for desktop
			if(!ZR.util.isMobile) {
			  filtersClear.fadeOut(300);
			}
			jQuery('#filterselected input').each(function(){
				var selectedClass = jQuery(this).attr('class');
					jQuery('#catfilters input[data-facetid="'+jQuery(this).attr("data-facetid")+'"]').attr('checked',false);
					jQuery(this).closest('.radiolabel').fadeOut(300,function(){
						jQuery(this).remove();
						
						filtersClear.show();
						if(jQuery('#filterselected input').length == 0) {
							jQuery('#filterselectedwrap').slideFade();
						}
					});
			});
			
			//*remove all labels from the mobile headers
			jQuery('.filterdesc').empty();
			
			ZR.category.submitSearchQuery();
			return false;
		});

	},
	loadFilters: function() {
		/*-------------------------------------
			The function that loads the category/search
			thumbnails.
		---------------------------------------*/
		var searchParams = jQuery('#catfilterform').serialize();
	},

  resetProducts : function(){
    jQuery("a", "#sectionutility").removeClass("active");
    jQuery(this).addClass("active");
    
    jQuery('#fqNewInput','#catfilterform').remove();
    jQuery('#facetNewInput','#catfilterform').remove();
    jQuery('#sort','#catfilterform').val('');



    var filtersClear = jQuery("#filtersclear");
    filtersClear.fadeOut(0);
    jQuery('#filterselected input').each(function(){
      var selectedClass = jQuery(this).attr('class');
      jQuery('#catfilters input[data-facetid="'+jQuery(this).attr("data-facetid")+'"]').attr('checked',false);
      jQuery(this).closest('.radiolabel').fadeOut(0,function(){
        jQuery(this).remove();
      });
    });
    if ( jQuery('#filterselectedwrap').is(":visible") ){
      jQuery('#filterselectedwrap').slideFade();
    }


    var filterButton = jQuery("#catfilterbutton");
    if ( filterButton.find(".up:visible").length != 0 ){
      filterButton.trigger("click");
    }


    jQuery("#searchthumbs").html(ZR.category.defaultResults);
    //jQuery("img.lazy").lazyload();
    ZR.category.showElite();
    //var count = jQuery("#searchthumbs > :input[name='numFound']:first").val();
    var count = jQuery('.catthumb').length;
    jQuery("#searchthumbs > :input[name='numFound']:first").val(count);
    jQuery("#resultsCount").html(count);
  },

  sortProducts : function(){
    var sort = jQuery(this).attr('data-sort');
    jQuery('#sort','#catfilterform').val(sort);
    jQuery("#sectionutility a").each(function(){jQuery(this).removeClass("active")});

    var fq = jQuery(this).attr('data-fq');
    if ( typeof fq !== 'undefined' ){
      if ( jQuery('#catfilterform').find("#fqNewInput").length == 0 ) {
        var ipt = jQuery("<input/>").attr({
          type : "hidden",
          name : "fq",
          id   : "fqNewInput"
        }).val(fq);
        jQuery('#catfilterform').append(ipt);
      }
    }
    else {
      jQuery('#fqNewInput','#catfilterform').remove();
    }

    var facet = jQuery(this).attr('data-facet-field');
    if ( typeof facet !== 'undefined' ){
      if ( jQuery('#catfilterform').find("#facetNewInput").length == 0 ) {
        var iptf = jQuery("<input/>").attr({
          type : "hidden",
          name : "facet.field",
          id   : "facetNewInput"
        }).val(facet);
        jQuery('#catfilterform').append(iptf);
      }
    }
    else {
      jQuery('#facetNewInput','#catfilterform').remove();
    }

    jQuery(this).addClass("active");
    ZR.category.submitSearchQuery(true);
  }
};

ZR.splash = {
	loadedImages: 0,
	activeGender: null,
	animateLinks: function(){
		jQuery('.no-cssanimations #splashlinks').hover(function(){
				jQuery('.splashword').animate({opacity: '1'});
				jQuery('.splashinitial').animate({opacity: '0'});
			},function(){
				jQuery('.splashword').animate({opacity: '0'});
				jQuery('.splashinitial').animate({opacity: '1'});
			}
		);
	},
	loadBg: function(){
		ZR.splash.loadedImages++;
		if(ZR.splash.loadedImages == 2 && !ZR.util.isMobile || ZR.util.isMobile){
			jQuery('#splashimgwrapper').fadeIn(1000);
		}
	}
}

ZR.Support = {
	faq: function(){
		jQuery('.question').click(function() {
			var answer = jQuery(this).attr('id').replace('question', 'answer'),
					question = jQuery(this),
          container= question.parents('section:first');
			if(!jQuery('#' + answer, container).is(':visible')) {
				jQuery('a', question).css('font-weight', 'bold');
                jQuery('#' + answer, container).slideFade(400);
			} else {
				jQuery('a', question).css('font-weight', 'normal');
                jQuery('#' + answer, container).slideFade(400);
			}
		});
		// Handle clicks within the answers that link to other FAQ questions
		jQuery('.answer a').click(function() {
		  var url = jQuery(this).attr('href');
		  if(url.indexOf('#') !== -1) {
	        var hashTarget = url.substring(url.indexOf('#') + 1);
	        ZR.util.scrollToId(hashTarget, 108);
	        jQuery('#' + hashTarget).click();
	      }
		});
		// Do pagelevel stuff
		ZR.util.scrollSidebar = true;
		ZR.util.pageHeader.init();
		ZR.util.sectionAnchors(26);
	},
	contactUs: function() {
	  var countrySelect = jQuery('#countrySelect');
	  countrySelect.change(function(){
	  	jQuery('.contactforms').hide();
	    jQuery('.contactinfotypes').slideUp('fast');
	    if(jQuery(this).val() == 'US' || jQuery(this).val() == 'CA') {
	      jQuery('#usaTypes').slideDown('fast');
	      jQuery('#stickerCountry').html(jQuery(this).val());
	      jQuery('#dealerCountry').html(jQuery(this).val());
	    }
	    else {
	      jQuery('#defaultTypes').slideDown('fast');
	    }
	    // Wire the state pick list
	    var ccountry = jQuery(this).val();
  	  jQuery('#stickerDealerState').html('<option value="">Choose State</option>');
  	  jQuery('#prospectingDealerState').html('<option value="">Choose State</option>');
	    jQuery('#stateSource').children('option').each(function() {
	      if ( jQuery(this).data('country') == ccountry ) {
	    	  jQuery('#stickerDealerState').append(jQuery(this).clone());
	    	  jQuery('#prospectingDealerState').append(jQuery(this).clone());
	    	}
	    });
	    jQuery("#prospectingDealerPostalCode, #stickerDealerPostalCode").keyup( ZR.Checkout.AddressPayment.zipCodeLookup );
	  });
	  countrySelect.trigger('change');
	  if (ZR.Settings.locale.code == "en_US" || ZR.Settings.locale.code == "en_CA"){
      jQuery("#stickerPhone, #prospectingDealerPhone").usphone();
      jQuery("#stickerPhone, #prospectingDealerPhone").trigger("keyup");
    }
	  jQuery('.typeselects').change(function(){
	    if (jQuery(this).hasClass('selected')){
  	    jQuery('.contactforms').hide();
  	    var theform = jQuery(this).children('option:selected').data('form');
  	    jQuery('#' + theform).show();
	    }
	    else {
  	    jQuery('.contactforms').slideUp('fast');
        var theform = jQuery(this).children('option:selected').data('form');
        jQuery('#' + theform).slideDown('fast');
        jQuery(this).addClass('selected');
	    }
	  });
	  jQuery('.coreform').validate({
	    rules: {
        "fromAddressConfirm": {
          equalTo: "#inputEmail"
        }
      },
      errorPlacement: function(error, element) {
        var isMulti = false;
        var o = jQuery(element);
        if(o.hasClass('requiredgroup') || o.hasClass('requiredradio')) {
          isMulti = true;
        }
        if(!isMulti) {
          o.parent('.placeholder').prepend(error);
        } else {
          o.closest('.inputmulti').prepend(error);
        }
      },
      submitHandler: function(form) {
      	jQuery('.submitbuttons').hide();
      	jQuery('.ajaxloader').show();
      	var countryValue = jQuery(':input[name="country"]', form).val().toUpperCase();
      	var sendMailTo = "";
      	if (countryValue == 'US' || countryValue == 'CA') {
      		sendMailTo = jQuery("#infotypeSelect option:selected").data('email');
      	}
      	else {
      		if ( jQuery("#infotype2Select option:selected").val() == "general" ) {
      			sendMailTo = jQuery("#countrySelect option:selected").data("contactemail");
      		}
      		if ( jQuery("#infotype2Select option:selected").val() == "warranty" ) {
      			sendMailTo = jQuery("#countrySelect option:selected").data("warrantyemail");
      		}
      		if ( sendMailTo == "" || sendMailTo == undefined ) {
      			sendMailTo = "support@nixon.com";
      		}
      	}
      	/* 
      	  SHR 0 11/26 - why is this here?!?
      	  if(countryValue == 'AU' || countryValue == 'NZ') {
      		 sendMailTo = 'info@nixonnow.com.au';
      	  }
      	*/
      	var useType = "";
      	var infotype2 = "";
      	infotype2 = jQuery(':input[name="infotype2"]', form).val();
      	if (infotype2 != "") {
      		useType = infotype2;
      	} 
      	else {
      		useType = jQuery(':input[name="infotype"]', form).val();
      	}
      	var fromAddr = "";
      	fromAddr = jQuery(':input[name="fromAddress"]', form).val();
      	if (fromAddr == "") {
      		fromAddr = jQuery(':input[name="dEmail"]', form).val();
      	}
      	if (fromAddr == "") {
      		fromAddr = "info@nixon.com";
      	}
      	
      	var fieldsByType = "";
      	if (useType == 'dealer') {
      		fieldsByType = "STORE_NAME,FIRST_NAME,LAST_NAME,ADDR,ADDR2,CITY,STATE,POSTAL,PHONE,WEBSITE,EMAIL,STORE_TYPE,TIME_IN_BIZ,LOCATIONS,ONLINE,PRODUCT_CATS,TOP_BRANDS,HOW_HEARD,ADDL_INFO,COUNTRY";
      	}
      	else if (useType == 'sticker') {
      		fieldsByType = "FNAME,LNAME,COMPANY,ADDRESS,TOWN,STATE_PROV,POSTAL_CODE,PHONE_NUMBER,COUNTRY";
      	}
      	else {
      		fieldsByType = "CONTACT_NAME,FROM_ADDRESS,MESSAGE,COUNTRY"; 
      	}
      	
      	var cts = new Array(); 
      	cts = document.form1.elements['dProductCats'];
      	var catTxt = "";
      	var k = 0;
      	for ( var i = 0; i < cts.length; i++ ) {
      		if ( cts[i].checked ) {
        		if ( k > 0)  { catTxt += " | "; }
        	  catTxt += cts[i].value;
        	  k++;
      		}
      	}
      	
      	jQuery.post(jQuery(form).attr('data-action'), {
      		country: countryValue,
      		toAddress: sendMailTo,
      		infotype: useType,
      		
      		fromAddress: fromAddr,
      		contactName: jQuery(':input[name="contactName"]', form).val(),
      		contactMessage: jQuery(':input[name="contactMessage"]', form).val(),
      		
      		//sticker fields
      		company: jQuery(':input[name="company"]', form).val(),

      		// dealer fields
      		storeName: jQuery(':input[name="dStoreName"]', form).val(),
      		firstName: jQuery(':input[name="dFirstName"]', form).val(),
      		lastName: jQuery(':input[name="dLastName"]', form).val(),
      		address: jQuery(':input[name="dAddress"]', form).val(),
      		address2: jQuery(':input[name="dAddress2"]', form).val(),
      		city: jQuery(':input[name="dCity"]', form).val(),
      		state: jQuery(':input[name="dState"]', form).val(),
      		postalCode: jQuery(':input[name="dPostalCode"]', form).val(),
      		phoneNumber: jQuery(':input[name="dPhoneNumber"]', form).val(),
      		website: jQuery(':input[name="dWebsite"]', form).val(),
      		email: jQuery(':input[name="dEmail"]', form).val(),
      		storeType: jQuery(':input[name="dStoreType"]', form).val(),
      		inBusiness: jQuery(':input[name="dInBusiness"]', form).val(),
      		locations: jQuery(':input[name="dLocations"]', form).val(),
      		onlineSales: jQuery(':input[name="dOnlineSales"]', form).val(),
      		productCats: catTxt,
      		topBrands: jQuery(':input[name="dTopBrands"]', form).val(),
      		heardNixon: jQuery(':input[name="dHeardNixon"]', form).val(),
      		addlInfo: jQuery(':input[name="dAddlInfo"]', form).val(),

      		sFirstName: jQuery(':input[name="firstName"]', form).val(),
      		sLastName: jQuery(':input[name="lastName"]', form).val(),
      		sCompany: jQuery(':input[name="company"]', form).val(),
      		sAddress: jQuery(':input[name="address"]', form).val(),
      		sCity: jQuery(':input[name="city"]', form).val(),
      		sState: jQuery(':input[name="state"]', form).val(),
      		sPostalCode: jQuery(':input[name="postalCode"]', form).val(),
      		sPhoneNumber: jQuery(':input[name="phoneNumber"]', form).val(),
      		
      		//prepare a zinformer insert
          zin_save: '1',
          zin_type: 'Contact-Nixon-' + useType,
          zin_fields: fieldsByType, 
          'zin_value_STORE_NAME-1': jQuery(':input[name="dStoreName"]', form).val(),
          'zin_value_FIRST_NAME-1': jQuery(':input[name="dFirstName"]', form).val(),
          'zin_value_LAST_NAME-1': jQuery(':input[name="dLastName"]', form).val(),
          'zin_value_ADDR-1': jQuery(':input[name="dAddress"]', form).val(),
          'zin_value_ADDR2-1': jQuery(':input[name="dAddress2"]', form).val(),
          'zin_value_CITY-1': jQuery(':input[name="dCity"]', form).val(),
          'zin_value_STATE-1': jQuery(':input[name="dState"]', form).val(),
          'zin_value_POSTAL-1': jQuery(':input[name="dPostalCode"]', form).val(),
          'zin_value_PHONE-1': jQuery(':input[name="dPhoneNumber"]', form).val(),
          'zin_value_WEBSITE-1': jQuery(':input[name="dWebsite"]', form).val(),
          'zin_value_EMAIL-1': jQuery(':input[name="dEmail"]', form).val(),
          'zin_value_STORE_TYPE-1': jQuery(':input[name="dStoreType"]', form).val(),
          'zin_value_TIME_IN_BIZ-1': jQuery(':input[name="dInBusiness"]', form).val(),
          'zin_value_LOCATIONS-1': jQuery(':input[name="dLocations"]', form).val(),
          'zin_value_ONLINE-1': jQuery(':input[name="dOnlineSales"]', form).val(),
          'zin_value_PRODUCT_CATS-1': catTxt,
          'zin_value_TOP_BRANDS-1': jQuery(':input[name="dTopBrands"]', form).val(),
          'zin_value_HOW_HEARD-1': jQuery(':input[name="dHeardNixon"]', form).val(),
          'zin_value_ADDL_INFO-1': jQuery(':input[name="dAddlInfo"]', form).val(),
      	
          'zin_value_CONTACT_NAME-1': jQuery(':input[name="contactName"]', form).val(),
          'zin_value_FROM_ADDRESS-1': fromAddr,
          'zin_value_MESSAGE-1': jQuery(':input[name="contactMessage"]', form).val(),
      	
          'zin_value_FNAME-1': jQuery(':input[name="firstName"]', form).val(),
          'zin_value_LNAME-1': jQuery(':input[name="lastName"]', form).val(),
          'zin_value_COMPANY-1': jQuery(':input[name="company"]', form).val(),
          'zin_value_ADDRESS-1': jQuery(':input[name="address"]', form).val(),
          'zin_value_TOWN-1': jQuery(':input[name="city"]', form).val(),
          'zin_value_STATE_PROV-1': jQuery(':input[name="state"]', form).val(),
          'zin_value_POSTAL_CODE-1': jQuery(':input[name="postalCode"]', form).val(),
          'zin_value_PHONE_NUMBER-1': jQuery(':input[name="phoneNumber"]', form).val(),
          'zin_value_COUNTRY-1': countryValue
      	}, function(data, status, jqXHR) {
      		if(data.indexOf('<div id="content">') !== -1 || status == 'success') {
      			jQuery('#contactform').addClass('hidden').hide();
      			jQuery('#thanks').removeClass('hidden').show();
      		}
      	});
      }
    });
	},
	repairCenter: function() {
		// Change functionality
	  jQuery('.formdisabled input, .formdisabled checkbox, .formdisabled textarea, .formdisabled button, .formdisabled radio, .formdisabled select').each(function() {
       jQuery(this).attr("disabled",true);
     })
     jQuery('.qualifier').on("change","#pythonRadio",function(){
        jQuery('#pythonWarning').slideUp('fast');
        if (jQuery('#pythonYes').attr('checked') == 'checked') {
          jQuery('#pythonWarning').slideDown('fast');
          jQuery('#repairForm').addClass('formdisabled');
          jQuery('.formdisabled input, .formdisabled checkbox, .formdisabled textarea, .formdisabled button, .formdisabled radio, .formdisabled select').each(function() {
            jQuery(this).attr("disabled",true);
          })
        }
        else {
          jQuery('#repairForm').removeClass('formdisabled');
          jQuery('input, checkbox, textarea, button, radio, select').each(function() {
            jQuery(this).attr("disabled",false);
          })
        }
      });
		jQuery(':input[name="model"]').change(function() {
			if(jQuery(this).val() === '') {
				//jQuery(':input[name="caseback"]').val('').removeAttr('disabled');
			} else {
				jQuery(':input[name="caseback"]').val('');	// .attr('disabled', 'disabled')
				jQuery(':input[name="zoi_value_RPR_MODEL-1"]').val(jQuery(this).val());
				jQuery("#repaircentersubmitbtn").data("ga-val","Submit Repair - "+jQuery(this).val());
				
			}
		});
		jQuery(':input[name="caseback"]').change(function() {
			if(jQuery(this).val() === '') {
				//jQuery(':input[name="model"]').val('').removeAttr('disabled');
			} else {
				jQuery(':input[name="model"]').val('');	// .attr('disabled', 'disabled')
				jQuery(':input[name="zoi_value_RPR_CASEBACK-1"]').val(jQuery(this).val());
				jQuery("#repaircentersubmitbtn").data("ga-val","Submit Repair - "+jQuery(this).val());
				
			}
		});
		jQuery(':input[name="zoi_value_EXPLANATION-1"]').blur(function() {
			var issueNotAvailable = jQuery('#liNotAvailable');
			if(jQuery(this).val() !== '' && !issueNotAvailable.is(':checked')) {
				issueNotAvailable.click();
			}
		});
		/*Handle Form submissions*/
	  /*Handle form submission and error handling*/
		jQuery('.coreform').validate({
			debug: false,
			ignore: ':disabled',
			rules: {
				model: {
					required: function() {
						var noGroupSelection = (jQuery(':input[name="caseback"]').val() === '') && 
							(jQuery(':input[name="model"]').val() === '');
						if(noGroupSelection) {
							return true;
						}
						return (jQuery(':input[name="caseback"]').val() === '');
					}
				},
				caseback: {
					required: function() {
						var noGroupSelection = (jQuery(':input[name="caseback"]').val() === '') && 
							(jQuery(':input[name="model"]').val() === '');
						if(noGroupSelection) {
							return true;
						}
						return (jQuery(':input[name="model"]').val() === '');
					}
				},
				'zoi_value_EXPLANATION-1': {
					required: function() {
						return jQuery('#liNotAvailable').is(':checked');
					}
				}
			},
			errorPlacement: function(error, element) {
        var isMulti = false;
        var o = jQuery(element);
        if(o.hasClass('requiredgroup') || o.hasClass('requiredradio')) {
          isMulti = true;
        }
        if(!isMulti) {
          o.closest('.placeholder').prepend(error);
        } else {
        	if(o.is(':checkbox')) {
        		o.closest('.radiolist').addClass('errorcontainer');
        		error.css('marginLeft', '10px');
        		o.closest('.radiolist').prepend(error);
        	} else {
        		o.closest('.inputmulti').prepend(error);
        	}
        }
      },
      submitHandler: function(form) {
      	// Configure hidden form fields
      	var tmp = form.elements['month'].value + " " + form.elements['year'].value;
      	form.elements['zoi_value_RPR_PURCHASE_DATE-1'].value = tmp.replace(/^\s+|\s+jQuery/g, '');
      	form.elements['zoi_value_RPR_MODEL-1'].value = form.elements['model'].value;
      	form.elements['zoi_value_RPR_CASEBACK-1'].value = form.elements['caseback'].value;

    	// GA Tracking
      	var productToTrack = '';
      	if(jQuery('option:selected', ':input[name="model"]').val() === '') {
      	  productToTrack = jQuery('option:selected', ':input[name="caseback"]').text();
      	} else {
      	  productToTrack = jQuery('option:selected', ':input[name="model"]').text();
      	}
    	_gaq.push(['_trackEvent', 'Cart', 'Add to Cart - Repair Center', 'Submit Repair - ' + productToTrack]);
    	
    	form.submit();
      }
    });
	}
};

ZR.Dealer = {
    alreadyGeolocated: false,
	init: function(){
		ZR.Dealer.configureSearch();
		//Show/hide dealer search form based on tabbed links
  	    if (ZR.util.isMobile) {
  	      var showThisTab = '';
      	  jQuery("#sectionutility a").each(function(i) {
      		  if (jQuery(this).attr("class").indexOf("active") != -1) {
      		    var splitList = jQuery(this).attr("class").split(" ");
      		    for (i = 0; i < splitList.length; i++) {
      		      if (splitList[i] != "active") {
      		        showThisTab = splitList[i];
      		      }
      		    }
      		  }
      	  });
      	  switch(showThisTab) {
          	case "results":
          	  jQuery("#dealersearch").hide();
          	  break;
          	case "finddealer":
          	  jQuery("#dealersearch").show();
          	  break;
          	case "findme":
          	  jQuery("#dealersearch").hide();
          	  break;
          	default:
          	  jQuery("#dealersearch").show();
      	  }
      	  jQuery(".finddealer").click(function() {
      	    jQuery(".dealerloading").hide();
        		jQuery("#dealersearch").slideDown();
        		jQuery("#sectionutility a").removeClass("active");
        		jQuery(this).addClass("active");
        		return false;
      	  });
      	  jQuery(".results").click(function() {
      	    jQuery(".dealerloading").hide();
      	    jQuery("#dealersearch").slideUp();
            jQuery("#sectionutility a").removeClass("active");
            jQuery(this).addClass("active");
            return false;
      	  });
  	    } else {
  	      jQuery("#dealersearch").show();
  	    }
    },
    findMe: function() {
      jQuery("#dealersearch").hide();
      jQuery("#sectionutility a").removeClass("active");
      jQuery('.findme').addClass("active");
      jQuery('input[name=sortBy]').val('proximity');
      jQuery('.dealerlocator').prepend('<section class="columns3 dealerloading"><img src="/images/common/ajax-loader.gif" /></div>');
      ZR.Dealer.geoLocate();
      return false;
    },
    geoLocate: function() {
      // We don't want to geolocate once we have a results page. - MTR 8/1/2012
      if(navigator.geolocation && jQuery('#dealerresults tr').length == 0) {
        navigator.geolocation.getCurrentPosition(ZR.Dealer.handleGeoLocate,ZR.Dealer.geoLocateError);
      }
      ZR.Dealer.alreadyGeolocated = true;
    },
    handleGeoLocate : function(position) {
      if(position.coords) {
        jQuery(':input[name="latitude"]').val(position.coords.latitude);
        jQuery(':input[name="longitude"]').val(position.coords.longitude);
        if(jQuery('#dealerresults tr').length == 0) {
          jQuery('form.coreform').submit();
        }
      }
    },
    geoLocateError: function(error) {
      var doNotShow;
      switch(error.code) {
        case error.PERMISSION_DENIED:
          ZR.Base.log("error.PERMISSION_DENIED: No location for you", null, "DEBUG");
          alert("We were unable to detect your current position");
          jQuery(".dealerloading").hide();
          jQuery("#dealersearch").show();
          jQuery("#sectionutility a").removeClass("active");
          jQuery('.finddealer').addClass("active");
          break;
        case error.POSITION_UNAVAILABLE:
          ZR.Base.log("error.POSITION_UNAVAILABLE: No location for you", null, "DEBUG");
          alert("We were unable to detect your current position");
          jQuery(".dealerloading").hide();
          jQuery("#dealersearch").show();
          jQuery("#sectionutility a").removeClass("active");
          jQuery('.finddealer').addClass("active");
          break;
        case error.TIMEOUT:
          ZR.Base.log("error.TIMEOUT: Took too long to find where you are located", null, "DEBUG");
          alert("We were unable to detect your current position in a timely manner");
          jQuery(".dealerloading").hide();
          jQuery("#dealersearch").show();
          jQuery("#sectionutility a").removeClass("active");
          jQuery('.finddealer').addClass("active");
          break;
        default: 
          alert("We were unable to detect your current position");
          jQuery(".dealerloading").hide();
          jQuery("#dealersearch").show();
          jQuery("#sectionutility a").removeClass("active");
          jQuery('.finddealer').addClass("active");
          break;
      }
      
    },
	configureSearch: function(){
		var form = jQuery('.coreform');
		/*Zip Code*/
		jQuery('#inputPostalCode', form).change(function() {
			ZR.Dealer.resetOtherSearch();
		})
		/*City*/
		jQuery('#inputCity', form).change(function() {
			ZR.Dealer.resetProximitySearch();
		});
		/*State*/
		jQuery(':input[name="state"]', form).change(function() {
			ZR.Dealer.resetProximitySearch();
		});
		/*Country*/
		jQuery(':input[name="country"]', form).change(function() {
			var value = jQuery(this).val(),
			    stateChooser = jQuery(':input[name="state"]', form);
			if(value == 'US' || value == 'CA' || value == 'AU') {
				jQuery('.optional').removeClass('hidden').show();
				jQuery('#solo').addClass('hidden').hide();
				jQuery('#duo').removeClass('hidden').show();
				ZR.Dealer.resetProximitySearch();
			} else {
				jQuery('.optional').addClass('hidden').hide();
				jQuery('#solo').removeClass('hidden').show();
				jQuery('#duo').addClass('hidden').hide();
			}
			jQuery.getJSON('/getcountries/?country_code=' + value, function(data) {
				if(data != null && data.country != null) {
					var defaultOption = jQuery('option:first', stateChooser),
						defaultText = (data.country.code == 'US' ? jQuery('#selectstate').text() : jQuery('#selectprovince').text()),
						newOptions = '',
						statesFound = data.country.states,
						i = 0;
					if(statesFound.length === 0) {
						defaultText = jQuery('#nostates').text();
					}
					newOptions = '<option value="' + defaultOption.val() + '">' + defaultText + '</option>';
					for(i = 0; i < statesFound.length; i++) {
						newOptions = newOptions + '<option value="' + statesFound[i].code +
							'">' + statesFound[i].name + '</option>';
					}
					stateChooser.empty();
					stateChooser.html(newOptions);
					if(statesFound.length === 0) {
					  /* Change request: hide the state/province chooser - MTR 4/2/2012 */
					  stateChooser.closest('.placeholder').addClass('hidden');
					  jQuery(':input[name="country"]', form).closest('.placeholder').removeClass('half');
					} else {
					  jQuery(':input[name="country"]', form).closest('.placeholder').addClass('half');
					  stateChooser.closest('.placeholder').addClass('half').removeClass('hidden');
					}
				}
			});
		});
		/*Form Submit*/
		form.submit(function() {
			// Basic Validation
			var cityInput = jQuery('#inputCity', form).val(),
				  stateInput = jQuery(':input[name="state"]', form),
				  countryInput = jQuery(':input[name="country"]', form);
			if(cityInput !== '' && (stateInput.val() === '' && jQuery('option', stateInput).length > 1)) {
				stateInput.addClass('error');
				jQuery('#fieldrequired').removeClass('hidden').show();
				stateInput.bind('mousedown keydown', function() {
					jQuery('#fieldrequired').addClass('hidden').hide();	// hide errors
					jQuery(this).removeClass('error');
				});
				return false;
			}
			return true;
		});
	},
	resetProximitySearch: function(){
		jQuery('#inputPostalCode', '.coreform').val('');
		jQuery(':input[name="search_radius"]', '.coreform').val('50');
	},
	resetOtherSearch: function(){
		jQuery('#inputCity', '.coreform').val('');
		jQuery(':input[name="state"]', '.coreform').val('');
		jQuery(':input[name="country"]', '.coreform').val('');
	}
};

ZR.AdGallery = {
	init: function(){
		ZR.util.pageHeader.init();
		ZR.util.blackLabel();
		ZR.util.viewMore();
		ZR.category.thumbSize();
    ZR.util.sectionAnchors(-2);
    ZR.lb.zoom();
		
		jQuery('.caticonlink').click(function(){
			var t = setTimeout(ZR.util.blackLabel,400); //adjust the labels on resize
		});
	}/*,
	showMoreAds: function(count) {
		var hiddenCount = jQuery('.catthumb.hidden').length;
		jQuery('.catthumb.hidden').each(function(index, node) {
			if(count > 0) {
				jQuery(this).removeClass('hidden');
				count--;
			}
		});
		// Update label
		hiddenCount = jQuery('.adgallery .catthumb.hidden').length;
		if(hiddenCount < 1) {
			jQuery('#showmore a').text('');
			jQuery('#showmore').css({
				borderTop: 'none',
				marginTop: 0,
				paddingTop: 0
			});
		} else {
			jQuery('#showmore a').text('Show ' + (hiddenCount > 10 ? '10' : hiddenCount) + ' More');
		}
	}*/
};

ZR.ImageGallery = {
	type: 'google',
	account: 'nixoninc1',
	initGallery: '',
	initTitle: '',
	initJSON: null,
	detailStart: 0,
	detailStop: 14,
	pageBy: 15,
	numAlbums: 0,
	albums: {},	// a cache of sorts
	init: function(){
		// Load Galleries
		ZR.ImageGallery.readAlbum(ZR.ImageGallery.account, true); // nixoninc1
		ZR.util.blackLabel();
	},
	initDetail: function(){
		// Configure Page-level stuff
		ZR.category.thumbSize();
		// Handle image size changes
		jQuery('a[rel="small"]').click(function() {
			ZR.ImageGallery.pageBy = 25;
			ZR.ImageGallery.scrollView(0);	// just refreshes display
			var t = setTimeout(ZR.util.blackLabel,400); //adjust the labels on resize
		});
		jQuery('a[rel="large"]').click(function() {
			ZR.ImageGallery.pageBy = 12;
			ZR.ImageGallery.scrollView(0);	// just refreshes display
			var t = setTimeout(ZR.util.blackLabel,400); //adjust the labels on resize
		});
  	// Load Galleries
		ZR.ImageGallery.readAlbum(ZR.ImageGallery.account, false); // nixoninc1
		ZR.util.blackLabel();
		ZR.util.viewMore();
	},
	// Used on image.jsp to build the album representations which link to image-detail.jsp
	buildGalleries: function(start) {
		if(start === undefined) {
			start = (ZR.ImageGallery.albums.length > 1 ? 1 : 0);
		}
		if(start >= ZR.ImageGallery.albums.length) {
			return;
		}
		var i = start,
				galleries = jQuery('#searchthumbs'),
				html = '';
		for(i = start; i < ZR.ImageGallery.numAlbums; i++) {
			html = '<a href="/photo-gallery/' + ZR.ImageGallery.albums[i].detail +'.html" id="catthumb' + i + '" class="catthumb morethumb columns3" data-uniqueid="' + i + '" data-refid="' + i + '"rel="imagegallery">';
			html = html + '<img src="/images/common/view_mask.png" class="mask" />';
      html = html + '<img class="moreimg" src="' + ZR.ImageGallery.albums[i].image + '" alt="' + ZR.ImageGallery.albums[i].title + '" />';
      html = html + '<span class="blacklabel"><span class="blacklabeltext">' + ZR.ImageGallery.albums[i].title + '</span></span>';
      html = html + '</a>';
      galleries.append(html);
      }
	},
	// Creates the thumbs representing each image in the album/gallery
	buildGallery: function(title, start, stop) {
		if(title === undefined || title === '') {
			return;
		}
		ZR.ImageGallery.detailStart = start;
		ZR.ImageGallery.detailStop = stop;
		var a = 0,
				objectToIterate = null;
		for(a = 0; a < ZR.ImageGallery.numAlbums; a++) {
		  
		  
			if(ZR.ImageGallery.albums[a].title.toLowerCase() == title) {
				objectToIterate = ZR.ImageGallery.albums[a];
			}
		}
		// Builds out the album thumbs
		if(objectToIterate != null) {
			ZR.ImageGallery.readGallery(objectToIterate.link, objectToIterate.title, true, function() {
				// Update AJAX Box functionlity
				ZR.lb.zoom();
			});
		}
	},
	buildAlbum: function(title, image, jsonLink, start, i) {
		if(ZR.ImageGallery.albums[i] === undefined) {
			ZR.ImageGallery.albums[i] = {
					title: title,
					image: image,
					link: jsonLink,
					detail: title.toLowerCase().split(' ').join('-')
			};
			ZR.ImageGallery.numAlbums++;
		}
	},
	loadImage: function(src,title){
		jQuery('.loading').fadeIn(200);
		var galleryImg = new Image();
		jQuery(galleryImg).load(function(){
			jQuery('.loading').fadeOut(200);
		}).attr('src',src).attr('title',title);
	},
	readGallery: function(url, title, isDetailView, whenReadyAction) {
    

		if(isDetailView === undefined) {
			isDetailView = false;
		}
		//set up the top pos for the loading image
		if(url.indexOf('callback') === -1) {
			url = url + '&callback=?';	// IE hack!!!!
		}
		jQuery.getJSON(url,function(json) {
			var objPath = null,
			    imgStart = 0,
					rowCount = 0,
					galleries = jQuery('#searchthumbs'),
					html = '';
			switch(ZR.ImageGallery.type) {
				case 'google':
					objPath = json.feed.entry;
					break;
				case 'facebook':
					objPath = json.data;
					break;
			}

			if(objPath.length == 0) {
				alert('Please check your photo permissions or make sure there are photos in this gallery.');
			}

			//Generate a random start index for the Image
			if(isDetailView) {
				jQuery('#albumCount').text('(' + objPath.length + ')');
				ZR.ImageGallery.numAlbums = objPath.length;
			}
			jQuery.each(objPath,function(i,obj){
				var imgTitle = null, imgSrc = null, imgTh = null, activeClass = '',
				    isFilename = false;
				switch(ZR.ImageGallery.type) {
					case 'google':
					  
						imgTitle = obj.title.jQueryt;
						imgSrc = obj.mediajQuerygroup.mediajQuerycontent[0].url;
						var lastSlash = imgSrc.lastIndexOf('/');
						var lastSlashString = imgSrc.substring(lastSlash);
						var lastSlashReplaced = lastSlashString.replace('/','/s800/');
						imgSrc = imgSrc.replace(lastSlashString,lastSlashReplaced);
						imgTh = obj.mediajQuerygroup.mediajQuerythumbnail[1].url;
						break;
					case 'facebook':
						imgTitle = obj.name;
						imgSrc = obj.images[0].source;
								imgTh = obj.images[1].source;
						break;
				}

				//Set a Random Start Album
				if(i == imgStart) {
					ZR.ImageGallery.loadImage(imgSrc,imgTitle);
					activeClass = ' active';
				} else {
					activeClass = '';
				}

				if(!isDetailView) {
					jQuery('#imagehero').html('<a href="/photo-gallery/' + title.toLowerCase().split(' ').join('-') + '.html"><img src="/images/common/blank.gif" style="background: url(' + imgSrc + ') no-repeat 50% 50%; background-size: cover;" alt="' + imgTitle + '" /><span class="blacklabel"><span class="blacklabeltext">' + title + '</span></span></a>');
					jQuery('#promoted').html('<h2>' + title + '</h2><a href="/photo-gallery/' + title.toLowerCase().split(' ').join('-') + '.html" class="pglink' + activeClass + '">View Album <span id="teaseicon">Large</span></a>');
				} else {
					html = '<a href="' + imgSrc + '" rel="imagegallery" id="catthumb' + i + '" class="catthumb morethumb zoom columns3' + (i > ZR.ImageGallery.detailStop ? ' hide' : '') + 
						'" data-uniqueid="' + i + '" data-refid="' + i + '" ';
					if(i > ZR.ImageGallery.detailStop) {
						html = html + ' data-src="' + imgSrc;
					}
					html = html + '">'; //Todo remove this
					if(i > ZR.ImageGallery.detailStop) {
						html = html + '<img class="moreimg" src="' + ZR.Settings.url.image + '/common/blank.gif" alt="' + imgTitle + '" />';
					} else {
		      html = html + '<img class="moreimg" src="' + imgSrc + '" alt="' + imgTitle + '" />';
					}
					isFilename = false;
					if(imgTitle.toLowerCase().indexOf('.jpg') !== -1) {
						isFilename = true;
					}
					if(imgTitle.toLowerCase().indexOf('.jpeg') !== -1) {
						isFilename = true;
					}
					if(imgTitle.toLowerCase().indexOf('.png') !== -1) {
						isFilename = true;
					}
					if(imgTitle.toLowerCase().indexOf('.bmp') !== -1) {
						isFilename = true;
					}
					if(!isFilename) {
						
					html = html + '<span class="blacklabel"><span class="blacklabeltext">' + imgTitle + '</span></span>';
					}
		      html = html + '</a>';
		      galleries.append(html);
		    }
			});
			if(jQuery.isFunction(whenReadyAction)) {
				whenReadyAction();
			}
		});
	},
	readAlbum: function(userId, loadFirst) {
	  
	  
		if(loadFirst === undefined) {
			loadFirst = true;
		}
		var albumURL = null;
		switch(ZR.ImageGallery.type) {
			case 'google':
				albumURL = 'https://picasaweb.google.com/data/feed/base/user/' + userId + '?alt=json&kind=album&hl=en_US&callback=?';
				break;
			case 'facebook':
				albumURL = 'http://graph.facebook.com/' + userId + '/albums&callback=?';
				break;
			default:
				alert('Please define a gallery type.');
				break;
		}
		if(albumURL.indexOf('callback') === -1) {
			albumURL = albumURL + '&callback=?';	// IE hack!!!!
		}
		jQuery.ajax({
			dataType: 'jsonp',
			timeout: 2000,
			type: 'GET',
			url: albumURL,
			error: function(request, status, error) {
				// On Error just display a link to the gallery on Google's Picasa web service
				if(!loadFirst) {	// only set to false when on a detail page
					var friendlyUrl = albumURL,
							title = jQuery('#album').html();
					
					if(friendlyUrl.indexOf('?') !== -1) {
						friendlyUrl = friendlyUrl.substring(0, friendlyUrl.indexOf('?'));
					}
					jQuery('#searchthumbs').addClass('columns1').html('Could not load gallery, please visit <a href="' + friendlyUrl + '" target="_new">our Google Albums</a> to view this album.');
				}
				return;
			},
			success: function(json, status) {
				var objPath = null, albumTotal = 0, albumStart = 0, galleryJSON = null,
					  galleryTitle = null, galleryImage = null;
				switch(ZR.ImageGallery.type) {
				
					case 'google':
					 
						objPath = json.feed.entry;
						albumTotal = objPath.length;
					  albumStart = Math.round(albumTotal > 0 ? 0 : albumTotal);
						if(albumTotal > 0 ) {
						  
							jQuery.each(objPath,function(i,obj){
								//obj is entry
								galleryTitle = obj.title.jQueryt;
								galleryImage = obj.mediajQuerygroup.mediajQuerythumbnail[0].url;
										galleryJSON = obj.link[0].href;

								// try for higher res image, but use the thumbnail as the default
								if(obj.mediajQuerygroup.mediajQuerycontent[0].medium == 'image') {
									galleryImage = obj.mediajQuerygroup.mediajQuerycontent[0].url;
								}
								if (i == albumStart) {
								  
									//set vars to load the initial gallery later
									ZR.ImageGallery.initTitle = galleryTitle;
									ZR.ImageGallery.initJSON = galleryJSON;
								}
								// Build the object containing details about albums in this account
								ZR.ImageGallery.buildAlbum(galleryTitle,galleryImage,galleryJSON,albumStart,i);
		
								//wait til we're done to load the individual gallery
								if(i == (objPath.length - 1)){
									if(loadFirst) {
									  
										ZR.ImageGallery.readGallery(ZR.ImageGallery.initJSON, ZR.ImageGallery.initTitle);
										ZR.ImageGallery.buildGalleries();
									} else {
									  var title = jQuery('#album').html();
									  title = title.split('<sp');
                    title = title[0];
                    title = jQuery.trim(title);
									  
										ZR.ImageGallery.buildGallery(
										  title,
											ZR.ImageGallery.detailStart,
											ZR.ImageGallery.detailStop
											
											
										);
									}
								}
							});
						} else { //else if albumTotal == 0
							alert('There are either no results for albums with this user ID or there was an error loading the data. \n' + galleryJSON);
						}
						break;
					case 'facebook':
						objPath = json.data;
						albumTotal = objPath.length;
						albumStart = Math.round(Math.random() * (albumTotal - 1));
						if(albumTotal > 0) {
							jQuery.each(objPath,function(i,obj) {
								galleryTitle = obj.name;
								galleryJSON = 'http://graph.facebook.com/' + obj.id + '/photos';
		
								if (i == albumStart) {
									//set vars to load the initial gallery later
									ZR.ImageGallery.initTitle = galleryTitle;
									ZR.ImageGallery.initJSON = galleryJSON;
								}
								if(obj.cover_photo){
										jQuery.getJSON('http://graph.facebook.com/' + obj.cover_photo,function(json){
											galleryImage = json.images[1].source;
											ZR.ImageGallery.buildAlbum(galleryTitle,galleryImage,galleryJSON,albumStart,i);
										});
								}
								if(i == (objPath.length - 1)){
									ZR.ImageGallery.readGallery(ZR.ImageGallery.initJSON, ZR.ImageGallery.initTitle);
								}
							});
						}	else { //else albumTotal == 0
							alert('There are either no results for albums with this user ID or there was an error loading the data. \n' + albumURL);
						}
						break;
				}
			}
		});
	}
};
ZR.VideoGallery = {
	init: function(){
		ZR.lb.video();
		ZR.util.blackLabel();
		ZR.util.viewMore();
	},
	playFeatured: function(container,iframeName,url) {
    	/*
    	 * NOTE: This function doesn't use oembed, rather it performs a simple
    	 * insert of HTML code into the container, and then adds some event
    	 * listeners to the loaded [Vimeo] player.
    	 */
    	var oldHtml = jQuery(container).html(),
    		  newHtml = '',
    			playMask = jQuery('.playMask', '.featuredvideo');
    	jQuery(container).fadeIn(1000,function(){
    	  if (jQuery('html').hasClass('desktop')) {
    	    newHtml = '<iframe id="' + iframeName + '" src="' + url + '" width="940" height="507" frameborder="0"';
    	  } else {
    	    newHtml = '<iframe id="' + iframeName + '" src="' + url + '" frameborder="0"';
    	  }
    		newHtml = newHtml + ' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
    		jQuery(container).html(newHtml).ready(function() {
    			playMask.hide();
    			// Prepare end of video actions
    			 Froogaloop.prototype.init(jQuery('#' + iframeName).get(0));
    			Froogaloop.prototype.addEvent('ready', function(response) {
    				Froogaloop.prototype.addEvent('finish', function(response) {
      				jQuery(container).fadeOut(750, function() {
      					jQuery(container).html(oldHtml).fadeIn(250, function() {
      						playMask.show();
      					});
      				});
      			});
    			});
    		});
      });
	}
  
};
ZR.Collections = {
	init: function(){
		// Setup the page and pageheader
		if(jQuery('.collection.sectionanchor', '#content.collections').length > 1) {
			ZR.util.pageHeader.init();
		}

    ZR.category.swatches();
    // Make the collection view toggles work
    
    jQuery('.toggle').hover(function(){
      var id = jQuery(this).attr('data-id'),
          viewLink = jQuery('#viewlink' + id);
      viewLink.css('text-decoration','underline');
      
    },function(){
      var id = jQuery(this).attr('data-id'),
          viewLink = jQuery('#viewlink' + id);
      viewLink.css('text-decoration','none');
      
    });
    
		jQuery('.toggle').click(function() {
			var parent = jQuery(this).parents(".collection"),
          id = jQuery(this).attr('data-id'),
          target = 'products' + id,
          products = jQuery('#' + target),
          viewLink = jQuery('#viewlink' + id);
			
     
		  
      if(!parent.hasClass('open')) {
        parent.addClass("open");
        
      }
     
      products.slideFade(function() {
				if(jQuery(this).is(':visible')) {
				  viewLink.text(ZR.Settings.alerts.collection.hidecollection);
				} else {
				  viewLink.text(ZR.Settings.alerts.collection.viewcollection);
          parent.removeClass("open");
				}
			});
      
      if (jQuery("html").hasClass("mobile")) {
        ZR.util.scrollToObject(jQuery('#' + target),0);
      }
      else {
        ZR.util.scrollToObject( jQuery('h2[data-id=' + id + ']'),124);
      }
		});
    

    /** unwrap the collection hero images when there are no products for the collection **/
    jQuery('.collectionhero').each(function(){
      var img = jQuery(this);
      var a = img.parents('a.showproducts');
      var pwrapper = jQuery("#" + a.attr("data-id"));
      if ( pwrapper.length != 0 && pwrapper.children().length == 0){
        img.unwrap();
      }
    });

	}
};
ZR.lookbookSlide = {
  winWidth: null,
  isTouch: false,
  playing: 0,
  zoom: false,
  totalPages: 0, // updates with the toal number of pages
  currentPosition: 0, // first slide index
	init: function(){
    if (Modernizr.touch == true) {
    	  	ZR.lookbookSlide.isTouch = true;
          }
          else {
        	ZR.lookbookSlide.isTouch = false;
          }
      ZR.lookbookSlide.setDims();
      
      myScroll = new iScroll('wrapper',
        {
          snap : 'li',
          momentum : true,
          hScrollbar : false,
          onScrollStart : function() {
        	  ZR.lookbookSlide.hideText();
          },
          onBeforeScrollStart : function(e) {
            if (ZR.lookbookSlide.isTouch) {
              point = e.touches[0];
              pointStartX = point.pageX;
              pointStartY = point.pageY;
              null;
            } 
            else {
              e.preventDefault();
            }
          },
          onBeforeScrollMove : function(e) {
            if (ZR.lookbookSlide.isTouch) {
              deltaX = Math.abs(point.pageX - pointStartX);
              deltaY = Math.abs(point.pageY - pointStartY);
              if (deltaX >= deltaY) {
                e.preventDefault();
              }
              else {
                null;
              }
            }
            else {
              null;
            }
          },
          onScrollEnd : function() {
        	  ZR.lookbookSlide.currentPosition = this.currPageX;
        	  ZR.lookbookSlide.scrollEnd(ZR.lookbookSlide.currentPosition);
					}
				});

      jQuery(window).resize(function(){
    	  ZR.lookbookSlide.setDims();
        
		});
      ZR.lookbookSlide.totalPages= myScroll.pagesX.length;
      jQuery('#arrownext').click(function() {
    	  ZR.lookbookSlide.next();
    	  ZR.lookbookSlide.playing++;
    	  return false;
      });
      jQuery('#arrowprev').click(function() {
    	  ZR.lookbookSlide.prev();
    	  ZR.lookbookSlide.playing++;
    	  return false;
      });
    }, // end of init
    setDims: function(){
    	ZR.lookbookSlide.winWidth = jQuery(window).width();
    	ZR.lookbookSlide.containerWidth = jQuery('#wrapper').width();
    	ZR.lookbookSlide.maxXPos = (ZR.lookbookSlide.containerWidth - ZR.lookbookSlide.winWidth) * -1;
      if (ZR.lookbookSlide.winWidth < ZR.lookbookSlide.containerWidth) {
    	  ZR.lookbookSlide.arrowPos = 0;
      }
      else {  
    	  ZR.lookbookSlide.arrowPos = ((ZR.lookbookSlide.winWidth - ZR.lookbookSlide.containerWidth)/2) * -1;
      }
      ZR.lookbookSlide.setCSS();
      ZR.lookbookSlide.scrollEnd(ZR.lookbookSlide.currentPosition);
    },
    setCSS: function() {
       if (!ZR.lookbookSlide.isTouch) {
         jQuery(".arrowlink").css('display','block');
         jQuery("#arrowprev.arrowlink").css('left',ZR.lookbookSlide.arrowPos);
         jQuery("#arrownext.arrowlink").css('right',ZR.lookbookSlide.arrowPos);
       }
    },
    hideText: function() {
      jQuery('.panel').fadeOut(500, function() {
        jQuery(this).removeClass('active');
      });
    },
    showText: function(pos) {
      jQuery('.panel').removeClass('active');
      var currID = 'lookbook-'+pos;
      jQuery('#'+currID).fadeIn(800, function() {
        jQuery(this).addClass("active");
      });
    },
    scrollEnd: function(pos) {
      if (!ZR.lookbookSlide.isTouch) {
        if (pos == 0) {
          jQuery('#arrowprev').addClass('nopacity').css('display','none');
          jQuery('#arrownext').removeClass('nopacity').css('display','block');
        } 
        else if (pos+1 >= ZR.lookbookSlide.totalPages ) { // pos is 0-based image#, need to add 1 for actual image#
          jQuery('#arrownext').addClass('nopacity').css('display','none');
          jQuery('#arrowprev').removeClass('nopacity').css('display','block');
        }
        else {
          jQuery('#arrowprev').removeClass('nopacity').css('display','block');
          jQuery('#arrownext').removeClass('nopacity').css('display','block');
        }
      }
      ZR.lookbookSlide.playing--;
      if (ZR.lookbookSlide.playing < 0) {
        ZR.lookbookSlide.showText(ZR.lookbookSlide.currentPosition);
      }
    },
    prev: function() {
      if (myScroll.isReady()) {
    	  ZR.lookbookSlide.hideText();
        myScroll.scrollToPage('prev', 0, 800);
      } 
      else {
    	  ZR.lookbookSlide.hideText();
        setTimeout("ZR.lookbookSlide.prev()", 200);
      }
      return false;
    },
    next: function() {
      if (myScroll.isReady()) {
    	  ZR.lookbookSlide.hideText();
        myScroll.scrollToPage('next', 0, 800);
      }
      else {
    	  ZR.lookbookSlide.hideText();
        setTimeout("ZR.lookbookSlide.next()", 200);
      }
      return false;
    }
  } 

// Handles the Pinterest button and refreshing the pinterest image
ZR.Pinterest = {
    refreshPinterestButton : function (url, media, description) {
      var js, href, html;
      url = escape(url);
      media = escape(media);
      description = escape(description);
      href = 'http://pinterest.com/pin/create/button/?url=' + url + '&media=' + media + '&description=' + description;
      html = '<a href="' + href + '" class="pin-it-button" count-layout="none" onclick="window.open(this.href,'+"'signin','height=300,width=665');return false;"+'"><img border="0" src="http://assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>';
      jQuery('div.pinterest-it').html(html);
    }
}


// Handles the Deal/VIP Splash Screen (deal.nixon.com)
ZR.ProSplash = {
	formValid: false,
	handleKeyPress: function(e){
		var key = e.keyCode || e.which,
			  ctrlKey = e.ctrlKey;	// allow Ctrl + V (for pasting in values)
		// Ignore returns/enters
		if (key==13) {
			return false;
		}
		// Allow ONLY tabs, backspace or numbers
		switch(key) {
			case 8:	// backspace
			case 9: // tab
				return true;
			case 48:	// 1 (above letters on keyboard)
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:	// 0 (above letters on keyboard)
				return true;
			case 86:	// V
				if(ctrlKey) {
					return true;
				} else {
					return false;
				}
				break;
			case 96:	// 0 (keypad on the right of most keyboards)
			case 97:
			case 98:
			case 99:
			case 100:
			case 101:
			case 102:
			case 103:
			case 104:
			case 105:	// 9 (keypad on the right of most keyboards)
				return true;
			default:
				return false;
		}
		return false;
	},
	checkSubmit: function () {	// Called on form button submit
	  if (!ZR.ProSplash.checkForm()) {
      return false;
	  }
	  var response = false,
				currHeight = (jQuery('#splashselectpro').height() > 257 ? 257 : jQuery('#splashselectpro').height()),
				form = jQuery('.coreform'),
				formTarget = document.location.host,
				formData = {
			'OPTION': 'PRO_LOGIN_LOOKUP',
			'account': jQuery(':input[name="account"]', form).val(),
			'locale': jQuery(':input[name="locale"]', form).val(),
			'pin': jQuery(':input[name="pin"]', form).val()
				};
	  if(jQuery.support.cors) {	// Firefox, Chrome, "Mozilla"
		  jQuery.when( jQuery.post(form.attr('action'), formData, function(data, status, jqXHR) {
			data = jQuery.trim(data);
			data = data.toLowerCase();
			if (data.indexOf('failure') === 0) {
				jQuery('#splashselectpro').css('height', (currHeight + 37) + 'px');
    		jQuery('.errorcontainer').html('Invalid account / pass code').show();
    		response = false;
      } else {
      	jQuery('#splashselectpro').css('height', currHeight + 'px');
    		jQuery('.errorcontainer').html('').hide();
      	response = true;
      	ZR.ProSplash.formValid = true;
      	jQuery(':input[name="REFERRER"]', form).val(data);
      	// formTarget === subdomain.domain, we just want the domain
      	if(formTarget.indexOf('.') !== -1) {
      		formTarget = formTarget.substring(formTarget.indexOf('.')+1);
      	}
      	formTarget = data + "." + formTarget;
      	form.attr('action', 'http://' + formTarget);
      	// Finally, submit to correct subdomain which will persist user values
      	form.submit();
      }
    }) ).done(function() {
    	return response;
    });
	  } else {
	  	/* IE and other non-CORS supporting browsers just have to deal with a page
	  	 * refresh experience.  IE's implemention of XDomainRequest blows and has
	  	 * ZERO error debugging capabilities on the XDR object. - MTR 1/24/2012
	  	 */
	  	ZR.ProSplash.formValid = true;	// check has to happen on submit, errors are shown
	  	form.attr('action', document.location.href);
	  	form.submit();
	  }
	},
	checkForm: function() {	// Checks for required inputs
		var erraccount = "", errpin = "",
			  currHeight = (jQuery('#splashselectpro').height() > 257 ? 257 : jQuery('#splashselectpro').height()), 
			  numErrors = currHeight, haserrors = (jQuery('.error').length > 0);
		
		if(jQuery('#inputAccount').val() == "") {
			erraccount = "Please enter your Account Number.";
			numErrors = numErrors + 27;
		} else if(jQuery('#inputAccount').val().length < 16) {
			erraccount = "Your Account Number must be 16 digits long.";
			numErrors = numErrors + 27;
		}
		if(jQuery('#inputPin').val() == "") {
			errpin = "Please enter your Pin Number.";
			numErrors = numErrors + 27;
		} else if(jQuery('#inputPin').val().length < 4) {
			errpin = "Your Pin Number must be 4 digits long.";
			numErrors = numErrors + 27;
		}
		if(erraccount.length || errpin.length) {
			var content = "";
			if(numErrors > 0) {
				jQuery('#splashselectpro').css('height', numErrors + 'px');
			}
			if(erraccount.length) {
				content = erraccount;
				jQuery('#inputAccount').addClass('error').bind('keyup', ZR.ProSplash.checkForm);
			} else if(haserrors && jQuery('#inputAccount').is('.error')) {
				jQuery('#inputAccount').removeClass('error').unbind('keyup');
			}
			if(errpin.length) {
				if(content.length) {
					content = content + "<br/>";
				}
				content = content + errpin;
				jQuery('#inputPin').addClass('error').bind('keyup', ZR.ProSplash.checkForm);
			} else if(haserrors && jQuery('#inputPin').is('.error')) {
				jQuery('#inputPin').removeClass('error').unbind('keyup');
			}
			jQuery('.errorcontainer').html(content).show();
			return false;
		}
		return true;
	}
};

ZR.Picasa = {
  feed : {},
  userid : null,
  baseurl : null,
  kind : "album",
  alt : "json",
  hl : "en_US",
  thumbsize : "90",
  crop : "u",
  maxresults : "50",
  startindex : "1",
  access : "visible",
  callback : null,



  /**
   * Called to load up the Picasa feed for a page.
   * Specify the callback function, pointing to
   * another function to fire once the feed is returned
   * and parsed. From the callback function, you can
   * access ZR.Picasa.feed or ZR.Picasa.entries
   * @param options
   */
  init : function(options){
    ZR.Base.log("ZR.Picasa.init()", null, "DEBUG");
    var loadFeed = true;
    if ( typeof options === "object" ){
      if ( typeof options.kind !== 'undefined' ){
        if (! options.kind.match(/(album|photo|comment|tag|user)/) ){
          ZR.Base.log("options.kind can only be one of album|photo|comment|tag|user", null, "ERROR");
          loadFeed = false;
        }
        else {
          ZR.Picasa.kind = options.kind;
        }
      }

      if ( typeof options.thumbsize !== 'undefined' ){
        if (! options.thumbsize.match(/(\d+)/) ){
          ZR.Base.log("options.thumbsize must be numeric", null, "ERROR");
          loadFeed = false;
        }
        else if (options.thumbsize < 0 ){
          ZR.Base.log("options.thumbsize must be greater than zero", null, "ERROR");
          loadFeed = false;
        }
        else {
          ZR.Picasa.thumbsize = options.thumbsize;
        }
      }

      if ( typeof options.maxresults !== 'undefined' ){
        if (! options.maxresults.match(/(\d+)/) ){
          ZR.Base.log("options.maxresults must be numeric", null, "ERROR");
          loadFeed = false;
        }
        else if (options.maxresults < 0 ){
          ZR.Base.log("options.maxresults must be greater than zero", null, "ERROR");
          loadFeed = false;
        }
        else {
          ZR.Picasa.maxresults = options.maxresults;
        }
      }

      if ( typeof options.startindex !== 'undefined' ){
        if (! options.startindex.match(/(\d+)/) ){
          ZR.Base.log("options.startindex must be numeric", null, "ERROR");
          loadFeed = false;
        }
        else if (options.startindex < 0 ){
          ZR.Base.log("options.startindex must be greater than zero", null, "ERROR");
          loadFeed = false;
        }
        else {
          ZR.Picasa.startindex = options.startindex;
        }
      }

      if ( typeof options.locale !== 'undefined' ){
        ZR.Picasa.locale = options.locale;
      }

      if ( typeof options.crop !== 'undefined' ){
        if (! options.crop.match(/(u|c)/) ){
          ZR.Base.log("options.crop can only be one of u|c", null, "ERROR");
          loadFeed = false;
        }
        else {
          ZR.Picasa.crop = options.crop;
        }
      }

      if ( typeof options.userid !== 'undefined' ){
        ZR.Picasa.userid = options.userid;
      }
      else if ( typeof ZR.Settings.picasa.userid !== 'undefined' ){
        ZR.Picasa.userid = ZR.Settings.picasa.userid;
      }
      else {
        ZR.Base.log("Picasa userid must either be defined in the options, or as ZR.Settings.Picasa.userid", null, "ERROR");
        loadFeed = false;
      }

      if ( typeof options.baseurl !== 'undefined' ){
        ZR.Picasa.baseurl = options.baseurl;
      }
      else if ( typeof ZR.Settings.picasa.baseurl !== 'undefined' ){
        ZR.Picasa.baseurl = ZR.Settings.picasa.baseurl;
      }
      else {
        ZR.Base.log("Picasa baseurl must either be defined in the options, or as ZR.Settings.Picasa.baseurl", null, "ERROR");
        loadFeed = false;
      }

      if ( typeof options.alt !== 'undefined' ){
        if (! options.alt.match(/(json|json-in-script|atom-in-script|rss-in-script)/) ){
          ZR.Base.log("options.alt can only be one of json|json-in-script|atom-in-script|rss-in-script", null, "ERROR");
          loadFeed = false;
        }
        else {
          ZR.Picasa.alt = options.alt;
        }
      }

      if ( typeof options.callback === 'function' ){
        ZR.Picasa.callback = options.callback;
      }


    }
    else {
      if ( typeof options !== 'undefined'){
        ZR.Base.log("The only valid argument is an object containing override settings", null, "ERROR");
        loadFeed = false;
      }
    }

    if (loadFeed){
      ZR.Picasa.loadFeed();
    }

  },



  /**
   * Called from init.  Makes the remote request for the
   * feed data, and passes it to the processor
   */
  loadFeed : function(){
    ZR.Base.log("ZR.Picasa.loadFeed()", null, "DEBUG");

    if ( ZR.Picasa.baseurl == null || ZR.Picasa.userid == null){
      ZR.Base.log("Missing required vars baseid or userid", null, "ERROR");
      return;
    }

    var url = ZR.Picasa.baseurl + ((ZR.Picasa.baseurl.substr(-1) == '/') ? '' : '/') + ZR.Picasa.userid;
    var data = 'kind=' + ZR.Picasa.kind + '&alt=' + ZR.Picasa.alt + '&hl=' + ZR.Picasa.hl + '&thumbsize=' + ZR.Picasa.thumbsize + '&crop=' + ZR.Picasa.crop + '&maxresults=' + ZR.Picasa.maxresults + '&startindex=' + ZR.Picasa.startindex + '&access=' + ZR.Picasa.access + '&callback=?';


    jQuery.getJSON(url,data,function(json){
      if ( typeof json === 'object' && typeof json.feed !== 'undefined' ){
        /** json request, add to the DOM cache **/
        ZR.Picasa.feed = json.feed;
        ZR.Picasa.processJsonFeed(json.feed);
      } else {
        /** TODO not implemented for script callbacks **/
        ZR.Base.log("jQuery.ajax.success() : response is not an object", null, "ERROR");
      }
    });

  },




  /**
   * Takes the main parts from the feed entries that
   * we would want, and puts them in a more user friends
   * array.  You can add anything to this array that is
   * needed
   * @param feed
   */
  processJsonFeed : function(feed){
    ZR.Base.log("ZR.Picasa.ProcessJsonFeed()", null, "DEBUG");

    if ( typeof feed !== 'object' ) {
      ZR.Base.log("argument is not an object, unable to continue", null, "ERROR");
      return;
    }

    if ( typeof feed.entry !== 'object' ) {
      ZR.Base.log("feed either has no entries, or they are not an object, unable to continue", null, "ERROR");
      return;
    }

    var i = 0;
    var x = 0;
    var entries = [];
    var newentry = {};

    for (;i < feed.entry.length; i++){
      var entry = feed.entry[i];
      newentry = {};
      newentry.url = entry.id.jQueryt;

      var urlargs = newentry.url.split("albumid/");
      if ( urlargs.length == 2 ){
        var idargs = urlargs[1].split('?');
        if (idargs.length > 0){
          newentry.id = idargs[0];
        }
      }

      newentry.title = entry.title.jQueryt;
      newentry.summary = entry.summary.jQueryt;
      newentry.thumbs = [];

      var thumbs = entry.mediajQuerygroup.mediajQuerythumbnail;

      for (x=0;x < thumbs.length; x++){
        var thumb = thumbs[x];
        var newthumb = {};
        newthumb.url = thumb.url;
        newthumb.height = thumb.height;
        newthumb.width = thumb.width;
        newentry.thumbs.push(newthumb);
      }

      entries.push(newentry);
    }

    ZR.Picasa.entries = entries;

    if ( typeof ZR.Picasa.callback === 'function'){
      ZR.Picasa.callback.call();
    }

  }
};


ZR.Press = {
  onprev: false,
  onnext : false,
  init : function(){
    ZR.util.pageHeader.init();
    ZR.util.sectionAnchors(-1);
    ZR.Press.lightbox();
    jQuery("#press #content").on("click","a.loadMoreLink",ZR.Press.loadMoreResults);

    var loadRef = jQuery.getUrlVar('lb');

    if ( loadRef !== 'undefined' ){
      var article = jQuery("#article-" + loadRef);
      if ( article.length != 0 ){
        article.trigger("click");
      }
      else {
        ZR.Base.log("ZR.Press.init() - Requested display of article " + loadRef + " but it doesn't exist on this page.", null, "ERROR");
      }
    }

  },

  loadMoreResults : function(e){
    e.preventDefault();
    var anchor = jQuery(this);
    var nextpage = anchor.attr("data-nextpage");
    ZR.util.hideButton(anchor.attr("id"));

    jQuery.ajax({
      url : ZR.Settings.url.host + "/press/page/" + nextpage + "/",
      type : "GET",
      dataType : "html",
      success: function(data){

        jQuery("#loadMorePressResults").replaceWith(data);
        if(!ZR.util.isMobile){
          jQuery(".pressajaxbox").filter(function(){ return jQuery(this).attr('href').indexOf('include') == -1}).each(function(){
            jQuery(this).attr("href", jQuery(this).attr("href").replace('/press','/press/includes') );
          });
        }

        var nextanchor = jQuery("a[id^='anchorpage']:last");
        var eOffset = nextanchor.offset().top -124; scrollPos = eOffset;

        jQuery('html, body').stop().animate({
          scrollTop: scrollPos
        }, 1500, 'easeInOutCubic');

      },
      error : function(response){
        ZR.Base.log("jQuery.ajax.error() : " + response.statusText, null, "ERROR");
      }
    });

  },

  lightboxInit : function(){
    jQuery(".panel.prodlist").each(function() {
      ZR.panels.prodList.init(jQuery(this));
    });
  },

  lightbox: function(){

    if(!ZR.util.isMobile){
      jQuery(".pressajaxbox").each(function(){
        jQuery(this).attr("href", jQuery(this).attr("href").replace('/press','/press/includes') );
      });
      jQuery(".pressajaxbox").fancybox({
        scrolling: 'auto',
        beforeLoad : function(){
          var previmg = jQuery(".prev-image");
          var nextimg = jQuery(".next-image");
        },
        type: 'ajax',
        width: 980,
        height: 'auto',
        autoSize: false,
        prevEffect  : 'none',
        nextEffect  : 'none',
        afterShow : function(){
          ZR.Press.lightboxInit();
          ZR.lb.moveArrows(jQuery(this)[0]);
        },
        onUpdate : function(){
          ZR.lb.moveArrows();
        }
      });

    }
    
    
    
	}
}


ZR.Happenings = {
  init : function(){
		ZR.Happenings.loadVideo(false);
    ZR.util.pageHeader.init();
		ZR.lb.video();
    ZR.util.pageHeader.addCallback(ZR.Happenings.pageHeaderChangeState);
    jQuery("a.sidebarLayerToggle").on("click",ZR.Happenings.toggleSidebarLayer);
    jQuery("#archiveAnchor").on("click", ZR.Happenings.toggleArchiveMenu).on("mouseover",function(){jQuery(this).css("cursor","pointer")});
    jQuery("#archiveDateSelect").on("change",ZR.Happenings.goToArchive);
  },
  pageHeaderChangeState : function(o){
    if ( o === false ){
      jQuery("#archiveWrapper, #topBorderBar").removeClass("behind");
    }
    else if ( o === true ){
      jQuery("#archiveWrapper, #topBorderBar").addClass("behind");
    }
  },
	loadVideo: function(play){
		jQuery(".oembed").each(function(){
			var url = this.href;
			if(url.indexOf('youtube') > 0) {
				var urlArr = url.split('v=');
				var vidCode = urlArr.pop();
						vidCode = vidCode.split('&');
						vidCode = vidCode[0];
						
						var vidHTML = '<iframe width="620" height="345" src="http://www.youtube.com/embed/' + vidCode + '" frameborder="0" allowfullscreen></iframe>';
						jQuery('.oembed').replaceWith(vidHTML);
				
			} else 
			if(url.indexOf('vimeo') > 0) {
				var oEmbedURL = 'http://vimeo.com/api/oembed.json?url=' + url + '&callback?';
				jQuery.getJSON(oEmbedURL,
					{
						maxwidth: 620,
						maxheight: 620,
						wmode: "transparent",
						autoplay: play
					},
					function(data){
					var vidHTML = data.html;
//					console.log('success');
//					console.log(data.html);
					
					jQuery('.oembed').replaceWith(vidHTML);
					
				});				
			}
			
			
			
		 });
			
			//console.log(oEmbedURL);
			//http://www.youtube.com/oembed?url=http%3A//www.youtube.com/watch?v%3D-UUx10KOWIE&format=xml&maxwidth=500
			//http://vimeo.com/api/oembed.xml?url=http%3A//vimeo.com/7100569
			/*jQuery.getJSON(oEmbedURL,
				{
					maxwidth: 620,
					maxheight: 620,
					wmode: "transparent",
					autoplay: play
				},
				function(data){
				console.log(data.html);
			});*/
			/*jQuery.ajax({
				url: oEmbedURL,
				crossDomain: true,
				dataType : 'xml',
				data: {
					maxwidth: 620,
					maxheight: 620,
					wmode: "transparent",
					autoplay: play
				}, 
				success: function(data){
					console.log('success');
					console.log(data);
				}
			});
		
		});*/
		
		
		jQuery(".oembed").oembed(null, 
			{
			embedMethod: "replace", 
			maxWidth: 620,
			maxHeight: 620,
			width: 620,
			vimeo: { autoplay: play,  wmode: "transparent"},
			youtube: { autoplay: play,  wmode: "transparent", width: 620}			
		});
	},
  goToArchive : function(){
    var select = jQuery(this);
    var val = select.val();
    var url = select.closest("form").attr("action");
    if ( ! ZR.Base.nullOrEmpty(val) && ! ZR.Base.nullOrEmpty(url) ){
      document.location.href = url + val;
    }
  },
  toggleSidebarLayer : function(e){
    var link = jQuery(this);
    var wrapper = link.parents('h1');
    var layer = link.parents('h1').next(".containertext");
    if (layer.length != 0){
      var isOpen = layer.hasClass("closed");
      var fullHeight = layer.find(".containertextwrap").height() + 56;
      wrapper.addClass(isOpen ? "isopen" : "isclosed").removeClass(isOpen ? "isclosed" : "isopen");
      layer.animate({
				height: (isOpen ? fullHeight : 0) + 'px'
			}, 300,
			function(){
				layer.toggleClass("closed");
			}
		);

    }
  },
  toggleArchiveMenu : function(e){
    var link = jQuery(this);
    var menu = jQuery(".archiveMenu", "#archiveWrapper");
    var txt = link.find('span');
    var img = link.find('img');

    if ( menu.is(":visible") ){
      jQuery(".sidebarWrapper").removeClass("archiveView");
      txt.html(link.attr("data-show"));
      img.attr('src',img.attr('src').replace('up','down'));
    }
    else{
      jQuery(".sidebarWrapper").addClass("archiveView");
      txt.html(link.attr("data-hide"));
      img.attr('src',img.attr('src').replace('down','up'));
      jQuery("#topBorderBar .columns3").removeClass("bottomBorder");
    }

    menu.slideFade(function(){
      if ( menu.is(":hidden") ){
        jQuery("#topBorderBar .columns3").addClass("bottomBorder");
      }
    });

    jQuery("#connectWrapper").slideFade();

  },
  loadLandingThumbs : function(){
    ZR.Base.log("ZR.Happenings.loadLandingThumbs()", null, "DEBUG");
    var albums = ZR.Picasa.entries;
    var showAlbums = false;
    var hasThumbs = false;

    if ( typeof albums !== 'object' ) return;

    var albumContainer = jQuery("#albumthumbcontainer", ".sidebarWrapper");

    if ( albums.length > 0 ){
      /** add primary image **/
      var album = albums[0];

      var primary = albumContainer.find(".primaryThumbWrapper");
      var primaryAnchor = primary.find("a");
      var primaryImage = primary.find(".primaryThumb a img");
      var primaryTitle = primary.find(".primaryThumbTitle a");

      primaryAnchor.attr({
        href : ZR.Settings.url.host + '/photo-gallery/' + jQuery.trim(album.title).replace(/\s/g, '-').toLowerCase() + '.html',
        title : album.title
      });

      var largeImage = album.thumbs[1];
			
			var largeImageURL = largeImage.url;
			var largeImageURL = largeImageURL.replace('/s320','/s361');

      if ( typeof largeImage !== 'undefined' ){
        primaryImage.attr({
          alt : album.title,
					title : album.title
         // src : largeImage.url,
         // width : largeImage.width,
         // height : largeImage.height
        }).css('background','url(' + largeImageURL + ') no-repeat 50% 50%');
				
      }

      primaryTitle.html(album.title);

      showAlbums = true;
    }

    if ( albums.length > 1 ){
      /** add thumbnails **/
      var thumbEl = albumContainer.find(".thumbElement");
      thumbEl.remove();

      var finalLink = jQuery("#albumViewAllLink");

      for ( var x = 1; x < albums.length && x <= 4; x++ ){

        var album = albums[x];
        var thumb = thumbEl.clone();

        var thumbAnchor = thumb.find("a");
        var thumbImage = thumb.find(".thumbImage a img");
        var thumbTitle = thumb.find(".thumbTitleWrapper div a");

        thumbAnchor.attr({
          href : ZR.Settings.url.host + '/photo-gallery/' + jQuery.trim(album.title).replace(/\s/g, '-').toLowerCase() + '.html',
          title : album.title
        });

        var smallImage = album.thumbs[0];
        if ( typeof smallImage !== 'undefined' ){
          thumbImage.attr({
            alt : album.title,
            src : smallImage.url
          });
        }

//      ,
//        width : smallImage.width,
//          height : smallImage.height

        thumbTitle.html(album.title);

        finalLink.before(thumb);
      }

      hasThumbs = true;
    }


    if ( showAlbums ){

      albumContainer.removeClass("hide");
      primary.removeClass("hide");
      jQuery("#albumViewAllLink").removeClass("hide");

      if ( hasThumbs ){
        albumContainer.find(".thumbElement").each(function(){
          jQuery(this).removeClass("hide");
        })
      }
      else {
        /** if there are no small thumb images, the See All Albums link appears to far away **/
        jQuery("#albumthumbcontainer .primaryThumbWrapper").css("margin-bottom","20px").attr("data-csschange","margin-bottom modified by ZR.Happenings.loadLandingThumbs");
      }
  }
}};

ZR.Giftcard = {
  /** Msg vars defined on page via zText **/
  connectionErrorMsg : "",
  invalidCardMsg : "",
  symbol : "jQuery",
  decimalPlaces : 2,
  thousandsSeparator : ",",
  decimalSeparator : ".",
  ajaxloaded : false,

  /**
   * Called from full page balance check (mobile, or direct call to URL)
   */
  init : function(){

    jQuery("#checkBalance").on("click", ZR.Giftcard.checkSingleCardBalance);

  },

  /**
   * called from ajax balancecheck lightbox
   */
  ajaxinit : function(){

    ZR.util.ajaxPlaceholder.apply( jQuery("#giftcardbalancecheck") );

    if ( ! ZR.Giftcard.ajaxloaded ){
      jQuery("body").on("click.giftcardbalancecheck", "#checkBalance", ZR.Giftcard.checkSingleCardBalance);
      ZR.Giftcard.ajaxloaded = true;
    }

  },


  /**
   * Used to format the balance reponse in to a localized output
   * @param symbol
   * @param decimalPlaces
   * @param thousandsSeparator
   * @param decimalSeparator
   */
  setFormatting : function(symbol,decimalPlaces,thousandsSeparator,decimalSeparator){
    ZR.Giftcard.symbol = symbol;
    ZR.Giftcard.decimalPlaces = decimalPlaces;
    ZR.Giftcard.thousandsSeparator = thousandsSeparator;
    ZR.Giftcard.decimalSeparator = decimalSeparator;
  },


  /**
   * Generic Single Card balance check, handles the response
   * and places it in the defined response element
   */
  checkSingleCardBalance : function(){

    var cardInput, cardNumber;

    /** Expects a single card number for a balance response **/
    cardInput = jQuery("#giftCardNumberInput");

    if ( cardInput.length != 0 ) {
      cardNumber = jQuery.trim(cardInput.val());
    }

    /** If the card number is empty, just do nothing **/
    if ( cardNumber.length != 0 ){

      /** Where we're going to output the results **/
      responseDiv = jQuery("#balanceResults");

      /** Ajax call to the JSON balance check **/
      var checkBalance = jQuery.ajax({
        url : '/za/NXN',
        cache : false,
        data : {
          OPTION : "AJAX_GIVEX_BALANCE_CHECK",
          gift_card_number : cardNumber
        },
        context : jQuery("#balanceResults")
      });

      /**
       * when successfully completes, this should fire.  We'll
       * have a  JSON Map representing the giftcard that was submitted
       * with the card number as the key to the map.
       *
       * {"123456":{"balance":-1,"statusdescription":"2 - Cert not exist","statuscode":1}}
       *
       * Returned status codes will be one of:
       *  OK = 0;
       *  NUMBER_INVALID = 1;
       *  HOST_NOT_AVAILABLE = 10;
       *  UNKNOWN_ERROR = 99;
       */
      checkBalance.done(function(data){

        var response = jQuery.parseJSON(data);

        /** default to eliminate having to decipher all possible error conditions **/
        var uiresponse = ZR.Giftcard.connectionErrorMsg;

        if ( typeof response === 'object' ){
          var card = response[cardNumber];
          var status = card.statuscode;
          var desc = card.statusdescription;
          var balance = card.balance;

          switch ( status ){
            case 0 :
              uiresponse = balance.formatMoney(
                ZR.Giftcard.decimalPlaces,
                ZR.Giftcard.symbol,
                ZR.Giftcard.thousandsSeparator,
                ZR.Giftcard.decimalSeparator
              );
              break;
            case 1 :
              uiresponse = ZR.Giftcard.invalidCardMsg;
              break;
            case 10 :
              uiresponse = ZR.Giftcard.connectionErrorMsg;
              break;
            case 20 :
              uiresponse = ZR.Giftcard.invalidCardMsg;
              break;
          }

        }

        /** TODO modify or format the response here if necessary before output **/
        jQuery(this).html(uiresponse);

      });

      checkBalance.fail(function(jqXHR, textStatus){
        jQuery(this).html( ZR.Giftcard.connectionErrorMsg );
      });

    }

  },

  initDigitalForm : function(){
    jQuery("#zoi_value_MESSAGE-1").keyup(function(){ZR.util.limitText(jQuery(this), 120);});

    jQuery('#digitalGiftcardForm').validate({
      rules: {
        'zoi_value_TO-1': {
          required: 	true
        },
        'zoi_value_FROM-1': {
          required: 	true
        },
        'zoi_price-1': {
          required: 	true,
          range: [25,150]
        },
        'zoi_value_TO_EMAIL-1': {
          email: 			true,
          required: 	true
        },
        'zoi_value_TO_EMAIL_2-1': {
          email: 			true,
          required: 	true,
          equalTo:    '#zoi_value_TO_EMAIL-1'
        },
        'zoi_value_FROM_EMAIL-1': {
          email: 			true,
          required: 	true
        },
        'zoi_value_FROM_EMAIL_2-1': {
          email: 			true,
          required: 	true,
          equalTo:    '#zoi_value_FROM_EMAIL-1'
        }
      },
      messages: {
        'zoi_value_TO-1': {
          required: 	gcError.recipientName
        },
        'zoi_value_FROM-1': {
          required: 	gcError.sendersName
        },
        'zoi_value_TO_EMAIL-1': {
          email: 			gcError.validEmail,
          required: 	gcError.recipientEmail
        },
        'zoi_value_TO_EMAIL_2-1': {
          email: 			gcError.validEmail,
          required: 	gcError.confirmRecipientEmail
        },
        'zoi_value_FROM_EMAIL-1': {
          email: 			gcError.validEmail,
          required: 	gcError.sendersEmail
        },
        'zoi_value_FROM_EMAIL_2-1': {
          email: 			gcError.validEmail,
          required: 	gcError.confirmSendersEmail
        }
      },
      invalidHandler: function(form, validator) {
        var errors = validator.numberOfInvalids();
      },
      errorPlacement: function(error, element) {
        error.prependTo( element.parent("div.placeholder") );
      },
      submitHandler: function(form) {
        var gcMessageText = jQuery.trim(jQuery('#zoi_value_MESSAGE-1').val());
        if(gcMessageText == "" || gcMessageText == 'Message (max 120 Characters)') {
          var confBox = confirm("You haven't left a message for your Gift Card. \r\n Are you sure you want to leave this empty?");
          if (confBox == false) {
            return false;
          }
          else {
            form.submit();
          }
        }
        else {
          form.submit();
        }
      }
    });

  }


};

ZR.SiteCountryMap = {
  setCurrent : function(name){
    jQuery("#countryDescription").text(jQuery("#currentCountry").text());
  }
}

