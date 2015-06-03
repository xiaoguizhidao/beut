function equalHeight(group) {
	
		var e = window,
			a = 'inner';
		if (!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		var vpWidth = e[a + 'Width'];
		
		var i = 0;
		var max = 0;
		group.each(function() {
			i++;
			if(i % 2 ==0){
				if (jQuery(this).height() >= jQuery(this).prev().height()) {
					max = jQuery(this).height();
				} else {
					max = jQuery(this).prev().height();
				}
				jQuery(this).height(max);
				jQuery(this).prev().height(max);
			}

		});			
		if (vpWidth <= 767) {
			group.each(function() {
				jQuery(this).height('auto');
			});
		}
}
function showArrow(){
	if($j('#amasty_gallery a').length <= 3){
		$j('.MagicScrollArrows').addClass('hidden');
	}
}
 jQuery( document ).ready(function( $ ) {
    var e = window,
        a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    var realHeight = e[a + 'Height'],
         windowWidth = e[a + 'Width'];

    var heightForTwoPerSession = realHeight / 2;
    var headerHeight = jQuery('#header').height();
    var headerLanguageHeight = jQuery('.header-language-background').height();
    if(jQuery(".cms-index-index.cms-home").length)
    {
        if (windowWidth < 768) {
            jQuery(".row").removeAttr("style");
        }
        else {
            jQuery(".row").each(function (element) {
                jQuery(this).height(realHeight);
                jQuery(this).find(".subblock").height(realHeight/2);
            });
        }
    }

     //menu for ie8
     if(jQuery('.ie8 .inner-toggle').length > 0){
        jQuery('.ie8 .inner-toggle').width(jQuery());
     }

    jQuery('#slideshow-next').click(function(){
        var currentScrollTop = jQuery(window).scrollTop();
        var currentSession = 0;
        if(jQuery(".cms-index-index.cms-home").length) {
            if (currentScrollTop >= (headerHeight + headerLanguageHeight +10)) {
                currentScrollTop = currentScrollTop-(headerHeight + headerLanguageHeight +10);
                currentSession =  parseInt(currentScrollTop / realHeight)+1;
                var needToScrool = currentSession * realHeight;
                var footerHeight = jQuery('.footer-container').height();
                jQuery("body, html").animate({scrollTop:needToScrool + headerHeight + headerLanguageHeight +10},500, function(){} );
            }
            else {
                jQuery("body, html").animate({scrollTop:headerHeight + headerLanguageHeight +10},500, function(){} );
            }
        }
    });
    jQuery('#slideshow-prev').click(function(){
        var currentScrollTop = jQuery(window).scrollTop();
        var currentSession = 0;
        if(jQuery(".cms-index-index.cms-home").length) {
            if (currentScrollTop > (headerHeight + headerLanguageHeight +10)) {
                currentScrollTop = (currentScrollTop-(headerHeight + headerLanguageHeight +10))
                if ( currentScrollTop % realHeight <= 50) {
                    currentSession =  parseInt(currentScrollTop / realHeight)- 1;
                }
                else {
                    currentSession = parseInt(currentScrollTop / realHeight);
                }
                var needToScrool = currentSession * realHeight;
                var footerHeight = jQuery('.footer-container').height();
                jQuery("body, html").animate({scrollTop:needToScrool + headerHeight + headerLanguageHeight +10},500, function(){} );
            }
            else {
                jQuery("body, html").animate({scrollTop:0},500, function(){} );
            }
        }


    });
});
jQuery(window).bind('load resize orientationchange', function() {
    var e = window,
        a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    var realHeight = e[a + 'Height'],
        windowWidth = e[a + 'Width'];
   // console.log(realHeight+'---'+windowWidth);
    var headerHeight = jQuery('#header').height();
    var headerLanguageHeight = jQuery('.header-language-background').height();
    if(jQuery(".cms-index-index.cms-home").length)
    {
        if (windowWidth < 850 || windowWidth >= 1920) {
            jQuery(".row,.subblock").removeAttr("style");
        }
        else {
            jQuery(".row").each(function (element) {
                jQuery(this).height(realHeight);
                jQuery(this).find(".subblock").height(realHeight/2);
            });
        }
        if(windowWidth == 1910){
            if(realHeight >= 1100 && realHeight <= 1400) {
             //   console.log(windowWidth+'---'+realHeight);
                jQuery('.row,.row .subblock').removeAttr('style');
                jQuery('.row img,.subblock img').addClass('resize');
            }else{
             //   console.log('out');
                jQuery('.row img,.subblock img').removeClass('resize');
            }
        }
    }
	showArrow();
});
	jQuery(document).ready(function(){
		if(jQuery('.cms-home').length > 0){
			$j(".share").click(function () {
				$j(".sharethis").slideToggle("slow");
			});
		}


	//	jQuery("select").uniform();

		jQuery('.block20').height(jQuery('.col-lg-51').height());

		/*if(jQuery('.category-products').length > 0){
			jQuery('.item').each(function(){
				var oldString = jQuery(this).find('.price').text();
				jQuery(this).find('.price').text(oldString.split('.', 1)[0]);
			})
		}*/
		jQuery('.block-subtitle--filter').click(function(){
			jQuery(this)
				.toggleClass('active')
				.next()
				.toggleClass('no-display');
		});

		/*if(jQuery(window).width() > 767){
			jQuery(function() {
				jQuery("#upsell-product-table > .row").niceScroll({
					cursorborder: "",
					autohidemode: false,
					boxzoom: false,
					cursorfixedheight: 10,
					cursorwidth: 10,
					cursorcolor: "#999",
					cursorborderradius: '50%'
				});
			});
			jQuery(function($) {
				$('.footer-block-second .links').responsiveEqualHeightGrid();
			});
		}*/
		if(jQuery('.checkout-cart-index .shipping-amount i').text()==0){

			var oldContent = jQuery('.checkout-cart-index td.shipping-title').text();
			var newContent = oldContent.substring(oldContent.indexOf('-') + 1);

			jQuery('.checkout-cart-index td i').closest('tr').find('td.shipping-title').html('Shipping');
			jQuery('.checkout-cart-index td i').closest('tr').find('td.shipping-amount').html(newContent.replace(')',''));
		}
		jQuery('#discount-coupon-form').click(function(){
			jQuery('#discount-coupon-form h2').hide();
			jQuery('.cart .discount-form').show();
		});
		jQuery('.block-cms-menu .block-content li').each(function(){
			if(jQuery(this).find('a span').text()==jQuery('.page-head h3')){
				jQuery(this).addClass('current');
			}
		});
		var url = jQuery(location).attr('href').slice(-1)=='/' ? jQuery(location).attr('href') : jQuery(location).attr('href')+'/';
		jQuery('.block-cms-menu li').each(function(){
			if(jQuery(this).find('a').attr('href') == url){
				jQuery(this).find('a').addClass('current');
				//console.log(jQuery(this).find('a').attr('href'));

			}
		});

        if(jQuery(".product-view .add-to-cart-wrapper").length) {

           var wrapperContent = jQuery(".product-view .add-to-cart-wrapper").html();
           jQuery(".product-view .add-to-cart-wrapper").css("margin-bottom", "0px");

        }

	})
	jQuery(window).bind('load resize orientationchange', function() {
		//equalHeight(jQuery('.row-item'));
		jQuery(function($) {
			$('.products-grid .item').responsiveEqualHeightGrid();
			if($(".slideshow").length > 0){
				if($(".slideshow-container li").length <=1){
					$(".slideshow-prev,.slideshow-next").hide();
				}
			}
		});
		jQuery('.block20').height(jQuery('.col-lg-51').height());
		//console.log(jQuery(window).width());
		var e = window,
					a = 'inner';
				if (!('innerWidth' in window)) {
					a = 'client';
					e = document.documentElement || document.body;
				}
				var vpWidth = e[a + 'Width'];
		if(vpWidth > 767){
			jQuery('dd.current').niceScroll({
				cursorborder: "",
				autohidemode: false,
				boxzoom: false,
				cursorfixedheight: 10,
				cursorwidth: 10,
				cursorcolor: "#999",
				cursorborderradius: '50%'
			});
			jQuery(function() {
				jQuery("#upsell-product-table > .row").niceScroll({
					cursorborder: "",
					autohidemode: false,
					boxzoom: false,
					cursorfixedheight: 10,
					cursorwidth: 10,
					cursorcolor: "#999",
					cursorborderradius: '50%'
				});
				jQuery("#upsell-product-table2 > .row").niceScroll({
					cursorborder: "",
					autohidemode: false,
					boxzoom: false,
					cursorfixedheight: 10,
					cursorwidth: 10,
					cursorcolor: "#999",
					cursorborderradius: '50%'
				});
			});
			jQuery('#upsell-product-table > .row .square-container,#upsell-product-table2 > .row .square-container').removeAttr("style");
		}else{
			jQuery("#upsell-product-table > .row").getNiceScroll().remove();
			jQuery("#upsell-product-table2 > .row").getNiceScroll().remove();
			jQuery('dd.current').niceScroll({
				cursorborder: "",
				autohidemode: false,
				boxzoom: false,
				cursorfixedheight: 10,
				cursorwidth: 10,
				cursorcolor: "#999",
				cursorborderradius: '50%'
			});
			jQuery('#upsell-product-table > .row .square-container').responsiveEqualHeightGrid();
			jQuery('#upsell-product-table2 > .row .square-container').responsiveEqualHeightGrid();
		}

		var bgImg =	jQuery('.col-lg-7.block1,.block2,.block11,.block5,.block14,.block16,.block9,.block3,.block12,.block8,.block17,.col-lg-12.block7').each(function(){
			var img = jQuery(this).find('img').attr('src')
			if(jQuery(this).children('.imgbg').length <= 0 ){
				jQuery(this).prepend('<img class="imgbg" src="'+img+'" style="position: absolute;width: 100%;height: 101%; top: 0;left: 0;" />');
			}
			//jQuery(this).children('.bg').css({'background':'url('+img+')'});
		});
		///homepage
		var e = window,
			a = 'inner';
		if (!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		var realHeight = e[a + 'Height'],
			windowWidth = e[a + 'Width'];
		var isResize = false;
		if((windowWidth <= 999 && realHeight >= 1050) && (windowWidth >= 851 && realHeight>= 1050)){
			isResize = false;
			//console.log(1);
		}
		if((windowWidth <= 1399 && realHeight >= 1062) && (windowWidth >= 1000 && realHeight>= 1062)){
			isResize = false;
			//console.log(2);
		}
		if((windowWidth <= 1600 && realHeight >= 1201) && (windowWidth >= 1400 && realHeight>= 1201)){
			isResize = false;
			//console.log(3);
		}
		if((windowWidth <= 1700 && realHeight >= 1200) && (windowWidth >= 1601 && realHeight>= 1200)){
			isResize = false;
			//console.log(16);
		}
		if((windowWidth <= 1775 && realHeight >= 1251) && (windowWidth >= 1701 && realHeight>= 1251)){
			isResize = false;
			//console.log(4);
		}
		if((windowWidth <= 1850 && realHeight >= 1401) && (windowWidth >= 1776 && realHeight>= 1401)){
			isResize = false;
			//console.log(5);
		}
		if((windowWidth <= 1919 && realHeight >= 1491) && (windowWidth >= 1851 && realHeight>= 1491)){
			isResize = false;
			//console.log(6);
		}

		if(windowWidth === 850 && realHeight=== 600){
			isResize = true;
			//console.log(7);
		}
		if((windowWidth === 1401 && realHeight >= 1062) && (windowWidth === 1401 && realHeight <= 1160)){
			isResize = true;
			//console.log(8);
		}
		if((windowWidth >= 1400 && windowWidth <= 1919) && (realHeight >= 1060 && realHeight <= 1161)){
			isResize = true;
			//console.log(9);
		}
		if((windowWidth >= 1601 && windowWidth <= 1919) && (realHeight >= 1162 && realHeight <= 1200)){
			isResize = true;
			//console.log(10);
		}
		if((windowWidth >= 1501 && windowWidth <= 1919) && (realHeight >= 1201 && realHeight <= 1250)){
			isResize = true;
			//console.log(11);
		}
		if((windowWidth >= 1776 && windowWidth <= 1919) && (realHeight >= 1252 && realHeight <= 1400)){
			isResize = true;
			//console.log(12);
		}
		if((windowWidth >= 1851 && windowWidth <= 1919) && (realHeight >= 1401 && realHeight <= 1490)){
			isResize = true;
			//console.log(13);
		}
		
		if( windowWidth==1024 || windowWidth==1280 ||  windowWidth==2560){
			isResize = true; 
		}
		var specialSize = false;
		if(windowWidth==240 || windowWidth==320 || windowWidth==480 ||  windowWidth==600 ||  windowWidth==1360 || windowWidth==1400 ){
			specialSize = true;
		} 
		//console.log(windowWidth+'---'+realHeight);
		var heightSpecial = 1060*(windowWidth/1900)-3;		
		//console.log(jQuery(window).height());
		//console.log(heightSpecial);
		jQuery('.row7 .one-per-session.special').height(heightSpecial); 		
		var headerHeight = jQuery('#header').height();
		var headerLanguageHeight = jQuery('.header-language-background').height();
		if(jQuery(".cms-index-index.cms-home").length)
		{
			jQuery('.row img,.subblock img').removeClass('resizespec');
			if (isResize === false) {
				jQuery(".row,.row .subblock").removeAttr("style");				
				jQuery('.row img,.subblock img').removeClass('unresize');
				if(specialSize){
					jQuery('.row img,.subblock img').removeClass('resize');
					jQuery('.row img,.subblock img').addClass('resizespec');
				}
				else {
					jQuery('.row img,.subblock img').addClass('resize');
					jQuery('.row img,.subblock img').removeClass('resizespec');
					if(700*(windowWidth/1900)*10>=5){					
					jQuery('.row img,.subblock img').css({'width':'102%'});
					//console.log("102");
					}
					if(700*(windowWidth/1900)*10>2 && 700*(windowWidth/1900)*10<5){					
							jQuery('.row img,.subblock img').css({'width':'101%'});
							//console.log("101");
					}
			
				}
				
				jQuery('.row7 .one-per-session.special').last().removeClass('resizespec').removeClass('resize').removeClass('unresize');			
			}
			else {
				jQuery(".row").each(function (element) {
					jQuery(this).height(realHeight);
					jQuery(this).find(".subblock").height(realHeight/2);
					jQuery('.row img,.subblock img').removeClass('resize');
					jQuery('.row img,.subblock img').removeClass('resizespec');
					jQuery('.row img,.subblock img').addClass('unresize');
				});
				if(700*(windowWidth/1900)*10>=5){					
					jQuery('.row img,.subblock img').css('width','102%!important;');
					//console.log("102");
				}
				if(700*(windowWidth/1900)*10>2 && 700*(windowWidth/1900)*10<5){					
						jQuery('.row img,.subblock img').css('width',"101%!important;");
						//console.log("101");
				}
			
			}
				
			/*select to resize %*/
			
			/*if(windowWidth == 1910){
			 if(realHeight >= 1100 && realHeight <= 1400) {
			 jQuery('.row,.row .subblock').removeAttr('style');
			 jQuery('.row img,.subblock img').addClass('resize');
			 }else{
			 jQuery('.row img,.subblock img').removeClass('resize');
			 }
			 }*/
		}


	});

